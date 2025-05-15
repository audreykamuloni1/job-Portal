package com.jobportal;
import io.jsonwebtoken.security.Keys; // Correct import for JJWT 0.11.5
import javax.crypto.SecretKey;
import java.util.Base64;

public class KeyGenerator {
    public static void main(String[] args) {
        SecretKey key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
        String base64Key = Base64.getEncoder().encodeToString(key.getEncoded());
        System.out.println("Generated JWT Secret: " + base64Key);
    }
}