package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data // Lombok annotation that automatically generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Generates a no-argument constructor
@AllArgsConstructor // Generates a constructor with all fields as parameters
public class JobDTO {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotBlank(message = "Job type is required")
    private String jobType;
    
    @NotBlank(message = "Requirements are required")
    private String requirements;
    
    private String salary;
    
    private LocalDateTime applicationDeadline;
    
    private LocalDateTime postedDate;
    
    private Long employerId;
    
    private String companyName;
}
