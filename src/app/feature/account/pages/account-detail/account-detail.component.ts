import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';

import { ProgressSpinner } from 'primeng/progressspinner';

import { AccountService } from '../../services/account.service';
import { CardComponent } from '@shared/components/card/card.component';
import { AccountTransactionItemComponent } from '../../components/account-transaction-item/account-transaction-item.component';

@Component({
  selector: 'vrw-account-detail',
  standalone: true,
  imports: [
    CardComponent,
    CurrencyPipe,
    RouterLink,
    ProgressSpinner,
    AccountTransactionItemComponent,
  ],
  templateUrl: './account-detail.component.html',
})
export default class AccountDetailComponent {
  public id = input.required<string>();

  private accountService = inject(AccountService);

  accountResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.accountService.getById(params.id),
  });

  transactionsResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.accountService.getTransactions(params.id),
  });

  summaryResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.accountService.getMonthlySummary(params.id)
  });

  account = computed(() => this.accountResource.value());
  accountStyle = computed(() => {
    const color = this.account()?.color || '#009688';
    return {
      primary: color,
      light: `${color}1A` // 10% opacidad
    };
  });
  currentSummary = computed(() => this.summaryResource.value()?.currentMonth ?? { income: 0, expense: 0 });
  isInitialLoading = computed(() => this.accountResource.isLoading());
}