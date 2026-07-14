import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe
],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css'
})
export class ProductTable {

  @Input() products: Product[] = [];

  @Output() view = new EventEmitter<Product>();

  @Output() edit = new EventEmitter<number>();

  @Output() delete = new EventEmitter<Product>();


  onView(product: Product): void {

    this.view.emit(product);

  }

  onEdit(id: number): void {

    this.edit.emit(id);

  }

  onDelete(product: Product): void {

    this.delete.emit(product);

  }

}