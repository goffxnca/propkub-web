import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import {
  ShieldCheckIcon,
  KeyIcon,
  ExclamationIcon,
  CheckIcon,
  XIcon
} from '@heroicons/react/outline';
import { AuthProvider, User } from '@/types/models/user';
import { useTranslation } from '@/hooks/useTranslation';
import { useValidators } from '@/hooks/useValidators';
import { apiClient } from '@/libs/client';
import { translateServerError } from '@/libs/serverErrorTranslator';
import TextInput from '../UI/Inputs/TextInput';
import Modal from '../UI/Modal';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AccountSecuritySectionProps {
  user: User;
}

interface PasswordStatus {
  hasPassword: boolean;
  canChangePassword: boolean;
  message: string;
}

const AccountSecuritySection = ({ user }: AccountSecuritySectionProps) => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation('pages/profile');
  const { t: tCommon } = useTranslation('common');
  const { required, minLength, maxLength } = useValidators();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<PasswordFormData>();

  const getPasswordStatus = (): PasswordStatus => {
    // Users who signed up with email have passwords
    if (user.provider === AuthProvider.EMAIL) {
      return {
        hasPassword: true,
        canChangePassword: true,
        message: t('sections.security.status.canChange')
      };
    } else {
      // Users who signed up with Google/Facebook don't have passwords
      const providerName = tCommon(`providers.${user.provider}`);
      return {
        hasPassword: false,
        canChangePassword: false,
        message: t('sections.security.status.noPasswordRequired', {
          provider: providerName
        })
      };
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setApiError('');
    reset();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setApiError('');
    reset();
  };

  const handleSave = async (formData: PasswordFormData) => {
    setIsSaving(true);
    setApiError('');

    try {
      await apiClient.auth.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccess(true);
      setIsEditing(false);
      reset();
    } catch (error: any) {
      const errorMessage = translateServerError(error.message, locale);
      setApiError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccess(false);
  };

  const handleCloseApiErrorModal = () => {
    setApiError('');
  };

  // Watch newPassword for confirm validation
  const newPassword = watch('newPassword');

  // Auto-focus current password when editing starts
  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        const currentPasswordInput = document.getElementById('currentPassword');
        if (currentPasswordInput) {
          currentPasswordInput.focus();
        }
      }, 100);
    }
  }, [isEditing]);

  const passwordStatus = getPasswordStatus();

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            🔐 {t('sections.security.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('sections.security.subtitle')}
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-6">
            {/* Password Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('sections.security.password')}
              </label>
              <div className="mt-1">
                {passwordStatus.hasPassword ? (
                  <>
                    {!isEditing ? (
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              {t('sections.security.status.hasPassword')}
                            </p>
                            <p className="text-sm text-green-600">
                              {passwordStatus.message}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleEdit}
                          className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <KeyIcon className="w-4 h-4 mr-2" />
                          {t('sections.security.changePasswordButton')}
                        </button>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <form
                          onSubmit={handleSubmit(handleSave)}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 gap-4">
                            <div className="password-input-thai">
                              <TextInput
                                id="currentPassword"
                                label={t('sections.security.currentPassword')}
                                type="password"
                                disabled={isSaving}
                                register={() =>
                                  register('currentPassword', {
                                    ...required(),
                                    ...minLength(6),
                                    ...maxLength(64)
                                  })
                                }
                                unregister={unregister}
                                error={errors.currentPassword}
                              />
                            </div>

                            <div className="password-input-thai">
                              <TextInput
                                id="newPassword"
                                label={t('sections.security.newPassword')}
                                type="password"
                                disabled={isSaving}
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
                            </div>

                            <div className="password-input-thai">
                              <TextInput
                                id="confirmPassword"
                                label={t('sections.security.confirmPassword')}
                                type="password"
                                disabled={isSaving}
                                register={() =>
                                  register('confirmPassword', {
                                    ...required(),
                                    validate: (value) =>
                                      value === newPassword ||
                                      t(
                                        'sections.security.validation.confirmPasswordMismatch'
                                      )
                                  })
                                }
                                unregister={unregister}
                                error={errors.confirmPassword}
                              />
                            </div>
                          </div>

                          <div className="flex space-x-3 pt-2">
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              <CheckIcon className="w-4 h-4 mr-1" />
                              {isSaving
                                ? tCommon('actions.submitting')
                                : t('sections.security.changePasswordButton')}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancel}
                              disabled={isSaving}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              <XIcon className="w-4 h-4 mr-1" />
                              {tCommon('buttons.cancel')}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ExclamationIcon className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          {t('sections.security.status.noPassword')}
                        </p>
                        <p className="text-sm text-blue-600">
                          {passwordStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Tips */}
            {user.provider === AuthProvider.EMAIL && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('sections.security.tips.title')}
                </label>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-500 text-sm">!</span>
                    <span className="text-sm text-gray-700">
                      {t('sections.security.tips.changeRegularly')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        visible={success}
        Icon={CheckIcon}
        type="success"
        title={t('sections.security.success.title')}
        desc={t('sections.security.success.description')}
        buttonCaption={tCommon('buttons.ok')}
        onClose={handleCloseSuccessModal}
      />

      {/* Error Modal */}
      <Modal
        visible={!!apiError}
        Icon={ExclamationIcon}
        type="warning"
        title={tCommon('error.generic.title')}
        desc={apiError}
        buttonCaption={tCommon('buttons.ok')}
        onClose={handleCloseApiErrorModal}
      />
    </div>
  );
};

export default AccountSecuritySection;
