package com.jobportal.controller;

import com.jobportal.dto.EmployerProfileDTO;
import com.jobportal.dto.JobSeekerProfileDTO;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.FileStorageService; // Added import
import com.jobportal.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Added import

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService; // Added injection

    @Autowired
    public ProfileController(UserService userService, UserRepository userRepository, FileStorageService fileStorageService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService; // Added initialization
    }

    // Helper method to get current user ID from principal
    private Long getCurrentUserId(UserDetails userDetails) {
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database")); // Should not happen
        return currentUser.getId();
    }

    // --- Job Seeker Profile Endpoints ---

    @GetMapping("/job-seeker")
    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    public ResponseEntity<JobSeekerProfileDTO> getJobSeekerProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        JobSeekerProfileDTO profileDTO = userService.getJobSeekerProfileByUserId(userId);
        return ResponseEntity.ok(profileDTO);
    }

    @PutMapping("/job-seeker")
    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    public ResponseEntity<JobSeekerProfileDTO> updateJobSeekerProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody JobSeekerProfileDTO profileDTO) {
        Long userId = getCurrentUserId(userDetails);
        // Ensure the DTO's userId matches the authenticated user, or ignore DTO's userId
        // The service method `updateJobSeekerProfile` already takes userId as a parameter.
        JobSeekerProfileDTO updatedProfile = userService.updateJobSeekerProfile(userId, profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/job-seeker/resume")
    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    public ResponseEntity<?> uploadResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("resume") MultipartFile resumeFile) {
        Long userId = getCurrentUserId(userDetails);

        // Store the file
        String fileName = fileStorageService.storeFile(resumeFile, String.valueOf(userId));

        // Update the user's profile with the file path
        JobSeekerProfileDTO profileDTO = userService.getJobSeekerProfileByUserId(userId);
        profileDTO.setResumeFilePath(fileName);
        userService.updateJobSeekerProfile(userId, profileDTO);

        // Using a simple string for the message to avoid complex JSON construction.
        // For a more structured response, consider creating a response DTO.
        return ResponseEntity.ok().body("{\"message\": \"Resume uploaded successfully: " + fileName + "\"}");
    }

    // --- Employer Profile Endpoints ---

    @GetMapping("/employer")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYER')")
    public ResponseEntity<EmployerProfileDTO> getEmployerProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        EmployerProfileDTO profileDTO = userService.getEmployerProfileByUserId(userId);
        return ResponseEntity.ok(profileDTO);
    }

    @PutMapping("/employer")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYER')")
    public ResponseEntity<EmployerProfileDTO> updateEmployerProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EmployerProfileDTO profileDTO) {
        Long userId = getCurrentUserId(userDetails);
        // Similar to job seeker, ensure DTO's userId is handled correctly by service or ignored.
        EmployerProfileDTO updatedProfile = userService.updateEmployerProfile(userId, profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }
}
