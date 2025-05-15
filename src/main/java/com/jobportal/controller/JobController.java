package com.jobportal.controller;

import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Create a new job (for employers only)
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Job> createJob(@RequestBody Job job, 
                                       @AuthenticationPrincipal User employer) {
        job.setEmployer(employer);
        Job createdJob = jobService.createJob(job);
        return ResponseEntity.ok(createdJob);
    }

    // Get all jobs
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // Get a job by ID
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobService.getJobById(id);
        return job.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update a job by ID (only owner or admin)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, 
                                       @RequestBody Job job,
                                       @AuthenticationPrincipal User user) {
        Optional<Job> existingJob = jobService.getJobById(id);
        if (existingJob.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        if (!isAdmin(user) && !isOwner(user, existingJob.get())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        job.setId(id);
        return ResponseEntity.ok(jobService.updateJob(job));
    }

    // Delete a job (only owner or admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, 
                                        @AuthenticationPrincipal User user) {
        Optional<Job> existingJob = jobService.getJobById(id);
        if (existingJob.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (!isAdmin(user) && !isOwner(user, existingJob.get())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    // Search jobs by keyword
    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(@RequestParam String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }

    // Advanced search by keyword + location + job type
    @GetMapping("/search/advanced")
    public ResponseEntity<List<Job>> searchJobsByKeywordLocationAndType(
            @RequestParam String keyword,
            @RequestParam String location,
            @RequestParam String jobType) {
        return ResponseEntity.ok(
                jobService.searchJobsByKeywordLocationAndType(keyword, location, jobType)
        );
    }

    // Get jobs by current employer
    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<Job>> getCurrentEmployerJobs(@AuthenticationPrincipal User employer) {
        return ResponseEntity.ok(jobService.getJobsByEmployerId(employer.getId()));
    }

    private boolean isAdmin(User user) {
        return user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }

    private boolean isOwner(User user, Job job) {
        return job.getEmployer().getId().equals(user.getId());
    }
}