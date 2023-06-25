import {
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../../libs/firebase";

const m20221020_addPostActionsForExistingPosts = async () => {
  const postsCollectionRef = collection(db, "posts");
  const postActionsCollectionRef = collection(db, "postActions");

  const q = query(postsCollectionRef, orderBy("createdAt", "asc"));
  //   const q = query(postsCollectionRef, where("postNumber", "==", 1666182266585));

  const postsDocs = await getDocs(q);

  let finalResult = "";

  postsDocs.forEach(async (postDoc) => {
    const postData = postDoc.data();
    const { status, indexed, createdAt } = postData;

    const result1 = await setDoc(doc(postActionsCollectionRef), {
      actionName: "CreatePost",
      actionLabel: "สร้างประกาศ",
      fromStatus: "",
      toStatus: "active",
      fromSubStatus: "",
      toSubStatus: "created",
      postId: postDoc.id,
      emailSent: false,
      notiSent: false,
      createdAt: createdAt,
      createdBy: {
        userId: postData.createdBy?.userId || "",
        name: postData.createdBy?.name || "",
      },
      note: "",
      additional: {},
      remark: "<MIGRATION>",
    });
    finalResult += "result1";
    console.log("result1", result1);

    if (indexed) {
      const result2 = await setDoc(doc(postActionsCollectionRef), {
        actionName: "MarkIndexed",
        actionLabel: "ประกาศติด Google",
        fromStatus: "active",
        toStatus: "active",
        fromSubStatus: "created",
        toSubStatus: "indexed",
        postId: postDoc.id,
        emailSent: false,
        notiSent: false,
        createdAt: serverTimestamp(), //fine, just use today as the mark as index date
        createdBy: {
          userId: "<ADMIN>",
          name: "Admin",
        },
        note: "",
        additional: {},
        remark: "<MIGRATION>",
      });
      finalResult += "result2";
      console.log("result2", result2);
    }

    if (status === "inactive" || status === "sold") {
      const result3 = await setDoc(doc(postActionsCollectionRef), {
        actionName: "FulfillPost",
        actionLabel: "ประกาศปิดการขาย",
        fromStatus: "active",
        toStatus: "inactive",
        fromSubStatus: indexed ? "indexed" : "created",
        toSubStatus: "fulfilled",
        postId: postDoc.id,
        emailSent: false,
        notiSent: false,
        createdAt: serverTimestamp(), //fine, just use today as the closing post date
        createdBy: {
          userId: "<ADMIN>",
          name: "Admin",
        },
        note: "",
        additional: {},
        remark: "<MIGRATION>",
      });
      finalResult += "result3";
      console.log("result3", result3);
    }
  });
  return {
    message: "OK",
    payload: { docs: postsDocs.docs.length, finalResult },
  };
};

export { m20221020_addPostActionsForExistingPosts };
