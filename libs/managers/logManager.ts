import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "../firebase";

const addLog = ({ action, type, payload }) => {
  const addLogRef = httpsCallable(firebaseFunctions, "addLog");
  addLogRef({ action, type, payload }).catch((error) => {
    throw error;
  });
};

export { addLog };
