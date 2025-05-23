package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            // You might want to set 'from' address if not configured globally
            // message.setFrom("noreply@jobportal.com"); 
            mailSender.send(message);
            System.out.println("Email sent successfully to " + to); // For logging
        } catch (Exception e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage()); // For logging
            // Depending on policy, you might re-throw or handle (e.g., queue for retry)
        }
    }
}
