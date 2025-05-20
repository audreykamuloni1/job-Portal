package com.jobportal.mapper;

import com.jobportal.dto.JobDTO;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {

    private final UserRepository userRepository;

    public JobMapper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Convert JobDTO to Job entity
     */
    public Job toEntity(JobDTO dto) {
        Job job = new Job();
        job.setId(dto.getId());
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setLocation(dto.getLocation());
        job.setJobType(dto.getJobType());
        job.setRequirements(dto.getRequirements());
        job.setSalary(dto.getSalary());
        job.setApplicationDeadline(dto.getApplicationDeadline());
        
        if (dto.getEmployerId() != null) {
            userRepository.findById(dto.getEmployerId()).ifPresent(job::setEmployer);
        }
        
        return job;
    }

    /**
     * Convert Job entity to JobDTO
     */
    public JobDTO toDTO(Job job) {
        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setRequirements(job.getRequirements());
        dto.setSalary(job.getSalary());
        dto.setApplicationDeadline(job.getApplicationDeadline());
        dto.setPostedDate(job.getPostedDate());
        dto.setActive(job.isActive());
        dto.setStatus(job.getStatus().name());
        
        if (job.getEmployer() != null) {
            dto.setEmployerId(job.getEmployer().getId());
            dto.setEmployerName(job.getEmployer().getUsername());
        }
        
        return dto;
    }
}