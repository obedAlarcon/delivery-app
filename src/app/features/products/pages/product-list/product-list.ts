import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  DestroyRef,
  inject
} from '@angular/core';

import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import Swal from 'sweetalert2';

import { ProductFilters } from '../../components/product-filters/product-filters';
import { ProductTable } from '../../components/product-table/product-table';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

import { CategoryService } from '../../../categories/services/category.service';
import { Category } from '../../../categories/models/category.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductTable,
    ProductFilters
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {

  //=========================================
  // Datos
  //=========================================

  products: Product[] = [];

  allProducts: Product[] = [];

  categories: Category[] = [];

  //=========================================
  // Filtros
  //=========================================

  search = '';

  selectedCategory = 0;

  selectedStatus: boolean | null = null;

  //=========================================
  // Dependencias
  //=========================================

  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

  private cdr = inject(ChangeDetectorRef);

  private destroyRef = inject(DestroyRef);

  private router = inject(Router);

  //=========================================
  // Inicio
  //=========================================

  ngOnInit(): void {

    this.loadCategories();

    this.loadProducts();

  }

  //=========================================
  // Categorías
  //=========================================

  loadCategories(): void {

    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: (categories) => {

          this.categories = [...categories];

          this.cdr.detectChanges();

        },

        error: (err) => console.error(err)

      });

  }

  //=========================================
  // Productos
  //=========================================

  loadProducts(): void {

    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: (products) => {

          this.allProducts = [...products];

          this.products = [...products];

          this.cdr.detectChanges();

        },

        error: (err) => console.error(err)

      });

  }

  //=========================================
  // Buscar
  //=========================================

  onSearch(value: string): void {

    this.search = value;

    this.applyFilters();

  }

  //=========================================
  // Categoría
  //=========================================

  onCategory(id: number): void {

    this.selectedCategory = id;

    this.applyFilters();

  }

  //=========================================
  // Estado
  //=========================================

  onStatus(status: boolean | null): void {

    this.selectedStatus = status;

    this.applyFilters();

  }

  //=========================================
  // Limpiar
  //=========================================

  clearFilters(): void {

    this.search = '';

    this.selectedCategory = 0;

    this.selectedStatus = null;

    this.products = [...this.allProducts];

  }

  //=========================================
  // Aplicar filtros
  //=========================================

  applyFilters(): void {

    this.products = this.allProducts.filter(product => {

      const matchName =
        product.name
          .toLowerCase()
          .includes(this.search.toLowerCase());

      const matchCategory =
        this.selectedCategory === 0 ||
        product.categoryId === this.selectedCategory;

      const matchStatus =
        this.selectedStatus === null ||
        product.isActive === this.selectedStatus;

      return matchName && matchCategory && matchStatus;

    });

  }

  //=========================================
  // Ver producto
  //=========================================

  viewProduct(product: Product): void {

    Swal.fire({

      title: product.name,

      imageUrl: product.imageUrl,

      imageWidth: 220,

      imageHeight: 220,

      html: `
        <p><strong>Descripción</strong></p>
        <p>${product.description}</p>

        <hr>

        <p><strong>Precio:</strong>
        ${product.price.toLocaleString('es-CO')}</p>

        <p><strong>Stock:</strong>
        ${product.stock}</p>

        <p><strong>Categoría:</strong>
        ${product.category ?? 'Sin categoría'}</p>
      `,

      confirmButtonText: 'Cerrar',

      confirmButtonColor: '#2563eb'

    });

  }

  //=========================================
  // Editar
  //=========================================

  editProduct(id: number): void {

    this.router.navigate(['/products/edit', id]);

  }

  //=========================================
  // Eliminar
  //=========================================

  deleteProduct(product: Product): void {

    Swal.fire({

      title: '¿Eliminar producto?',

      text: product.name,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Eliminar',

      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#dc2626',

      cancelButtonColor: '#64748b'

    }).then(result => {

      if (!result.isConfirmed) return;

      this.productService.delete(product.id).subscribe({

        next: () => {

          Swal.fire({

            icon: 'success',

            title: 'Producto eliminado',

            timer: 1500,

            showConfirmButton: false

          });

          this.loadProducts();

        },

        error: () => {

          Swal.fire({

            icon: 'error',

            title: 'No fue posible eliminar el producto'

          });

        }

      });

    });

  }

}