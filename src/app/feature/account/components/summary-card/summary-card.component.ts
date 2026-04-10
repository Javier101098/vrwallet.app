import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CardComponent } from '@shared/components/card/card.component';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import {AccountSummary} from "../../interfaces/account-summary.interface";

@Component({
  selector: 'vrw-summary-card',
  imports: [CardComponent, CurrencyPipe, PercentPipe],
  templateUrl: './summary-card.component.html',
  styles: `
    ::ng-deep .p-togglebutton .p-togglebutton-content {
      padding: 5px 0 !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardComponent {
  summary = input.required<AccountSummary>();
  style = input.required<{ primary: string; light: string }>();
  
  currentSummary = computed(
    () =>
      this.summary()?.currentMonth ?? { income: 0, expense: 0 },
  );
  previousSummary = computed(
    () =>
      this.summary()?.previousMonth ?? { income: 0, expense: 0 },
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
