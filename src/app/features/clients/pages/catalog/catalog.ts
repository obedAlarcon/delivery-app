import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Subscription } from 'rxjs';

import { CategoryFilter } from '../../components/category-filter/category-filter';
import { ProductCard } from '../../components/product-card/product-card';

import { CategoryService } from '../../../categories/services/category.service';
import { ProductService } from '../../../products/services/product.service';

import { ClientSearchService } from '../../services/client-search.service';

import { Product } from '../../../products/models/product.model';


@Component({
  selector: 'app-catalog',
  standalone: true,

  imports: [
    CategoryFilter,
    ProductCard
  ],

  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog
  implements OnInit, OnDestroy {


  // =========================================
  // CATEGORÍAS
  // =========================================

  categories: any[] = [];

  selectedCategory: number | null = null;


  // =========================================
  // BÚSQUEDA
  // =========================================

  searchTerm = '';


  // =========================================
  // PRODUCTOS
  // =========================================

  products: Product[] = [];

  allProducts: Product[] = [];


  // =========================================
  // SUSCRIPCIÓN
  // =========================================

  private searchSubscription?: Subscription;


  // =========================================
  // SERVICIOS
  // =========================================

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private searchService: ClientSearchService
  ) {}


  // =========================================
  // INICIO
  // =========================================

  ngOnInit(): void {

    this.loadCategories();

    this.loadProducts();


    // =======================================
    // ESCUCHAR BUSCADOR
    // =======================================

    this.searchSubscription =
      this.searchService.search$
        .subscribe(search => {

          this.searchTerm =
            search.toLowerCase().trim();

          this.applyFilters();

        });

  }


  // =========================================
  // DESTRUIR
  // =========================================

  ngOnDestroy(): void {

    this.searchSubscription?.unsubscribe();

  }


  // =========================================
  // CATEGORÍAS
  // =========================================

  loadCategories(): void {

    this.categoryService
      .getCategories()
      .subscribe({

        next: (categories) => {

          this.categories =
            [...categories];

        },

        error: (error) => {

          console.error(
            'ERROR CARGANDO CATEGORÍAS:',
            error
          );

        }

      });

  }


  // =========================================
  // PRODUCTOS
  // =========================================

  loadProducts(): void {

    this.productService
      .getProducts()
      .subscribe({

        next: (products) => {

          this.allProducts =
            [...products];

          this.applyFilters();

        },

        error: (error) => {

          console.error(
            'ERROR CARGANDO PRODUCTOS:',
            error
          );

        }

      });

  }


  // =========================================
  // CAMBIO DE CATEGORÍA
  // =========================================

  onCategoryChange(
    categoryId: number | null
  ): void {

    this.selectedCategory =
      categoryId;

    this.applyFilters();

  }


  // =========================================
  // APLICAR FILTROS
  // =========================================

  private applyFilters(): void {

    let filteredProducts =
      [...this.allProducts];


    // =======================================
    // CATEGORÍA
    // =======================================

    if (
      this.selectedCategory !== null
    ) {

      filteredProducts =
        filteredProducts.filter(
          product =>
            product.categoryId ===
            this.selectedCategory
        );

    }


    // =======================================
    // BUSCADOR
    // =======================================

    if (this.searchTerm) {

      filteredProducts =
        filteredProducts.filter(
          product => {

            const name =
              product.name
                ?.toLowerCase()
                .trim() ?? '';

            return name.includes(
              this.searchTerm
            );

          }
        );

    }


    // =======================================
    // RESULTADO
    // =======================================

    this.products =
      filteredProducts;

  }

}