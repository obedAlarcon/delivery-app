import { CommonModule } from '@angular/common';

import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';


@Component({
  selector: 'app-purchase-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './purchase-filters.html',
  styleUrl: './purchase-filters.css'
})
export class PurchaseFilters {


  search = '';

  status = '';

@Output()
create = new EventEmitter<void>();
  @Output()
  searchChange =
    new EventEmitter<string>();


  @Output()
  statusChange =
    new EventEmitter<string>();


  @Output()
  clear =
    new EventEmitter<void>();



  onSearch(){

    this.searchChange.emit(this.search);

  }



  onStatusChange(){

    this.statusChange.emit(this.status);

  }



  clearFilters(){

    this.search = '';

    this.status = '';

    this.clear.emit();

  }

goCreate(){

  this.create.emit();

}
}