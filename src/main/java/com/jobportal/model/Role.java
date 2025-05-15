package com.jobportal.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;

@Entity
public class Role implements GrantedAuthority {

    public enum RoleName {
        ROLE_JOB_SEEKER,
        ROLE_EMPLOYER,
        ROLE_ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoleName name;

    // GrantedAuthority method
    @Override
    public String getAuthority() {
        return name.name();
    }

    // Getters and setters
    public Long getId() { return id; }
    public RoleName getName() { return name; }
    public void setName(RoleName name) { this.name = name; }
}