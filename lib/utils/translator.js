const TRANSLATIONS = {
  // Auth errors
  'Email already registered': 'อีเมลนี้ถูกใช้งานแล้ว',
  'Unauthorized': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
};

export const t = (text) => {
  const genericErrorMessage = "เกิดข้อผิดพลาด กรุณาลองใหม่";
  if (!text) {
    return genericErrorMessage;
  }

  if (TRANSLATIONS[text]) {
    return TRANSLATIONS[text];
  }

  return genericErrorMessage;
}; 