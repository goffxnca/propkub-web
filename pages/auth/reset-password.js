import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/UI/Public/Modal';
import { apiClient } from '../../libs/client';
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { genPageTitle } from '../../libs/seo-utils';
import Head from 'next/head';
import Loader from '../../components/UI/Common/modals/Loader';
import TextInput from '../../components/UI/Public/Inputs/TextInput';
import Button from '../../components/UI/Public/Button';
import { translateServerError } from '../../libs/serverErrorTranslator';
import GuestOnlyRoute from '../../components/Auth/GuestOnlyRoute';
import { useTranslation } from '../../hooks/useTranslation';
import { useValidators } from '../../hooks/useValidators';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const { locale } = router;
  const { t } = useTranslation('pages/reset-password');
  const { t: tCommon } = useTranslation('common');
  const { required, minLength, maxLength } = useValidators();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(null);

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    const validateToken = async () => {
      if (router.isReady && token && locale) {
        try {
          await apiClient.auth.validateResetToken(token);
          setTokenValid(true);
        } catch (err) {
          setTokenValid(false);
          const errorMessage = translateServerError(err.message, locale);
          setError(errorMessage);
        }
      }
    };

    validateToken();
  }, [router.isReady, token, locale]);

  const submitHandler = async (data) => {
    setLoading(true);
    setError('');

    try {
      await apiClient.auth.resetPassword({
        token,
        newPassword: data.newPassword
      });
      setSuccess(true);
    } catch (err) {
      const errorMessage = translateServerError(err.message, locale);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (success) {
      router.push('/login');
    } else {
      router.push('/');
    }
  };

  return (
    <GuestOnlyRoute>
      {/* Show loader while checking token */}
      {tokenValid === null && (
        <>
          <Head>
            <title>{genPageTitle(t('title'))}</title>
          </Head>
          <Loader />
        </>
      )}

      {/* Show success modal */}
      {success && (
        <>
          <Head>
            <title>{genPageTitle(t('title'))}</title>
          </Head>
          <Modal
            visible={true}
            type="success"
            title={t('success.title')}
            desc={t('success.description')}
            buttonCaption={t('success.button')}
            Icon={CheckIcon}
            onClose={handleClose}
          />
        </>
      )}

      {/* Show error modal for invalid token */}
      {(!tokenValid || error) && !success && tokenValid !== null && (
        <>
          <Head>
            <title>{genPageTitle(t('title'))}</title>
          </Head>
          <Modal
            visible={true}
            type="warning"
            title={tCommon('error.generic.title')}
            desc={error}
            buttonCaption={tCommon('buttons.goHome')}
            Icon={ExclamationCircleIcon}
            onClose={handleClose}
          />
        </>
      )}

      {/* Show reset password form */}
      {tokenValid && !success && (
        <>
          <Head>
            <title>{genPageTitle(t('title'))}</title>
          </Head>

          <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-center text-3xl tracking-tight font-bold text-gray-900">
                {t('form.title')}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {t('form.description')}
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 mx-2">
                <form
                  className="space-y-6"
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <TextInput
                    id="newPassword"
                    label={t('form.fields.newPassword.label')}
                    type="password"
                    register={() =>
                      register('newPassword', {
                        ...required(),
                        ...minLength(6),
                        ...maxLength(64)
                      })
                    }
                    unregister={unregister}
                    error={errors.newPassword}
                  />

                  <TextInput
                    id="confirmPassword"
                    label={t('form.fields.confirmPassword.label')}
                    type="password"
                    register={() =>
                      register('confirmPassword', {
                        ...required(),
                        validate: (value, { newPassword }) =>
                          value === newPassword ||
                          t('form.validation.confirmPasswordMismatch')
                      })
                    }
                    unregister={unregister}
                    error={errors.confirmPassword}
                  />

                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-red-800">{error}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Button type="submit" variant="primary" loading={loading}>
                      {t('form.submit')}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </GuestOnlyRoute>
  );
};

export default ResetPasswordPage;
