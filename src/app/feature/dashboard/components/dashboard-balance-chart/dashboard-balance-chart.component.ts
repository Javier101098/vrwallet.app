import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ChartComponent} from "ng-apexcharts";
import {SelectButton} from "primeng/selectbutton";
import {ChartOptions} from "../../../account/components/balance-chart/balance-chart.component";
import {FinancialService} from "../../services/financial.service";
import {rxResource} from "@angular/core/rxjs-interop";
import {FormsModule} from "@angular/forms";
import {ProgressSpinner} from "primeng/progressspinner";
import {AccountStore} from "../../../account/services/account-store.service";
import {format} from "date-fns";
import {map} from "rxjs";

@Component({
  selector: 'vrw-dashboard-balance-chart',
  imports: [
    ChartComponent,
    SelectButton,
    FormsModule,
    ProgressSpinner
  ],
  templateUrl: './dashboard-balance-chart.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBalanceChartComponent {
  private financialService = inject(FinancialService);
  private accountStore = inject(AccountStore);
  
  optionSelected = signal<number>(7);
  chartOpts = computed<Partial<ChartOptions>>(() => {
    const data = this.statsResource.value()?.balances || [];
    
    const seriesData = data.map((b) => b.balance);
    const categories = data.map((b) => b.date);

    return {
      series: [
        {
          color: "#1c1c75",
          name: 'Balance',
          data: seriesData,
        },
      ],
      dataLabels: {
        enabled: false,
      },
      chart: {
        selection: {
          enabled: true,
        },
        height: 350,
        width: '100%',
        stacked: false,
        type: 'area',
        zoom: {
          enabled: false,
        },
        toolbar: { show: false },
      },
      tooltip: {},
      yaxis: {
        min: function (min) {
          return min * 0.9995;
        },
        max: function (max) {
          return max * 1.0005;
        },
        labels: {
          show: true,
          formatter: function (value) {
            return (
              '$' +
              value.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            );
          },
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
      },
      xaxis: {
        categories: categories,
        type: 'datetime',
        labels: {
          format: 'dd MMM',
        },
      },
      annotations: {},
      grid: {
        padding: {
          left: 5,
          right: 10,
        },
      },
      stroke:{
        curve: 'monotoneCubic',
        lineCap: 'round',
        width: 4
      },
      plotOptions: {
        bar: {
          borderRadius: 9,
          borderRadiusApplication: 'end', // solo redondea la punta superior
          columnWidth: '60%',
        },
        area:{}
      }
    };
  });
  currentBalance = computed<number>(()=> this.accountStore.balance());
  
  stateOptions: { label: string; value: number }[] = [
    { label: '7 días', value: 7 },
    { label: '30 días', value: 30 },
    { label: '12 semanas', value: 84 },
    { label: '6 meses', value: 182 },
    { label: '1 año', value: 365 },
  ];
  
  statsResource = rxResource({
    params: () => ({ 
      days: this.optionSelected() ?? 7
    }),
    stream: ({params}) => {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - params.days);
      const startDate = lastWeek.toISOString().split('T')[0];
      return this.financialService.getStats(startDate)
        .pipe(
          map((stats) => {
            const date = format(new Date(), 'yyyy-MM-dd');
            stats.balances = [
              ...stats.balances,
              {date:date, balance: this.currentBalance()}
            ];
            return stats;
          })
        )
    }
  })

  changeOption(value: number) {
    this.optionSelected.set(value);
  }
}
