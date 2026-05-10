/**
 * Validation utilities for API endpoints
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a field name (tag name, category name, etc.)
 * @param value - The value to validate
 * @param fieldName - The name of the field (for error messages)
 * @param maxLength - Maximum allowed length (default: 50)
 * @returns Validation result
 */
export function validateFieldName(
  value: any,
  fieldName: string,
  maxLength: number = 50
): ValidationResult {
  if (!value) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (value.trim().length === 0) {
    return { valid: false, error: `${fieldName} cannot be empty` };
  }

  if (value.length > maxLength) {
    return { valid: false, error: `${fieldName} must be ${maxLength} characters or less` };
  }

  return { valid: true };
}

/**
 * Validates and sanitizes pagination parameters
 * @param limit - The limit parameter (optional)
 * @param offset - The offset parameter (optional)
 * @returns Sanitized pagination parameters
 */
export function sanitizePaginationParams(limit?: any, offset?: any): {
  take?: number;
  skip?: number;
} {
  const result: { take?: number; skip?: number } = {};

  if (limit !== undefined && limit !== null) {
    const limitNum = parseInt(limit as string);
    if (!isNaN(limitNum)) {
      result.take = Math.min(Math.max(0, limitNum), 100); // Cap at 100
    }
  }

  if (offset !== undefined && offset !== null) {
    const offsetNum = parseInt(offset as string);
    if (!isNaN(offsetNum)) {
      result.skip = Math.max(0, offsetNum); // Ensure non-negative
    }
  }

  return result;
}
