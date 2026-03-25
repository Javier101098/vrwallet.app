import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';

import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import {rxResource} from "@angular/core/rxjs-interop";
import {AccountService} from "../../services/account.service";
import {SelectButton} from "primeng/selectbutton";
import {delay} from "rxjs";
import {ProgressSpinner} from "primeng/progressspinner";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  grid :ApexGrid;
  chart: ApexChart;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  annotations: ApexAnnotations
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'vrw-account-summary-chart',
  imports: [ChartComponent, SelectButton, ProgressSpinner],
  templateUrl: './account-summary-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSummaryChartComponent {
  id = input.required<string>();
  color = input.required<string>();
  today = input.required<{ date: string; balance: number }>();
  
  private accountService = inject(AccountService);
  
  stateOptions : { label: string; value: number }[] = [
    { label: '7 dias', value:  7},
    { label: '30 dias', value: 30 },
    { label: '12 semanas', value: 84 },
    { label: '6 meses', value: 182 },
    { label: '1 año', value: 365 },
  ]

  chartOpts = computed<Partial<ChartOptions>>(() => {
    const data = this.dailyBalanceRx.value() || [];

    const normalized = data.length > 0 ? [...data,this.today()] : [];
    
    const seriesData = normalized.map((b) => b.balance)
    const categories = normalized.map((b) => b.date);
    
    return {
      series: [
        {
          color: this.color(),
          name: 'Balance',
          data: seriesData,
        },
      ],
      dataLabels:{
        enabled: false
      },
      chart: {
        selection: {
          enabled: true
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
      tooltip:{
        
      },
      yaxis: {
        min: function(min) { return min * 0.9995 },
        max: function(max) { return max * 1.0005 },
        labels: {
          show: true ,
          formatter: function(value) {
            return "$" + value.toLocaleString('es-MX', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
          }
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        }
      },
      xaxis: {
        categories: categories,
        type: 'datetime',
        labels: {
          format: 'dd MMM'
        }
      },
      annotations:{

      },
      grid:{
        padding: {
          left: 5,
          right: 10
        }
      }
    };
  });
  optionSelected = signal<number>(7);

  changeOption(value: number){
    this.optionSelected.set(value)
  }
  
  dailyBalanceRx = rxResource({
    params: () => ({ 
      id: this.id(),
      days : this.optionSelected()
    }),
    stream: ({ params }) => {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - params.days);
      const startDate = lastWeek.toISOString().split('T')[0];
      return this.accountService.getDailyBalance(params.id, startDate).pipe(delay(1000));
    },
  });
}
