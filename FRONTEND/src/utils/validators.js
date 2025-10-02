// src/utils/validators.js

// Check if value is not empty
export function notEmpty(value) {
  return value && value.trim().length > 0;
}

// Check if value looks like a valid email
export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Check if password is "strong enough"
// (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
export function passwordStrong(value) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
}
