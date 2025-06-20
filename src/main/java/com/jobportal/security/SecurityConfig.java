package com.jobportal.security;

import com.jobportal.security.jwt.JwtAccessDeniedHandler;
import com.jobportal.security.jwt.JwtAuthEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
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
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Value("${cors.allowed-origins}")
    private String corsAllowedOrigins;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          UserDetailsService userDetailsService,
                          PasswordEncoder passwordEncoder) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, HandlerMappingIntrospector introspector, JwtAuthEntryPoint jwtAuthEntryPoint) throws Exception {
        MvcRequestMatcher.Builder mvcMatcherBuilder = new MvcRequestMatcher.Builder(introspector);

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
                .anonymous(anonymous -> anonymous.disable())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new JwtAuthEntryPoint())
                        .accessDeniedHandler(new JwtAccessDeniedHandler())
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(mvcMatcherBuilder.pattern("/h2-console/**")).permitAll()
                        .requestMatchers(mvcMatcherBuilder.pattern("/api/auth/**")).permitAll()
                        .requestMatchers(mvcMatcherBuilder.pattern("/api-docs/**")).permitAll()
                        .requestMatchers(mvcMatcherBuilder.pattern("/swagger-ui/**")).permitAll()
                        .requestMatchers(mvcMatcherBuilder.pattern("/swagger-ui.html")).permitAll()
                        .requestMatchers(mvcMatcherBuilder.pattern("/error")).permitAll()
                        .requestMatchers(mvcMatcherBuilder.pattern(org.springframework.http.HttpMethod.GET, "/api/jobs/**")).permitAll()

                        .requestMatchers(mvcMatcherBuilder.pattern("/api/profile/**")).authenticated()
                        .requestMatchers(mvcMatcherBuilder.pattern("/api/resume/**")).authenticated()
                        .requestMatchers(mvcMatcherBuilder.pattern("/api/jobs/**")).authenticated()
                        .requestMatchers(mvcMatcherBuilder.pattern("/api/applications/**")).authenticated()
                        .requestMatchers(mvcMatcherBuilder.pattern("/api/admin/**")).authenticated()
                        .anyRequest().denyAll()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(authenticationProvider())
        ;

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> allowedOriginsList;
        if (StringUtils.hasText(corsAllowedOrigins)) {
            allowedOriginsList = Arrays.stream(corsAllowedOrigins.split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        } else {
            allowedOriginsList = Collections.singletonList("http://localhost:3000"); // Default fallback
        }
        configuration.setAllowedOrigins(allowedOriginsList);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of(HttpHeaders.CONTENT_DISPOSITION));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}