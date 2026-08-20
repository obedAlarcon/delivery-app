import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BaseService } from '../../../core/services/base.service';

import { Tax } from '../models/tax.model';

@Injectable({
  providedIn: 'root'
})
export class TaxService extends BaseService {

  getTaxes(): Observable<Tax[]> {

    return this.http.get<Tax[]>(
      `${this.apiUrl}/v1/taxes`
    );

  }

  getTax(id: number): Observable<Tax> {

    return this.http.get<Tax>(
      `${this.apiUrl}/v1/taxes/${id}`
    );

  }

}