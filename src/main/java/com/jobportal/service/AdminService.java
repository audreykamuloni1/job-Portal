package com.jobportal.service;

import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Job;
import com.jobportal.model.JobStatus; // Import JobStatus
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public AdminService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void approveJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        job.setStatus(JobStatus.APPROVED); // Use JobStatus
        job.setActive(true); 
        jobRepository.save(job);
    }

    @Transactional
    public void rejectJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        job.setStatus(JobStatus.REJECTED); // Use JobStatus
        jobRepository.save(job);
    }

    public List<Job> getPendingJobs() {
        return jobRepository.findByStatus(JobStatus.PENDING_APPROVAL); // Use JobStatus
    }

    @Transactional
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setEnabled(false);
        userRepository.save(user);
    }

    @Transactional
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setEnabled(true);
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}