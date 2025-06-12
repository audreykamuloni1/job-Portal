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

    
    @Column(nullable = false)
    private String title;

    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

  
    @Column(nullable = false)
    private String location;

   
    @Column(name = "job_type", nullable = false)
    private String jobType;

  
    @Column(nullable = false)
    private String requirements;

    @Column
    private String salary;

    
    @Column(name = "application_deadline")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime applicationDeadline;

    @Column(name = "posted_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime postedDate = LocalDateTime.now();

    
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.PENDING;

   
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private Set<Application> applications = new HashSet<>();

    
    public enum Status {
        PENDING,   
        APPROVED,  
        REJECTED   
    }
    
   
    public boolean isActive() {
        return isActive;
    }
    
   
    public void setActive(boolean active) {
        isActive = active;
    }
}