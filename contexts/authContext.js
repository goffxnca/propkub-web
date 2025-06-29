import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { firebaseAuth, firebaseFunctions } from "../libs/firebase";
import { getNotifications } from "../libs/managers/notificationManager";
import { getFirebaseErrorLabel } from "../libs/mappers/firebaseErrorCodeMapper";
import { apiClient } from "../lib/api/client";
import { tokenManager } from "../lib/api/tokenManager";
import { t } from "../lib/utils/translator";

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
  notifications: [],
  markNotificationAsRead: (notificationId) => {},
  error: "",
  clearError: () => {},
  setUser: () => {},
};

const authContext = createContext(initialContext);

const AuthContextProvider = ({ children }) => {
  // console.log("AuthContextProvider ran...");
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true); // For initial auth check
  const [loading, setLoading] = useState(false); // For login/signup operations
  const [error, setError] = useState("");
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

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

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifictions = notifications.map((noti) =>
      noti.id === notificationId ? { ...noti, read: true } : noti
    );
    setNotifications(updatedNotifictions);
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
    user.profileImg

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
    notifications,
    markNotificationAsRead,
    setUser,
  };

  // if (loading) {
  //   return <div>LOADING!!!.....</div>;
  // }

  return (
    <authContext.Provider value={authValue}>
      {/* isAuthenticated:{isAuthenticated.toString()} */}
      {children}
    </authContext.Provider>
  );
};

export { authContext, AuthContextProvider };
