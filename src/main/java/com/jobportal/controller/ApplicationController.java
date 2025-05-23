package com.jobportal.controller;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    @Autowired
    public ApplicationController(ApplicationService applicationService, UserRepository userRepository) {
        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    public ResponseEntity<Void> createApplication(
            @RequestBody ApplicationDTO applicationDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        User applicant = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Applicant not found"));
        applicationService.createApplication(applicationDTO, applicant.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationService.getApplicationsByUserId(currentUser.getId()));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYER')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByJob(
            @PathVariable Long jobId) {
        // Optional ownership check can be added here later if complex logic is required
        return ResponseEntity.ok(applicationService.getApplicationsByJobId(jobId));
    }

    @PatchMapping("/{applicationId}/status")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYER')")
    public ResponseEntity<Void> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String status) {
        // Optional ownership check can be added here later
        applicationService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok().build();
    }
}