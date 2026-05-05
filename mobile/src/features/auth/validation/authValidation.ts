export type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
};

export function validateLoginForm(email: string, password: string): string | null {
  if (!email.trim() || !password) return 'auth.login.error_required';
  return null;
}

export function validateForgotPasswordForm(email: string): string | null {
  if (!email.trim()) return 'auth.login.error_forgot_email';
  return null;
}

export function validateRegisterForm(data: RegisterFormData): string | null {
  if (!data.name.trim() || !data.email.trim() || !data.phone.trim() || !data.password) {
    return 'auth.register.error_required';
  }
  if (data.password !== data.confirm) return 'auth.register.error_password_match';
  if (data.password.length < 6) return 'auth.register.error_password_length';
  return null;
}
