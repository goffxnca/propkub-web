import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { firebaseFunctions } from "../firebase";
import { VerifyEmailParams, VerifyEmailResponse } from "../../src/types/auth";

const verifyEmail = async ({ email, vToken }: VerifyEmailParams): Promise<VerifyEmailResponse> => {
  const verifyEmailRef = httpsCallable<VerifyEmailParams, VerifyEmailResponse>(firebaseFunctions, "verifyEmail");
  const result = await verifyEmailRef({ email, vToken });
  return result.data;
};

export { verifyEmail };
