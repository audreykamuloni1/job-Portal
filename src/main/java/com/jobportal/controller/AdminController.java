package com.jobportal.controller;

import com.jobportal.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Endpoint to approve a job posting
    @PutMapping("/jobs/{jobId}/approve")
    public ResponseEntity<String> approveJob(@PathVariable Long jobId) {
        adminService.approveJob(jobId);
        return ResponseEntity.ok("Job approved successfully.");
    }

    // Endpoint to reject a job posting
    @PutMapping("/jobs/{jobId}/reject")
    public ResponseEntity<String> rejectJob(@PathVariable Long jobId) {
        adminService.rejectJob(jobId);
        return ResponseEntity.ok("Job rejected successfully.");
    }

    // Additional endpoints for user management can be added here
}
