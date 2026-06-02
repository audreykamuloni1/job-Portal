import api from './api'; // Your configured Axios instance

const profileService = {
  // === Job Seeker Profile ===
  getJobSeekerProfile: async () => {
    const response = await api.get('/profile/job-seeker');
    return response.data;
  },

  updateJobSeekerProfile: async (profileData) => {
    const response = await api.put('/profile/job-seeker', profileData);
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file); 
    const response = await api.post('/profile/job-seeker/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  
  getEmployerProfile: async () => {
    const response = await api.get('/profile/employer');
    return response.data;
  },

  updateEmployerProfile: async (profileData) => {
    const response = await api.put('/profile/employer', profileData);
    return response.data;
  },
};

export default profileService;