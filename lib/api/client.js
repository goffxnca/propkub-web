import axios from 'axios';
import { tokenManager } from './tokenManager';

const API_BASE_URL = 'http://localhost:3000';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiInstance.interceptors.response.use(
  (response) => {
    return response.data; 
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'API request failed';
    throw new Error(errorMessage);
  }
);

export const apiClient = {
  auth: {
    async signup(name, email, password, isAgent) {
      return apiInstance.post('/auth/register', {
        name,
        email, 
        password,
        isAgent
      });
    },
    
    async login(email, password) {
      return apiInstance.post('/auth/login', {
        email,
        password
      });
    },
    
    async getProfile() {
      return apiInstance.get('/auth/profile');
    },
    
    async verifyEmail(vtoken) {
      return apiInstance.get('/auth/verify-email', {
        params: { vtoken }
      });
    },
    
    async forgotPassword(email) {
      return apiInstance.post('/auth/forgot-password', {
        email
      });
    },
    
    async validateResetToken(token) {
      return apiInstance.get('/auth/validate-reset-token', {
        params: { token }
      });
    },
    
    async resetPassword(token, newPassword) {
      return apiInstance.post('/auth/reset-password', {
        token,
        newPassword
      });
    },
    
    async updatePassword(currentPassword, newPassword) {
      return apiInstance.post('/auth/update-password', {
        currentPassword,
        newPassword
      });
    }
  }
}; 