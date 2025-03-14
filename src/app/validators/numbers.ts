import {AbstractControl, ValidationErrors} from "@angular/forms";


export function validateDecimals(decimals?: number | undefined) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null; // Don't validate empty values (handled by other validators like required)
    }

    const value = control.value.toString();

    // Regex for validating integer
    const integerRegex = /^-?\d+$/;

    // Regex for validating decimal with specified decimal places
    const decimalRegex = decimals !== undefined && decimals > 0
      ? new RegExp(`^-?\\d+(\\.\\d{1,${decimals}})?$`)
      : integerRegex; // Use integer regex if decimals is undefined or 0

    if ((decimals === 0 || decimals === undefined) && !integerRegex.test(value)) {
      return {integerError: {valid: false}}; // Invalid integer error
    }

    if (decimals !== 0 && !decimalRegex.test(value)) {
      return {decimalError: {valid: false, decimals: decimals}}; // Invalid decimal error
    }

    return null; // No errors
  };
}
