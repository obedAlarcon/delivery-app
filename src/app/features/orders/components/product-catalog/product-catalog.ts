import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { Product } from '../../../products/models/product.model';
import { ProductService } from '../../../products/services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-catalog',
  standalone:true,
  imports: [FormsModule,
    CurrencyPipe,
    CommonModule
  ],
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.css',
})
export class ProductCatalog {
 @Output()
  addProduct = new EventEmitter<Product>();

  products: Product[] = [];

  filteredProducts: Product[] = [];

  search = '';

  loading = false;

 private productService= inject(ProductService);
 private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadProducts();
    
  }

 loadProducts() {

  this.loading = true;

  this.productService.getProducts().subscribe({

    next: (products) => {

      this.products = products;
      this.filteredProducts = [...products];
      this.loading = false;
  this.cdr.markForCheck();
    },

    error: () => {

      this.loading = false;

    }

  });

}
  filterProducts(): void {

    const value = this.search.toLowerCase().trim();

    if (!value) {

      this.filteredProducts = this.products;

      return;

    }

    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(value)
    );

  }

  add(product: Product): void {

    this.addProduct.emit(product);

  }

}
