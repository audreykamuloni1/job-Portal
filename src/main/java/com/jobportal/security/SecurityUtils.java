package com.jobportal.security;

import com.jobportal.model.User;
import org.springframework.security.core.GrantedAuthority;

public class SecurityUtils {

    public static boolean isAdmin(User user) {
        return user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }

    public static boolean hasRole(User user, String roleName) {
        return user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals("ROLE_" + roleName));
    }
}