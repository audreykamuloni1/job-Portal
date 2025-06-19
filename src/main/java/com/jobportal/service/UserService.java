package com.jobportal.service;

import com.jobportal.dto.EmployerProfileDTO;
import com.jobportal.dto.JobSeekerProfileDTO;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.*;
import com.jobportal.repository.EmployerProfileRepository;
import com.jobportal.repository.JobSeekerProfileRepository;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final EmployerProfileRepository employerProfileRepository;

    @Autowired
    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JobSeekerProfileRepository jobSeekerProfileRepository,
                       EmployerProfileRepository employerProfileRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
        this.employerProfileRepository = employerProfileRepository;
    }

    @Transactional
    public void registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String userType = request.getUserType();
        String roleName;
        if ("ROLE_EMPLOYER".equalsIgnoreCase(userType)) {
            roleName = "ROLE_EMPLOYER";
        } else if ("ROLE_JOB_SEEKER".equalsIgnoreCase(userType)) {
            roleName = "ROLE_JOB_SEEKER";
        } else {
            throw new RuntimeException("Invalid userType: " + userType);
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        User user = new User(
            request.getUsername(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            true
        );
        user.setRoles(Set.of(role));

        User savedUser = userRepository.save(user); // Save the user and get the managed instance with ID

        if ("ROLE_EMPLOYER".equalsIgnoreCase(request.getUserType())) {
            EmployerProfile employerProfile = new EmployerProfile(savedUser); // Pass managed User
            employerProfileRepository.save(employerProfile);
            // Optional: savedUser.setEmployerProfile(employerProfile); if you need the link in the current User object in memory
        } else if ("ROLE_JOB_SEEKER".equalsIgnoreCase(request.getUserType())) {
            JobSeekerProfile jobSeekerProfile = new JobSeekerProfile(savedUser); // Pass managed User
            jobSeekerProfileRepository.save(jobSeekerProfile);
            // Optional: savedUser.setJobSeekerProfile(jobSeekerProfile);
        }
    }

    @Transactional(readOnly = true)
    public JobSeekerProfileDTO getJobSeekerProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Seeker Profile not found for user id: " + userId));
        return convertToJobSeekerProfileDTO(profile, user);
    }

    @Transactional
    public JobSeekerProfileDTO updateJobSeekerProfile(Long userId, JobSeekerProfileDTO profileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Seeker Profile not found for user id: " + userId));

        profile.setFullName(profileDTO.getFullName());
        profile.setContactPhone(profileDTO.getContactPhone());
        profile.setSkillsSummary(profileDTO.getSkillsSummary());
        profile.setEducation(profileDTO.getEducation());
        profile.setExperience(profileDTO.getExperience());
        profile.setResumeFilePath(profileDTO.getResumeFilePath());

        JobSeekerProfile updatedProfile = jobSeekerProfileRepository.save(profile);
        return convertToJobSeekerProfileDTO(updatedProfile, user);
    }

    @Transactional(readOnly = true)
    public EmployerProfileDTO getEmployerProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        EmployerProfile profile = employerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer Profile not found for user id: " + userId));
        return convertToEmployerProfileDTO(profile, user);
    }

    @Transactional
    public EmployerProfileDTO updateEmployerProfile(Long userId, EmployerProfileDTO profileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        EmployerProfile profile = employerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer Profile not found for user id: " + userId));

        profile.setCompanyName(profileDTO.getCompanyName());
        profile.setCompanyDescription(profileDTO.getCompanyDescription());
        profile.setCompanyWebsite(profileDTO.getCompanyWebsite());
        profile.setCompanyContactPhone(profileDTO.getCompanyContactPhone());

        EmployerProfile updatedProfile = employerProfileRepository.save(profile);
        return convertToEmployerProfileDTO(updatedProfile, user);
    }

    private JobSeekerProfileDTO convertToJobSeekerProfileDTO(JobSeekerProfile profile, User user) {
        JobSeekerProfileDTO dto = new JobSeekerProfileDTO();
        dto.setUserId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(profile.getFullName());
        dto.setContactPhone(profile.getContactPhone());
        dto.setSkillsSummary(profile.getSkillsSummary());
        dto.setEducation(profile.getEducation());
        dto.setExperience(profile.getExperience());
        dto.setResumeFilePath(profile.getResumeFilePath());
        return dto;
    }

    private EmployerProfileDTO convertToEmployerProfileDTO(EmployerProfile profile, User user) {
        EmployerProfileDTO dto = new EmployerProfileDTO();
        dto.setUserId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCompanyName(profile.getCompanyName());
        dto.setCompanyDescription(profile.getCompanyDescription());
        dto.setCompanyWebsite(profile.getCompanyWebsite());
        dto.setCompanyContactPhone(profile.getCompanyContactPhone());
        return dto;
    }
}