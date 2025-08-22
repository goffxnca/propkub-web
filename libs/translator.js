const TRANSLATIONS = {
  // Auth errors
  'Email already registered': 'อีเมลนี้ถูกใช้งานแล้ว',
  'Unauthorized': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'This account was registered with Google': 'บัญชีนี้ลงทะเบียนด้วย Google กรุณาใช้ปุ่ม "ล็อกอินด้วย Google" เพื่อเข้าสู่ระบบ',
  'This account was registered with Facebook': 'บัญชีนี้ลงทะเบียนด้วย Facebook กรุณาใช้ปุ่ม "ล็อกอินด้วย Facebook" เพื่อเข้าสู่ระบบ',
  
  // Reset password errors
  'Invalid or expired reset token': 'ลิ้งค์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ',
  'Reset token is valid': 'โทเค็นรีเซ็ตถูกต้อง',
  'Password has been reset successfully': 'รหัสผ่านถูกรีเซ็ตเรียบร้อยแล้ว',
  
  // Password update errors
  'Current password is incorrect': 'รหัสผ่านปัจจุบันไม่ถูกต้อง',
  'Password has been updated successfully': 'รหัสผ่านได้รับการอัปเดตเรียบร้อยแล้ว',
  'Failed to update password': 'ไม่สามารถอัปเดตรหัสผ่านได้',
  
  // Validation errors
  'currentPassword should not be empty': 'กรุณาระบุรหัสผ่านปัจจุบัน',
  'newPassword should not be empty': 'กรุณาระบุรหัสผ่านใหม่',
  'currentPassword must be longer than or equal to 6 characters': 'รหัสผ่านปัจจุบันต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
  'newPassword must be longer than or equal to 6 characters': 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร22',
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