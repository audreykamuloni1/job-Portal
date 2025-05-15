package com.jobportal.repository;

import com.jobportal.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Find all applications submitted by a specific applicant
    List<Application> findByApplicantId(Long applicantId);

    // Find all applications submitted to a specific job
    List<Application> findByJobId(Long jobId);
}
