import { useTranslation } from '@/hooks/useTranslation';
import { resizeFile } from '@/libs/utils/file-utils';
import { ReactHookFormError } from '@/types/misc/form';
import { useEffect, useRef, useState, ChangeEvent } from 'react';
import UploadImagePreviewItem from './UploadImagePreviewItem';
import CirclePlus from '@/components/Icons/CirclePlus';
import InlineError from '../../InlineError';

interface InlineErrorType {
  title: string;
  messages: string[];
}

interface UploadImagesInputDetailProps {
  maxFile?: number;
  maxFileSizeMB?: number;
  onImageChange: (files: File[]) => void;
  error?: ReactHookFormError | boolean | null;
}

const UploadImagesInputDetail = ({
  maxFile = 1,
  maxFileSizeMB = 10,
  onImageChange,
  error
}: UploadImagesInputDetailProps) => {
  const { t } = useTranslation('common');
  const fileRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]); //track list of resized files
  const [originalFiles, setOriginalFiles] = useState<File[]>([]); //track original file (un-resized), used to detects choosing the same file twice
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [inlineError, setInlineError] = useState<InlineErrorType | null>(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

  //multiple support
  const filesSelectedHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = event.target.files;
    if (!uploadFiles || uploadFiles.length === 0) return;

    const totalBrowsedFile = files.length;
    const totalBrowsingFile = uploadFiles.length;

    if (totalBrowsedFile + totalBrowsingFile > maxFile) {
      return setInlineError({
        title: t('upload.errors.warning'),
        messages: [t('upload.errors.maxFiles', { maxFile })]
      });
    }

    const tempFiles: File[] = [];
    const tempOriginalFiles: File[] = [];
    const tempFileUrls: string[] = [];

    const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];

    const errors: string[] = [];

    for (const file of Array.from(uploadFiles)) {
      setInlineError(null);

      //validate file type
      if (!allowedFileTypes.includes(file.type)) {
        errors.push(t('upload.errors.invalidType', { filename: file.name }));
        continue;
      }

      //validate file size
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > maxFileSizeMB) {
        errors.push(t('upload.errors.maxSize', { filename: file.name }));
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
        errors.push(t('upload.errors.duplicate', { filename: file.name }));
        continue;
      }

      const resizedFile = await resizeFile(file);
      const url = URL.createObjectURL(resizedFile);

      tempFiles.push(resizedFile);
      tempOriginalFiles.push(file);
      tempFileUrls.push(url);
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
    //   if (fileSizeMB > maxFileSizeMB) {
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

    if (errors.length > 0) {
      setInlineError({
        title: t('upload.errors.uploadFailed'),
        messages: errors
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
    fileRef.current?.click();
  };

  const removeFileHandler = (imageIndex: number) => {
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
          <UploadImagePreviewItem
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
          onClose={() => setInlineError(null)}
        />
      )}
    </div>
  );
};

export default UploadImagesInputDetail;
