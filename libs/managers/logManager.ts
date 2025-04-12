import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { firebaseFunctions } from "../firebase";
import { LogParams, LogResponse } from "../../src/types/models/_log";

const addLog = ({ action, type, payload }: LogParams): Promise<LogResponse> => {
  const addLogRef = httpsCallable(firebaseFunctions, "addLog");
  return addLogRef({ action, type, payload })
    .then((result: HttpsCallableResult<LogResponse>) => result.data)
    .catch((error) => {
      throw error;
    });
};

export { addLog };
