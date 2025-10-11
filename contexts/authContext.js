import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { apiClient } from '../libs/client';
import { tokenManager } from '../libs/tokenManager';
import { translateServerError } from '../libs/serverErrorTranslator';

const initialContext = {
  user: null,
  isAuthenticated: false,
  isNormalUser: false,
  isAgent: false,
  isProfileComplete: false,
  signin: (email, password) => {},
  signup: (email, password, role) => {},
  signout: (redirectTo) => {},
  initializing: false,
  loading: false,
  error: '',
  clearError: () => {},
  setUser: () => {}
};

const authContext = createContext(initialContext);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { locale = 'th' } = router;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (tokenManager.hasToken()) {
          const userProfile = await apiClient.auth.getProfile();

          if (userProfile) {
            setUser(userProfile);
          } else {
            tokenManager.removeToken();
          }
          setInitializing(false);
        } else {
          setUser(null);
          setInitializing(false);
        }
      } catch (error) {
        console.error('[Auth] Initialization failed:', error);
        tokenManager.removeToken();
        setUser(null);
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const signin = async (email, password) => {
    setLoading(true);
    try {
      const result = await apiClient.auth.login(email, password);

      tokenManager.setToken(result.accessToken);
      const userProfile = await apiClient.auth.getProfile();
      setUser(userProfile);
      setLoading(false);
    } catch (error) {
      const errorMessage = translateServerError(error.message, locale);
      setError(errorMessage);
      setLoading(false);
      console.error('[Auth] Login failed:', error.message);
    }
  };

  const signup = async (email, password, name, isAgent) => {
    setLoading(true);
    try {
      const result = await apiClient.auth.signup(
        name,
        email,
        password,
        isAgent
      );

      tokenManager.setToken(result.accessToken);

      const userProfile = await apiClient.auth.getProfile();
      setUser(userProfile);
      setLoading(false);
    } catch (error) {
      const errorMessage = translateServerError(error.message, locale);
      setError(errorMessage);
      setLoading(false);
      console.error('[Auth] Signup failed:', error.message);
    }
  };

  const signout = async (redirectTo = '/') => {
    setLoading(true);
    try {
      tokenManager.removeToken();
      setUser(null);
      setLoading(false);
      router.push(redirectTo);
    } catch (error) {
      console.error('[Auth] Logout failed:', error.message);
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(false);
  };

  const isAuthenticated = !!user;
  const isNormalUser = user && user.role === 'normal';
  const isAgent = user && user.role === 'agent';
  const isProfileComplete =
    user &&
    user.email &&
    user.name &&
    user.phone &&
    user.line &&
    user.profileImg;

  const authValue = {
    user,
    isAuthenticated,
    isNormalUser,
    isAgent,
    isProfileComplete,
    signin,
    signup,
    signout,
    initializing,
    loading,
    error,
    clearError,
    setUser
  };

  return (
    <authContext.Provider value={authValue}>{children}</authContext.Provider>
  );
};

export { authContext, AuthContextProvider };
