import { CommonModule } from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { Purchase } from '../../models/purchase.model';


@Component({
  selector: 'app-purchase-table',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './purchase-table.html',
  styleUrl: './purchase-table.css'
})
export class PurchaseTable {


  @Input()
  purchases: Purchase[] = [];



  @Output()
  view =
    new EventEmitter<Purchase>();


  @Output()
  edit =
    new EventEmitter<number>();


  @Output()
  delete =
    new EventEmitter<Purchase>();



  viewPurchase(purchase: Purchase){

    this.view.emit(purchase);

  }



  editPurchase(id:number){

    this.edit.emit(id);

  }



  @Output()
cancel = new EventEmitter<Purchase>();

cancelPurchase(purchase: Purchase){
  this.cancel.emit(purchase);
}

}