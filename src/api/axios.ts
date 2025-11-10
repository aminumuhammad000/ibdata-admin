import axios from 'axios';

const BASE_URL =
  import.meta.env.MODE === 'production'
    ? 'https://vtuapp-production.up.railway.app/api/v1/admin'
    : 'http://localhost:5000/api/v1/admin';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
