import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "../firebase";

const verifyEmail = async ({ email, vToken }) => {
  const verifyEmailRef = httpsCallable(firebaseFunctions, "verifyEmail");
  return verifyEmailRef({ email, vToken });
};

export { verifyEmail };
