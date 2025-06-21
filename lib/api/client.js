import axios from 'axios';

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
    console.error('API Error:', errorMessage);
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
    }
  }
}; 