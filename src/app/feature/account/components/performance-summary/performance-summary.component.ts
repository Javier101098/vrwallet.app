import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {CardComponent} from '@shared/components/card/card.component';
import {MonthlyYield} from '../../interfaces/account-summary.interface';
import {CurrencyPipe, PercentPipe} from '@angular/common';

@Component({
  selector: 'vrw-performance-summary',
  imports: [
    CardComponent,
    CurrencyPipe,
    PercentPipe,
  ],
  templateUrl: './performance-summary.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceSummaryComponent {
  readonly monthlyYield = input.required<MonthlyYield>();
  readonly colors = input.required<{primary:string,light:string}>()

  readonly monthlyVariation = computed(() => {
    const {current, previous} = this.monthlyYield();
    return (current - previous) / previous;
  });

  readonly isPositive = computed(() => this.monthlyVariation() > 0);
  readonly isNegative = computed(() => this.monthlyVariation() < 0);
  readonly isNeutral  = computed(() => this.monthlyVariation() === 0);


}
