import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../../../core/services/base.service';
import { Supplier } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends BaseService {
  getAll() {
    throw new Error('Method not implemented.');
  }

  private endpoint = `${this.apiUrl}/v1/suppliers`;

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.endpoint);
  }

  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.endpoint}/${id}`);
  }

  create(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.post<Supplier>(this.endpoint, supplier);
  }

  update(id: number, supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.endpoint}/${id}`, supplier);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

}