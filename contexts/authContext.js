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
    console.log("ONLY ONE TIME!!");

    const unsubscriber = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        const userData = {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          // emailVerified: user.emailVerified,
          emailVerified: user.emailVerified, //TODO: Change to true for testing, change back later
          phone: user.phoneNumber,
        };

        user.getIdTokenResult().then((result) => {
          userData.role = result.claims.role;
          userData.line = result.claims.line;
          console.log("onAuthStateChanged", userData);
          if (userData.role) {
            setUser(userData);
            setLoading(false);

            if (userData.role === "agent") {
              //TODO: Get Notification By User Id
              getNotifications(user.uid).then((response) => {
                setNotifications(response.data);
              });
            }
          }
        });
      } else {
        console.log("onAuthStateChanged", "none");
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscriber();
      // console.log("UNMOUNTED AuthContextProvider");
    };
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

  const signup = (email, password, name, role) => {
    setLoading(true);
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((cred) => {
        const postUserSignup = httpsCallable(
          firebaseFunctions,
          "postUserSignup"
        );
        postUserSignup({
          uid: cred.user.uid,
          email: cred.user.email,
          role: role,
          name: name,
        })
          .then((result) => {
            console.log("signup success");
            firebaseAuth.currentUser.getIdTokenResult(true).then(() => {
              window.document.location.replace("/profile");
            });
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        if (error.code) {
          const errorMessage =
            getFirebaseErrorLabel(error.code) || "ข้อมูลการลงทะเบียนไม่ถูกต้อง";
          setError(errorMessage);
        }
        setLoading(false);
        console.error(`signup failed: ${error.message}`);
      });
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
