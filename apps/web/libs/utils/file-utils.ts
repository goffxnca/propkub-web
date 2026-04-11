import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import Resizer from 'react-image-file-resizer';
import { randomOneToN } from '../number-utils';
import { initFirebase } from '../firebase';

const resizeFile = async (file: File): Promise<File> => {
  return new Promise<File>((resolve) => {
    Resizer.imageFileResizer(
      file,
      800,
      600,
      'JPEG',
      75,
      0,
      (resizedFile) => {
        resolve(resizedFile as File);
      },
      'file'
    );
  });
};

const uploadFileToStorage = async (
  type: string,
  postNumber: string,
  file: File
): Promise<string | undefined> => {
  initFirebase();
  const storage = getStorage();
  const storageRef = ref(
    storage,
    `${type}/${postNumber}/i/${randomOneToN(99999)}${getFileExtension(file.name)}`
  );

  return uploadBytes(storageRef, file).then((snapshot) =>
    getDownloadURL(snapshot.ref).then((downloadUrl: string) => {
      if (downloadUrl) {
        const tokenIndex = downloadUrl.indexOf('&token');
        //if there's a token segment in image url, drop it
        return tokenIndex === -1
          ? downloadUrl
          : downloadUrl.substring(0, tokenIndex);
      }
      return undefined;
    })
  );
};

const getFileExtension = (filename: string | undefined): string => {
  let fileExtension = '';
  if (typeof filename === 'string' && filename.length > 0) {
    const filenameSegments = filename.split('.');
    if (filenameSegments.length > 0) {
      fileExtension = filenameSegments.pop() || '';
    }
  }

  if (fileExtension) {
    fileExtension = fileExtension.toLowerCase();
  }

  return fileExtension ? '.' + fileExtension : '';
};

export { resizeFile, uploadFileToStorage };
