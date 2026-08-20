import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientSearchService {
   private searchSubject =
    new BehaviorSubject<string>('');

  search$ =
    this.searchSubject.asObservable();


  setSearch(value: string): void {

    this.searchSubject.next(
      value.trim()
    );

  }


  clearSearch(): void {

    this.searchSubject.next('');

  }
}
