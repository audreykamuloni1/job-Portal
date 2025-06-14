package com.jobportal.service;

import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Job;
import com.jobportal.model.JobStatus; // Import JobStatus
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
        // Set status to PENDING_APPROVAL for new jobs
        job.setStatus(JobStatus.PENDING_APPROVAL);
        return jobRepository.save(job);
    }

    @Transactional(readOnly = true)
    public List<Job> getAllJobs() {
        // Return only active jobs that have been approved
        return jobRepository.findAll().stream()
                .filter(job -> job.isActive() && job.getStatus() == JobStatus.APPROVED)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Job> getJobById(Long id) {
        // This method can be used internally or by admin/employer who might see non-approved jobs
        // For public view, getJobByIdOrThrow is filtered
        return jobRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Job getJobByIdOrThrow(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        // For public access, only return if job is APPROVED
        if (job.getStatus() != JobStatus.APPROVED) {
            throw new ResourceNotFoundException("Job not found with id: " + id + " or it is not currently available.");
        }
        return job;
    }

    @Transactional
    public Job updateJob(Job job) {
        // Check if job exists
        Job existingJob = jobRepository.findById(job.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + job.getId()));
        
       
        
        job.setStatus(existingJob.getStatus()); 
        
        
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
        // Filtering is now done at the repository level
        return jobRepository.searchJobs(keyword);
    }

    @Transactional(readOnly = true)
    public List<Job> searchJobsByKeywordLocationAndType(String keyword, String location, String jobType) {
        // Filtering is now done at the repository level
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
        
        return jobRepository.countByEmployerIdAndIsActiveAndStatus(employerId, true, JobStatus.APPROVED);
    }
}