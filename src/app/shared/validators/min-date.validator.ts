import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {format} from "date-fns";

export function MinDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    
    if (control.value === null || control.value == '') return null;
    
    const date = format(control.value, 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');
    
    return date <= today ? { minDate: {value:control.value}} : null;
  };
}