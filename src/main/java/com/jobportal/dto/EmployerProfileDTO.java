package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployerProfileDTO {
    private Long userId; // To associate with the User
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String companyContactPhone;
    // We might also want to include username or email from the User entity for display purposes
    private String username;
    private String email;
}
