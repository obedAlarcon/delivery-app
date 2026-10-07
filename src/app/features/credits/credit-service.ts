import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Credit } from './models/credit.model';

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/v1/credits`;

  // Obtener todos los créditos
  getCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl);
  }

  // Obtener un crédito
  getCredit(id: number): Observable<Credit> {
    return this.http.get<Credit>(`${this.apiUrl}/${id}`);
  }

  // Crear crédito
  createCredit(credit: Credit): Observable<Credit> {
    return this.http.post<Credit>(this.apiUrl, credit);
  }

  // Actualizar crédito
  updateCredit(id: number, credit: Partial<Credit>): Observable<Credit> {
    return this.http.patch<Credit>(
      `${this.apiUrl}/${id}`,
      credit
    );
  }

  // Eliminar crédito
  deleteCredit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}