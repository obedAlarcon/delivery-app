import { Component, Input, SimpleChanges } from '@angular/core';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-product-table',
    standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css',
})
export class ProductTable {
    @Input() products: Product[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ProductTable recibió:', this.products);

}
}
