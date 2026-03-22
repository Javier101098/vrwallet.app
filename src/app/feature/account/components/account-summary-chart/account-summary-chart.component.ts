import {Component, computed, inject, input, signal} from '@angular/core';
import { CardComponent } from '@shared/components/card/card.component';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle, ApexDataLabels,
} from 'ng-apexcharts';
import {rxResource} from "@angular/core/rxjs-interop";
import {AccountService} from "../../services/account.service";
import {SelectButton} from "primeng/selectbutton";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'vrw-account-summary-chart',
  imports: [CardComponent, ChartComponent, SelectButton],
  templateUrl: './account-summary-chart.component.html',
})
export class AccountSummaryChartComponent {
  id = input.required<string>();
  color = input.required<string>();

  private accountService = inject(AccountService);
  
  stateOptions : { label: string; value: number }[] = [
    { label: '7 dias', value:  7},
    { label: '30 dias', value: 30 },
    { label: '12 semanas', value: 84 },
    { label: '6 meses', value: 182 },
    { label: '1 año', value: 365 },
  ]

  chartOpts = computed<Partial<ChartOptions>>(() => {
    const data = this.dailyBalanceResource.value() || [];

    const seriesData = data.map((b) => b.balance);
    const categories = data.map((b) => b.date);

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
        stacked: false,
        type: 'area',
        zoom: {
          enabled: false,
        },
        toolbar: {
          autoSelected: "zoom"
        }
      },
      xaxis: {
        categories: categories,
      },
    };
  });
  optionSelected = signal<number>(7);

  changeOption(value: number){
    this.optionSelected.set(value)
  }
  
  dailyBalanceResource = rxResource({
    params: () => ({ 
      id: this.id(),
      days : this.optionSelected()
    }),
    stream: ({ params }) => {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - params.days);
      const startDate = lastWeek.toISOString().split('T')[0];
      return this.accountService.getDailyBalance(params.id, startDate);
    },
  });
}
