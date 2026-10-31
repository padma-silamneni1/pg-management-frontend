import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
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
