import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Order } from '../models/order.model';

@Injectable({

  providedIn: 'root'

})
export class OrderService {

  //==========================================
  // Dependencias
  //==========================================

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/v1/orders`;

  //==========================================
  // Obtener pedidos
  //==========================================

  getOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(this.apiUrl);

  }

  //==========================================
  // Obtener un pedido
  //==========================================

  getOrder(id: number): Observable<Order> {

    return this.http.get<Order>(`${this.apiUrl}/${id}`);

  }

  //==========================================
  // Crear pedido
  //==========================================

  create(order: any): Observable<Order> {

    return this.http.post<Order>(this.apiUrl, order);

  }

  //==========================================
  // Actualizar pedido
  //==========================================

  update(id: number, order: Partial<Order>): Observable<Order> {

    return this.http.patch<Order>(`${this.apiUrl}/${id}`, order);

  }

  //==========================================
  // Eliminar pedido
  //==========================================

  delete(id: number): Observable<void> {

    return this.http.delete<void>(`${this.apiUrl}/${id}`);

  }

}