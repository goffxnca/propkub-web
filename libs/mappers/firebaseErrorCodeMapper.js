const firebaseErrors = [
  { id: "auth/email-already-in-use", label: "อีเมลนี้ไม่สามารถใช้งานได้" },
  { id: "auth/sth-else", label: "ข้อผิดพลาดบลาๆ" },
];
const getFirebaseErrorLabel = (errorId) => {
  const error = firebaseErrors.find((a) => a.id === errorId);
  if (!error) {
    console.log("firebaseErrorCodeMapper Failed:", errorId);
    return "";
  }
  return error.label;
};

export { getFirebaseErrorLabel };
