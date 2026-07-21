import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe      // ✅
  ],
  templateUrl: './order-table.html',
  styleUrl: './order-table.css'
})
export class OrderTable {

  @Input()
  orders: Order[] = [];

  @Output()
  viewOrder = new EventEmitter<number>();

  @Output()
  editOrder = new EventEmitter<number>();

  @Output()
  deleteOrder = new EventEmitter<number>();

}