import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { CategoryForm } from '../../components/category-form/category-form';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [
    CategoryForm
  ],
  templateUrl: './category-create.html',
  styleUrl: './category-create.css'
})
export class CategoryCreate {

  private categoryService = inject(CategoryService);

  private router = inject(Router);

  save(category: any): void {

    this.categoryService.create(category).subscribe({

      next: () => {

        Swal.fire({

          icon: 'success',

          title: 'Categoría creada',

          text: 'La categoría fue registrada correctamente.',

          timer: 1800,

          showConfirmButton: false

        });

        this.router.navigate(['/categories']);

      },

      error: () => {

        Swal.fire({

          icon: 'error',

          title: 'Error',

          text: 'No fue posible crear la categoría.'

        });

      }

    });

  }

}