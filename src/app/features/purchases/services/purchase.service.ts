import { Injectable, inject } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  environment
} from '../../../../environments/environment';

import {
  Purchase
} from '../models/purchase.model';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  getOne(id: number) {
    throw new Error('Method not implemented.');
  }


  private http = inject(HttpClient);


  private api =
    environment.apiUrl + '/v1/purchases';



  //=========================================
  // LISTAR COMPRAS
  //=========================================

  getPurchases() {

    return this.http.get<Purchase[]>(this.api);

  }



  //=========================================
  // OBTENER COMPRA POR ID
  //=========================================

  getById(id:number) {

    return this.http.get<Purchase>(
      `${this.api}/${id}`
    );

  }



  //=========================================
  // CREAR COMPRA
  //=========================================

  create(data:any) {

    return this.http.post<Purchase>(
      this.api,
      data
    );

  }



  //=========================================
  // ACTUALIZAR COMPRA
  //=========================================

  update(
    id:number,
    data:any
  ) {

    return this.http.patch<Purchase>(
      `${this.api}/${id}`,
      data
    );

  }



  //=========================================
  // ELIMINAR COMPRA
  //=========================================

  delete(id:number) {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }


}