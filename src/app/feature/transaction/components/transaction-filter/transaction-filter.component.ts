import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CardComponent} from '@shared/components/card/card.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {Slider} from 'primeng/slider';
import {AccountStore} from '../../../account/services/account-store.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {CategoryService} from '@core/services/category.service';
import {Transaction, Type} from '../../interfaces/transaction.interface';
import {CurrencyPipe} from '@angular/common';
import {debounceTime, map} from 'rxjs';
import {TransactionFilterRequest} from '../../interfaces/transaction-filter.interface';
import {TransactionStore} from '../../services/transaction-store.service';

@Component({
  selector: 'vrw-transaction-filter',
  imports: [
    CardComponent,
    ReactiveFormsModule,
    Slider,
    DatePicker,
    CurrencyPipe
  ],
  templateUrl: './transaction-filter.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFilterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly accountStore = inject(AccountStore);
  private readonly categoryService = inject(CategoryService);
  private readonly transactionStore = inject(TransactionStore);

  accounts = computed(() => this.accountStore.accounts());
  categories = toSignal(this.categoryService.get(), {
    initialValue: [],
  });
  transactions = signal<Transaction[]>([]);

  recordType: { label: string; value: Type }[] = [
    { label: 'Expense', value: Type.Expense },
    { label: 'Income', value: Type.Income },
    { label: 'Transfer', value: Type.Transfer },
    { label: 'Rendimientos', value: Type.Yield },
  ];

  public readonly form = this.fb.group({
    range: [
      [0, 1000000]
    ],
    accountId:[null],
    categoryId:[null],
    type: [null],
    date: [null],
    amount: [null]
  });

  amountRange = toSignal(
    this.form.controls.range.valueChanges.pipe(
      map((numbers) =>{
        return {
          min: numbers ? numbers[0] : 0,
          max: numbers ? numbers[1] : 0
        }
      })
    ),
    { initialValue: { min: 0, max: 1000000 } }
  );

  constructor() {
    this.form.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(() : void => {
        console.log(this.transactionFilters);
      this.transactionStore.loadTransactions(this.transactionFilters);
    })
  }

  get transactionFilters(): TransactionFilterRequest {
    const { accountId, categoryId, date, amount, range, type } = this.form.getRawValue();

    const [startDate, endDate] = date ?? [];
    const [minPrice, maxPrice] = range ?? [];

    return {
      accountId: accountId ?? null,
      categoryId: categoryId ?? null,
      from: startDate ? new Date(startDate) : null,
      to: endDate ? new Date(endDate) : null,
      amount: amount ? Number(amount) : null,
      type: type ?? null,
      minAmount: minPrice ? Number(minPrice) : null,
      maxAmount: maxPrice ? Number(maxPrice) : null
    };
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];

    const isNumber = /^[0-9]$/.test(event.key);

    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

}
