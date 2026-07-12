import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatCards } from '../../components/stat-cards/stat-cards';
import { SalesChart } from '../../components/sales-chart/sales-chart';

import { RecentOrders } from '../../components/recent-orders/recent-orders';
import { LowStock } from '../../components/low-stock/low-stock';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [CommonModule,StatCards,SalesChart, RecentOrders,LowStock],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
 admin = 'Administrador';


 cards = [
  { title: 'Productos', value: 235, icon: 'bi-box-seam', color: 'primary' },
  { title: 'Categorías', value: 18, icon: 'bi-tags', color: 'success' },
  { title: 'Pedidos', value: 54, icon: 'bi-cart3', color: 'warning' },
  { title: 'Clientes', value: 120, icon: 'bi-people', color: 'danger' }
];
}
