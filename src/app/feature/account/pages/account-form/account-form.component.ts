import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountTypeService } from '@core/services/account-type.service';
import { CurrencyService } from '@core/services/currency.service';
import { InstitutionService } from '@core/services/institution.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { MessageService } from 'primeng/api';
import { AccountCreate } from '../../interfaces/account-create.interface';
import { AccountStore } from '../../services/account-store.service';
import { Router } from '@angular/router';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'vrw-account-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    ColorPickerModule,
  ],
  providers: [MessageService],
  templateUrl: './account-form.component.html',
  styles: ``,
})
export default class AccountFormComponent {
  private fb = inject(FormBuilder);
  private accountTypeService = inject(AccountTypeService);
  private currencyService = inject(CurrencyService);
  private institutionService = inject(InstitutionService);
  private accountStore = inject(AccountStore);
  private messageService = inject(MessageService);
  private router = inject(Router);

  isLoading = this.accountStore.isLoading;

  accountTypes = toSignal(this.accountTypeService.get(), { initialValue: [] });

  currencies = toSignal(this.currencyService.get(), { initialValue: [] });

  institutions = toSignal(this.institutionService.get(), { initialValue: [] });

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    accountTypeId: ['', [Validators.required]],
    currencyId: ['', [Validators.required]],
    institutionId: ['', [Validators.required]],
    color: ['#ff0066', [Validators.required]],
  });

  get currentForm(): AccountCreate {
    return this.form.value as AccountCreate;
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor complete todos los campos requeridos.',
      });
      return;
    }

    this.accountStore.addAccount(this.currentForm);
  }

  handleGoOut(): void {
    this.router.navigate(['/accounts']).then();
  }
}
