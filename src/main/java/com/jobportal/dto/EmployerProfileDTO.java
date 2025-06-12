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
    private Long userId; 
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String companyContactPhone;
   
    private String username;
    private String email;
}
