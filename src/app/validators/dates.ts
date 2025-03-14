import {AbstractControl, ValidatorFn} from "@angular/forms";

export function minDateValidator(minDate: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const inputDate = new Date(control.value);
    const minDateObj = new Date(minDate);

    if (!control.value) {
      return null; // no value, no error
    }

    return inputDate < minDateObj ? { 'minDate': { value: control.value, requiredMinDate: minDate } } : null;
  };
}

export function maxDateValidator(maxDate: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const inputDate = new Date(control.value);
    const maxDateObj = new Date(maxDate);

    if (!control.value) {
      return null; // no value, no error
    }

    return inputDate > maxDateObj ? { 'maxDate': { value: control.value, requiredMaxDate: maxDate } } : null;
  };
}
