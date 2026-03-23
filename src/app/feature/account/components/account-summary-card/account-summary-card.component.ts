import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AccountService } from '../../services/account.service';
import { CardComponent } from '@shared/components/card/card.component';
import { CurrencyPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'vrw-account-summary-card',
  imports: [CardComponent, CurrencyPipe, PercentPipe],
  templateUrl: './account-summary-card.component.html',
  styles: `
    ::ng-deep .p-togglebutton .p-togglebutton-content {
      padding: 5px 0 !important;
    }
  `,
})
export class AccountSummaryCardComponent {
  id = input.required<string>();
  style = input.required<{ primary: string; light: string }>();

  private accountService = inject(AccountService);

  currentSummary = computed(
    () =>
      this.summaryResource.value()?.currentMonth ?? { income: 0, expense: 0 },
  );
  previousSummary = computed(
    () =>
      this.summaryResource.value()?.previousMonth ?? { income: 0, expense: 0 },
  );

  readonly incomeStats = computed(() => {
    const change = this.calculateChange(
      this.currentSummary().income,
      this.previousSummary().income,
    );
    return { change, color: this.getBadgeColor(change) };
  });

  readonly expenseStats = computed(() => {
    const change = this.calculateChange(
      this.currentSummary().expense,
      this.previousSummary().expense,
    );
    return { change, color: this.getBadgeColor(change) };
  });

  summaryResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.accountService.getMonthlySummary(params.id),
  });

  private calculateChange(current: number, previous: number) {
    if (previous === 0) return 0;
    return (current - previous) / previous;
  }

  private getBadgeColor(percentage: number) {
    if (percentage > 0) return this.style().primary;
    if (percentage < 0) return '#ff0000';
    return '#656565';
  }
}
