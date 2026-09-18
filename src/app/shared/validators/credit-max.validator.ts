import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function creditMaxValidator(limitControlName: string = 'creditLimit'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control.parent;
    if (!group) return null;
    if (control.value === null || control.value === undefined || control.value === '') return null;
    const limit = Number(group.get(limitControlName)?.value) || 0;
    const value = Number(control.value) || 0;
    if (value > limit) {
      return { max: { max: limit, actual: value } };
    }
    return null;
  };
}

export const CreditMaxValidator = creditMaxValidator;
