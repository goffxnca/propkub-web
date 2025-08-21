import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authContext } from '../../contexts/authContext';
import Loader from '../UI/Common/modals/Loader';

const ProtectedRoute = ({ children, redirectTo = '/' }) => {
  const { initializing, isAuthenticated } = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      console.log(
        '[Auth-Protected] User not authenticated, redirecting to:',
        redirectTo
      );
      router.push(redirectTo);
    }
  }, [initializing, isAuthenticated, router, redirectTo]);

  if (initializing || !isAuthenticated) {
    return <Loader />;
  }

  return children;
};

export default ProtectedRoute;
