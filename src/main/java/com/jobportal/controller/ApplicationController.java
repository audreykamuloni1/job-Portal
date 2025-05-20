package com.jobportal.controller;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.model.User;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserService userService;

    public ApplicationController(ApplicationService applicationService, 
                                UserService userService) {
        this.applicationService = applicationService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<String> createApplication(
            @Valid @RequestBody ApplicationDTO applicationDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userService.getUserByUsername(userDetails.getUsername());
        applicationService.createApplication(applicationDTO, user.getId());
        return new ResponseEntity<>("Application submitted successfully!", HttpStatus.CREATED);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobId(jobId));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(applicationService.getApplicationsByUserId(user.getId()));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<String> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String status) {
        applicationService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok("Application status updated successfully!");
    }
}