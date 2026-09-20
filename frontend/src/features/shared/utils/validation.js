// ==============================================================================
// VICEVERSE VALIDATION UTILITIES
// ==============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function createValidator<T>(rules: ValidationRule<T>[]): (value: T) => ValidationResult {
  return (value: T) => {
    const errors: string[] = [];
    for (const rule of rules) {
      if (!rule.test(value)) {
        errors.push(rule.message);
      }
    }
    return { valid: errors.length === 0, errors };
  };
}

export interface ValidationRule<T> {
  test: (value: T) => boolean;
  message: string;
}

export const required = <T>(message = 'This field is required'): ValidationRule<T> => ({
  test: (value: T) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  },
  message,
});

export const minLength = (min: number, message?: string): ValidationRule<string> => ({
  test: (value: string) => !value || value.length >= min,
  message: message || `Must be at least ${min} characters`,
});

export const maxLength = (max: number, message?: string): ValidationRule<string> => ({
  test: (value: string) => !value || value.length <= max,
  message: message || `Must be no more than ${max} characters`,
});

export const pattern = (regex: RegExp, message = 'Invalid format'): ValidationRule<string> => ({
  test: (value: string) => !value || regex.test(value),
  message,
});

export const email = (message = 'Invalid email address'): ValidationRule<string> => ({
  test: (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message,
});

export const url = (message = 'Invalid URL'): ValidationRule<string> => ({
  test: (value: string) => !value || /^https?:\/\/.+/.test(value),
  message,
});

export const numeric = (message = 'Must be a number'): ValidationRule<string> => ({
  test: (value: string) => !value || /^\d+(\.\d+)?$/.test(value),
  message,
});

export const integer = (message = 'Must be an integer'): ValidationRule<string> => ({
  test: (value: string) => !value || /^\d+$/.test(value),
  message,
});

export const min = (min: number, message?: string): ValidationRule<number> => ({
  test: (value: number) => value === undefined || value === null || value >= min,
  message: message || `Must be at least ${min}`,
});

export const max = (max: number, message?: string): ValidationRule<number> => ({
  test: (value: number) => value === undefined || value === null || value <= max,
  message: message || `Must be no more than ${max}`,
});

export const between = (min: number, max: number, message?: string): ValidationRule<number> => ({
  test: (value: number) => value === undefined || value === null || (value >= min && value <= max),
  message: message || `Must be between ${min} and ${max}`,
});

export const oneOf = <T>(values: T[], message = 'Invalid value'): ValidationRule<T> => ({
  test: (value: T) => value === undefined || value === null || values.includes(value),
  message,
});

export const validate = <T>(value: T, rules: ValidationRule<T>[]): ValidationResult => {
  const errors: string[] = [];
  for (const rule of rules) {
    if (!rule.test(value)) {
      errors.push(rule.message);
    }
  }
  return { valid: errors.length === 0, errors };
};

export function validateObject<T extends Record<string, unknown>>(
  obj: T,
  schema: Record<keyof T, ValidationRule<T[keyof T]>[]>
): Record<keyof T, ValidationResult> {
  const result: Record<string, ValidationResult> = {};
  for (const [key, rules] of Object.entries(schema)) {
    result[key] = validate(obj[key], rules);
  }
  return result as Record<keyof T, ValidationResult>;
}

export function isValidObject<T extends Record<string, unknown>>(
  obj: T,
  schema: Record<keyof T, ValidationRule<T[keyof T]>[]>
): boolean {
  const results = validateObject(obj, schema);
  return Object.values(results).every(r => r.valid);
}