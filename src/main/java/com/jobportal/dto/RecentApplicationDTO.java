package com.jobportal.dto;

import java.time.LocalDateTime;

public class RecentApplicationDTO {
    private Long applicationId;
    private String applicantUsername;
    private String jobTitle;
    private Long jobId;
    private LocalDateTime applicationDate;
    private String status; 

    
    public RecentApplicationDTO() {}

    public RecentApplicationDTO(Long applicationId, String applicantUsername, String jobTitle, Long jobId, LocalDateTime applicationDate, String status) {
        this.applicationId = applicationId;
        this.applicantUsername = applicantUsername;
        this.jobTitle = jobTitle;
        this.jobId = jobId;
        this.applicationDate = applicationDate;
        this.status = status;
    }

   
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public String getApplicantUsername() { return applicantUsername; }
    public void setApplicantUsername(String applicantUsername) { this.applicantUsername = applicantUsername; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public LocalDateTime getApplicationDate() { return applicationDate; }
    public void setApplicationDate(LocalDateTime applicationDate) { this.applicationDate = applicationDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
