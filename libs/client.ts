import axios from 'axios';
import { tokenManager } from './tokenManager';
import { envConfig } from './envConfig';
import { sleep } from './misc';
import { AccessTokenResponse, MessageResponse } from '../types/http';
import { Province, District, SubDistrict } from '../types/models/address';
import { User } from '../types/models/user';

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
      email: string,
      password: string,
      name: string,
      isAgent: boolean
    ): Promise<AccessTokenResponse> {
      return apiInstance.post('/auth/register', {
        email,
        password,
        name,
        isAgent
      });
    },

    async login(email: string, password: string): Promise<AccessTokenResponse> {
      return apiInstance.post('/auth/login', {
        email,
        password
      });
    },

    async getProfile(): Promise<User> {
      return apiInstance.get('/auth/profile');
    },

    async verifyEmail(vtoken: string): Promise<MessageResponse> {
      return apiInstance.get('/auth/verify-email', {
        params: { vtoken }
      });
    },

    async forgotPassword(email: string): Promise<MessageResponse> {
      return apiInstance.post('/auth/forgot-password', {
        email
      });
    },

    async validateResetToken(token: string): Promise<MessageResponse> {
      return apiInstance.get('/auth/validate-reset-token', {
        params: { token }
      });
    },

    async resetPassword(
      token: string,
      newPassword: string
    ): Promise<MessageResponse> {
      return apiInstance.post('/auth/reset-password', {
        token,
        newPassword
      });
    },

    async updatePassword(
      currentPassword: string,
      newPassword: string
    ): Promise<MessageResponse> {
      return apiInstance.post('/auth/update-password', {
        currentPassword,
        newPassword
      });
    },

    async updateProfile(profileData): Promise<User> {
      return apiInstance.patch('/auth/profile', profileData);
    }
  },

  provinces: {
    async getAll(): Promise<Province[]> {
      return apiInstance.get('/provinces');
    },

    async getById(id: string): Promise<Province> {
      return apiInstance.get(`/provinces/${id}`);
    },

    async getByRegionId(regionId: string): Promise<Province[]> {
      return apiInstance.get(`/provinces?regionId=${regionId}`);
    }
  },

  districts: {
    async getById(id: string): Promise<District> {
      return apiInstance.get(`/districts/${id}`);
    },

    async getByProvinceId(provinceId: string): Promise<District[]> {
      return apiInstance.get(`/districts/province/${provinceId}`);
    }
  },

  subDistricts: {
    async getById(id: string): Promise<SubDistrict> {
      return apiInstance.get(`/subDistricts/${id}`);
    },

    async getByDistrictId(districtId: string): Promise<SubDistrict[]> {
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
