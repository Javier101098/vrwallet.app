import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {AbstractControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'vrw-input-currency',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './input-currency.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCurrencyComponent {
  control = input<AbstractControl>();

  visualAmount: string = '';
  actualAmount: number = 0
  
  handleAmountChange(event: any) {
    let input = event.target.value;

    let onlyNumber = input.replace(/[^0-9]/g, '');

    if (!onlyNumber) {
      this.visualAmount = '';
      this.actualAmount = 0;
      return;
    }

    let cents = parseInt(onlyNumber, 10);
    this.control()?.setValue(cents / 100)

    this.visualAmount = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(this.control()?.value);
  }
}
