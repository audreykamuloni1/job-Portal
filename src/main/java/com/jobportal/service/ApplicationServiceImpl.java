package com.jobportal.service;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.model.Application;
import com.jobportal.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Override
    public void createApplication(ApplicationDTO applicationDTO, Long applicantId) {
        Application application = new Application();
        application.setJobId(applicationDTO.getJobId());
        application.setApplicantId(applicantId);
        application.setCoverLetter(applicationDTO.getCoverLetter());
        application.setStatus("PENDING");
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
        application.setStatus(status);
        applicationRepository.save(application);
    }

    private ApplicationDTO convertToDTO(Application application) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(application.getId());
        dto.setJobId(application.getJobId());
        dto.setApplicantId(application.getApplicantId());
        dto.setCoverLetter(application.getCoverLetter());
        dto.setStatus(application.getStatus());
        return dto;
    }
}