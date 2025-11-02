// JWT Token Management Utilities

const TOKEN_KEY = 'accessToken';

interface TokenManager {
  setToken: (token: string) => void;
  getToken: () => string | null;
  removeToken: () => void;
  hasToken: () => boolean;
}

export const tokenManager: TokenManager = {
  // Store token in localStorage
  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Get token from localStorage
  getToken(): string | null {
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
  hasToken(): boolean {
    return !!this.getToken();
  }
};
