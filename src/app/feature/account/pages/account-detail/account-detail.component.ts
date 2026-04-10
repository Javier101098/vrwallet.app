import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AccountService } from '../../services/account.service';
import { CardComponent } from '@shared/components/card/card.component';
import { AccountTransactionItemComponent } from '../../components/account-transaction-item/account-transaction-item.component';
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BalanceChartComponent } from '../../components/balance-chart/balance-chart.component';
import { format } from 'date-fns';
import {AccountCardComponent} from "../../components/account-card/account-card.component";
import {AccountSummary} from "../../interfaces/account-summary.interface";

@Component({
  selector: 'vrw-account-detail',
  standalone: true,
  imports: [
    CardComponent,
    RouterLink,
    ProgressSpinner,
    AccountTransactionItemComponent,
    SummaryCardComponent,
    NgApexchartsModule,
    BalanceChartComponent,
    AccountCardComponent,
  ],
  templateUrl: './account-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountDetailComponent {
  public id = input.required<string>();

  private accountService = inject(AccountService);
  
  account = computed<AccountSummary|undefined>(() => this.accountSummaryResource.value());
  isInvestment = computed(() => this.account()?.isInvestment);
  balanceTodayChart = computed(() => {
    const date = format(new Date(), 'yyyy-MM-dd');
    const balance = this.account()?.balance || 0;
    return {      date,
      balance,
    };
  });
  isInitialLoading = computed(() => this.accountSummaryResource.isLoading());
  accountStyle = computed(() => {
    const color = this.account()?.color || '#009688';
    return {
      primary: color,
      light: `${color}1A`,
    };
  });
  
  accountSummaryResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.accountService.getSummary(params.id),
  });

  transactionsResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.accountService.getTransactions(params.id),
  });
}
