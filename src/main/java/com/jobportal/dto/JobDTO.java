package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @Size(min = 5, max = 100, message = "Job title must be between 5 and 100 characters")
    private String title;
    
    @NotBlank(message = "Job description is required")
    @Size(min = 20, max = 5000, message = "Job description must be between 20 and 5000 characters")
    private String description;
    
    @NotBlank(message = "Job location is required")
    @Size(min = 2, max = 100, message = "Job location must be between 2 and 100 characters")
    private String location;
    
    @NotBlank(message = "Job type is required")
    @Size(min = 2, max = 50, message = "Job type must be between 2 and 50 characters")
    private String jobType;
    
    @NotBlank(message = "Job requirements are required")
    @Size(min = 10, max = 2000, message = "Job requirements must be between 10 and 2000 characters")
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