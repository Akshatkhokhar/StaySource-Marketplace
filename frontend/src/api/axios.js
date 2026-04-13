import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add auth header from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('staysource_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: handle global errors like 401
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('staysource_token');
    localStorage.removeItem('staysource_user');
    window.dispatchEvent(new Event('auth:unauthorized'));
  }
  return Promise.reject(error);
});

export default api;
