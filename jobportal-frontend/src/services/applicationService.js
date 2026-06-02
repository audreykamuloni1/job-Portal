import api from './api';

// Usage: applicationService.applyToJob(applicationDTO)
const applicationService = {
  // Apply to a job
  applyToJob: async (applicationDTO) => {
    return api.post('/applications', applicationDTO);
  },

  // Get all applications for the current user
  getApplicationsByUser: async () => {
    return api.get('/applications/user/me');
  },

  // Get all applications for a specific job
  getApplicationsByJob: async (jobId) => {
    return api.get(`/applications/job/${jobId}`);
  },

  updateApplicationStatus: async (applicationId, status) => {
    try {
      // The backend expects the status as a request parameter
      const response = await api.patch(`/applications/${applicationId}/status?status=${status}`);
      return response.data; // Backend currently returns void, so this might be empty or a success message if backend changes
    } catch (error) {
      console.error('Error updating application status:', error.response || error.message);
      throw error.response?.data || { message: error.message };
    }
  },
};

export default applicationService;