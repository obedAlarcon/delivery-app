import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Product } from '../../../products/models/product.model';
import { ClientCartService } from '../../services/client-cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,

  imports: [
    DecimalPipe
  ],

  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

  @Input() product!: Product;

  constructor(
    private cartService: ClientCartService
  ) {}

  //=========================================
  // AGREGAR AL CARRITO
  //=========================================

  addToCart(): void {

    if (this.product.stock <= 0) {
      return;
    }

    this.cartService.addToCart(
      this.product,
      1
    );

    console.log(
      'PRODUCTO AGREGADO AL CARRITO:',
      this.product.name
    );

  }

}