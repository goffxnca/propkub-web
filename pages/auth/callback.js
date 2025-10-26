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
import { useTranslation } from '../../hooks/useTranslation';

const AuthCallback = () => {
  const router = useRouter();
  const { t } = useTranslation('pages/auth-callback');
  const { t: tCommon } = useTranslation('common');
  const { setUser } = useContext(authContext);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const [showLinkSuccess, setShowLinkSuccess] = useState(false);
  const [linkProvider, setLinkProvider] = useState('');

  const formatProviderName = (provider) => {
    if (!provider) return 'provider';
    const normalized = provider?.toLowerCase();
    switch (normalized) {
      case 'google':
        return tCommon('providers.google');
      case 'facebook':
        return tCommon('providers.facebook');
      default:
        return provider;
    }
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
              t('errors.emailMismatch', {
                provider: formatProviderName(provider),
                email: expectedEmail || 'email'
              })
            );
          } else if (error === 'linking_failed') {
            setError(t('errors.linkingFailed'));
          } else if (error === 'already_linked') {
            setError(
              t('errors.alreadyLinked', {
                provider: formatProviderName(provider)
              })
            );
          } else if (error === 'oauth_cancelled') {
            setError(
              t('errors.oauthCancelled', {
                provider: formatProviderName(provider)
              })
            );
          } else {
            setError(t('errors.loginFailed'));
          }
          return;
        }

        if (!token) {
          console.error('[AuthCallback] Missing token');
          setIsProcessing(false);
          setError(t('errors.loginFailed'));
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
        setError(t('errors.processingFailed'));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <p className="mt-4 text-gray-600">{t('processing')}</p>
          </div>
        </div>
      )}

      <Modal
        visible={!!error}
        Icon={ExclamationIcon}
        type="warning"
        title={tCommon('error.generic.title')}
        desc={error}
        buttonCaption={tCommon('buttons.ok')}
        onClose={handleCloseErrorModal}
      />

      <Modal
        visible={showLinkSuccess}
        Icon={() => formatProviderIcon(linkProvider)}
        type="success"
        title={t('success.title', {
          provider: formatProviderName(linkProvider)
        })}
        desc={
          <>
            <p className="mt-2 text-gray-500">
              {t('success.description', {
                provider: formatProviderName(linkProvider)
              })}
            </p>
          </>
        }
        buttonCaption={tCommon('buttons.ok')}
        onClose={() => router.push('/profile')}
      />
    </>
  );
};

export default AuthCallback;
