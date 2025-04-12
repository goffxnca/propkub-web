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
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { Migration, MigrationResult } from "../../src/types/models/_migration";

const migrationsCollectionRef = collection(db, "_migrations");

const getMigrationByFuncName = async (funcName: string): Promise<Migration | null> => {
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

  return { id: firstMigrationDoc.id, ...firstMigrationDoc.data() } as Migration;
};

const getMigrationByMigrationKey = async (mKey: string): Promise<Migration | null> => {
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

  return { id: firstMigrationDoc.id, ...firstMigrationDoc.data() } as Migration;
};

const markMigrationAsRan = async (
  mId: string,
  funcName: string,
  result: MigrationResult
): Promise<void> => {
  const docRef = doc(migrationsCollectionRef, mId);
  await updateDoc(docRef, {
    funcName,
    ranAt: serverTimestamp(),
    result,
  });
};

const addEmptyNextMigration = async (): Promise<void> => {
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
