package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {
    @NotBlank private String username;
    @NotBlank private String email;
    @NotBlank private String password;
    @NotBlank private String userType; 

    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
}