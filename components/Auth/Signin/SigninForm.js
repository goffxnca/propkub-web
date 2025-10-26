import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { authContext } from '../../../contexts/authContext';
import { ExclamationIcon } from '@heroicons/react/outline';
import { useTranslation } from '../../../hooks/useTranslation';
import { useValidators } from '../../../hooks/useValidators';
import Logo from '../../Layouts/Logo';
import Button from '../../UI/Public/Button';
import TextInput from '../../UI/Public/Inputs/TextInput';
import GoogleLoginButton from '../../UI/Public/SocialLogin/GoogleLoginButton';
import FacebookLoginButton from '../../UI/Public/SocialLogin/FacebookLoginButton';
import Modal from '../../UI/Public/Modal';
import ForgotPasswordModal from '../ForgotPasswordModal';

const SiginInForm = () => {
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { t } = useTranslation('pages/login');
  const { t: tCommon } = useTranslation('common');
  const { required, minLength, maxLength, EmailPattern } = useValidators();

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const { signin, loading, error, clearError } = useContext(authContext);

  const handleCloseErrorModal = () => {
    clearError();
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPasswordModal(true);
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  const submitHandler = (data) => {
    signin(data.email, data.password);
  };

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 mx-2">
            <h1 className="mt-6 text-center text-3xl tracking-tight font-bold text-gray-900">
              {t('form.title')}
            </h1>
            <div className="flex justify-center mt-2">
              <Logo />
            </div>
            <br />

            <div className="mb-6 space-y-3">
              <GoogleLoginButton text={t('form.googleLogin')} />
              {/* <FacebookLoginButton text={t('form.facebookLogin')} /> */}
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t('form.or')}
                </span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
              <TextInput
                id="email"
                label={t('form.fields.email.label')}
                register={() =>
                  register('email', {
                    ...required(),
                    ...EmailPattern()
                  })
                }
                unregister={unregister}
                error={errors.email}
              />
              <TextInput
                id="password"
                label={t('form.fields.password.label')}
                type="password"
                register={() =>
                  register('password', {
                    ...required(),
                    ...minLength(6),
                    ...maxLength(64)
                  })
                }
                unregister={unregister}
                error={errors.password}
              />
              {/* TODO: implement later after v1.0 */}
              <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div> */}

                <div className="text-sm">
                  <a
                    href="#"
                    onClick={handleForgotPasswordClick}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {t('form.forgotPassword')}
                  </a>
                </div>
              </div>
              <div>
                {/* <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign In
                </button> */}

                <Button type="submit" variant="primary" loading={loading}>
                  {t('form.submit')}
                </Button>
              </div>
            </form>

            <div className="text-sm text-center  mt-2">
              {t('form.noAccount')}
              <Link
                href="/signup"
                className="text-primary hover:text-primary-hover ml-2"
              >
                {t('form.signup')}
              </Link>
            </div>
            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Facebook</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Twitter</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <Modal
        visible={!!error}
        Icon={ExclamationIcon}
        type="warning"
        title={tCommon('error.generic.title')}
        desc={error}
        buttonCaption={tCommon('buttons.ok')}
        onClose={handleCloseErrorModal}
      />

      <ForgotPasswordModal
        visible={showForgotPasswordModal}
        onClose={handleCloseForgotPasswordModal}
      />
    </>
  );
};

export default SiginInForm;
