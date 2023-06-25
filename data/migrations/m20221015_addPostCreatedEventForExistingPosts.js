import {
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../libs/firebase";

const m20221015_addPostCreatedEventForExistingPosts = async () => {
  const postsCollectionRef = collection(db, "posts");
  const eventsCollectionRef = collection(db, "events");

  const q = query(postsCollectionRef, orderBy("createdAt", "asc"));

  const postsDocs = await getDocs(q);

  postsDocs.forEach(async (postDoc) => {
    const postData = postDoc.data();
    const result = await setDoc(doc(eventsCollectionRef), {
      type: "post",
      subType: "created",
      refId: postDoc.id,
      createdAt: postData.createdAt,
      createdBy: {
        userId: postData.createdBy?.userId || "<MIGRATION>",
        name: postData.createdBy?.name || "Admin",
      },
    });
    console.log(result);
  });
  return { message: "OK", payload: { docs: postsDocs.size } };
};

export { m20221015_addPostCreatedEventForExistingPosts };
