package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    private Long id;

    @NotBlank(message = "Cover letter cannot be blank")
    @Size(min = 10, max = 5000, message = "Cover letter must be between 10 and 5000 characters")
    private String coverLetter;

    private LocalDateTime applicationDate;
    private String status;

    @NotNull(message = "Job ID cannot be null when submitting an application")
    private Long jobId;

    private String jobTitle;
    private Long applicantId;
    private String applicantName;
    private String companyName;
}