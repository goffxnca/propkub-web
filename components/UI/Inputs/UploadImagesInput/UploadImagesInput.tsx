import { useEffect, useState } from 'react';
import BaseInput from '../BaseInput';
import { useTranslation } from '../../../../hooks/useTranslation';
import {
  ReactHookFormError,
  ReactHookFormRegister,
  ReactHookFormUnRegister
} from '../../../../types/misc/form';
import type { UseFormSetValue } from 'react-hook-form';
import UploadImagesInputDetail from './UploadImagesInputDetail';

interface UploadImagesInputProps {
  id: string;
  label?: string;
  maxFile?: number;
  error?: ReactHookFormError;
  setValue?: UseFormSetValue<any>;
  register?: ReactHookFormRegister;
  unregister?: ReactHookFormUnRegister;
  submitCount?: number;
}

const UploadImagesInput = ({
  id,
  label,
  maxFile = 1,
  error,
  setValue,
  register = () => ({}),
  unregister = () => ({}),
  submitCount = 0
}: UploadImagesInputProps) => {
  const { t } = useTranslation('common');
  const [reachMaxImageCount, setReachMaxImageCount] = useState(false);

  const onImageChangeHandler = (images: File[]) => {
    if (setValue) {
      setValue(id, images, { shouldValidate: submitCount > 0 });
    }
    setReachMaxImageCount(images.length === maxFile);
  };

  useEffect(() => {
    return () => {
      unregister(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseInput id={id} label={label} error={error}>
      <div className="relative">
        <UploadImagesInputDetail
          maxFile={maxFile}
          onImageChange={onImageChangeHandler}
          error={error}
        />
        <input
          type="text"
          {...register()}
          className="absolute top-0 left-0 w-0 h-0 text-sm border-none focus:border-none -z-40"
          style={{ fontSize: 0 }}
        />
      </div>
      {!reachMaxImageCount && (
        <div className="text-sm text-gray-600">
          <p className="">{t('upload.helperText')}</p>
          <p className="text-xs text-gray-500">
            {t('upload.fileRequirements')}
          </p>
        </div>
      )}
    </BaseInput>
  );
};

export default UploadImagesInput;
