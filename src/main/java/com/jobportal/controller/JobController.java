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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    @PreAuthorize("hasAuthority('ROLE_EMPLOYER')")
    public ResponseEntity<JobDTO> createJob(@Valid @RequestBody JobDTO jobDTO, @AuthenticationPrincipal UserDetails userDetails) {
        jobDTO.setPostedDate(LocalDateTime.now());

        User employer = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with username: " + userDetails.getUsername()));

        
        Job job = jobMapper.toEntity(jobDTO);
        job.setEmployer(employer);
        
        jobDTO.setEmployerId(employer.getId());


        Job savedJob = jobService.createJob(job);

        return new ResponseEntity<>(jobMapper.toDTO(savedJob), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYER')")
    public ResponseEntity<JobDTO> updateJob(@PathVariable Long id, @Valid @RequestBody JobDTO jobDTO, @AuthenticationPrincipal UserDetails userDetails) {
        // Fetch the job using the unfiltered getJobById to allow updates on PENDING/REJECTED jobs
        Job existingJob = jobService.getJobById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        // Verify ownership
        User employer = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with username: " + userDetails.getUsername()));
        if (!existingJob.getEmployer().getId().equals(employer.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Or throw NotAuthorizedException
        }
        
        // Preserve original creation date and employer, status is handled by service layer (preserves current status)
        jobDTO.setId(id); // Ensure DTO has the correct ID for mapping
        Job jobToUpdate = jobMapper.toEntity(jobDTO);
        jobToUpdate.setEmployer(existingJob.getEmployer()); 
        jobToUpdate.setPostedDate(existingJob.getPostedDate()); // Keep original posted date
        // The status will be set by jobService.updateJob by fetching the existingJob's status.

        Job updatedJob = jobService.updateJob(jobToUpdate);

        return ResponseEntity.ok(jobMapper.toDTO(updatedJob));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYER')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobDTO>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType) {

        List<Job> searchResults;
        if (location != null && jobType != null) {
            searchResults = jobService.searchJobsByKeywordLocationAndType(
                    keyword != null ? keyword : "", location, jobType);
        } else {
            searchResults = jobService.searchJobs(keyword != null ? keyword : "");
        }
        List<JobDTO> jobDTOs = searchResults.stream()
                .map(jobMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(jobDTOs);
    }

    @GetMapping("/employer/my-jobs")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYER')")
    public ResponseEntity<List<JobDTO>> getJobsByEmployer(@AuthenticationPrincipal UserDetails userDetails) {
        User employer = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with username: " + userDetails.getUsername()));

        List<Job> jobs = jobService.getJobsByEmployerId(employer.getId());
        List<JobDTO> jobDTOs = jobs.stream()
                .map(jobMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(jobDTOs);
    }

    @GetMapping("/employer/metrics/total-posted")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYER')")
    public ResponseEntity<Long> getTotalJobsPostedMetric(@AuthenticationPrincipal UserDetails userDetails) {
        User employer = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with username: " + userDetails.getUsername()));
        long count = jobService.getTotalJobsPostedByEmployer(employer.getId());
        return ResponseEntity.ok(count);
    }

    @GetMapping("/employer/metrics/active-listings")
    @PreAuthorize("hasAuthority('ROLE_EMPLOYER')")
    public ResponseEntity<Long> getActiveJobsMetric(@AuthenticationPrincipal UserDetails userDetails) {
        User employer = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with username: " + userDetails.getUsername()));
        long count = jobService.getActiveJobsCountByEmployer(employer.getId());
        return ResponseEntity.ok(count);
    }
}