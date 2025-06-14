package com.jobportal.config;

import com.jobportal.model.Role;
import com.jobportal.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        if (roleRepository.findByName("EMPLOYER").isEmpty()) {
            roleRepository.save(new Role("EMPLOYER"));
        }
        if (roleRepository.findByName("JOB_SEEKER").isEmpty()) {
            roleRepository.save(new Role("JOB_SEEKER"));
        }
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new Role("ROLE_ADMIN"));
        }
    }
}