import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../../../core/services/base.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {
  getAll() {
    throw new Error('Method not implemented.');
  }
  getLowStock(): Observable<Product[]> {
  return this.http.get<Product[]>(this.endpoint + '/low-stock');
}
  private endpoint = `${this.apiUrl}/v1/products`;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.endpoint);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.endpoint}/${id}`);
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.endpoint, product);
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.endpoint}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {

    const formData = new FormData();

    formData.append('image', file);

    return this.http.post<{ imageUrl: string }>(
      `${this.endpoint}/upload`,
      formData
    );

  }

}