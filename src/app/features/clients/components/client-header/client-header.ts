import {
  Component,
  OnInit
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { ClientCartService } from '../../services/client-cart.service';
import { ClientSearchService } from '../../services/client-search.service';


@Component({
  selector: 'app-client-header',
  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './client-header.html',
  styleUrl: './client-header.css',
})
export class ClientHeader implements OnInit {

  // =========================================
  // CARRITO
  // =========================================

  cartCount = 0;


  // =========================================
  // CONSTRUCTOR
  // =========================================

  constructor(
    private cartService: ClientCartService,
    private searchService: ClientSearchService
  ) {}


  // =========================================
  // INICIO
  // =========================================

  ngOnInit(): void {

    this.cartService.cart$
      .subscribe(items => {

        this.cartCount =
          items.reduce(
            (total, item) =>
              total + item.quantity,
            0
          );

      });

  }


  // =========================================
  // BUSCADOR
  // =========================================

  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchService.setSearch(
      input.value
    );

  }

}