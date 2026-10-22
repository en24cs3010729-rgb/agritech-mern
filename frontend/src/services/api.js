import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  try {
    const saved = localStorage.getItem('agritech_user');
    if (saved) {
      const user = JSON.parse(saved);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (e) {
    console.error('Failed to attach token', e);
  }
  return config;
});

export default api;
