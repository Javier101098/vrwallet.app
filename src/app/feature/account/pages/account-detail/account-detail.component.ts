import { Component, inject, input } from '@angular/core';
import { CardComponent } from '@shared/components/card/card.component';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { AccountService } from '../../services/account.service';
import { CurrencyPipe } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';
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
  styles: ``,
})
export default class AccountDetailComponent {
  public id = input.required<string>();
  
  private accountService = inject(AccountService);

  accountRx = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.accountService.getById(params.id),
  });

  transactionsRx = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.accountService.getTransactions(params.id),
  });
}
