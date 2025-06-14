package com.jobportal.controller;

import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Endpoint to approve a job posting
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/jobs/{jobId}/approve")
    public ResponseEntity<String> approveJob(@PathVariable Long jobId) {
        adminService.approveJob(jobId);
        return ResponseEntity.ok("Job approved successfully.");
    }

    // Endpoint to reject a job posting
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/jobs/{jobId}/reject")
    public ResponseEntity<String> rejectJob(@PathVariable Long jobId) {
        adminService.rejectJob(jobId);
        return ResponseEntity.ok("Job rejected successfully.");
    }

    // Get all pending jobs that need approval
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/jobs/pending")
    public ResponseEntity<List<Job>> getPendingJobs() {
        return ResponseEntity.ok(adminService.getPendingJobs());
    }

    // User management endpoints
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/users/{userId}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Long userId) {
        adminService.deactivateUser(userId);
        return ResponseEntity.ok("User deactivated successfully.");
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/users/{userId}/activate")
    public ResponseEntity<String> activateUser(@PathVariable Long userId) {
        adminService.activateUser(userId);
        return ResponseEntity.ok("User activated successfully.");
    }
}