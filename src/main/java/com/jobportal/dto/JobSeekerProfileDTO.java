package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerProfileDTO {
    private Long userId; 

    @NotBlank(message = "Full name cannot be blank")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Pattern(regexp = "^(\\+?[0-9\\s\\-\\(\\)]{7,20})?$", message = "Invalid phone number format")
    @Size(max = 20, message = "Contact phone must be less than 20 characters")
    private String contactPhone;

    @NotBlank(message = "Skills summary cannot be blank")
    @Size(min = 10, max = 2000, message = "Skills summary must be between 10 and 2000 characters")
    private String skillsSummary;

    @Size(max = 2000, message = "Education details must be less than 2000 characters")
    private String education;

    @Size(max = 5000, message = "Experience details must be less than 5000 characters")
    private String experience;

    private String resumeFilePath;
    
    private String username;
    private String email;
}
