package com.jobportal.service;

import com.jobportal.model.Job;
import com.jobportal.repository.JobRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final JobRepository jobRepository;

    public AdminService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public void approveJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(Job.Status.APPROVED);
        jobRepository.save(job);
    }

    public void rejectJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(Job.Status.REJECTED);
        jobRepository.save(job);
    }

    // Additional methods for user management can be added here
}
