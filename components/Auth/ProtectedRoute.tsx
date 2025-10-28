import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../contexts/authContext';
import Loader from '../UI/Common/modals/Loader';

const ProtectedRoute = ({ children, redirectTo = '/' }) => {
  const { initializing, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [initializing, isAuthenticated, router, redirectTo]);

  if (initializing || !isAuthenticated) {
    return <Loader />;
  }

  return children;
};

export default ProtectedRoute;
