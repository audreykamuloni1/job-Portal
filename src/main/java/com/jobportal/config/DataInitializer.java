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
        // Store roles without the "ROLE_" prefix.
        // UserDetailsServiceImpl will add the prefix when creating GrantedAuthority objects.
        if (roleRepository.findByName("EMPLOYER").isEmpty()) {
            roleRepository.save(new Role("EMPLOYER"));
            System.out.println("Created EMPLOYER role");
        }
        if (roleRepository.findByName("JOB_SEEKER").isEmpty()) {
            roleRepository.save(new Role("JOB_SEEKER"));
            System.out.println("Created JOB_SEEKER role");
        }
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            roleRepository.save(new Role("ADMIN"));
            System.out.println("Created ADMIN role");
        }
    }
}