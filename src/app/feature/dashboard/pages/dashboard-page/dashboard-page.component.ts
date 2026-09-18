import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DashboardBalanceChartComponent
} from "../../components/dashboard-balance-chart/dashboard-balance-chart.component";

@Component({
  selector: 'vrw-dashboard-page',
  imports: [ DashboardBalanceChartComponent],
  templateUrl: './dashboard-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {

}
