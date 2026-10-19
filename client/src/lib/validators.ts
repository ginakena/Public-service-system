export interface RegisterValues {
  name: string;
  email: string;
  nationalId: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function validateRegister(v: RegisterValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (v.name.trim().length < 2) errors.name = "Enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) errors.email = "Enter a valid email address";
  if (!/^\d{7,8}$/.test(v.nationalId.trim())) errors.nationalId = "National ID must be 7 or 8 digits";
  if (!/^(?:\+254|0)[17]\d{8}$/.test(v.phone.trim())) errors.phone = "Use a valid Kenyan number, e.g. 0712345678";
  if (v.password.length < 8 || !/[A-Za-z]/.test(v.password) || !/\d/.test(v.password)) {
    errors.password = "At least 8 characters, with a letter and a number";
  }
  if (v.confirmPassword !== v.password) errors.confirmPassword = "Passwords do not match";
  return errors;
}