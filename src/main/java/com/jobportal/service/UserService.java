package com.jobportal.service;

import com.jobportal.dto.RegisterRequest;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String userType = request.getUserType();
        String roleName;
        if ("EMPLOYER".equalsIgnoreCase(userType)) {
            roleName = "EMPLOYER";
        } else if ("JOB_SEEKER".equalsIgnoreCase(userType)) {
            roleName = "JOB_SEEKER";
        } else {
            throw new RuntimeException("Invalid userType: " + userType);
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        User user = new User(
            request.getUsername(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            true
        );
        user.setRoles(Set.of(role));
        userRepository.save(user);
    }
}