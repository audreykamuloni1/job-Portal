package com.jobportal.security.jwt;

import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @Mock
    private HttpServletRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtUtils = new JwtUtils();

        // Generate a valid HS512 secret key (512 bits)
        SecretKey validKey = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
        String base64EncodedKey = Base64.getEncoder().encodeToString(validKey.getEncoded());

        // Set the valid key using ReflectionTestUtils
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", base64EncodedKey);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000); // 24 hours
    }

    @Test
    void testParseJwt() {
        when(request.getHeader("Authorization")).thenReturn("Bearer test-token");
        assertEquals("test-token", jwtUtils.parseJwt(request));
    }

    @Test
    void testValidateJwtToken() {
        String token = jwtUtils.generateJwtToken("test-user", List.of("ROLE_ADMIN"));
        assertTrue(jwtUtils.validateJwtToken(token));
    }
}