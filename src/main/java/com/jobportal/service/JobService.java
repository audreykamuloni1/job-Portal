package com.jobportal.service;

import com.jobportal.model.Job;
import com.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;

    @Autowired
    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public Job updateJob(Job job) {
        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    public List<Job> searchJobs(String keyword) {
        return jobRepository.searchJobs(keyword);
    }

    public List<Job> searchJobsByKeywordLocationAndType(String keyword, String location, String jobType) {
        return jobRepository.searchJobsByKeywordLocationAndType(keyword, location, jobType);
    }

    public List<Job> getJobsByEmployerId(Long employerId) {
        return jobRepository.findByEmployer_Id(employerId);
    }
}