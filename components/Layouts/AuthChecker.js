import { Router } from "next/router";
import { useContext } from "react";
import { authContext } from "../../contexts/authContext";

const AuthChecker = ({ children }) => {
  //   console.log("AuthChecker");
  //   const { signin, user, loading, error, isAuthenticated } =
  //     useContext(authContext);
  //   console.log("isAuthenticated", isAuthenticated);
  //   console.log("loading", loading);
  //   //   if (!isAuthenticated) {
  //   //     return <div>NOT AUTHENTICATED...</div>;
  //   //   }
  //   if (loading) {
  //     return <div>LOADING...</div>;
  //   } else {
  //     return children;
  //   }
  return children;
};

export default AuthChecker;
