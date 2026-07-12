import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductFilters } from '../../components/product-filters/product-filters';
import { ProductTable } from '../../components/product-table/product-table';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone:true,
  imports: [ CommonModule,
    ProductFilters,
    ProductTable, ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList  {
  



  id = Math.random();
  constructor(private productService: ProductService) {    console.log('ID ProductList:', this.id);}
      products:Product[]=[];

ngOnInit(): void {
    console.log('ngOnInit:', this.id);
  this.loadProducts();
}

loadProducts() {
  console.log('Antes de pedir:', this.products);

  this.productService.getProducts().subscribe({
    next: (products) => {
      console.log('Respuesta HTTP:', products);
      console.log('Productos recibidos:', products);

      console.log('Primer producto:', products[0]);

      this.products = products;

      console.log('Después de asignar:', this.products);

      queueMicrotask(() => {
        console.log('Microtask:', this.products);
      });

      setTimeout(() => {
        console.log('Timeout:', this.products);
      }, 0);
    },
    error: (err) => console.error(err)
  });
}
}
