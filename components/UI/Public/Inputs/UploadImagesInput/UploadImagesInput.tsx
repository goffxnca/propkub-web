import { useEffect, useState } from "react";
import UploadImagesInputDetail from "./UploadImagesInputDetail";
import BaseInput from "../BaseInput";

const UploadImagesInput = ({
  id,
  label,
  maxFile = 1,
  error,
  setValue,
  register = () => ({}),
  unregister = () => ({}),
  submitCount = 0,
}) => {
  const [reachMaxImageCount, setReachMaxImageCount] = useState(false);

  const onImageChangeHandler = (images) => {
    setValue(id, images, { shouldValidate: submitCount > 0 });
    setReachMaxImageCount(images.length === maxFile);
  };

  useEffect(() => {
    return () => {
      unregister(id);
    };
  }, []);

  return (
    <BaseInput id={id} label={label} error={error?.message} hiddenInput={true}>
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
          <p className="">คลิกไอคอนบวก(+) เพื่อ Browse ไฟล์</p>
          <p className="text-xs text-gray-500">
            ต้องเป็นไฟล์ JPG, JPEG, PNG ขนาดไม่เกิน 10MB เท่านั้น
          </p>
        </div>
      )}
    </BaseInput>
  );
};

export default UploadImagesInput;
