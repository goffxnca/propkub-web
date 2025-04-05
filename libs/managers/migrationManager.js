import {
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const migrationsCollectionRef = collection(db, "_migrations");

const getMigrationByFuncName = async (funcName) => {
  const q = query(
    migrationsCollectionRef,
    where("funcName", "==", funcName),
    orderBy("ranAt", "desc")
  );

  const migrationDocs = await getDocs(q);
  if (migrationDocs.empty) {
    return null;
  }
  const firstMigrationDoc = migrationDocs.docs[0];

  return { id: firstMigrationDoc.id, ...firstMigrationDoc.data() };
};

const getMigrationByMigrationKey = async (mKey) => {
  const q = query(
    migrationsCollectionRef,
    where("mKey", "==", mKey),
    where("funcName", "==", "<WATING_MIGRATION>")
  );

  const migrationDocs = await getDocs(q);
  if (migrationDocs.empty) {
    return null;
  }
  const firstMigrationDoc = migrationDocs.docs[0];

  return { id: firstMigrationDoc.id, ...firstMigrationDoc.data() };
};

const markMigrationAsRan = async (mId, funcName, result) => {
  const docRef = doc(migrationsCollectionRef, mId);
  return await updateDoc(docRef, {
    funcName,
    ranAt: serverTimestamp(),
    result,
  });
};

const addEmptyNextMigration = async () => {
  await setDoc(doc(migrationsCollectionRef), {
    funcName: "<WATING_MIGRATION>",
    mKey: uuidv4(),
    createdAt: serverTimestamp(),
  });
};

export {
  getMigrationByFuncName,
  getMigrationByMigrationKey,
  markMigrationAsRan,
  addEmptyNextMigration,
};
