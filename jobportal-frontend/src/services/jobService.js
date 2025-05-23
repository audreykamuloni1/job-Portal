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
};

export default jobService;
