import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../../../core/services/base.service';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {

  private endpoint = `${this.apiUrl}/v1/customers`;

  getCustomers(): Observable<Customer[]> {

    return this.http.get<Customer[]>(this.endpoint);

  }

  getById(id: number): Observable<Customer> {

    return this.http.get<Customer>(`${this.endpoint}/${id}`);

  }

  create(customer: Partial<Customer>): Observable<Customer> {

    return this.http.post<Customer>(this.endpoint, customer);

  }

  update(id: number, customer: Partial<Customer>): Observable<Customer> {

    return this.http.patch<Customer>(`${this.endpoint}/${id}`, customer);

  }

  delete(id: number): Observable<void> {

    return this.http.delete<void>(`${this.endpoint}/${id}`);

  }

}