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
    private Long userId; 
    private String fullName;
    private String contactPhone;
    private String skillsSummary;
    private String education;
    private String experience;
    private String resumeFilePath;
    
    private String username;
    private String email;
}
