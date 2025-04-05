import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const counterCollectionRef = collection(db, "counters");

const getCounterById = async (counterId) => {
  const docRef = doc(counterCollectionRef, counterId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
  };
};

export { getCounterById };
