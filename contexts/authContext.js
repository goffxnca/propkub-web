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
  loading: false,
  notifications: [],
  markNotificationAsRead: (notificationId) => {},
  error: "",
  clearError: () => {},
};

const authContext = createContext(initialContext);

const AuthContextProvider = ({ children }) => {
  // console.log("AuthContextProvider ran...");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

          setUser(userProfile);
          setLoading(false);
        } else {
          console.log("[Auth] No JWT token found");
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("[Auth] Initialization failed:", error);
        tokenManager.removeToken();
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signin = (email, password) => {
    setLoading(true);
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((result) => {
        setLoading(false);
        console.log("signin success");
      })
      .catch((error) => {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setLoading(false);
        console.error(`signin failed: ${error.message}`);
      });
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
      const errorMessage = error.message || "ข้อมูลการลงทะเบียนไม่ถูกต้อง";
      setError(errorMessage);
      setLoading(false);
      console.error("[Auth] Signup failed:", error.message);
    }
  };

  const signout = (redirectTo) => {
    if (!redirectTo) {
      signOut(firebaseAuth);
    } else {
      router.push(redirectTo).then(() => {
        signOut(firebaseAuth)
          .then((result) => {
            console.log("signout success");
          })
          .catch((err) => {
            console.error("signout failed", err);
          });
      });
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
    user.displayName &&
    user.phone &&
    user.line &&
    user.photoURL &&
    ["agent", "admin"].includes(user.role);

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
    loading,
    error,
    clearError,
    notifications,
    markNotificationAsRead,
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
