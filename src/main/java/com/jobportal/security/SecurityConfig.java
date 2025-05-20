package com.jobportal.security;

import com.jobportal.security.jwt.JwtUtils;
import com.jobportal.service.UserService;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@ConditionalOnProperty(
    name = "spring.security.enabled", 
    havingValue = "true", 
    matchIfMissing = true
)
public class SecurityConfig {

    private final JwtUtils jwtUtils;
    private final UserService userService;

    public SecurityConfig(JwtUtils jwtUtils, UserService userService) {
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    new AntPathRequestMatcher("/api/auth/**"),
                    new AntPathRequestMatcher("/h2-console/**"),
                    new AntPathRequestMatcher("/error")
                ).permitAll()
                
                // Public GET endpoints
                .requestMatchers(
                    new AntPathRequestMatcher("/api/jobs/**", HttpMethod.GET.name())
                ).permitAll()

                // Job Seeker endpoints
                .requestMatchers(
                    new AntPathRequestMatcher("/api/applications/**", HttpMethod.POST.name())
                ).hasAuthority("ROLE_JOB_SEEKER")
                .requestMatchers(
                    new AntPathRequestMatcher("/api/applications/user/**", HttpMethod.GET.name())
                ).hasAuthority("ROLE_JOB_SEEKER")

                // Employer endpoints
                .requestMatchers(
                    new AntPathRequestMatcher("/api/applications/job/**", HttpMethod.GET.name())
                ).hasAuthority("ROLE_EMPLOYER")
                .requestMatchers(
                    new AntPathRequestMatcher("/api/jobs/**", HttpMethod.POST.name())
                ).hasAuthority("ROLE_EMPLOYER")
                .requestMatchers(
                    new AntPathRequestMatcher("/api/jobs/**", HttpMethod.PUT.name())
                ).hasAnyAuthority("ROLE_EMPLOYER", "ROLE_ADMIN")
                .requestMatchers(
                    new AntPathRequestMatcher("/api/jobs/**", HttpMethod.DELETE.name())
                ).hasAnyAuthority("ROLE_EMPLOYER", "ROLE_ADMIN")
                .requestMatchers(
                    new AntPathRequestMatcher("/api/employer/**")
                ).hasAuthority("ROLE_EMPLOYER")

                // Admin endpoints
                .requestMatchers(
                    new AntPathRequestMatcher("/api/admin/**")
                ).hasAuthority("ROLE_ADMIN")

                // Catch-all rule
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        http.headers(headers -> headers.frameOptions().disable());
        return http.build();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtils, userService);
    }

    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:8091"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}