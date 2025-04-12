import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Counter } from "../../src/types/counter";

const counterCollectionRef = collection(db, "counters");

const getCounterById = async (counterId: string): Promise<Counter> => {
  const docRef = doc(counterCollectionRef, counterId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
  } as Counter;
};

export { getCounterById };
