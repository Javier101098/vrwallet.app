import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountTypeService } from '@core/services/account-type.service';
import { CurrencyService } from '@core/services/currency.service';
import { InstitutionService } from '@core/services/institution.service';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { MessageService } from 'primeng/api';
import {AccountCreate, InvestmentAccount} from '../../interfaces/account-create.interface';
import { AccountStore } from '../../services/account-store.service';
import { Router} from '@angular/router';
import { ColorPickerModule } from 'primeng/colorpicker';
import {map, of, startWith, tap} from "rxjs";
import {AccountService} from "../../services/account.service";
import {ProgressSpinner} from "primeng/progressspinner";
import {Select} from "primeng/select";
import {NotFoundComponent} from "@shared/components/not-found/not-found.component";
import {Divider} from "primeng/divider";
import {SelectButton} from "primeng/selectbutton";
import {InputNumber} from "primeng/inputnumber";
import {Checkbox} from "primeng/checkbox";
import {Frequency} from "../../interfaces/yield-frequency";
import {MinDateValidator} from "@shared/validators/min-date.validator";

@Component({
  selector: 'vrw-account-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    ColorPickerModule,
    ProgressSpinner,
    Select,
    NotFoundComponent,
    Divider,
    SelectButton,
    InputNumber,
    Checkbox,
  ],
  providers: [MessageService],
  templateUrl: './account-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.Default,
})
export default class AccountFormComponent {
  id = input<string>(); 
    
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private accountTypeService = inject(AccountTypeService);
  private currencyService = inject(CurrencyService);
  private institutionService = inject(InstitutionService);
  private accountStore = inject(AccountStore);
  private messageService = inject(MessageService);
  private router = inject(Router);

  isLoading = this.accountStore.isLoading;
  isEdit = computed(()=>this.id() != undefined)
  
  accountTypes = toSignal(this.accountTypeService.get(), { initialValue: [] });
  currencies = toSignal(this.currencyService.get(), { initialValue: [] });
  institutions = toSignal(this.institutionService.get(), { initialValue: [] });

  yieldFrequencies = signal([
    { label: 'Diario', value: Frequency.daily },
    { label: 'Semanal', value: Frequency.weekly },
    { label: 'Mensual', value: Frequency.monthly }
  ]);
  
  accountResource = rxResource({
    params:()=> ({id:this.id()}),
    stream:({params}) => {
      const {id} = params;
      if (id == undefined) return of(null);
      return this.accountService.getById(id);
    }
  })
  
  form = this.fb.nonNullable.group({
    name: ['', [
      Validators.required,
      Validators.maxLength(50)
    ]],
    accountTypeId: ['', [Validators.required]],
    currencyId: ['', [Validators.required]],
    institutionId: ['', [Validators.required]],
    color: ['#ff0066', [Validators.required]],
    notes: ['', [Validators.maxLength(100)]],
    investment:  this.fb.group({
      frequency: [Frequency.daily],
      rate: [0],
      maturityDate: [''],
      isCompound: [false],
      retainsIsr: [false],
    }),
  });

  isInvestment = toSignal(
    this.form.get('accountTypeId')!.valueChanges.pipe(
      startWith(this.form.get('accountTypeId')!.value),
      map((id: string) => {
        const type = this.accountTypes().find(t => t.id === id);
        return type?.name.includes('Inversión') ?? false;
      }),
      tap((isInv) => {
        const frequencyCtrl = this.form.get('investment.frequency');
        const rateCtrl = this.form.get('investment.rate');
        const maturityDateCtrl = this.form.get('investment.maturityDate');

        if (isInv) {
          frequencyCtrl?.setValidators([Validators.required]);
          rateCtrl?.setValidators([
            Validators.required,
            Validators.min(0.01)
          ]);
          maturityDateCtrl?.setValidators([MinDateValidator()]);
        } else {
          frequencyCtrl?.clearValidators();
          rateCtrl?.clearValidators();
          maturityDateCtrl?.clearValidators();
        }

        frequencyCtrl?.updateValueAndValidity();
        rateCtrl?.updateValueAndValidity();
        maturityDateCtrl?.updateValueAndValidity();
      })
    ),
    { requireSync: true }
  );
  
  constructor() {
    effect(() => {
      const account = this.accountResource.value();
      const accountTypes = this.accountTypes();
      const currencies = this.currencies();
      const institutions = this.institutions();

      const allLoaded =
        account &&
        accountTypes.length > 0 &&
        currencies.length > 0 &&
        institutions.length > 0;

      if (allLoaded) {
        this.form.patchValue(account as AccountCreate);
      }
    });
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

    const { investment, ...base } = this.form.getRawValue();

    const payload: AccountCreate = {
      ...base,
      investment: this.isInvestment() && investment.maturityDate !== ''
        ? (investment as InvestmentAccount)
        : undefined,
    };

    this.isEdit() && this.id() != undefined
      ? this.accountStore.updateAccount({ account: payload, id: this.id()! })
      : this.accountStore.addAccount(payload);
  }

  handleGoOut(): void {
    this.router.navigate(['/accounts']).then();
  }
}
