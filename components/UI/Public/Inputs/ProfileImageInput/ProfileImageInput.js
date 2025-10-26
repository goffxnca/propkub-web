import { useEffect, useRef, useState } from 'react';
import { resizeFile } from '../../../../../libs/utils/file-utils';
import InlineError from '../../InlineError';
import BaseInput from '../BaseInput';

const maxFileSizeMB = 10;

const ProfileImageInput = ({
  id,
  label,
  error,
  originFileUrl = '',
  register = () => ({}),
  unregister = () => ({}),
  setValue = () => ({})
}) => {
  const errorStyle = error ? 'border border-red-300' : '';

  useEffect(() => {
    return () => {
      unregister(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(originFileUrl);
  const [inlineError, setInlineError] = useState(null);

  useEffect(() => {
    if (fileUrl) {
      setValue(
        id,
        {
          fileData: file,
          isFileChanged: fileUrl !== originFileUrl,
          originFileUrl: originFileUrl
        },
        { shouldValidate: true, shouldDirty: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl, file]);

  const filesSelectedHandler = (event) => {
    setInlineError(null);
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];

    const errorMessages = [];

    //validate file type
    if (!allowedFileTypes.includes(file.type)) {
      errorMessages.push(
        `ไฟล์ '${file.name}' ไม่ใช่ไฟล์รูปภาพประเภท .jpg, .jpeg, .png`
      );
    }

    //validate file size
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxFileSizeMB) {
      errorMessages.push(`ไฟล์ '${file.name}' มีขนาดไฟล์เกิน 10MB`);
    }

    if (errorMessages.length > 0) {
      return setInlineError({
        title: 'ไม่สามารถอัพโหลดและพรีวิวไฟล์ได้',
        messages: errorMessages
      });
    }

    resizeFile(file).then((resizedFile) => {
      const fileUrl = URL.createObjectURL(resizedFile);

      if (resizedFile && fileUrl) {
        setFile(resizedFile);
        setFileUrl(fileUrl);
      }
    });
  };

  return (
    <BaseInput id={id} label={label} error={error?.message}>
      <div className="relative">
        <input id={id} type="text" name={id} {...register()} hidden />
        <div className="mt-1 flex items-center space-x-5">
          <div
            className={`w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200 ${errorStyle}`}
          >
            {/* <Image
              src={`${fileUrl || "/user.png"}`}
              alt=""
              className="w-32 h-auto object-cover"
              height={120}
              width={120}
            /> */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${fileUrl || '/user.png'}`}
              alt=""
              className="h-full w-full object-cover"
            ></img>
          </div>

          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              fileRef.current.click();
            }}
          >
            เปลี่ยน
          </button>

          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            ref={fileRef}
            id="thefile"
            onChange={filesSelectedHandler}
            hidden={true}
          />
        </div>
        <div className="">
          {inlineError && (
            <InlineError
              title={inlineError.title}
              messages={inlineError.messages}
              closeAfterMS={5000}
              onClose={() => setInlineError(null)}
            />
          )}
        </div>
      </div>
    </BaseInput>
  );
};

export default ProfileImageInput;
