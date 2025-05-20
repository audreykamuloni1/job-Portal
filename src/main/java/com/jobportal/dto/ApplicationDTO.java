package com.jobportal.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationDTO {
    private Long id;
    private String coverLetter;
    private LocalDateTime applicationDate;
    private String status;
    private Long jobId;
    private String jobTitle;
    private Long applicantId;
    private String applicantName;
   

    // Constructor for Option 2 (without resumePath)
    public ApplicationDTO(
        Long id, 
        String coverLetter, 
        LocalDateTime applicationDate, 
        String status, 
        Long jobId, 
        String jobTitle, 
        Long applicantId, 
        String applicantName
    ) {
        this.id = id;
        this.coverLetter = coverLetter;
        this.applicationDate = applicationDate;
        this.status = status;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.applicantId = applicantId;
        this.applicantName = applicantName;
    }
}