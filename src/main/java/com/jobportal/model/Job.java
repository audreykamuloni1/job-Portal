package com.jobportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Represents a job posting created by an employer.
 */
@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Job title
    @Column(nullable = false)
    private String title;

    // Full description of the job
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    // Location of the job
    @Column(nullable = false)
    private String location;

    // Type of job: internship, grant, opportunity, etc.
    @Column(name = "job_type", nullable = false)
    private String jobType;

    // Job requirements
    @Column(nullable = false)
    private String requirements;

    // Optional salary field
    @Column
    private String salary;

    // Application deadline for the job
    @Column(name = "application_deadline")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime applicationDeadline;

    // Timestamp for when the job was posted
    @Column(name = "posted_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime postedDate = LocalDateTime.now();

    // Flag to mark whether the job is still visible/active
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    // Job approval status (added for admin management)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.PENDING;

    // Many jobs can be posted by one employer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;

    // Applications submitted for this job
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private Set<Application> applications = new HashSet<>();

    // Job approval status options
    public enum Status {
        PENDING,   // Awaiting admin review
        APPROVED,  // Approved by admin
        REJECTED   // Rejected by admin
    }
}
