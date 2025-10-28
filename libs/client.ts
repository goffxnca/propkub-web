import axios from 'axios';
import { tokenManager } from './tokenManager';
import { envConfig } from './envConfig';
import { sleep } from './misc';
import { MessageResponse } from '../types/http';

const apiInstance = axios.create({
  baseURL: envConfig.apiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
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
    const errorMessage =
      error.response?.data?.message || error.message || 'API request failed';
    throw new Error(errorMessage);
  }
);

// Create a server-side API instance with API key
const serverApiInstance = axios.create({
  baseURL: envConfig.apiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

serverApiInstance.interceptors.request.use(
  (config) => {
    const apiKey = envConfig.apiKey();
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

serverApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || 'API request failed';
    throw new Error(errorMessage);
  }
);

export const apiClient = {
  auth: {
    async signup(
      name: string,
      email: string,
      password: string,
      isAgent: boolean
    ) {
      return apiInstance.post('/auth/register', {
        name,
        email,
        password,
        isAgent
      });
    },

    async login(email: string, password: string) {
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

    async forgotPassword(email: string): Promise<MessageResponse> {
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
    },

    async updateProfile(profileData) {
      return apiInstance.patch('/auth/profile', profileData);
    }
  },

  provinces: {
    async getAll() {
      return apiInstance.get('/provinces');
    },

    async getById(id) {
      return apiInstance.get(`/provinces/${id}`);
    },

    async getByRegionId(regionId) {
      return apiInstance.get(`/provinces?regionId=${regionId}`);
    }
  },

  districts: {
    async getById(id) {
      return apiInstance.get(`/districts/${id}`);
    },

    async getByProvinceId(provinceId) {
      return apiInstance.get(`/districts/province/${provinceId}`);
    }
  },

  subDistricts: {
    async getById(id) {
      return apiInstance.get(`/subDistricts/${id}`);
    },

    async getByDistrictId(districtId) {
      return apiInstance.get(`/subDistricts/district/${districtId}`);
    }
  },

  posts: {
    async create(postData) {
      return apiInstance.post('/posts', postData);
    },

    async update(postId, postData) {
      return apiInstance.patch(`/posts/${postId}`, postData);
    },

    async getByNumber(postNumber) {
      return serverApiInstance.get(`/posts/${postNumber}`);
    },

    async getByIdForOwner(postId) {
      return apiInstance.get(`/posts/${postId}/me`);
    },

    async getMyPosts(page = 1, per_page = 20) {
      return apiInstance.get(`/posts/me?page=${page}&per_page=${per_page}`);
    },

    async getMyPostsStats() {
      return apiInstance.get('/posts/me/stats');
    },

    async closePost(postId) {
      return apiInstance.post(`/posts/${postId}/close`);
    },

    async getSimilarPosts(postId) {
      return serverApiInstance.get('/posts/similar', {
        params: { postId }
      });
    },

    async getAllPosts(page, per_page) {
      return serverApiInstance.get('/posts', {
        params: { page, per_page }
      });
    },

    async searchPosts({
      postType,
      assetType,
      regionId,
      provinceId,
      districtId,
      subDistrictId
    }) {
      return apiInstance.post('/posts/search', {
        postType,
        assetType,
        regionId,
        provinceId,
        districtId,
        subDistrictId
      });
    },

    async increasePostStats(postId, statType) {
      await sleep(1);
      return apiInstance.post(`/posts/${postId}/stats`, {
        statType
      });
    },

    async getLatestActiveForSitemap() {
      return serverApiInstance.get('/posts/latest-active-sitemap');
    },

    async getAllActiveForSitemap() {
      return serverApiInstance.get('/posts/all-active-sitemap');
    }
  }
};
