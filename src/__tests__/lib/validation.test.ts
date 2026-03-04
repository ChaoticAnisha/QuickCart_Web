import {
  validateEmail,
  validatePassword,
  validateName,
  validatePrice,
  validateLoginForm,
  validateRegisterForm,
} from '@/lib/validation';

// Test 9 & 10 — validateEmail
describe('validateEmail', () => {
  it('returns an empty string for a valid email', () => {
    expect(validateEmail('user@example.com')).toBe('');
  });

  it('returns an error message for an invalid email', () => {
    expect(validateEmail('not-an-email')).toBe(
      'Please enter a valid email address'
    );
  });
});

// Test 11 & 12 — validatePassword
describe('validatePassword', () => {
  it('returns an empty string for a valid password', () => {
    expect(validatePassword('password123')).toBe('');
  });

  it('returns an error for a password shorter than 6 characters', () => {
    expect(validatePassword('abc')).toBe(
      'Password must be at least 6 characters'
    );
  });
});

// Test 13 — validateName
describe('validateName', () => {
  it('returns an error when the name is too short', () => {
    expect(validateName('Jo')).toBe('Name must be at least 3 characters');
  });
});

// Test 14 — validatePrice
describe('validatePrice', () => {
  it('returns an error for a negative price', () => {
    expect(validatePrice(-5)).toBe('Price must be a positive number');
  });
});

// Test 15 & 16 — validateLoginForm
describe('validateLoginForm', () => {
  it('returns isValid true with no errors for valid credentials', () => {
    const result = validateLoginForm({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns isValid false with errors when fields are empty', () => {
    const result = validateLoginForm({ email: '', password: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.password).toBeTruthy();
  });
});

// Test 17 & 18 — validateRegisterForm
describe('validateRegisterForm', () => {
  it('returns an error when confirm password does not match', () => {
    const result = validateRegisterForm({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'different',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.confirmPassword).toBe('Passwords do not match');
  });

  it('returns isValid true for a fully valid registration form', () => {
    const result = validateRegisterForm({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.isValid).toBe(true);
  });
});
