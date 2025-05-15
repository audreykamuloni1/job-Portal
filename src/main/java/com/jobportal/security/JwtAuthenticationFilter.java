package com.jobportal.security;

import com.jobportal.security.jwt.JwtUtils;
import com.jobportal.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

/**
 * This filter intercepts every request to extract and validate the JWT token.
 * If the token is valid, it sets the user details in the security context.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserService userService;

    @Autowired
    public JwtAuthenticationFilter(JwtUtils jwtUtils, UserService userService) {
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        // ✅ Skip JWT processing for public login and registration endpoints
        if (requestURI.equals("/api/auth/login") || requestURI.equals("/api/auth/register")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extract the token from the Authorization header
            String jwt = jwtUtils.parseJwt(request);

            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                // Extract username/email from token
                String username = jwtUtils.getUsernameFromJwtToken(jwt);

                // Load user from DB
                UserDetails userDetails = userService.loadUserByUsername(username);

                // Create an authentication token
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // Attach details from the current request
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Set authentication in the context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (Exception e) {
            logger.error("JWT Authentication Error: {}", e.getMessage());
        }

        // Continue to the next filter in the chain
        filterChain.doFilter(request, response);
    }
}
