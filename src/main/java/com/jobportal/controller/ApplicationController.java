package com.jobportal.controller;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Submit a new job application
    @PostMapping
    public ResponseEntity<String> applyToJob(@Valid @RequestBody ApplicationDTO applicationDTO) {
        applicationService.applyToJob(applicationDTO);
        return ResponseEntity.ok("Application submitted successfully!");
    }

    // Get all applications for a specific job (for employers)
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    // Get all applications submitted by a specific user (for job seekers)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getApplicationsByUser(userId));
    }

    //  Update application status (e.g., approve/reject)
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long applicationId,
                                               @RequestParam String status) {
        applicationService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok("Application status updated!");
    }
}
