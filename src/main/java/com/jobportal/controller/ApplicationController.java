package com.jobportal.controller;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.exception.NotAuthorizedException;
import com.jobportal.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Submit a job application
     */
    @PostMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<String> applyForJob(@Valid @RequestBody ApplicationDTO applicationDTO) {
        // Get the current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Ensure the user is applying as themselves
        if (!auth.getName().equals(applicationDTO.getApplicantId().toString())) {
            throw new NotAuthorizedException("You are not authorized to apply on behalf of another user");
        }
        
        applicationService.applyToJob(applicationDTO);
        return new ResponseEntity<>("Application submitted successfully", HttpStatus.CREATED);
    }

    /**
     * Get all applications for a specific job (for employers)
     */
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByJob(@PathVariable Long jobId) {
        List<ApplicationDTO> applications = applicationService.getApplicationsByJob(jobId);
        return ResponseEntity.ok(applications);
    }

    /**
     * Get all applications submitted by a user (for job seekers)
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('JOB_SEEKER') or hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByUser(@PathVariable Long userId) {
        // Get the current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Ensure users can only view their own applications (unless admin)
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
            !auth.getName().equals(userId.toString())) {
            throw new NotAuthorizedException("You are not authorized to view applications of another user");
        }
        
        List<ApplicationDTO> applications = applicationService.getApplicationsByUser(userId);
        return ResponseEntity.ok(applications);
    }

    /**
     * Update application status (for employers)
     */
    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<String> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String status) {
        applicationService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok("Application status updated successfully");
    }
}