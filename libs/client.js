import axios from "axios";
import { tokenManager } from "./tokenManager";
import { envConfig } from "./envConfig";

const apiInstance = axios.create({
  baseURL: envConfig.apiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
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
    const errorMessage =
      error.response?.data?.message || error.message || "API request failed";
    throw new Error(errorMessage);
  }
);

export const apiClient = {
  auth: {
    async signup(name, email, password, isAgent) {
      return apiInstance.post("/auth/register", {
        name,
        email,
        password,
        isAgent,
      });
    },

    async login(email, password) {
      return apiInstance.post("/auth/login", {
        email,
        password,
      });
    },

    async getProfile() {
      return apiInstance.get("/auth/profile");
    },

    async verifyEmail(vtoken) {
      return apiInstance.get("/auth/verify-email", {
        params: { vtoken },
      });
    },

    async forgotPassword(email) {
      return apiInstance.post("/auth/forgot-password", {
        email,
      });
    },

    async validateResetToken(token) {
      return apiInstance.get("/auth/validate-reset-token", {
        params: { token },
      });
    },

    async resetPassword(token, newPassword) {
      return apiInstance.post("/auth/reset-password", {
        token,
        newPassword,
      });
    },

    async updatePassword(currentPassword, newPassword) {
      return apiInstance.post("/auth/update-password", {
        currentPassword,
        newPassword,
      });
    },

    async updateProfile(profileData) {
      return apiInstance.patch("/auth/profile", profileData);
    },
  },

  provinces: {
    async getAll() {
      return apiInstance.get("/provinces");
    },

    async getByRegionId(regionId) {
      return apiInstance.get(`/provinces?regionId=${regionId}`);
    },
  },

  districts: {
    async getByProvinceId(provinceId) {
      return apiInstance.get(`/districts/province/${provinceId}`);
    },

    async getById(id) {
      return apiInstance.get(`/districts/${id}`);
    },
  },

  subDistricts: {
    async getByDistrictId(districtId) {
      return apiInstance.get(`/subDistricts/district/${districtId}`);
    },

    async getById(id) {
      return apiInstance.get(`/subDistricts/${id}`);
    },
  },

  posts: {
    async create(postData) {
      return apiInstance.post("/posts", postData);
    },

    async getMyPosts(page = 1, per_page = 20) {
      return apiInstance.get(`/posts/me?page=${page}&per_page=${per_page}`);
    },

    async getMyPostsStats() {
      return apiInstance.get("/posts/me/stats");
    },
  },
};
