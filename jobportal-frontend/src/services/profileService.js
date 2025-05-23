import api from './api'; // Assuming 'api.js' is your configured Axios instance

const profileService = {
  // === Job Seeker Profile ===
  getJobSeekerProfile: async () => {
    try {
      const response = await api.get('/profile/job-seeker');
      return response.data;
    } catch (error) {
      console.error('Error fetching job seeker profile:', error.response || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  updateJobSeekerProfile: async (profileData) => {
    try {
      const response = await api.put('/profile/job-seeker', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating job seeker profile:', error.response || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file); // 'resume' is the key expected by the backend

    try {
      const response = await api.post('/profile/job-seeker/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading resume:', error.response || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  getEmployerProfile: async () => {
    try {
      const response = await api.get('/profile/employer');
      return response.data;
    } catch (error) {
      console.error('Error fetching employer profile:', error.response || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  updateEmployerProfile: async (profileData) => {
    try {
      const response = await api.put('/profile/employer', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating employer profile:', error.response || error.message);
      throw error.response?.data || { message: error.message };
    }
  },
};

export default profileService;
