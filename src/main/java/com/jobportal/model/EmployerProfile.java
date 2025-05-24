package com.jobportal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "employer_profiles")
@Getter
@Setter
@NoArgsConstructor
public class EmployerProfile {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String companyName;

    @Column(columnDefinition = "TEXT")
    private String companyDescription;

    private String companyWebsite;
    private String companyContactPhone;

    public EmployerProfile(User user) {
        this.user = user;
    }
}