import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { OrderService } from '../../../orders/services/order.service';
import { Order } from '../../../orders/models/order.model';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.css',
})
export class RecentOrders implements OnInit {

  private orderService = inject(OrderService);
 private cdr = inject(ChangeDetectorRef);
  orders: Order[] = [];

  ngOnInit(): void {
    this.loadRecentOrders();
  }

  loadRecentOrders(): void {

    this.orderService.getOrders().subscribe({

      next: (orders) => {

        // Mostrar únicamente los últimos 5 pedidos
        this.orders = orders.slice(0, 5);
this.cdr.detectChanges();
      },

      error: (err) => console.error(err)

    });

  }

}