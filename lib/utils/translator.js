const TRANSLATIONS = {
  // Auth errors
  'Email already registered': 'อีเมลนี้ถูกใช้งานแล้ว',
  'Unauthorized': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'This account was registered with Google': 'บัญชีนี้ลงทะเบียนด้วย Google กรุณาใช้ปุ่ม "ล็อกอินด้วย Google" เพื่อเข้าสู่ระบบ',
  'This account was registered with Facebook': 'บัญชีนี้ลงทะเบียนด้วย Facebook กรุณาใช้ปุ่ม "ล็อกอินด้วย Facebook" เพื่อเข้าสู่ระบบ',
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