import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
  styles: ``,
})
export class FormErrorLabelComponent {
  control = input.required<AbstractControl | null>();

  get isValid(): boolean {
    const control = this.control();
    return !!control && control.valid && control.touched;
  }

  get errorMessage(): string {
    const errors: ValidationErrors = this.control()?.errors ?? {};

    return this.control()?.touched && Object.keys(errors).length > 0
      ? this.getErrorMessage(errors)
      : '';
  }

  getErrorMessage(control: ValidationErrors): string {
    const firstError: string = Object.keys(control)[0];

    switch (firstError) {
      case 'required':
        return '* Este campo es requerido';

      case 'minlength':
        return `* Mínimo de ${control['minlength'].requiredLength} caracteres.`;

      case 'maxlength':
        return `* Maximo de ${control['maxlength'].requiredLength} caracteres.`;

      case 'min':
        return `* Valor mínimo de ${control['min'].min}`;

      case 'max':
        return `* Valor maximo de ${control['max'].max}`;

      case 'email':
        return `* El valor ingresado no es un correo electrónico`;

      case 'emailTaken':
        return `* El correo electrónico ya está siendo usado por otro usuario`;

      case 'noStrider':
        return `* No se puede usar el username de strider en la app`;

      case 'pattern':
        return `* El valor debe ser de tipo alfanumérico`;

      case 'requireNonAlphanumeric':
        return `* Requiere un valor alfanumérico`;

      case 'requireNumber':
        return '* Las contraseñas deben tener al menos un dígito';

      case 'requireCapitalLetter':
        return '* Requiere al menos una letra mayúscula';

      case 'passwordMismatch':
        return '* La contraseña no coincide';

      case 'maxTwoDecimals':
        return '* Solo se admiten 2 decimales';

      default:
        return `* Error de validación no controlado ${firstError}`;
    }
  }
}
