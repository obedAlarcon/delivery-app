import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { User } from '../models/user.model';
import { BaseService } from '../../../core/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  private endpoint = `${this.apiUrl}/v1/user`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoint);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.endpoint, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.endpoint}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}