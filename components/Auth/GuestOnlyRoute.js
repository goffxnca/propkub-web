import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authContext } from '../../contexts/authContext';
import Loader from '../UI/Common/modals/Loader';

const GuestOnlyRoute = ({ children, redirectTo = null }) => {
  const { loading, isAuthenticated, isAgent } = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const destination = '/profile';
      console.log('[Auth-GuestOnly] User authenticated, redirecting to:', destination);
      router.push(destination);
    }
  }, [isAuthenticated, isAgent, router, redirectTo]);

  if (loading) {
    return <Loader />;
  }


  return children;
};

export default GuestOnlyRoute; 