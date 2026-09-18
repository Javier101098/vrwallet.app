import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid, ApexPlotOptions, ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { rxResource } from '@angular/core/rxjs-interop';
import { AccountService } from '../../services/account.service';
import { SelectButton } from 'primeng/selectbutton';
import { ProgressSpinner } from 'primeng/progressspinner';
import {FormsModule} from "@angular/forms";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  grid: ApexGrid;
  chart: ApexChart;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  annotations: ApexAnnotations;
  dataLabels: ApexDataLabels;
  stroke:ApexStroke,
  plotOptions:ApexPlotOptions
};

@Component({
  selector: 'vrw-balance-chart',
  imports: [ChartComponent, SelectButton, ProgressSpinner, FormsModule],
  templateUrl: './balance-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceChartComponent {
  id = input.required<string>();
  color = input.required<string>();
  today = input.required<{ date: string; balance: number }>();

  private accountService = inject(AccountService);

  stateOptions: { label: string; value: number }[] = [
    { label: '7 días', value: 7 },
    { label: '30 días', value: 30 },
    { label: '12 semanas', value: 84 },
    { label: '6 meses', value: 182 },
    { label: '1 año', value: 365 },
  ];

  chartOpts = computed<Partial<ChartOptions>>(() => {
    const data = this.balanceHistoryRx.value() || [];

    const normalized = data.length > 0 ? [...data, this.today()] : [];

    const seriesData = normalized.map((b) => b.balance);
    const categories = normalized.map((b) => b.date);

    return {
      series: [
        {
          color: this.color(),
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
  optionSelected = signal<number>(7);

  changeOption(value: number) {
    this.optionSelected.set(value);
  }

  balanceHistoryRx = rxResource({
    params: () => ({
      id: this.id(),
      days: this.optionSelected() ?? 7,
    }),
    stream: ({ params }) => {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - params.days);
      const startDate = lastWeek.toISOString().split('T')[0];
      return this.accountService
        .getBalanceHistory(params.id, startDate)
    },
  });
}
