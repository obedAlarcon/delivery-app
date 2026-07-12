// Contiene el código genérico HTTP para evitar repetirlo en los demás servicios.
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
;

export abstract class BaseApiService<T> {
  
  constructor(
    protected http: HttpClient, 
    protected endpoint: string
  ) {}

  private get url(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  getAll(): Observable<T[]> { return this.http.get<T[]>(this.url); }
  getById(id: number | string): Observable<T> { return this.http.get<T>(`${this.url}/${id}`); }
  create(data: Partial<T>): Observable<any> { return this.http.post(this.url, data); }
  update(id: number | string, data: Partial<T>): Observable<any> { return this.http.patch(`${this.url}/${id}`, data); }
  delete(id: number | string): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}