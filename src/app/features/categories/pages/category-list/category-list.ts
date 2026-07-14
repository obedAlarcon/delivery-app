import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject
} from '@angular/core';

import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import Swal from 'sweetalert2';

import { Category } from '../../models/category.model';

import { CategoryService } from '../../services/category.service';

import { CategoryFilters } from '../../components/category-filters/category-filters';
import { CategoryTable } from '../../components/category-table/category-table';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    CategoryFilters,
    CategoryTable
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList {

  //==============================================
  // Datos
  //==============================================

  categories: Category[] = [];

  allCategories: Category[] = [];

  search = '';

  //==============================================
  // Dependencias
  //==============================================

  private categoryService = inject(CategoryService);

  private cdr = inject(ChangeDetectorRef);

  private destroyRef = inject(DestroyRef);

  private router = inject(Router);

  //==============================================
  // Inicialización
  //==============================================

  ngOnInit(): void {

    this.loadCategories();

  }

  //==============================================
  // Obtener categorías
  //==============================================

  loadCategories(): void {

    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: (categories) => {

          this.allCategories = [...categories];

          this.categories = [...categories];

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  //==============================================
  // Buscar
  //==============================================

  onSearch(value: string): void {

    this.search = value;

    this.applyFilters();

  }

  //==============================================
  // Limpiar
  //==============================================

  clearFilters(): void {

    this.search = '';

    this.categories = [...this.allCategories];

  }

  //==============================================
  // Aplicar filtros
  //==============================================

  applyFilters(): void {

    this.categories = this.allCategories.filter(category =>

      category.name
        .toLowerCase()
        .includes(this.search.toLowerCase())

    );

  }

  //==============================================
  // Editar
  //==============================================

  editCategory(id: number): void {

    this.router.navigate(['/categories/edit', id]);

  }

  //==============================================
  // Eliminar
  //==============================================

  deleteCategory(id: number): void {

    Swal.fire({

      title: '¿Eliminar categoría?',

      text: 'Esta acción no se puede deshacer.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Eliminar',

      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#dc2626',

      cancelButtonColor: '#64748b'

    }).then(result => {

      if (!result.isConfirmed) return;

      this.categoryService.delete(id).subscribe({

        next: () => {

          Swal.fire({

            icon: 'success',

            title: 'Categoría eliminada',

            timer: 1500,

            showConfirmButton: false

          });

          this.loadCategories();

        },

        error: () => {

          Swal.fire({

            icon: 'error',

            title: 'No fue posible eliminar la categoría'

          });

        }

      });

    });

  }

}