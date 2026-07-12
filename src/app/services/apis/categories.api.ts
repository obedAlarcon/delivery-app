// SERVICIO DE CATEGORÍAS. Hereda del Base.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api';
import { Category } from '../../models/category.model';


@Injectable({ providedIn: 'root' })
export class CategoriesService extends BaseApiService<Category> {
  constructor(http: HttpClient) {
    super(http, 'categories');
  }
}