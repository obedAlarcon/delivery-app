import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.css',
})
export class RecentOrders {

  orders = [
    {
      id: 1001,
      customer: 'Juan Pérez',
      status: 'Pendiente',
      total: '$45.000'
    },
    {
      id: 1002,
      customer: 'María López',
      status: 'Entregado',
      total: '$28.000'
    },
    {
      id: 1003,
      customer: 'Carlos Díaz',
      status: 'En camino',
      total: '$65.000'
    },
    {
      id: 1004,
      customer: 'Ana Torres',
      status: 'Cancelado',
      total: '$15.000'
    }
  ];

}