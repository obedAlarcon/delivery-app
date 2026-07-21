import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { ProductService } from '../../../products/services/product.service';
import { Product } from '../../../products/models/product.model';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './low-stock.html',
  styleUrl: './low-stock.css',
})
export class LowStock implements OnInit {

  private productService = inject(ProductService);
 private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];

  ngOnInit(): void {
     console.log('LowStock iniciado');
    this.loadLowStock();
  }

loadLowStock(): void {

  this.productService.getLowStock().subscribe({

    next: (products: Product[]) => {

      console.log('Respuesta:', products);
      console.log('Cantidad:', products.length);

      this.products = products;
 this.cdr.detectChanges();
    },

    error: (err) => console.error(err)

  });

}
 

}