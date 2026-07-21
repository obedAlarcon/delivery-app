import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OrderItem } from '../../models/order-item.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-products',
  standalone: true,
  imports: [
    CommonModule,
        FormsModule
  ],
  templateUrl: './order-products.html',
  styleUrl: './order-products.css'
})
export class OrderProducts {

  @Input()
  items: OrderItem[] = [];

  @Output()
  increaseItem = new EventEmitter<OrderItem>();

  @Output()
  decreaseItem = new EventEmitter<OrderItem>();

  @Output()
  removeItem = new EventEmitter<OrderItem>();
  itemsChange: any;

  get total(): number {

    return this.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

  }
quantityChanged(item: OrderItem): void {

  if (item.quantity < 1) {
    item.quantity = 1;
  }

  item.subtotal = item.quantity * item.price;

}
}