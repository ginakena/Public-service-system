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

export interface RequestValues {
  category: string;
  county: string;
  area: string;
  description: string;
}

export function validateRequest(v: RequestValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!v.category) errors.category = "Choose a category";
  if (!v.county) errors.county = "Select a county";
  if (v.area.trim().length < 2) errors.area = "Enter the area or neighbourhood";

  const length = v.description.trim().length;
  if (length < 10) errors.description = "Please describe the problem in at least 10 characters";
  else if (length > 1000) errors.description = "Description must be 1000 characters or less";

  return errors;
}