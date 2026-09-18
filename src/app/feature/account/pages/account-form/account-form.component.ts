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
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountTypeService } from '@core/services/account-type.service';
import { CurrencyService } from '@core/services/currency.service';
import { InstitutionService } from '@core/services/institution.service';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { MessageService } from 'primeng/api';
import { CreateAccountRequest } from '../../interfaces/account-create.interface';
import {CreateCreditRequest} from '../../interfaces/credit.interface';
import { AccountStore } from '../../services/account-store.service';
import { Router } from '@angular/router';
import { ColorPickerModule } from 'primeng/colorpicker';
import { of, startWith } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Select } from 'primeng/select';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { Divider } from 'primeng/divider';
import { SelectButton } from 'primeng/selectbutton';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import { Frequency } from '../../interfaces/yield-frequency';
import { MinDateValidator } from '@shared/validators/min-date.validator';
import { creditMaxValidator } from '@shared/validators/credit-max.validator';
import { creditSumValidator } from '@shared/validators/credit-sum.validator';
import { Tooltip } from 'primeng/tooltip';
import {CreateInvestmentRequest} from '../../interfaces/investment.interface';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountFormComponent {
  id = input<string>();
  protected readonly maxPaymentDueDay = 31;

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private accountTypeService = inject(AccountTypeService);
  private currencyService = inject(CurrencyService);
  private institutionService = inject(InstitutionService);
  private accountStore = inject(AccountStore);
  private messageService = inject(MessageService);
  private router = inject(Router);

  private isSyncingCredit = false;
  private hasPatchedForm = signal(false);
  private destroyRef = inject(DestroyRef);

  isLoading = this.accountStore.isLoading;
  isEdit = computed(() => this.id() != undefined);

  accountTypes = toSignal(this.accountTypeService.get(), { initialValue: [] });
  currencies = toSignal(this.currencyService.get(), { initialValue: [] });
  institutions = toSignal(this.institutionService.get(), { initialValue: [] });

  yieldFrequencies = signal([
    { label: 'Diario', value: Frequency.daily },
    { label: 'Semanal', value: Frequency.weekly },
    { label: 'Mensual', value: Frequency.monthly }
  ]);

  accountResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => {
      const { id } = params;
      if (id == undefined) return of(null);
      return this.accountService.getById(id);
    }
  });

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
    investment: this.fb.group({
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

  private selectedAccountTypeId = toSignal(
    this.form.controls.accountTypeId.valueChanges.pipe(
      startWith(this.form.controls.accountTypeId.value)
    ),
    { requireSync: true }
  );

  private selectedAccountType = computed(() =>
    this.accountTypes().find(t => t.id === this.selectedAccountTypeId())
  );

  isCredit = computed(() =>
    this.matchesTypeName(this.selectedAccountType()?.name, ['crédito', 'credito'])
  );

  isInvestment = computed(() =>
    this.matchesTypeName(this.selectedAccountType()?.name, ['inversión', 'inversion'])
  );

  private matchesTypeName(name: string | undefined, keywords: string[]): boolean {
    if (!name) return false;
    const normalized = name.toLowerCase();
    return keywords.some(keyword => normalized.includes(keyword));
  }

  constructor() {
    this.setupCreditSync();

    effect(() => this.syncCreditValidators(this.isCredit()));
    effect(() => this.syncInvestmentValidators(this.isInvestment()));

    effect(() => {
      if (this.hasPatchedForm()) return;

      const account = this.accountResource.value();
      const accountTypes = this.accountTypes();
      const currencies = this.currencies();
      const institutions = this.institutions();

      const allLoaded =
        account &&
        accountTypes.length > 0 &&
        currencies.length > 0 &&
        institutions.length > 0;

      if (!allLoaded) return;

      this.isSyncingCredit = true;
      this.form.patchValue(account as CreateAccountRequest);
      this.isSyncingCredit = false;
      this.form.get('credit.creditAvailable')?.updateValueAndValidity();
      this.form.get('credit.creditUsed')?.updateValueAndValidity();
      this.hasPatchedForm.set(true);
    });
  }

  private syncCreditValidators(isCredit: boolean): void {
    const validatorsByPath: Record<string, ValidatorFn[]> = {
      'credit.creditLimit': [Validators.required, Validators.min(0)],
      'credit.creditAvailable': [
        Validators.required,
        Validators.min(0),
        creditMaxValidator(),
        creditSumValidator(),
      ],
      'credit.creditUsed': [
        Validators.required,
        Validators.min(0),
        creditMaxValidator(),
        creditSumValidator(),
      ],
      'credit.paymentDueDay': [
        Validators.required,
        Validators.min(1),
        Validators.max(this.maxPaymentDueDay),
      ],
      'credit.notifyPayment': [Validators.required],
    };

    for (const [path, validators] of Object.entries(validatorsByPath)) {
      const control = this.form.get(path);
      control?.setValidators(isCredit ? validators : []);
      control?.updateValueAndValidity({ emitEvent: false });
    }
  }

  private syncInvestmentValidators(isInvestment: boolean): void {
    const frequencyCtrl = this.form.get('investment.frequency');
    const rateCtrl = this.form.get('investment.rate');
    const maturityDateCtrl = this.form.get('investment.maturityDate');

    frequencyCtrl?.setValidators(isInvestment ? [Validators.required] : []);
    rateCtrl?.setValidators(isInvestment ? [Validators.required, Validators.min(0.01)] : []);
    maturityDateCtrl?.setValidators(isInvestment ? [MinDateValidator()] : []);

    frequencyCtrl?.updateValueAndValidity({ emitEvent: false });
    rateCtrl?.updateValueAndValidity({ emitEvent: false });
    maturityDateCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  private setupCreditSync(): void {
    const limitCtrl = this.form.get('credit.creditLimit');
    const availableCtrl = this.form.get('credit.creditAvailable');
    const usedCtrl = this.form.get('credit.creditUsed');

    if (!limitCtrl || !availableCtrl || !usedCtrl) return;

    const recompute = (source: 'limit' | 'available' | 'used'): void => {
      if (this.isSyncingCredit || !this.isCredit()) return;
      this.isSyncingCredit = true;

      const limit = Number(limitCtrl.value) || 0;
      let available = Number(availableCtrl.value) || 0;
      let used = Number(usedCtrl.value) || 0;

      if (source === 'available') {
        available = Math.min(available, limit);
        used = Number((limit - available).toFixed(2));
        availableCtrl.setValue(available, { emitEvent: false });
        usedCtrl.setValue(used, { emitEvent: false });
      } else {
        used = Math.min(used, limit);
        available = Number((limit - used).toFixed(2));
        usedCtrl.setValue(used, { emitEvent: false });
        availableCtrl.setValue(available, { emitEvent: false });
      }

      availableCtrl.updateValueAndValidity({ emitEvent: false });
      usedCtrl.updateValueAndValidity({ emitEvent: false });
      this.isSyncingCredit = false;
    };

    limitCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => recompute('limit'));

    availableCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => recompute('available'));

    usedCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => recompute('used'));
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
      investment: this.isInvestment()
        ? ({
          ...investment,
          maturityDate: investment.maturityDate || undefined,
        } as CreateInvestmentRequest)
        : undefined,
      credit: this.isCredit() ? (credit as CreateCreditRequest) : undefined,
    };

    this.isEdit()
      ? this.accountStore.updateAccount({ account: payload, id: this.id()! })
      : this.accountStore.addAccount(payload);
  }

  handleGoOut(): void {
    void this.router.navigate(['/accounts']);
  }
}
