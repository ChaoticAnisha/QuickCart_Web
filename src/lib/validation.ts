export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^(\+977\s?)?[9][6-9]\d{8}$/; // ← Updated to allow space

export function validateEmail(email: string): string {
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
}

export function validatePassword(password: string): string {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 50) return 'Password must be less than 50 characters';
  return '';
}

export function validateName(name: string): string {
  if (!name) return 'Name is required';
  if (name.length < 3) return 'Name must be at least 3 characters';
  if (name.length > 50) return 'Name must be less than 50 characters';
  return '';
}

export function validatePhone(phone: string): string {
  if (!phone) return ''; // Optional field
  
  // Remove spaces for validation
  const cleanPhone = phone.replace(/\s/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return 'Please enter a valid Nepali phone number';
  }
  return '';
}

export function validateAddress(address: string): string {
  if (!address) return 'Address is required';
  if (address.length < 10) return 'Please enter a complete address';
  return '';
}

export function validatePrice(price: number): string {
  if (price === undefined || price === null) return 'Price is required';
  if (price < 0) return 'Price must be a positive number';
  if (price > 1000000) return 'Price is too high';
  return '';
}

export function validateStock(stock: number): string {
  if (stock === undefined || stock === null) return 'Stock is required';
  if (stock < 0) return 'Stock must be a positive number';
  if (!Number.isInteger(stock)) return 'Stock must be a whole number';
  return '';
}

export interface LoginFormData {
  email: string;
  password: string;
}

export function validateLoginForm(data: LoginFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
}

export function validateRegisterForm(data: RegisterFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (data.phone) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
  }

  if (data.address) {
    const addressError = validateAddress(data.address);
    if (addressError) errors.address = addressError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  deliveryTime: string;
  image: string;
}

export function validateProductForm(data: ProductFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name) errors.name = 'Product name is required';
  if (!data.description) errors.description = 'Description is required';

  const priceError = validatePrice(data.price);
  if (priceError) errors.price = priceError;

  if (!data.category) errors.category = 'Category is required';

  const stockError = validateStock(data.stock);
  if (stockError) errors.stock = stockError;

  if (!data.deliveryTime) errors.deliveryTime = 'Delivery time is required';
  if (!data.image) errors.image = 'Product image is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}