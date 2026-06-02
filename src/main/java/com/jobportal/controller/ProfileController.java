package com.jobportal.controller;

import com.jobportal.dto.EmployerProfileDTO;
import com.jobportal.dto.JobSeekerProfileDTO;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.FileStorageService;
import com.jobportal.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public ProfileController(UserService userService, UserRepository userRepository, FileStorageService fileStorageService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    private Long getCurrentUserId(UserDetails userDetails) {
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
        return currentUser.getId();
    }

    

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
        JobSeekerProfileDTO updatedProfile = userService.updateJobSeekerProfile(userId, profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/job-seeker/resume")
    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    public ResponseEntity<?> uploadResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("resume") MultipartFile resumeFile) {
        Long userId = getCurrentUserId(userDetails);

        
        String fileName = fileStorageService.storeFile(resumeFile, String.valueOf(userId));

        
        JobSeekerProfileDTO profileDTO = userService.getJobSeekerProfileByUserId(userId);
        profileDTO.setResumeFilePath(fileName);
        userService.updateJobSeekerProfile(userId, profileDTO);

        return ResponseEntity.ok().body("{\"message\": \"Resume uploaded successfully: " + fileName + "\"}");
    }

    

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
        EmployerProfileDTO updatedProfile = userService.updateEmployerProfile(userId, profileDTO);
        return ResponseEntity.ok(updatedProfile);
    } 
}