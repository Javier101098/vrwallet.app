import { ChangeDetectionStrategy, Component } from '@angular/core';
import {BalanceTotalCardComponent} from "@shared/components/balance-total-card/balance-total-card.component";
import {
  DashboardBalanceChartComponent
} from "../../components/dashboard-balance-chart/dashboard-balance-chart.component";

@Component({
  selector: 'vrw-dashboard-page',
  imports: [BalanceTotalCardComponent, DashboardBalanceChartComponent],
  templateUrl: './dashboard-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  
}
