import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { CategoryForm } from '../../components/category-form/category-form';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [
    CategoryForm
  ],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.css'
})
export class CategoryEdit {

  category: Category | null = null;

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private categoryService = inject(CategoryService);

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.categoryService.getById(id).subscribe({

      next: (category) => {

        this.category = category;

      },

      error: () => {

        Swal.fire({

          icon: 'error',

          title: 'Categoría no encontrada'

        });

        this.router.navigate(['/categories']);

      }

    });

  }

  save(data: any): void {

    if (!this.category) return;

    this.categoryService.update(this.category.id, data).subscribe({

      next: () => {

        Swal.fire({

          icon: 'success',

          title: 'Categoría actualizada',

          timer: 1500,

          showConfirmButton: false

        });

        this.router.navigate(['/categories']);

      },

      error: () => {

        Swal.fire({

          icon: 'error',

          title: 'Error al actualizar'

        });

      }

    });

  }

}