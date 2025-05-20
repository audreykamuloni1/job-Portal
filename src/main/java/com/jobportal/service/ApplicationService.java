package com.jobportal.service;

import com.jobportal.dto.ApplicationDTO;
import java.util.List;

public interface ApplicationService {
    void createApplication(ApplicationDTO applicationDTO, Long applicantId);
    List<ApplicationDTO> getApplicationsByJobId(Long jobId);
    List<ApplicationDTO> getApplicationsByUserId(Long userId);
    void updateApplicationStatus(Long applicationId, String status);
}