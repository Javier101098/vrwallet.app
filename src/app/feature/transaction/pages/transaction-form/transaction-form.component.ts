import {CommonModule, Location} from '@angular/common';
import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {AccountStore} from '../../../account/services/account-store.service';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TransactionService} from '../../services/transaction.service';
import {Expense, Income, Transfer} from '../../interfaces/deposit.interface';
import {MessageService} from 'primeng/api';
import {Account} from '../../../account/interfaces/account.interface';
import {FormErrorLabelComponent} from '@shared/components/form-error-label/form-error-label.component';
import {Transaction, Type} from '../../interfaces/transaction.interface';
import {finalize, map, Observable} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {CategoryService} from '@core/services/category.service';
import {AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent,} from 'primeng/autocomplete';
import {Category} from '@core/Interfaces/category.interface';
import {DatePickerModule} from 'primeng/datepicker';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectedBalanceCardComponent} from "../../components/projected-balance-card/projected-balance-card.component";
import {InputCurrencyComponent} from "@shared/components/input-currency/input-currency.component";

@Component({
  selector: 'vrw-transaction-form',
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    SelectButtonModule,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    AutoComplete,
    DatePickerModule,
    ProjectedBalanceCardComponent,
    InputCurrencyComponent,
  ],
  templateUrl: './transaction-form.component.html',
  styles: ``,
})
export default class TransactionFormComponent {
  accountId =  input<string | null>(null);
  
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  accountStore = inject(AccountStore);
  protected readonly Type = Type;

  maxDate = signal<Date>(new Date());
  loading = signal<boolean>(false);
  accountSelected = signal<Account | null>(null);
  filteredCategories = signal<Category[]>([]);
  filteredAccounts = signal<Account[]>([]);
  
  accountParam = computed(()=>{
    console.log(this.accountId())
    const id = this.accountId();
    return id 
      ? this.accountStore.accounts().find((account) => account.id === id) ?? null
      : null;
  })
  
  typeParam = toSignal(
    this.activatedRoute.queryParams.pipe(
      map(({ type }) => {
        const parsed = Number(type);
        return Object.values(Type).includes(parsed)
          ? (parsed as Type)
          : Type.Income;
      }),
    ),
    { initialValue: Type.Income },
  );
  
  categories = toSignal(this.categoryService.get(), {
    initialValue: [],
  });

  form = this.fb.group({
    accountId: ['', Validators.required],
    destinationAccountId: [null],
    categoryId: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    date: ['', Validators.required],
    note: ['', Validators.maxLength(100)],
    payer: ['', Validators.maxLength(100)],
    type: [this.typeParam(), Validators.required],
  });

  stateOptions: { label: string; value: Type }[] = [
    { label: 'Expense', value: Type.Expense },
    { label: 'Income', value: Type.Income },
    { label: 'Transfer', value: Type.Transfer },
  ];

  get currentIncome(): Income {
    return this.form.value as Income;
  }

  get currentTransfer(): Transfer {
    return this.form.getRawValue() as unknown as Transfer;
  }

  get currentExpense(): Expense {
    return this.form.value as Expense;
  }
  
  get amount() : number {
    return this.form.get('amount')?.value ?? 0;
  }
  
  get selectedTransactionType() : Type {
    return this.form.get('type')?.value as Type;
  }

  get buttonClass(): string {
    const type: Type = this.form.get('type')?.value!;

    const statusClasses: Record<Type, string> = {
      [Type.Expense]: 'kt-btn-destructive',
      [Type.Income]: 'bg-green-600',
      [Type.Transfer]: 'kt-btn-primary',
    };

    return statusClasses[type] || 'kt-btn-default';
  }

  constructor(private location: Location) {
    effect(() => {
      const accountByParam = this.accountParam();
      if (accountByParam){
        this.accountSelected.set(this.accountParam());
        this.form.get('accountId')?.setValue(accountByParam.id);
      }else{
        this.accountSelected.set(null);
        this.form.get('accountId')?.setValue('');
      }
      this.form.updateValueAndValidity();
    });
  }

  filterCategory(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    const filter = this.categories().filter((category) =>
      category.name.toLowerCase().startsWith(query),
    );

    this.filteredCategories.set(filter);
  }

  filterAccount(
    event: AutoCompleteCompleteEvent,
    isDestination: boolean = false,
  ) {
    const query = event.query.toLowerCase();

    const type = this.form.get('type')?.value;
    const destinationControl = this.form.get('destinationAccountId');

    if (
      !isDestination &&
      type === Type.Transfer &&
      this.currentTransfer.destinationAccountId
    ) {
      destinationControl?.reset();
    }

    const accounts = this.accountStore.accounts();

    const filtered = accounts.filter((account) => {
      const matchesQuery = account.name.toLowerCase().startsWith(query);
      const validDestination =
        !isDestination || account.id !== this.currentTransfer.accountId;

      return matchesQuery && validDestination;
    });

    this.filteredAccounts.set(filtered);
  }

  handleChangeAccount(account: AutoCompleteSelectEvent) {
    this.accountSelected.set(account.value);
  }

  handleChangeTypeOperation({ value }: any) {
    const destControl = this.form.get('destinationAccountId');
    const categoryControl = this.form.get('categoryId');

    if (value === Type.Transfer) {
      destControl?.setValidators([Validators.required]);
      categoryControl?.clearValidators();
      categoryControl?.setValue(null);
    } else {
      categoryControl?.setValidators([Validators.required]);
      destControl?.clearValidators();
      destControl?.setValue(null);
    }
    destControl?.updateValueAndValidity();
    categoryControl?.updateValueAndValidity();
  }

  handleSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);

    const request$: Record<Type, Observable<Transaction>> = {
      [Type.Expense]: this.transactionService.expense(this.currentExpense),
      [Type.Income]: this.transactionService.add(this.currentIncome),
      [Type.Transfer]: this.transactionService.transfer(this.currentTransfer),
    };

    request$[this.form.get('type')?.value!]
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (transaction: Transaction) => {
          this.messageService.add({
            severity: 'success',
            detail: 'La transaccion se ha llevado acabo con exito.',
          });
          this.accountStore.loadAccounts();
          this.router.navigate(['/accounts', transaction.accountId]).then();
        },
        error: (error: any) => {
          //todo error aplicar interceptor, mensaje de error por cantidad insuficiente
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo problemas al realizar la transaccion',
          });
        },
      });
  }

  handleCancel() {
    this.location.back();
  }
}
