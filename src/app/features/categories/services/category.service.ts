import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../../../core/services/base.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  // =====================================================
  // Endpoint del módulo Categorías
  // =====================================================

  private endpoint = `${this.apiUrl}/v1/categories`;

  // =====================================================
  // Obtener todas las categorías
  // GET /categories
  // =====================================================

  getCategories(): Observable<Category[]> {

    return this.http.get<Category[]>(this.endpoint);

  }

  // =====================================================
  // Obtener una categoría por ID
  // GET /categories/:id
  // =====================================================

  getById(id: number): Observable<Category> {

    return this.http.get<Category>(`${this.endpoint}/${id}`);

  }

  // =====================================================
  // Crear categoría
  // POST /categories
  // =====================================================

  create(category: Partial<Category>): Observable<Category> {

    return this.http.post<Category>(this.endpoint, category);

  }

  // =====================================================
  // Actualizar categoría
  // PATCH /categories/:id
  // =====================================================

  update(
    id: number,
    category: Partial<Category>
  ): Observable<Category> {

    return this.http.patch<Category>(
      `${this.endpoint}/${id}`,
      category
    );

  }

  // =====================================================
  // Eliminar categoría
  // DELETE /categories/:id
  // =====================================================

  delete(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.endpoint}/${id}`
    );

  }

}