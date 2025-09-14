import { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { authContext } from '../../contexts/authContext';
import { apiClient } from '../../libs/client';
import { ExclamationIcon, CheckIcon } from '@heroicons/react/outline';
import Loader from '../../components/UI/Common/modals/Loader';
import Modal from '../../components/UI/Public/Modal';
import GoogleIcon from '../../components/Icons/GoogleIcon';
import FacebookIcon from '../../components/Icons/FacebookIcon';
import { tokenManager } from '../../libs/tokenManager';

const AuthCallback = () => {
  const router = useRouter();
  const { setUser } = useContext(authContext);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const [showLinkSuccess, setShowLinkSuccess] = useState(false);
  const [linkProvider, setLinkProvider] = useState('');

  const formatProviderName = (provider) => {
    if (!provider) return 'provider';
    const providerMap = {
      google: 'Google',
      facebook: 'Facebook'
    };
    return providerMap[provider?.toLowerCase()] || provider;
  };

  const formatProviderIcon = (provider) => {
    switch ((provider || '').toLowerCase()) {
      case 'google':
        return <GoogleIcon className="h-6 w-6" />;
      case 'facebook':
        return <FacebookIcon className="h-6 w-6 text-blue-800" />;
      default:
        return <CheckIcon className="h-6 w-6 text-green-600" />;
    }
  };

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { token, error, success, provider, expectedEmail } = router.query;

        if (error) {
          console.error('[AuthCallback] OAuth error:', error);
          setIsProcessing(false);

          if (error === 'email_mismatch') {
            setError(
              `เชื่อมต่อไม่ได้ กรุณาใช้บัญชี ${formatProviderName(
                provider
              )} ที่ผูกกับอีเมล: ${expectedEmail || 'email'}`
            );
          } else if (error === 'linking_failed') {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อบัญชี กรุณาลองใหม่อีกครั้ง');
          } else if (error === 'already_linked') {
            setError(
              `บัญชี ${formatProviderName(provider)} นี้เชื่อมต่ออยู่แล้ว กรุณารีเฟรชหน้าเว็บ`
            );
          } else if (error === 'oauth_cancelled') {
            setError(
              `การเชื่อมต่อบัญชี ${formatProviderName(provider)} ถูกยกเลิก`
            );
          } else {
            setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
          }
          return;
        }

        if (!token) {
          console.error('[AuthCallback] Missing token');
          setIsProcessing(false);
          setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
          return;
        }

        // Handle linking success
        if (success === 'linking') {
          await handleAuthSuccess({ token, provider, isLinking: true });
          return;
        }

        // Handle regular login/signup success
        await handleAuthSuccess({ token, provider, isLinking: false });
      } catch (error) {
        console.error('[AuthCallback] Error processing callback:', error);
        tokenManager.removeToken();
        setUser(null);
        setIsProcessing(false);
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
      }
    };

    const handleAuthSuccess = async ({ token, provider, isLinking }) => {
      tokenManager.setToken(token);
      const userProfile = await apiClient.auth.getProfile();
      setUser(userProfile);
      setIsProcessing(false);

      if (isLinking) {
        setLinkProvider(provider);
        setShowLinkSuccess(true);
      } else {
        router.push('/profile');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query, router, setUser]);

  const handleCloseErrorModal = () => {
    const { error } = router.query;
    router.push('/profile');
  };

  return (
    <>
      {isProcessing && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader />
            <p className="mt-4 text-gray-600">กำลังเข้าสู่ระบบ...</p>
          </div>
        </div>
      )}

      <Modal
        visible={!!error}
        Icon={ExclamationIcon}
        type="warning"
        title="เกิดข้อผิดพลาด"
        desc={error}
        buttonCaption="ตกลง"
        onClose={handleCloseErrorModal}
      />

      <Modal
        visible={showLinkSuccess}
        Icon={() => formatProviderIcon(linkProvider)}
        type="success"
        title={`เชื่อมต่อบัญชี ${formatProviderName(linkProvider)} สำเร็จ!`}
        desc={
          <>
            <p className="mt-2 text-gray-500">
              ครั้งถัดไปคุณสามารถเข้าสู่ระบบด้วยบัญชี{' '}
              {formatProviderName(linkProvider)} นี้ได้เช่นกัน
            </p>
          </>
        }
        buttonCaption="ตกลง"
        onClose={() => router.push('/profile')}
      />
    </>
  );
};

export default AuthCallback;
