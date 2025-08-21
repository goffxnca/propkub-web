import { useEffect, useRef, useState } from 'react';
import CirclePlus from '../../../../Icons/CirclePlus';
import ImagePreviewItem from './UploadImagePreviewItem';
import InlineError from '../../InlineError';
import { resizeFile } from '../../../../../libs/utils/file-utils';

const UploadImagesInputDetail = ({
  maxFile = 1,
  maxfileSizeMB = 10,
  onImageChange,
  error
}) => {
  const fileRef = useRef();

  const [files, setFiles] = useState([]); //track list of resized files
  const [originalFiles, setOriginalFiles] = useState([]); //trakc original file (un-resized), used to detect the choosing the same file twice
  const [fileUrls, setFileUrls] = useState([]);
  const [inlineError, setInlineError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (files.length === maxFile) {
      setInlineError(null);
    }

    if (isMounted) {
      onImageChange(files);
    } else {
      setIsMounted(true);
    }
  }, [files.length]);

  //multiple support
  const filesSelectedHandler = async (event) => {
    const uploadFiles = event.target.files;
    if (uploadFiles.length === 0) return;

    const totalBrowsedFile = files.length;
    const totalBrowsingFile = uploadFiles.length;

    if (totalBrowsedFile + totalBrowsingFile > maxFile) {
      return setInlineError({
        title: 'แจ้งเตือน',
        messages: [`อนุญาตให้อัพโหลดได้สูงสุดจำนวน ${maxFile} ไฟล์เท่านั้น`]
      });
    }

    const tempFiles = [];
    const tempOriginalFiles = [];
    const tempFileUrls = [];

    const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];

    const errorMessages = [];

    for (const file of uploadFiles) {
      setInlineError(null);

      //validate file type
      if (!allowedFileTypes.includes(file.type)) {
        errorMessages.push(
          `ไฟล์ '${file.name}' ไม่ใช่ไฟล์รูปภาพประเภท .jpg, .jpeg, .png`
        );
        continue;
      }

      //validate file size
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > maxfileSizeMB) {
        errorMessages.push(`ไฟล์ '${file.name}' มีขนาดไฟล์เกิน 10MB`);
        continue;
      }

      //validate duplicate file
      const existingFile = originalFiles.find(
        (f) =>
          f.name === file.name &&
          f.type === file.type &&
          f.size === file.size &&
          f.lastModified === file.lastModified
      );

      if (existingFile) {
        errorMessages.push(`ไฟล์ '${file.name}' ไม่สามารถอัพโหลดซ้ำได้`);
        continue;
      }

      const resizedFile = await resizeFile(file);
      const url = URL.createObjectURL(resizedFile);

      tempFiles.push(resizedFile);
      tempOriginalFiles.push(file);
      tempFileUrls.push(url);

      console.log(
        `resize! from ${(file.size / 1024).toFixed(2)}kb to ${(
          resizedFile.size / 1024
        ).toFixed(
          2
        )}kb = new file is now ${(file.size / resizedFile.size).toFixed(2)}X smaller than old file`
      );
    }

    // Array.from(uploadFiles).forEach((file) => {
    //   setInlineError(null);

    //   //validate file type
    //   if (!allowedFileTypes.includes(file.type)) {
    //     return errorMessages.push(
    //       `ไฟล์ '${file.name}' ไม่ใช่ไฟล์รูปภาพประเภท .jpg, .jpeg, .png`
    //     );
    //   }

    //   //validate file size
    //   const fileSizeMB = file.size / 1024 / 1024;
    //   if (fileSizeMB > maxfileSizeMB) {
    //     return errorMessages.push(`ไฟล์ '${file.name}' มีขนาดไฟล์เกิน 10MB`);
    //   }

    //   //validate duplicate file
    //   const existingFile = files.find(
    //     (f) =>
    //       f.name === file.name &&
    //       f.type === file.type &&
    //       f.size === file.size &&
    //       f.lastModified === file.lastModified
    //   );

    //   if (existingFile) {
    //     return errorMessages.push(`ไฟล์ '${file.name}' ไม่สามารถอัพโหลดซ้ำได้`);
    //   }

    //   resizeFile(file)
    //     .then((resizedFile) => {
    //       console.log("yeahh");
    //       const url = URL.createObjectURL(file);

    //       tempFiles.push(file);
    //       tempFileUrls.push(url);
    //     })
    //     .catch((err) => {
    //       console.log("wattt", err);
    //     });
    // });

    if (errorMessages.length > 0) {
      setInlineError({
        title: 'ไม่สามารถอัพโหลดและพรีวิวไฟล์เหล่านี้ได้',
        messages: errorMessages
      });
    }

    if (tempFiles.length > 0 && tempFileUrls.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...tempFiles]);
      setOriginalFiles((prevOriginalFiles) => [
        ...prevOriginalFiles,
        ...tempOriginalFiles
      ]);
      setFileUrls((prevUrls) => [...prevUrls, ...tempFileUrls]);
    }
  };

  const addPlusClickHandler = () => {
    fileRef.current.click();
  };

  const removeFileHandler = (imageIndex) => {
    setFileUrls((prevFileUrls) =>
      prevFileUrls.filter((p, idx) => idx !== imageIndex)
    );
    setFiles((prevFiles) => prevFiles.filter((p, idx) => idx !== imageIndex));
    setOriginalFiles((prevOriginalFiles) =>
      prevOriginalFiles.filter((p, idx) => idx !== imageIndex)
    );
  };

  return (
    <div>
      <div className="flex items-center justify-center flex-wrap">
        {fileUrls.map((url, index) => (
          <ImagePreviewItem
            key={url}
            src={url}
            fileName={files[index]?.name}
            imageIndex={index}
            onClose={removeFileHandler}
          />
        ))}

        {files.length < maxFile && (
          <div
            className={`border-2 border-dashed h-40 w-52 rounded-lg m-2 flex items-center justify-center ${
              error && 'border-red-300'
            }`}
            onClick={addPlusClickHandler}
          >
            <CirclePlus className="text-primary h-12 w-12 transition-all hover:scale-110 cursor-pointer" />
          </div>
        )}
      </div>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        ref={fileRef}
        id="thefile"
        onChange={filesSelectedHandler}
        multiple={true}
        hidden={true}
      />
      {/* <input value="test" /> */}
      {inlineError && (
        <InlineError
          title={inlineError.title}
          messages={inlineError.messages}
          closeAfterMS={5000}
          onClose={() => setInlineError(null)}
        />
      )}
    </div>
  );
};

export default UploadImagesInputDetail;
