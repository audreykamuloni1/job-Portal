package com.jobportal.service;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.dto.RecentApplicationDTO;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final EmailService emailService;

    @Autowired
    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                 UserRepository userRepository,
                                 JobRepository jobRepository,
                                 EmailService emailService) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.emailService = emailService;
    }

    @Override
    public void createApplication(ApplicationDTO applicationDTO, Long applicantId) {
        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobRepository.findById(applicationDTO.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Application application = new Application();
        application.setApplicant(applicant);
        application.setJob(job);
        application.setCoverLetter(applicationDTO.getCoverLetter());
        application.setApplicationDate(LocalDateTime.now());
        application.setStatus(Application.ApplicationStatus.PENDING);

        applicationRepository.save(application);
    }

    @Override
    public List<ApplicationDTO> getApplicationsByJobId(Long jobId) {
        return applicationRepository.findByJob_Id(jobId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDTO> getApplicationsByUserId(Long userId) {
        return applicationRepository.findByApplicant_Id(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void updateApplicationStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(Application.ApplicationStatus.valueOf(status.toUpperCase())); // Ensure status is uppercase for enum matching
        applicationRepository.save(application);

        // Send email notification if status is APPROVED
        if (Application.ApplicationStatus.APPROVED.name().equalsIgnoreCase(status)) {
            User applicant = application.getApplicant();
            Job job = application.getJob();
            if (applicant != null && applicant.getEmail() != null && !applicant.getEmail().isEmpty() && job != null) {
                String subject = "Your Application for '" + job.getTitle() + "' has been Approved!";
                String text = "Dear " + applicant.getUsername() + ",\n\n" +
                              "Congratulations! Your application for the position of '" +
                              job.getTitle() + "' has been approved.\n\n" +
                              "The employer will contact you with further details.\n\n" +
                              "Best regards,\nThe Job Portal Team";
                emailService.sendSimpleEmail(applicant.getEmail(), subject, text);
            }
        }
    }

    private ApplicationDTO convertToDTO(Application application) {
        String companyName = null;
        if (application.getJob() != null && application.getJob().getEmployer() != null) {
            User employer = application.getJob().getEmployer();
            if (employer.getEmployerProfile() != null && 
                employer.getEmployerProfile().getCompanyName() != null &&
                !employer.getEmployerProfile().getCompanyName().isEmpty()) {
                companyName = employer.getEmployerProfile().getCompanyName();
            } else {
                companyName = employer.getUsername(); // Fallback to username
            }
        }

        return new ApplicationDTO(
                application.getId(),
                application.getCoverLetter(),
                application.getApplicationDate(),
                application.getStatus().name(),
                application.getJob().getId(),
                application.getJob().getTitle(),
                application.getApplicant().getId(),
                application.getApplicant().getUsername(),
                companyName // Add the new companyName here
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecentApplicationDTO> getRecentApplicationsByEmployer(Long employerId, int limit) {
        // Find jobs posted by the employer
        List<Job> employerJobs = jobRepository.findByEmployer_Id(employerId);
        if (employerJobs.isEmpty()) {
            return Collections.emptyList();
        }
        List<Long> jobIds = employerJobs.stream().map(Job::getId).collect(Collectors.toList());

        // Find applications for these jobs, order by date descending, limit results
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "applicationDate"));
        List<Application> recentApplications = applicationRepository.findByJob_IdIn(jobIds, pageable);

        return recentApplications.stream()
            .map(app -> new RecentApplicationDTO(
                app.getId(),
                app.getApplicant().getUsername(),
                app.getJob().getTitle(),
                app.getJob().getId(),
                app.getApplicationDate(),
                app.getStatus().name()
            ))
            .collect(Collectors.toList());
    }
}