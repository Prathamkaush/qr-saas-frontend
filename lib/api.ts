import axios from 'axios';

// 1. Point to your Go Backend
// If you used the Next.js Rewrite (Option 2 in previous msg), use '/api'
// If you used the Go CORS fix (Option 1), use 'http://localhost:8080/api'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor: Auto-attach JWT token
api.interceptors.request.use(
  (config) => {
    // We will store the token in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Interceptor: Handle 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear it and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional: window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);