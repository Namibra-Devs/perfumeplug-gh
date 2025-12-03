/**
 * Phone number utilities for Ghana phone numbers
 */

/**
 * Sanitizes a phone number by adding Ghana country code (+233) if not present
 * @param phoneNumber - The phone number to sanitize
 * @returns Sanitized phone number with +233 country code
 */
export function sanitizeGhanaPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';
  
  // Remove all spaces, dashes, and other non-digit characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // If it already has +233, return as is
  if (cleaned.startsWith('+233')) {
    return cleaned;
  }
  
  // If it starts with 233 (without +), add the +
  if (cleaned.startsWith('233')) {
    return '+' + cleaned;
  }
  
  // If it starts with 0, remove the 0 and add +233
  if (cleaned.startsWith('0')) {
    return '+233' + cleaned.substring(1);
  }
  
  // If it's a 9-digit number (typical Ghana mobile without 0), add +233
  if (cleaned.length === 9 && /^[2-9]/.test(cleaned)) {
    return '+233' + cleaned;
  }
  
  // If it's a 10-digit number starting with 0, remove 0 and add +233
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return '+233' + cleaned.substring(1);
  }
  
  // For any other case, assume it's a Ghana number and add +233
  return '+233' + cleaned;
}

/**
 * Validates if a phone number is a valid Ghana phone number
 * @param phoneNumber - The phone number to validate
 * @returns True if valid Ghana phone number, false otherwise
 */
export function isValidGhanaPhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) return false;
  
  const sanitized = sanitizeGhanaPhoneNumber(phoneNumber);
  
  // Ghana phone numbers should be +233 followed by 9 digits
  // Valid prefixes after +233: 20, 23, 24, 26, 27, 28, 50, 54, 55, 56, 57, 59
  const ghanaPhoneRegex = /^\+233(20|23|24|26|27|28|50|54|55|56|57|59)\d{7}$/;
  
  return ghanaPhoneRegex.test(sanitized);
}

/**
 * Formats a Ghana phone number for display
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number (e.g., +233 24 123 4567)
 */
export function formatGhanaPhoneNumber(phoneNumber: string): string {
  const sanitized = sanitizeGhanaPhoneNumber(phoneNumber);
  
  if (sanitized.length === 13 && sanitized.startsWith('+233')) {
    // Format as +233 XX XXX XXXX
    return `${sanitized.substring(0, 4)} ${sanitized.substring(4, 6)} ${sanitized.substring(6, 9)} ${sanitized.substring(9)}`;
  }
  
  return sanitized;
}

/**
 * Examples of usage:
 * 
 * sanitizeGhanaPhoneNumber('0242826513') → '+233242826513'
 * sanitizeGhanaPhoneNumber('242826513') → '+233242826513'
 * sanitizeGhanaPhoneNumber('+233242826513') → '+233242826513'
 * sanitizeGhanaPhoneNumber('233242826513') → '+233242826513'
 * sanitizeGhanaPhoneNumber('024-282-6513') → '+233242826513'
 * 
 * isValidGhanaPhoneNumber('+233242826513') → true
 * isValidGhanaPhoneNumber('+233142826513') → false (invalid prefix)
 * 
 * formatGhanaPhoneNumber('0242826513') → '+233 24 282 6513'
 */