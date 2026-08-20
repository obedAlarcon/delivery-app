import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import 'chart.js/auto';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

import { OrderService } from '../../../orders/services/order.service';
import { Order } from '../../../orders/models/order.model';

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
export class SalesChart implements OnInit {
private cdr = inject(ChangeDetectorRef);
  private orderService = inject(OrderService);

  public lineChartType: 'line' = 'line';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Ventas',
        data: [],
        fill: true,
        tension: 0.4
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  ngOnInit(): void {
    this.loadSales();
  }

  private loadSales(): void {

    this.orderService.getOrders().subscribe({

      next: (orders: Order[]) => {

        const labels: string[] = [];
        const sales: number[] = [];

        for (let i = 6; i >= 0; i--) {

          const date = new Date();
          date.setHours(0, 0, 0, 0);
          date.setDate(date.getDate() - i);

          labels.push(
            date.toLocaleDateString('es-CO', {
              day: '2-digit',
              month: 'short'
              
            })
          );

          const total = orders
            .filter(order => {

              const orderDate = new Date(order.createdAt);
              orderDate.setHours(0, 0, 0, 0);

              return orderDate.getTime() === date.getTime();

            })
            .reduce((sum, order) => sum + Number(order.total), 0);

          sales.push(total);
  
        }

        this.lineChartData = {
          labels,
          datasets: [
            {
              label: 'Ventas',
              data: sales,
              fill: true,
              tension: 0.4
            }
          ]
        };
this.cdr.detectChanges();
      },
 
      error: (error) => {
        console.error('Error al cargar ventas:', error);
      }

    });

  }

}