import api from './api';

const jobService = {
  getAllJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  postJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  getEmployerJobs: async () => {
    try {
      const response = await api.get('/jobs/employer/my-jobs');
      return response.data;
    } catch (error) {
      console.error('Error fetching employer jobs:', error.response || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  getTotalJobsPostedMetric: async () => {
    try {
      const response = await api.get('/jobs/employer/metrics/total-posted');
      return response.data; // Should be a number
    } catch (error) {
      console.error('Error fetching total jobs posted metric:', error.response || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  getActiveJobsMetric: async () => {
    try {
      const response = await api.get('/jobs/employer/metrics/active-listings');
      return response.data; // Should be a number
    } catch (error) {
      console.error('Error fetching active jobs metric:', error.response || error.message);
      throw error.response?.data || { message: error.message };
    }
  },
};

export default jobService;
