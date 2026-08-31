import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function creditSumValidator(
  limitControlName: string = 'creditLimit',
  availableControlName: string = 'creditAvailable',
  usedControlName: string = 'creditUsed'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control.parent;
    if (!group) return null;
    const limitCtrl = group.get(limitControlName);
    const availableCtrl = group.get(availableControlName);
    const usedCtrl = group.get(usedControlName);

    if (!limitCtrl || !availableCtrl || !usedCtrl) return null;
    if (
      control.value === null ||
      control.value === undefined ||
      control.value === ''
    ) {
      return null;
    }
    if (
      limitCtrl.value === null ||
      limitCtrl.value === undefined ||
      availableCtrl.value === null ||
      availableCtrl.value === undefined ||
      usedCtrl.value === null ||
      usedCtrl.value === undefined
    ) {
      return null;
    }

    const limit = Number(limitCtrl.value) || 0;
    const available = Number(availableCtrl.value) || 0;
    const used = Number(usedCtrl.value) || 0;
    const sum = Number((available + used).toFixed(2));
    const expected = Number(limit.toFixed(2));
    if (sum !== expected) {
      return { creditSumMismatch: true };
    }
    return null;
  };
}

export const CreditSumValidator = creditSumValidator;
