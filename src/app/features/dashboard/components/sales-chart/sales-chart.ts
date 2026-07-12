import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'chart.js/auto';
import { BaseChartDirective } from 'ng2-charts';

import {
  ChartConfiguration,
  ChartOptions,
  ChartType
} from 'chart.js';

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './sales-chart.html',
  styleUrl: './sales-chart.css'
})
export class SalesChart {

  lineChartType = 'line' as const;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun'
    ],
    datasets: [
      {
        data: [12, 18, 15, 22, 30, 28],
        label: 'Ventas',
        fill: true,
        tension: 0.4
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };

}