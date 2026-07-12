import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api';
import { Order } from '../../models/order.model';


@Injectable({ providedIn: 'root' })
export class OrdersService extends BaseApiService<Order> {
  constructor(http: HttpClient) {
    super(http, 'orders');
  }
}