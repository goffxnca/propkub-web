import { useEffect, useRef, useState } from 'react';
import { resizeFile } from '../../libs/utils/file-utils';
import Modal from '../UI/Public/Modal';
import { ExclamationIcon } from '@heroicons/react/outline';

const maxfileSizeMB = 10;

const ProfileImageInput = ({
  id,
  label,
  formError,
  originFileUrl = '',
  register = () => ({}),
  unregister = () => ({}),
  setValue = () => ({}),
  disabled = false
}) => {
  const errorStyle = formError ? 'border border-red-300' : '';

  useEffect(() => {
    return () => {
      unregister(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(originFileUrl);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fileUrl) {
      setValue(
        id,
        {
          file,
          changed: fileUrl !== originFileUrl,
          origin: originFileUrl
        },
        { shouldValidate: true, shouldDirty: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl, file]);

  const filesSelectedHandler = async (event) => {
    setError(null);
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      return;
    }

    const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    const errorMessages = [];

    // Validate file type
    if (!allowedFileTypes.includes(selectedFile.type)) {
      errorMessages.push(
        `ไฟล์ '${selectedFile.name}' ไม่ใช่ไฟล์รูปภาพประเภท .jpg, .jpeg, .png`
      );
    }

    // Validate file size
    const fileSizeMB = selectedFile.size / 1024 / 1024;
    if (fileSizeMB > maxfileSizeMB) {
      errorMessages.push(`ไฟล์ '${selectedFile.name}' มีขนาดไฟล์เกิน 10MB`);
    }

    if (errorMessages.length > 0) {
      setError({
        title: 'ไม่สามารถอัพโหลดและพรีวิวไฟล์ได้',
        messages: errorMessages
      });
      return;
    }

    const resizedFile = await resizeFile(selectedFile);
    const newFileUrl = URL.createObjectURL(resizedFile);

    if (resizedFile && newFileUrl) {
      setFile(resizedFile);
      setFileUrl(newFileUrl);
    }
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input id={id} type="text" name={id} {...register()} hidden />

        <div className="mt-1 flex items-center space-x-5">
          <div
            className={`w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200 ${errorStyle}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileUrl || '/user.png'}
              alt="Profile"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src = '/user.png';
              }}
            />
          </div>

          <button
            type="button"
            disabled={disabled}
            className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (!disabled) {
                fileRef.current.click();
              }
            }}
          >
            เปลี่ยน
          </button>

          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            ref={fileRef}
            onChange={filesSelectedHandler}
            hidden={true}
            disabled={disabled}
          />
        </div>

        {formError && (
          <p className="text-red-400 text-xs py-1 mt-1">{formError.message}</p>
        )}
      </div>

      {/* Error Modal */}
      <Modal
        visible={!!error}
        Icon={ExclamationIcon}
        type="warning"
        title={error?.title}
        desc={error?.messages?.join(', ')}
        buttonCaption="ตกลง"
        onClose={() => {
          setError(null);
        }}
      />
    </div>
  );
};

export default ProfileImageInput;
