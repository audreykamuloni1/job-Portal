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
public class JobDTO {
    
    private Long id;
    
    @NotBlank(message = "Job title is required")
    private String title;
    
    @NotBlank(message = "Job description is required")
    private String description;
    
    @NotBlank(message = "Job location is required")
    private String location;
    
    @NotBlank(message = "Job type is required")
    private String jobType;
    
    @NotBlank(message = "Job requirements are required")
    private String requirements;
    
    private String salary;
    
    private LocalDateTime applicationDeadline;
    
    private LocalDateTime postedDate;
    
    private boolean active;
    
    private String status;
    
    @NotNull(message = "Employer ID is required")
    private Long employerId;
    
    private String employerName;
}