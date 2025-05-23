package com.jobportal.service;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final EmailService emailService; // Added EmailService

    @Autowired
    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                 UserRepository userRepository,
                                 JobRepository jobRepository,
                                 EmailService emailService) { // Added EmailService to constructor
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.emailService = emailService; // Initialize EmailService
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
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDTO> getApplicationsByUserId(Long userId) {
        return applicationRepository.findByApplicantId(userId).stream()
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
        return new ApplicationDTO(
                application.getId(),
                application.getCoverLetter(),
                application.getApplicationDate(),
                application.getStatus().name(),
                application.getJob().getId(),
                application.getJob().getTitle(),
                application.getApplicant().getId(),
                application.getApplicant().getUsername()
        );
    }
}