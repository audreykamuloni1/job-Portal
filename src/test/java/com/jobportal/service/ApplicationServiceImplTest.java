package com.jobportal.service;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.model.EmployerProfile;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceImplTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    private User applicant;
    private User employer;
    private Job job;
    private ApplicationDTO applicationDTO;
    private Application application;

    @BeforeEach
    void setUp() {
        applicant = new User();
        applicant.setId(1L);
        applicant.setUsername("testApplicant");
        applicant.setEmail("applicant@example.com");

        employer = new User();
        employer.setId(2L);
        employer.setUsername("testEmployer");
        employer.setEmail("employer@example.com");
        EmployerProfile employerProfile = new EmployerProfile();
        employerProfile.setCompanyName("Test Company");
        employer.setEmployerProfile(employerProfile);


        job = new Job();
        job.setId(10L);
        job.setTitle("Software Engineer");
        job.setEmployer(employer);

        applicationDTO = new ApplicationDTO();
        applicationDTO.setJobId(job.getId());
        applicationDTO.setCoverLetter("This is my cover letter.");
        
        // Application object that would be saved
        application = new Application();
        application.setApplicant(applicant);
        application.setJob(job);
        application.setCoverLetter(applicationDTO.getCoverLetter());
        application.setApplicationDate(LocalDateTime.now());
        application.setStatus(Application.ApplicationStatus.PENDING);
    }

    @Test
    void createApplication_ShouldSendEmailToEmployer_WhenEmployerHasEmail() {
        when(userRepository.findById(applicant.getId())).thenReturn(Optional.of(applicant));
        when(jobRepository.findById(job.getId())).thenReturn(Optional.of(job));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        applicationService.createApplication(applicationDTO, applicant.getId());

        verify(emailService).sendSimpleEmail(
            eq(employer.getEmail()),
            eq("New Application Received for '" + job.getTitle() + "'"),
            contains("Dear " + employer.getUsername())
        );
    }

    @Test
    void createApplication_ShouldNotSendEmail_WhenEmployerHasNoEmail() {
        employer.setEmail(null); // Employer has no email

        when(userRepository.findById(applicant.getId())).thenReturn(Optional.of(applicant));
        when(jobRepository.findById(job.getId())).thenReturn(Optional.of(job));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);


        applicationService.createApplication(applicationDTO, applicant.getId());

        verify(emailService, never()).sendSimpleEmail(anyString(), anyString(), anyString());
    }
    
    @Test
    void createApplication_ShouldNotSendEmail_WhenEmployerEmailIsEmpty() {
        employer.setEmail(""); // Employer has an empty email string

        when(userRepository.findById(applicant.getId())).thenReturn(Optional.of(applicant));
        when(jobRepository.findById(job.getId())).thenReturn(Optional.of(job));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        applicationService.createApplication(applicationDTO, applicant.getId());

        verify(emailService, never()).sendSimpleEmail(anyString(), anyString(), anyString());
    }

    @Test
    void createApplication_ShouldStillSaveApplication_WhenEmployerHasNoEmail() {
        employer.setEmail(null);

        when(userRepository.findById(applicant.getId())).thenReturn(Optional.of(applicant));
        when(jobRepository.findById(job.getId())).thenReturn(Optional.of(job));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        applicationService.createApplication(applicationDTO, applicant.getId());

        verify(applicationRepository).save(any(Application.class)); // Ensure application is still saved
        verify(emailService, never()).sendSimpleEmail(anyString(), anyString(), anyString());
    }
}
