package com.jobportal;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import com.jobportal.config.TestSecurityConfig;
import com.jobportal.security.JwtAuthenticationFilter;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestSecurityConfig.class)
class JobportalApplicationTests {

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void contextLoads() {
        // This is just a basic test to check if the application context loads properly.
    }
}

