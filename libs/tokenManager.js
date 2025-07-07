// JWT Token Management Utilities

const TOKEN_KEY = 'accessToken';

export const tokenManager = {
  // Store token in localStorage
  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Get token from localStorage
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  // Remove token from localStorage
  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // Check if token exists
  hasToken() {
    return !!this.getToken();
  }
}; 