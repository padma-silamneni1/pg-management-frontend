import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  const ownerEmail = localStorage.getItem('ownerEmail');
  
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  if (ownerEmail) {
    config.headers['X-Owner-Email'] = ownerEmail;
  }
  
  return config;
});

export default api;
