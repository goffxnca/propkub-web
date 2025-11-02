import LocationSection from './LocationSection';
import BasicSection from './BasicSection';
import { useForm } from 'react-hook-form';
import { addNewPost, updatePost } from '../../../libs/post-utils';
import MediaSection from './MediaSection';
import Modal from '../../UI/Public/Modal';
import { CheckIcon, ExclamationIcon } from '@heroicons/react/outline';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../../UI/Public/Button';
import { AuthContext } from '../../../contexts/authContext';
import AddDoc from '../../Icons/AddDoc';
import PageTitle from '../../UI/Private/PageTitle';
// import Banner from "../../Banner/Banner";
import ConfirmSection from './ConfirmSection';
import ProfileWarnings from '../../Profile/ProfileWarnings';
import { getFacilityObject } from '../../../libs/mappers/facilityMapper';
import { getSpecsObject } from '../../../libs/mappers/specMapper';
import { getEditedFields } from '../../../libs/form-utils';
import { useTranslation } from '../../../hooks/useTranslation';
import type { Post } from '../../../types/models/post';
import type { AuthContextValue } from '../../../contexts/authContext';

interface PostFormDefaultValues {
  title?: string;
  desc?: string;
  assetType?: string;
  postType?: string;
  price?: number;
  thumbnail?: string;
  images?: string[] | File[];
  facilities?: Record<string, boolean>;
  specs?: Record<string, number>;
  address?: any;
  isStudio?: boolean;
  land?: number;
  landUnit?: string;
  area?: number;
  areaUnit?: string;
  priceUnit?: string;
  condition?: string;
  refId?: string;
  [key: string]: any;
}

interface PostFormProps {
  postData?: Post;
}

const PostForm = ({ postData }: PostFormProps) => {
  const { t } = useTranslation('pages/profile');
  const { t: tCommon } = useTranslation('common');
  const { t: tForm } = useTranslation('pages/post-form');
  const isEditMode = !!postData;

  const defaultValues: PostFormDefaultValues =
    isEditMode && postData
      ? {
          // Required 10 fields excluded postNumber (Originally it's 11 required fields)
          title: postData.title,
          desc: postData.desc,
          assetType: postData.assetType,
          postType: postData.postType,
          price: postData.price,
          thumbnail: postData.thumbnail,
          images: postData.images,
          facilities: getFacilityObject(postData.facilities),
          specs: getSpecsObject(postData.specs),
          address: postData.address,

          // Optional 8 fields
          isStudio: postData.isStudio,
          land: postData.land,
          landUnit: postData.landUnit,
          area: postData.area,
          areaUnit: postData.areaUnit,
          priceUnit: postData.priceUnit,
          condition: postData.condition,
          refId: postData.refId
        }
      : {};

  const {
    register,
    unregister,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    trigger,
    formState: { errors, submitCount, dirtyFields, isDirty }
  } = useForm({ defaultValues: defaultValues });

  const router = useRouter();
  const { locale } = router;
  const { user, isAgent, isProfileComplete } = useContext(
    AuthContext
  ) as AuthContextValue;

  // Re-trigger validation when locale changes to update error messages
  useEffect(() => {
    if (submitCount > 0) {
      trigger();
    }
  }, [locale, submitCount, trigger]);

  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdPostId, setCreatedPostId] = useState('');

  const modalSuccessTitle = isEditMode
    ? tForm('success.update.title')
    : tForm('success.create.title');
  const modalSuccessMessage = isEditMode
    ? tForm('success.update.message')
    : tForm('success.create.message');

  const roleLabel = isAgent ? tCommon('roles.agent') : tCommon('roles.normal');
  const modeLabel =
    isEditMode && postData
      ? tForm('mode.edit', { postNumber: postData.postNumber })
      : tForm('mode.create');
  const pageTitle = `${modeLabel} (${roleLabel})`;

  const allowCreatePost = isAgent ? isProfileComplete : true;

  const formDataChanged = isDirty && Object.entries(dirtyFields).length > 0;

  const submitHandler = async (formData: any): Promise<void> => {
    setSaving(true);

    try {
      if (isEditMode && postData) {
        //UPDATE MODE
        const editedData = getEditedFields(
          dirtyFields as Record<string, boolean>,
          formData
        );
        await updatePost(postData._id, editedData);
      } else {
        // CREATE MODE
        const result = await addNewPost(formData);
        setCreatedPostId(result._id);
      }
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error(`${isEditMode ? 'Edit' : 'Create'} post failed:`, error);
      setErrorMessage(tCommon('error.generic.description'));

      setShowErrorModal(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle label={modeLabel} />

      <form
        className="space-y-6 relative"
        onSubmit={handleSubmit(submitHandler)}
      >
        {/* Profile warning messages */}
        <ProfileWarnings
          user={user}
          onCheckAgainClick={() => router.push('/profile')}
          showLockOverlay={true}
        />

        {/* Main basic section */}
        <BasicSection
          register={register}
          unregister={unregister}
          watch={watch}
          setValue={setValue}
          errors={errors}
          isEditMode={isEditMode}
          defaultValues={defaultValues}
        />

        {!isEditMode && (
          <MediaSection
            register={register}
            unregister={unregister}
            watch={watch}
            setValue={setValue}
            errors={errors}
            submitCount={submitCount}
          />
        )}

        {!isEditMode && (
          <LocationSection
            register={register}
            unregister={unregister}
            watch={watch}
            setValue={setValue}
            errors={errors}
            submitCount={submitCount}
          />
        )}

        {/* Confirm Post Creation Section*/}
        {!isEditMode && (
          <ConfirmSection
            register={register}
            unregister={unregister}
            errors={errors}
          />
        )}

        {/* Post Success Modal */}
        <Modal
          visible={showSuccessModal}
          title={modalSuccessTitle}
          desc={modalSuccessMessage}
          buttonCaption={
            isEditMode
              ? tForm('success.update.button')
              : tForm('success.create.button')
          }
          Icon={CheckIcon}
          onClose={() => {
            setShowSuccessModal(false);
            router.push(`/account/posts/${createdPostId || postData?._id}`);
          }}
        />

        {/* Error Modal */}
        <Modal
          visible={showErrorModal}
          type="warning"
          title={tCommon('error.generic.title')}
          desc={errorMessage}
          buttonCaption={tCommon('buttons.ok')}
          Icon={ExclamationIcon}
          onClose={() => {
            setShowErrorModal(false);
            setErrorMessage('');
          }}
        />

        {/* Footer Buttons */}
        {allowCreatePost && (
          <div className="flex-row md:flex md:justify-between md:flex-row-reverse md:gap-4 md:w-60 md:ml-auto">
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={isEditMode && !formDataChanged}
            >
              {tCommon('buttons.save')}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                router.push('/dashboard');
              }}
            >
              {tCommon('buttons.cancel')}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PostForm;
