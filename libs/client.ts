import axios from 'axios';
import { tokenManager } from './tokenManager';
import { envConfig } from './envConfig';
import { sleep } from './misc';
import { AccessTokenResponse, MessageResponse } from '../types/http';
import { Province, District, SubDistrict } from '../types/models/address';
import { User } from '../types/models/user';
import { Post } from '../types/models/post';
import { paginatedItemsResponse } from '../types/dtos/responses/paginatedItemsResponse';
import { PostStatsResponse } from '../types/dtos/responses/postStatsResponse';
import { PaginationRequest } from '../types/dtos/requests/paginationRequest';
import { SearchPostRequest } from '../types/dtos/requests/searchPostRequest';
import { PostStatType } from '../types/enums/postStatType';
import { SignupRequest } from '../types/dtos/requests/signupRequest';
import { LoginRequest } from '../types/dtos/requests/loginRequest';
import { ResetPasswordRequest } from '../types/dtos/requests/resetPasswordRequest';
import { UpdatePasswordRequest } from '../types/dtos/requests/updatePasswordRequest';
import { UpdateProfileRequest } from '../types/dtos/requests/updateProfileRequest';
import { CreatePostRequest } from '../types/dtos/requests/createPostRequest';
import { UpdatePostRequest } from '../types/dtos/requests/updatePostRequest';
import { PostSitemapResponse } from '../types/dtos/responses/postSitemapResponse';

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
    async signup(signupData: SignupRequest): Promise<AccessTokenResponse> {
      return apiInstance.post('/auth/register', signupData);
    },

    async login(loginData: LoginRequest): Promise<AccessTokenResponse> {
      return apiInstance.post('/auth/login', loginData);
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
      resetPasswordData: ResetPasswordRequest
    ): Promise<MessageResponse> {
      return apiInstance.post('/auth/reset-password', resetPasswordData);
    },

    async updatePassword(
      updatePasswordData: UpdatePasswordRequest
    ): Promise<MessageResponse> {
      return apiInstance.post('/auth/update-password', updatePasswordData);
    },

    async updateProfile(
      updateProfileData: UpdateProfileRequest
    ): Promise<User> {
      return apiInstance.patch('/auth/profile', updateProfileData);
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
    async create(postData: CreatePostRequest): Promise<Post> {
      return apiInstance.post('/posts', postData);
    },

    async update(postId: string, postData: UpdatePostRequest): Promise<Post> {
      return apiInstance.patch(`/posts/${postId}`, postData);
    },

    async getByNumber(postNumber: string): Promise<Post> {
      return serverApiInstance.get(`/posts/${postNumber}`);
    },

    async getByIdForOwner(postId: string): Promise<Post> {
      return apiInstance.get(`/posts/${postId}/me`);
    },

    async getMyPosts(
      paginationData: PaginationRequest
    ): Promise<paginatedItemsResponse<Post>> {
      return apiInstance.get(`/posts/me`, {
        params: paginationData
      });
    },

    async getMyPostsStats(): Promise<PostStatsResponse> {
      return apiInstance.get('/posts/me/stats');
    },

    async closePost(postId: string): Promise<boolean> {
      return apiInstance.post(`/posts/${postId}/close`);
    },

    async getSimilarPosts(postId: string): Promise<Post[]> {
      return serverApiInstance.get('/posts/similar', {
        params: { postId }
      });
    },

    async getAllPosts(
      paginationData: PaginationRequest
    ): Promise<paginatedItemsResponse<Post>> {
      return serverApiInstance.get('/posts', {
        params: paginationData
      });
    },

    async searchPosts(searchPostRequest: SearchPostRequest): Promise<Post[]> {
      return apiInstance.post('/posts/search', searchPostRequest);
    },

    async increasePostStats(
      postId: string,
      statType: PostStatType
    ): Promise<void> {
      await sleep(1);
      return apiInstance.post(`/posts/${postId}/stats`, {
        statType
      });
    },

    async getLatestActiveForSitemap(): Promise<PostSitemapResponse> {
      return serverApiInstance.get('/posts/latest-active-sitemap');
    },

    async getAllActiveForSitemap(): Promise<PostSitemapResponse[]> {
      return serverApiInstance.get('/posts/all-active-sitemap');
    }
  }
};
