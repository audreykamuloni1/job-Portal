package com.jobportal.service;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    // Constructor to inject dependencies
    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    /**
     * Handles logic for submitting a new job application.
     */
    public void applyToJob(ApplicationDTO dto) {
        Application application = new Application();
        application.setCoverLetter(dto.getCoverLetter());
        application.setApplicationDate(LocalDateTime.now()); // Set submission time

        // Get job and applicant from DB
        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));
        User applicant = userRepository.findById(dto.getApplicantId())
                .orElseThrow(() -> new RuntimeException("Applicant not found"));

        // Link job and applicant to the application
        application.setJob(job);
        application.setApplicant(applicant);

        applicationRepository.save(application);
    }

    /**
     * Get all applications submitted to a specific job (for employers).
     */
    public List<ApplicationDTO> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all applications submitted by a specific user (for job seekers).
     */
    public List<ApplicationDTO> getApplicationsByUser(Long userId) {
        return applicationRepository.findByApplicantId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update the status of an application (e.g., from PENDING to APPROVED).
     */
    @Transactional
    public void updateApplicationStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        try {
            Application.ApplicationStatus newStatus = Application.ApplicationStatus.valueOf(status.toUpperCase());
            application.setStatus(newStatus); // Update status if valid
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    /**
     * Convert Application entity to ApplicationDTO.
     */
    private ApplicationDTO mapToDTO(Application app) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(app.getId());
        dto.setCoverLetter(app.getCoverLetter());
        dto.setApplicationDate(app.getApplicationDate());
        dto.setStatus(app.getStatus().name());
        dto.setJobId(app.getJob().getId());
        dto.setApplicantId(app.getApplicant().getId());
        return dto;
    }
}
