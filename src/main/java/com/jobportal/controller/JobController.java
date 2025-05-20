package com.jobportal.controller;

import com.jobportal.dto.JobDTO;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.mapper.JobMapper;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final JobMapper jobMapper;
    private final UserRepository userRepository;

    public JobController(JobService jobService, JobMapper jobMapper, UserRepository userRepository) {
        this.jobService = jobService;
        this.jobMapper = jobMapper;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        List<Job> jobs = jobService.getAllJobs();
        List<JobDTO> jobDTOs = jobs.stream()
                .map(jobMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(jobDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable Long id) {
        Job job = jobService.getJobByIdOrThrow(id);
        return ResponseEntity.ok(jobMapper.toDTO(job));
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobDTO> createJob(@Valid @RequestBody JobDTO jobDTO) {
        // Set current time as posted date
        jobDTO.setPostedDate(LocalDateTime.now());
        
        // Convert DTO to entity
        Job job = jobMapper.toEntity(jobDTO);
        
        // Save job
        Job savedJob = jobService.createJob(job);
        
        // Return saved job as DTO
        return new ResponseEntity<>(jobMapper.toDTO(savedJob), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobDTO> updateJob(@PathVariable Long id, @Valid @RequestBody JobDTO jobDTO) {
        // Check if job exists
        Job existingJob = jobService.getJobByIdOrThrow(id);
        
        // Set the ID to ensure we're updating the right job
        jobDTO.setId(id);
        
        // Convert DTO to entity
        Job jobToUpdate = jobMapper.toEntity(jobDTO);
        
        // Preserve the original employer
        jobToUpdate.setEmployer(existingJob.getEmployer());
        
        // Update job
        Job updatedJob = jobService.updateJob(jobToUpdate);
        
        // Return updated job as DTO
        return ResponseEntity.ok(jobMapper.toDTO(updatedJob));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        // Delete job
        jobService.deleteJob(id);
        
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobDTO>> searchJobs(@RequestParam(required = false) String keyword,
                                              @RequestParam(required = false) String location,
                                              @RequestParam(required = false) String jobType) {
        
        List<Job> searchResults;
        
        // Determine which search method to use based on parameters provided
        if (location != null && jobType != null) {
            searchResults = jobService.searchJobsByKeywordLocationAndType(
                    keyword != null ? keyword : "", location, jobType);
        } else {
            searchResults = jobService.searchJobs(keyword != null ? keyword : "");
        }
        
        // Convert to DTOs
        List<JobDTO> jobDTOs = searchResults.stream()
                .map(jobMapper::toDTO)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(jobDTOs);
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<JobDTO>> getJobsByEmployer(@PathVariable Long employerId) {
        // Check if employer exists
        if (!userRepository.existsById(employerId)) {
            throw new ResourceNotFoundException("Employer not found with id: " + employerId);
        }
        
        List<Job> jobs = jobService.getJobsByEmployerId(employerId);
        
        // Convert to DTOs
        List<JobDTO> jobDTOs = jobs.stream()
                .map(jobMapper::toDTO)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(jobDTOs);
    }
}