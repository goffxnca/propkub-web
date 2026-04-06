import { apiClient } from '@/libs/client';
import { translateServerError } from '@/libs/serverErrorTranslator';
import { tokenManager } from '@/libs/tokenManager';
import { User, UserRole } from '@/types/models/user';
import { useRouter } from 'next/router';
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isNormalUser: boolean;
  isAgent: boolean;
  isProfileComplete: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    isAgent: boolean
  ) => Promise<void>;
  signout: (redirectTo?: string) => Promise<void>;
  initializing: boolean;
  loading: boolean;
  error: string;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { locale } = router;

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
      } catch (err: any) {
        console.error('[Auth] Initialization failed:', err);
        tokenManager.removeToken();
        setUser(null);
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const signin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await apiClient.auth.login({ email, password });
      tokenManager.setToken(result.accessToken);
      const userProfile = await apiClient.auth.getProfile();
      setUser(userProfile);
      setLoading(false);
    } catch (err: any) {
      const errorMessage = translateServerError(err.message, locale);
      setError(errorMessage);
      setLoading(false);
      console.error('[Auth] Login failed:', err.message);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    isAgent: boolean
  ) => {
    setLoading(true);
    try {
      const result = await apiClient.auth.signup({
        email,
        password,
        name,
        isAgent
      });

      tokenManager.setToken(result.accessToken);
      const userProfile = await apiClient.auth.getProfile();
      setUser(userProfile);
      setLoading(false);
    } catch (err: any) {
      const errorMessage = translateServerError(err.message, locale);
      setError(errorMessage);
      setLoading(false);
      console.error('[Auth] Signup failed:', err.message);
    }
  };

  const signout = async (redirectTo = '/') => {
    setLoading(true);
    try {
      tokenManager.removeToken();
      setUser(null);
      setLoading(false);
      router.push(redirectTo);
    } catch (err: any) {
      console.error('[Auth] Logout failed:', err.message);
      setLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  const isAuthenticated = !!user;
  const isNormalUser = user && user.role === UserRole.NORMAL;
  const isAgent = user && user.role === UserRole.AGENT;
  const isProfileComplete = !!(
    user &&
    user.email &&
    user.name &&
    user.phone &&
    user.line &&
    user.profileImg
  );

  const authValue: AuthContextValue = {
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
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
