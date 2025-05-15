package com.jobportal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter // Lombok will generate getters for all fields
@Setter // Lombok will generate setters for all fields
@NoArgsConstructor // Lombok will generate a no-argument constructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The date when the application was submitted
    @Column(name = "application_date", nullable = false)
    private LocalDateTime applicationDate;

    // Optional cover letter for the application
    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    // Current status of the application (e.g., PENDING, APPROVED, REJECTED)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    // Relationship to the job being applied to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    // Relationship to the user who submitted the application
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    // Enum for tracking application status
    public enum ApplicationStatus {
        PENDING, APPROVED, REJECTED
    }
}
