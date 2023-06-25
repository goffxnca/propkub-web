import {
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../libs/firebase";

const m20221020_updateStatusAndSubStatusForExistingPosts = async () => {
  const postsCollectionRef = collection(db, "posts");

  const q = query(postsCollectionRef, orderBy("createdAt", "asc"));
  //   const q = query(postsCollectionRef, where("postNumber", "==", 1666244848997));

  const postsDocs = await getDocs(q);

  postsDocs.forEach(async (postDoc) => {
    const postData = { postId: postDoc.id, ...postDoc.data() };
    const { postId, status, indexed } = postData;

    let newStatus = "";
    let newSubStatus = "";

    if (status === "active") {
      newStatus = "active";
      newSubStatus = indexed ? "indexed" : "created";
    } else if (status === "inactive" || status === "sold") {
      newStatus = "inactive";
      newSubStatus = "fulfilled";
    }

    const toBeUpdatedPost = {
      status: newStatus,
      subStatus: newSubStatus,
      updatedAt: serverTimestamp(),
      updatedBy: { userId: "<ADMIN>", name: "Admin" },
    };

    const docRef = doc(db, "posts", postId);
    const result = await updateDoc(docRef, toBeUpdatedPost);
    console.log(result);
  });
  return { message: "OK", payload: { docs: postsDocs.size } };
};

export { m20221020_updateStatusAndSubStatusForExistingPosts };
