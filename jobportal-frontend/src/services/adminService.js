import API from './api'; // Assuming API is the configured Axios instance

const AdminService = {
  // User Management
  getAllUsers: async () => {
    try {
      const response = await API.get('/admin/users');
      return response.data; // Expecting an array of user objects
    } catch (error) {
      console.error('Error fetching all users:', error.response || error.message);
      throw error.response?.data || error;
    }
  },

  activateUser: async (userId) => {
    try {
      // Backend uses PUT, but PATCH might also be suitable semantically.
      // Sticking to PUT as per backend AdminController likely uses @PutMapping
      const response = await API.put(`/admin/users/${userId}/activate`);
      return response.data; // Expecting a success message or updated user
    } catch (error) {
      console.error(`Error activating user ${userId}:`, error.response || error.message);
      throw error.response?.data || error;
    }
  },

  deactivateUser: async (userId) => {
    try {
      const response = await API.put(`/admin/users/${userId}/deactivate`);
      return response.data; // Expecting a success message or updated user
    } catch (error) {
      console.error(`Error deactivating user ${userId}:`, error.response || error.message);
      throw error.response?.data || error;
    }
  },

  // Job Approval Management
  getPendingJobs: async () => {
    try {
      const response = await API.get('/admin/jobs/pending');
      return response.data; // Expecting an array of job objects pending approval
    } catch (error) {
      console.error('Error fetching pending jobs:', error.response || error.message);
      throw error.response?.data || error;
    }
  },

  approveJob: async (jobId) => {
    try {
      const response = await API.put(`/admin/jobs/${jobId}/approve`);
      return response.data; // Expecting a success message or updated job
    } catch (error) {
      console.error(`Error approving job ${jobId}:`, error.response || error.message);
      throw error.response?.data || error;
    }
  },

  rejectJob: async (jobId) => {
    try {
      const response = await API.put(`/admin/jobs/${jobId}/reject`);
      return response.data; // Expecting a success message or updated job
    } catch (error) {
      console.error(`Error rejecting job ${jobId}:`, error.response || error.message);
      throw error.response?.data || error;
    }
  }
};

export default AdminService;
