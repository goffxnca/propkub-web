import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { authContext } from "../../contexts/authContext";
import Loader from "../UI/Common/modals/Loader";

const ProtectedRoute = ({ children, redirectTo = "/" }) => {
  const { loading, isAuthenticated } = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log(
        "[Auth-Protected] User not authenticated, redirecting to:",
        redirectTo
      );
      router.push(redirectTo);
    }
  }, [loading, isAuthenticated, router, redirectTo]);

  if (loading) {
    return <Loader />;
  }

  return children;
};

export default ProtectedRoute;
