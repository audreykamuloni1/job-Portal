package com.jobportal.repository;

import com.jobportal.model.Job;
import com.jobportal.model.JobStatus; // Import JobStatus
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    
    List<Job> findByEmployer_Id(Long employerId);
    
    List<Job> findByIsActiveTrue();
    
    List<Job> findByStatus(JobStatus status); // Changed to JobStatus
    
    @Query("SELECT j FROM Job j WHERE j.isActive = true AND j.status = com.jobportal.model.JobStatus.APPROVED AND " + // Added status filter
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.requirements) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Job> searchJobs(@Param("keyword") String keyword);

    @Query("SELECT j FROM Job j WHERE j.isActive = true AND j.status = com.jobportal.model.JobStatus.APPROVED AND " + // Added status filter
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.requirements) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')) AND " +
           "LOWER(j.jobType) = LOWER(:jobType)")
    List<Job> searchJobsByKeywordLocationAndType(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("jobType") String jobType);
            
    Long countByEmployerId(Long employerId);
    Long countByEmployerIdAndIsActiveAndStatus(Long employerId, boolean isActive, JobStatus status); // Changed to JobStatus
}