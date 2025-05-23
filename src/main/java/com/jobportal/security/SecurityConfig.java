package com.jobportal.security;

// No need to import JwtUtils or UserService here as they are not directly used in this config
// They are used by JwtAuthenticationFilter and DaoAuthenticationProvider respectively.

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher; // Ensure this is imported
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize, @PostAuthorize, @Secured, @RolesAllowed
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

   
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          UserDetailsService userDetailsService,
                          PasswordEncoder passwordEncoder) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, HandlerMappingIntrospector introspector) throws Exception {
        // Create an MvcRequestMatcher.Builder instance to use for all MVC patterns
        MvcRequestMatcher.Builder mvcMatcherBuilder = new MvcRequestMatcher.Builder(introspector);

        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless APIs
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Use custom CORS configuration
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin())) // Allow H2 console in frames from same origin
            .authorizeHttpRequests(auth -> auth
                // Publicly accessible paths
                .requestMatchers(mvcMatcherBuilder.pattern("/h2-console/**")).permitAll()
                .requestMatchers(mvcMatcherBuilder.pattern("/api/auth/**")).permitAll()
                .requestMatchers(mvcMatcherBuilder.pattern("/api-docs/**")).permitAll() // For OpenAPI/Swagger if you use it
                .requestMatchers(mvcMatcherBuilder.pattern("/swagger-ui/**")).permitAll()
                .requestMatchers(mvcMatcherBuilder.pattern("/swagger-ui.html")).permitAll()
                .requestMatchers(mvcMatcherBuilder.pattern("/error")).permitAll() // Allow Spring Boot's default error page

                // Public GET requests for jobs
                .requestMatchers(mvcMatcherBuilder.pattern(HttpMethod.GET, "/api/jobs/**")).permitAll()

                // Authenticated POST requests for jobs (likely requires specific roles, handled by @PreAuthorize or more specific rules)
                // If you need more granular control here (e.g. employers posting), use @PreAuthorize on controller methods
                // or add more specific .hasRole() / .hasAuthority() rules.
                // For now, general /api/jobs/** for non-GET methods is authenticated:
                .requestMatchers(mvcMatcherBuilder.pattern("/api/jobs/**")).authenticated()

                // Authenticated requests for applications
                .requestMatchers(mvcMatcherBuilder.pattern("/api/applications/**")).authenticated()
                // You would typically add more granular role-based access here or use @EnableMethodSecurity
                // Example (if you want to add them back here directly):
                // .requestMatchers(mvcMatcherBuilder.pattern(HttpMethod.POST, "/api/applications/**")).hasAuthority("ROLE_JOB_SEEKER")
                // .requestMatchers(mvcMatcherBuilder.pattern(HttpMethod.GET, "/api/applications/applicant/**")).hasAuthority("ROLE_JOB_SEEKER")
                // .requestMatchers(mvcMatcherBuilder.pattern(HttpMethod.GET, "/api/applications/job/**")).hasAuthority("ROLE_EMPLOYER")
                // .requestMatchers(mvcMatcherBuilder.pattern(HttpMethod.POST, "/api/jobs/**")).hasAuthority("ROLE_EMPLOYER") // This would conflict with permitAll for GET above
                // .requestMatchers(mvcMatcherBuilder.pattern(HttpMethod.PUT, "/api/jobs/**")).hasAnyAuthority("ROLE_EMPLOYER", "ROLE_ADMIN")
                // .requestMatchers(mvcMatcherBuilder.pattern(HttpMethod.DELETE, "/api/jobs/**")).hasAnyAuthority("ROLE_EMPLOYER", "ROLE_ADMIN")

                // Fallback: Deny all other requests (very restrictive)
                // Consider .anyRequest().authenticated() if you want any other unlisted path to just require login
                .anyRequest().denyAll()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean to provide and configure DaoAuthenticationProvider
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // Your custom UserDetailsService
        authProvider.setPasswordEncoder(passwordEncoder);      // Your PasswordEncoder (e.g., BCrypt)
        return authProvider;
    }

    // Bean to expose AuthenticationManager (needed for login endpoint in AuthController)
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Bean for CORS configuration
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // IMPORTANT: For production, specify your frontend's actual origin instead of "*"
        configuration.setAllowedOrigins(List.of("*"));
        // Include "OPTIONS" for pre-flight requests, and other methods you use
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*")); // Allow all headers, or be more specific
        // configuration.setAllowCredentials(true); // Set to true if your frontend sends credentials (cookies, auth headers)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply this CORS configuration to all paths
        return source;
    }
}