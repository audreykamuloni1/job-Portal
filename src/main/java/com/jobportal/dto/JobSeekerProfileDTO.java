package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerProfileDTO {
    private Long userId; // To associate with the User
    private String fullName;
    private String contactPhone;
    private String skillsSummary;
    private String education;
    private String experience;
    private String resumeFilePath;
    // We might also want to include username or email from the User entity for display purposes
    private String username;
    private String email;
}
