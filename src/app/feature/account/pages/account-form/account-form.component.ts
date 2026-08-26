import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountTypeService } from '@core/services/account-type.service';
import { CurrencyService } from '@core/services/currency.service';
import { InstitutionService } from '@core/services/institution.service';
import {rxResource, takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { MessageService } from 'primeng/api';
import {CreateAccountRequest, InvestmentAccount} from '../../interfaces/account-create.interface';
import {Credit} from '../../interfaces/credit.interface';
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
import {creditMaxValidator} from "@shared/validators/credit-max.validator";
import {creditSumValidator} from "@shared/validators/credit-sum.validator";
import {Tooltip} from "primeng/tooltip";

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
    Tooltip,
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

  private isSyncingCredit = false;
  private destroyRef = inject(DestroyRef);

  isLoading = this.accountStore.isLoading;
  isEdit = computed(()=>this.id() != undefined);
  isFormCollapsed = signal(false);

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
    credit: this.fb.group({
      creditLimit: [0],
      creditAvailable: [0],
      creditUsed: [0],
      paymentDueDay: [1],
      notifyPayment: [false],
    }),
  });

  isCredit = toSignal(
    this.form.get('accountTypeId')!.valueChanges.pipe(
      startWith(this.form.get('accountTypeId')!.value),
      map((id: string) => {
        const type = this.accountTypes().find(t => t.id === id);
        return type?.name.toLowerCase().includes('crédito') || type?.name.toLowerCase().includes('credito') || false;
      }),
      tap((isCred) => {
        const creditLimitCtrl = this.form.get('credit.creditLimit');
        const creditAvailableCtrl = this.form.get('credit.creditAvailable');
        const creditUsedCtrl = this.form.get('credit.creditUsed');
        const paymentDueDayCtrl = this.form.get('credit.paymentDueDay');
        const notifyPaymentCtrl = this.form.get('credit.notifyPayment');

        if (isCred) {
          creditLimitCtrl?.setValidators([Validators.required, Validators.min(0)]);
          creditAvailableCtrl?.setValidators([
            Validators.required,
            Validators.min(0),
            creditMaxValidator(),
            creditSumValidator(),
          ]);
          creditUsedCtrl?.setValidators([
            Validators.required,
            Validators.min(0),
            creditMaxValidator(),
            creditSumValidator(),
          ]);
          paymentDueDayCtrl?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(31)
          ]);
          notifyPaymentCtrl?.setValidators([Validators.required]);
        } else {
          creditLimitCtrl?.clearValidators();
          creditAvailableCtrl?.clearValidators();
          creditUsedCtrl?.clearValidators();
          paymentDueDayCtrl?.clearValidators();
          notifyPaymentCtrl?.clearValidators();
        }

        creditLimitCtrl?.updateValueAndValidity();
        creditAvailableCtrl?.updateValueAndValidity();
        creditUsedCtrl?.updateValueAndValidity();
        paymentDueDayCtrl?.updateValueAndValidity();
        notifyPaymentCtrl?.updateValueAndValidity();
      })
    ),
    { requireSync: true }
  );

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
    this.setupCreditSync();

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
        this.isSyncingCredit = true;
        this.form.markAllAsTouched();
        this.form.patchValue(account as CreateAccountRequest);
        this.isSyncingCredit = false;
        this.form.get('credit.creditAvailable')?.updateValueAndValidity();
        this.form.get('credit.creditUsed')?.updateValueAndValidity();
      }
    });
  }

  private setupCreditSync(): void {
    const creditLimitCtrl = this.form.get('credit.creditLimit');
    const creditAvailableCtrl = this.form.get('credit.creditAvailable');
    const creditUsedCtrl = this.form.get('credit.creditUsed');

    if (!creditLimitCtrl || !creditAvailableCtrl || !creditUsedCtrl) return;

    creditLimitCtrl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((limitVal) => {
      if (this.isSyncingCredit || !this.isCredit()) return;
      this.isSyncingCredit = true;
      const limit = Number(limitVal) || 0;
      let used = Number(creditUsedCtrl.value) || 0;
      if (used > limit) {
        used = limit;
        creditUsedCtrl.setValue(used, { emitEvent: false });
      }
      const available = Number((Math.max(0, limit - used)).toFixed(2));
      creditAvailableCtrl.setValue(available, { emitEvent: false });
      creditAvailableCtrl.updateValueAndValidity({ emitEvent: false });
      creditUsedCtrl.updateValueAndValidity({ emitEvent: false });
      this.isSyncingCredit = false;
    });

    creditAvailableCtrl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((availVal) => {
      if (this.isSyncingCredit || !this.isCredit()) return;
      this.isSyncingCredit = true;
      const limit = Number(creditLimitCtrl.value) || 0;
      let available = Number(availVal) || 0;
      if (available > limit) {
        available = limit;
        creditAvailableCtrl.setValue(available, { emitEvent: false });
      }
      const used = Number((Math.max(0, limit - available)).toFixed(2));
      creditUsedCtrl.setValue(used, { emitEvent: false });
      creditAvailableCtrl.updateValueAndValidity({ emitEvent: false });
      creditUsedCtrl.updateValueAndValidity({ emitEvent: false });
      this.isSyncingCredit = false;
    });

    creditUsedCtrl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((usedVal) => {
      if (this.isSyncingCredit || !this.isCredit()) return;
      this.isSyncingCredit = true;
      const limit = Number(creditLimitCtrl.value) || 0;
      let used = Number(usedVal) || 0;
      if (used > limit) {
        used = limit;
        creditUsedCtrl.setValue(used, { emitEvent: false });
      }
      const available = Number((Math.max(0, limit - used)).toFixed(2));
      creditAvailableCtrl.setValue(available, { emitEvent: false });
      creditAvailableCtrl.updateValueAndValidity({ emitEvent: false });
      creditUsedCtrl.updateValueAndValidity({ emitEvent: false });
      this.isSyncingCredit = false;
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

    const { investment, credit, ...base } = this.form.getRawValue();

    const payload: CreateAccountRequest = {
      ...base,
      investment: this.isInvestment() && investment.maturityDate !== ''
        ? (investment as InvestmentAccount)
        : undefined,
      credit: this.isCredit()
        ? (credit as Credit)
        : undefined,
    };

    this.isEdit() && this.id() != undefined
      ? this.accountStore.updateAccount({ account: payload, id: this.id()! })
      : this.accountStore.addAccount(payload);
  }

  handleGoOut(): void {
    this.router.navigate(['/accounts']).then();
  }

  toggleFormCollapse(): void {
    this.isFormCollapsed.set(!this.isFormCollapsed());
  }
}
