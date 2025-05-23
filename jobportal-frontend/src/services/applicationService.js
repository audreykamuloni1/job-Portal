import api from './api';

// Usage: applicationService.applyToJob(applicationDTO, userId)
const applicationService = {
  // Apply to a job
  applyToJob: async (applicationDTO, applicantId) => {
    return api.post(`/applications?applicantId=${applicantId}`, applicationDTO);
  },

  // Get all applications for a specific user
  getApplicationsByUser: async (userId) => {
    return api.get(`/applications/user/${userId}`);
  },

  // Get all applications for a specific job
  getApplicationsByJob: async (jobId) => {
    return api.get(`/applications/job/${jobId}`);
  },
};

export default applicationService;