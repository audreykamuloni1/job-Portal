package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data // Lombok annotation to generate getters, setters, equals, hashCode, and toString
@NoArgsConstructor // Generates a no-argument constructor
@AllArgsConstructor // Generates a constructor with all fields
public class ApplicationDTO {

    private Long id; // ID of the application 
    @NotBlank(message = "Cover letter cannot be blank")
    private String coverLetter; // Cover letter submitted by the applicant

    private LocalDateTime applicationDate; // Automatically set when creating the application

    private String status; // Optional status (Pending, Approved, Rejected)

    @NotNull(message = "Job ID is required")
    private Long jobId; // The ID of the job being applied to

    @NotNull(message = "Applicant ID is required")
    private Long applicantId; // The ID of the user applying to the job
}
