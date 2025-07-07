import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { apiClient } from "../libs/client";
import { tokenManager } from "../libs/tokenManager";
import { t } from "../libs/translator";

const initialContext = {
  user: null,
  isAuthenticated: false,
  isNormalUser: false,
  isAgent: false,
  isAdmin: false,
  isProfileComplete: false,
  signin: (email, password) => {},
  signup: (email, password, role) => {},
  signout: (redirectTo) => {},
  initializing: false,
  loading: false,
  error: "",
  clearError: () => {},
  setUser: () => {},
};

const authContext = createContext(initialContext);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log("[Auth] Initialization...");

    const initializeAuth = async () => {
      try {
        if (tokenManager.hasToken()) {
          console.log("[Auth] JWT token found, fetching user profile...");

          const userProfile = await apiClient.auth.getProfile();
          console.log("[Auth] User profile restored:", userProfile);

          if (userProfile) {
            setUser(userProfile);
          } else {
            tokenManager.removeToken();
          }
          setInitializing(false);
        } else {
          console.log("[Auth] No JWT token found");
          setUser(null);
          setInitializing(false);
        }
      } catch (error) {
        console.error("[Auth] Initialization failed:", error);
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
      console.log("[Auth] Login attempt for:", email);

      const result = await apiClient.auth.login(email, password);
      console.log("[Auth] Login successful:", result);

      tokenManager.setToken(result.accessToken);
      const userProfile = await apiClient.auth.getProfile();
      console.log("[Auth] User profile fetched after login:", userProfile);
      setUser(userProfile);
      setLoading(false);
    } catch (error) {
      const errorMessage = t(error.message);
      setError(errorMessage);
      setLoading(false);
      console.error("[Auth] Login failed:", error.message);
    }
  };

  const signup = async (email, password, name, isAgent) => {
    setLoading(true);
    try {
      console.log("[Auth] Signup attempt for:", email);

      const result = await apiClient.auth.signup(
        name,
        email,
        password,
        isAgent
      );
      console.log("[Auth] Signup successful:", result);

      tokenManager.setToken(result.accessToken);

      const userProfile = await apiClient.auth.getProfile();
      console.log("[Auth] User profile fetched after signup:", userProfile);
      setUser(userProfile);
      setLoading(false);
    } catch (error) {
      const errorMessage = t(error.message);
      setError(errorMessage);
      setLoading(false);
      console.error("[Auth] Signup failed:", error.message);
    }
  };

  const signout = async (redirectTo = "/") => {
    setLoading(true);
    try {
      console.log("[Auth] Logout initiated...");

      tokenManager.removeToken();
      setUser(null);
      setLoading(false);
      console.log("[Auth] Logout successful");
      router.push(redirectTo);
    } catch (error) {
      console.error("[Auth] Logout failed:", error.message);
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(false);
  };

  const isAuthenticated = !!user;
  const isNormalUser = user && user.role === "normal";
  const isAgent = user && user.role === "agent";
  const isAdmin = user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
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
    isAdmin,
    isProfileComplete,
    signin,
    signup,
    signout,
    initializing,
    loading,
    error,
    clearError,
    setUser,
  };

  return (
    <authContext.Provider value={authValue}>
      {children}
    </authContext.Provider>
  );
};

export { authContext, AuthContextProvider };
