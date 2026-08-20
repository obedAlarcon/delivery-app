import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  ClientCartService,
  CartItem
} from '../../services/client-cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,

  imports: [
    CommonModule,
    DecimalPipe,
    RouterLink
  ],

  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  items: CartItem[] = [];

  subtotal = 0;
  total = 0;
  totalItems = 0;

  constructor(
    private cartService: ClientCartService
  ) {}

  ngOnInit(): void {

    this.cartService.cart$
      .subscribe(items => {

        this.items = items;

        this.updateTotals();

      });

  }

  private updateTotals(): void {

    this.subtotal =
      this.cartService.getSubtotal();

    this.total =
      this.cartService.getTotal();

    this.totalItems =
      this.cartService.getTotalItems();

  }

  increase(productId: number): void {

    this.cartService.increaseQuantity(productId);

  }

  decrease(productId: number): void {

    this.cartService.decreaseQuantity(productId);

  }

  remove(productId: number): void {

    this.cartService.removeFromCart(productId);

  }

  clearCart(): void {

    this.cartService.clearCart();

  }

}