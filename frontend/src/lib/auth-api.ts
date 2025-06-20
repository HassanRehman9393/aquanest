import axios from 'axios';
import { LoginCredentials, RegisterData, RegisterPayload, AuthResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('aquanest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aquanest_token');
        localStorage.removeItem('aquanest_user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);    return response.data;
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...registerPayload }: { confirmPassword: string; [key: string]: any } = data;
    const response = await api.post('/auth/register', registerPayload as RegisterPayload);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: any) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Logout (optional API call for server-side logout)
  logout: async () => {
    await api.post('/auth/logout');
  },
};

export default api;
