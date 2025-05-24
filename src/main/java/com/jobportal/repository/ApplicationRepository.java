package com.jobportal.repository;

import com.jobportal.model.Application;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJob_Id(Long jobId);
    List<Application> findByApplicant_Id(Long applicantId);
    List<Application> findByJob_IdIn(List<Long> jobIds, Pageable pageable);
}