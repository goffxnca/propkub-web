import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  ExclamationIcon
} from '@heroicons/react/outline';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '../../libs/client';
import { authContext } from '../../contexts/authContext';
import TextInput from '../UI/Public/Inputs/TextInput';
import Modal from '../UI/Public/Modal';

import ProfileImageInput from './ProfileImageInput';
import { uploadFileToStorage } from '../../libs/utils/file-utils';
import { useTranslation } from '../../hooks/useTranslation';
import { useValidators } from '../../hooks/useValidators';

const PersonalInfoSection = ({ user }) => {
  const { t } = useTranslation('pages/profile');
  const { t: tCommon } = useTranslation('common');
  const { required, minLength, maxLength } = useValidators();
  const { setUser } = useContext(authContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const getDefaultFormValues = () => ({
    name: user.name || '',
    profileImg: user.profileImg || ''
  });

  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: getDefaultFormValues()
  });

  const handleEdit = () => {
    setIsEditing(true);
    setApiError('');
    reset(getDefaultFormValues());
  };

  const handleCancel = () => {
    setIsEditing(false);
    setApiError('');
    reset(getDefaultFormValues());
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    setApiError('');

    try {
      const finalData = { name: formData.name };

      if (formData.profileImg?.changed) {
        const imageUrl = await uploadFileToStorage(
          'us',
          user._id,
          formData.profileImg.file
        );

        if (!imageUrl) {
          throw new Error(t('sections.personal.uploadImageError'));
        }

        finalData.profileImg = imageUrl;
      }

      const updatedUser = await apiClient.auth.updateProfile(finalData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save personal info:', error);
      setApiError(tCommon('error.generic.description'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseApiErrorModal = () => {
    setApiError('');
  };

  const getVerificationStatus = () => {
    if (user.emailVerified) {
      return {
        text: t('sections.personal.emailVerified'),
        icon: CheckCircleIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    } else {
      return {
        text: t('sections.personal.emailNotVerified'),
        icon: ExclamationCircleIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    }
  };

  const getRoleBadge = () => {
    if (user.role === 'agent') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {tCommon('roles.agent')}
        </span>
      );
    }
    if (user.role === 'normal') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {tCommon('roles.normal')}
        </span>
      );
    }
    return null;
  };

  const verification = getVerificationStatus();
  const VerificationIcon = verification.icon;

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                🧑‍💼 {t('sections.personal.title')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('sections.personal.subtitle')}
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-6">
            {/* Profile Image and Name Row */}
            <div className="flex items-center space-x-6">
              {isEditing ? (
                <form onSubmit={handleSubmit(handleSave)} className="w-full">
                  <div className="space-y-4">
                    {/* Profile Image Input */}
                    <ProfileImageInput
                      id="profileImg"
                      label={t('sections.personal.profileImage')}
                      register={() => register('profileImg')}
                      originFileUrl={user.profileImg}
                      unregister={unregister}
                      formError={errors.profileImg}
                      setValue={setValue}
                      disabled={isSaving}
                    />

                    {/* Name Input */}
                    <TextInput
                      id="name"
                      label={t('sections.personal.name')}
                      register={() =>
                        register('name', {
                          ...required(),
                          ...minLength(5),
                          ...maxLength(30)
                        })
                      }
                      unregister={unregister}
                      error={errors.name}
                      placeholder={t('sections.personal.namePlaceholder')}
                      disabled={isSaving}
                    />

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        {isSaving ? tCommon('actions.submitting') : tCommon('actions.submit')}
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
                  </div>
                </form>
              ) : (
                <>
                  <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.profileImg || '/user.png'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = '/user.png';
                      }}
                      alt=""
                    />
                  </div>

                  <div className="flex-1">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {user.name}
                      </h4>
                      {getRoleBadge()}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Email and Verification */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('sections.personal.email')}
                </label>
                <div className="mt-1 flex items-center space-x-3">
                  <span className="text-sm text-gray-900">{user.email}</span>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verification.bgColor} ${verification.color}`}
                  >
                    <VerificationIcon className="w-3 h-3 mr-1" />
                    {verification.text}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default PersonalInfoSection;
