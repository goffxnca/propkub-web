const min = (min, title) => ({
  value: min,
  message: `${title}ต้องไม่ต่ำกว่า ${min}`,
});

const max = (max, title) => ({
  value: max,
  message: `${title}ต้องไม่เกิน ${max}`,
});

const minLength = (minLength, title) => ({
  value: minLength,
  message: `${title}ต้องไม่ต่ำกว่า ${minLength} ตัวอักษร`,
});

const maxLength = (maxLength, title) => ({
  value: maxLength,
  message: `${title}ต้องไม่เกิน ${maxLength} ตัวอักษร`,
});

const EmailPattern = () => ({
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: `อีเมลไม่ถูกต้อง`,
});

const GenericPhonePattern = (title) => ({
  value: /^[0-9]{9,10}$/g,
  message: `หมายเลขโทรศัพท์มือถือต้องเป็นตัวเลขเท่านั้น ความยาว 9-10 ตัวอักษร`,
});

const MobilePhonePattern = (title) => ({
  value: /^[0-9]{10}$/g,
  message: `หมายเลขโทรศัพท์มือถือต้องเป็นตัวเลขเท่านั้น ความยาว 10 ตัวอักษร`,
});

export {
  min,
  max,
  minLength,
  maxLength,
  EmailPattern,
  MobilePhonePattern,
  GenericPhonePattern,
};
