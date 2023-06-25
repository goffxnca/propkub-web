// import { sendFirstEmail } from "../libs/managers/emailManager";

const TriggerPage = () => {
  const triggerHanlder = () => {
    // sendFirstEmail();
  };
  return <button onClick={triggerHanlder}>Trigger</button>;
};

export default TriggerPage;
