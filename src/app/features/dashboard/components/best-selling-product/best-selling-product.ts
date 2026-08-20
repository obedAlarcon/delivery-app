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
  selector: 'app-best-selling-product',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './best-selling-product.html',
  styleUrl: './best-selling-product.css'
})
export class BestSellingProductComponent implements OnInit {
private cdr = inject(ChangeDetectorRef);
  private orderService = inject(OrderService);

  public doughnutChartType: 'doughnut' = 'doughnut';

  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  ngOnInit(): void {
    this.loadBestSellingProducts();
  }

  private loadBestSellingProducts(): void {

    this.orderService.getOrders().subscribe({

      next: (orders: Order[]) => {

        const map = new Map<number, { name: string; quantity: number }>();

        orders.forEach(order => {

          if (!order.orderDetails) return;

          order.orderDetails.forEach(item => {

            if (!item.product) return;

            const existing = map.get(item.product.id);

            if (existing) {

              existing.quantity += item.quantity;

            } else {

              map.set(item.product.id, {

                name: item.product.name,
                quantity: item.quantity

              });

            }

          });

        });

        const topProducts = Array.from(map.values())
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        this.doughnutChartData = {
          labels: topProducts.map(p => p.name),
          datasets: [
            {
              data: topProducts.map(p => p.quantity)
            }
          ]
        };
this.cdr.detectChanges();
      },

      error: error => {
        console.error(error);
      }

    });

  }

}