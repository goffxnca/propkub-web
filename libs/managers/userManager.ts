import {
  collection,
  setDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  addDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { uploadFileToStorage } from "../utils/file-utils";
import { User, UserProfile } from "../../src/types/user";

const usersCollectionRef = collection(db, "users");

const getUserById = async (userId: string): Promise<User> => {
  const docRef = doc(usersCollectionRef, userId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: new Date().toLocaleString("th"),
  } as User;
};

const updateUserProfile = async (userProfile: UserProfile, userId: string): Promise<void> => {
  const docRef = doc(usersCollectionRef, userId);
  const docId = docRef.id;
  const file = userProfile.profileImg.fileData;
  const fileChanged = userProfile.profileImg.isFileChanged;
  const originFileUrl = userProfile.profileImg.originFileUrl;

  const toBeUpdatedUserProfile = {
    name: userProfile.name || "",
    phone: userProfile.phone || "",
    line: userProfile.line || "",
    profileImg: originFileUrl || "",
    updatedAt: serverTimestamp(),
  };

  if (fileChanged) {
    return uploadFileToStorage("us", docId, file).then((profileImageUrl) => {
      if (!profileImageUrl) {
        throw new Error(
          `Failed updating user profile, profile image failed to upload`
        );
      }

      toBeUpdatedUserProfile.profileImg = profileImageUrl;
      //TODO: using firebase function for server validate data later

      return updateDoc(docRef, toBeUpdatedUserProfile);
    });
  } else {
    //TODO: using firebase function for server validate data later

    return updateDoc(docRef, toBeUpdatedUserProfile);
  }
};

export { getUserById, updateUserProfile };
