package com.jobportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;

@WebMvcTest(AdminController.class)
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @Autowired
    private ObjectMapper objectMapper;

    // --- Test approveJob ---
    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void approveJob_AsAdmin_ShouldSucceed() throws Exception {
        doNothing().when(adminService).approveJob(1L);
        mockMvc.perform(put("/api/admin/jobs/1/approve"))
               .andExpect(status().isOk())
               .andExpect(content().string("Job approved successfully."));
    }

    @Test
    @WithMockUser(authorities = {"ROLE_EMPLOYER"})
    void approveJob_AsEmployer_ShouldBeForbidden() throws Exception {
        mockMvc.perform(put("/api/admin/jobs/1/approve"))
               .andExpect(status().isForbidden());
    }

    @Test
    void approveJob_AsUnauthenticated_ShouldBeForbidden() throws Exception {
         // Spring Security by default will deny unauthenticated access to protected endpoints.
         // Depending on the setup, this might be a 401 or 403.
         // @WebMvcTest without a user context often leads to 401 if not configured otherwise for unauthenticated access.
         // However, with @EnableMethodSecurity and @PreAuthorize, it should result in 403 if the filter chain is hit.
         // For WebMvcTest, the full filter chain leading to a 401 might not always be active for unauthenticated tests
         // unless explicitly configured. Let's assume it will try to authenticate and fail, or hit PreAuthorize.
         // If security context is empty, PreAuthorize typically denies.
        mockMvc.perform(put("/api/admin/jobs/1/approve"))
               .andExpect(status().isUnauthorized()); // Or isForbidden() if PreAuthorize is hit before authentication mechanism
    }


    // --- Test rejectJob ---
    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void rejectJob_AsAdmin_ShouldSucceed() throws Exception {
        doNothing().when(adminService).rejectJob(1L);
        mockMvc.perform(put("/api/admin/jobs/1/reject"))
               .andExpect(status().isOk())
               .andExpect(content().string("Job rejected successfully."));
    }

    @Test
    @WithMockUser(authorities = {"ROLE_JOB_SEEKER"})
    void rejectJob_AsJobSeeker_ShouldBeForbidden() throws Exception {
        mockMvc.perform(put("/api/admin/jobs/1/reject"))
               .andExpect(status().isForbidden());
    }

    // --- Test getPendingJobs ---
    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void getPendingJobs_AsAdmin_ShouldSucceed() throws Exception {
        when(adminService.getPendingJobs()).thenReturn(new ArrayList<>());
        mockMvc.perform(get("/api/admin/jobs/pending"))
               .andExpect(status().isOk())
               .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser(authorities = {"ROLE_EMPLOYER"})
    void getPendingJobs_AsEmployer_ShouldBeForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/jobs/pending"))
               .andExpect(status().isForbidden());
    }

    // --- Test getAllUsers ---
    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void getAllUsers_AsAdmin_ShouldSucceed() throws Exception {
        when(adminService.getAllUsers()).thenReturn(new ArrayList<>());
        mockMvc.perform(get("/api/admin/users"))
               .andExpect(status().isOk())
               .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser(authorities = {"ROLE_JOB_SEEKER"})
    void getAllUsers_AsJobSeeker_ShouldBeForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
               .andExpect(status().isForbidden());
    }

    // --- Test deactivateUser ---
    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void deactivateUser_AsAdmin_ShouldSucceed() throws Exception {
        doNothing().when(adminService).deactivateUser(1L);
        mockMvc.perform(put("/api/admin/users/1/deactivate"))
               .andExpect(status().isOk())
               .andExpect(content().string("User deactivated successfully."));
    }

    @Test
    @WithMockUser(authorities = {"ROLE_EMPLOYER"})
    void deactivateUser_AsEmployer_ShouldBeForbidden() throws Exception {
        mockMvc.perform(put("/api/admin/users/1/deactivate"))
               .andExpect(status().isForbidden());
    }

    // --- Test activateUser ---
    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void activateUser_AsAdmin_ShouldSucceed() throws Exception {
        doNothing().when(adminService).activateUser(1L);
        mockMvc.perform(put("/api/admin/users/1/activate"))
               .andExpect(status().isOk())
               .andExpect(content().string("User activated successfully."));
    }

    @Test
    @WithMockUser(authorities = {"ROLE_JOB_SEEKER"})
    void activateUser_AsJobSeeker_ShouldBeForbidden() throws Exception {
        mockMvc.perform(put("/api/admin/users/1/activate"))
               .andExpect(status().isForbidden());
    }

    // Test unauthenticated access for a GET endpoint as an example
    @Test
    void getAllUsers_AsUnauthenticated_ShouldBeUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
               .andExpect(status().isUnauthorized());
    }
}
