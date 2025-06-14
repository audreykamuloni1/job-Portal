package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
// Consider adding import org.hibernate.validator.constraints.URL; if Hibernate Validator is used and a strict URL validation is needed.

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployerProfileDTO {
    private Long userId; 

    @NotBlank(message = "Company name cannot be blank")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    private String companyName;

    @Size(max = 5000, message = "Company description must be less than 5000 characters")
    private String companyDescription;

    @Pattern(regexp = "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$", message = "Invalid website URL format")
    @Size(max = 255, message = "Company website URL must be less than 255 characters")
    private String companyWebsite;

    @Pattern(regexp = "^(\\+?[0-9\\s\\-\\(\\)]{7,20})?$", message = "Invalid phone number format")
    @Size(max = 20, message = "Company contact phone must be less than 20 characters")
    private String companyContactPhone;
   
    private String username;
    private String email;
}
