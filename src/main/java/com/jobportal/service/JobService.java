package com.jobportal.service;

import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Job;
import com.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;

    @Autowired
    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Transactional
    public Job createJob(Job job) {
        // Jobs are now approved by default
        job.setStatus(Job.Status.APPROVED);
        return jobRepository.save(job);
    }

    @Transactional(readOnly = true)
    public List<Job> getAllJobs() {
        // Return only active jobs that have been approved
        return jobRepository.findAll().stream()
                .filter(job -> job.isActive() && job.getStatus() == Job.Status.APPROVED)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Job getJobByIdOrThrow(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    @Transactional
    public Job updateJob(Job job) {
        // Check if job exists
        if (!jobRepository.existsById(job.getId())) {
            throw new ResourceNotFoundException("Job not found with id: " + job.getId());
        }
        
        // Ensure updated jobs are also set to approved status
        job.setStatus(Job.Status.APPROVED);
        
        return jobRepository.save(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Job> searchJobs(String keyword) {
        return jobRepository.searchJobs(keyword);
    }

    @Transactional(readOnly = true)
    public List<Job> searchJobsByKeywordLocationAndType(String keyword, String location, String jobType) {
        return jobRepository.searchJobsByKeywordLocationAndType(keyword, location, jobType);
    }

    @Transactional(readOnly = true)
    public List<Job> getJobsByEmployerId(Long employerId) {
        return jobRepository.findByEmployer_Id(employerId);
    }

    @Transactional(readOnly = true)
    public long getTotalJobsPostedByEmployer(Long employerId) {
        return jobRepository.countByEmployerId(employerId);
    }

    @Transactional(readOnly = true)
    public long getActiveJobsCountByEmployer(Long employerId) {
        
        return jobRepository.countByEmployerIdAndIsActiveAndStatus(employerId, true, Job.Status.APPROVED);
    }
}