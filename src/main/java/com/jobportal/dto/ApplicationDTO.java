package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    
    private Long id;
    
    @NotBlank(message = "Cover letter is required")
    private String coverLetter;
    
    private LocalDateTime applicationDate;
    
    private String status;
    
    @NotNull(message = "Job ID is required")
    private Long jobId;
    
    private String jobTitle;
    
    @NotNull(message = "Applicant ID is required")
    private Long applicantId;
    
    private String applicantName;
    
    // Additional fields that might be needed when retrieving applications
    private String resume;
}