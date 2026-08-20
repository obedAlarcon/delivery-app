import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../products/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientCartService {

  private readonly cartSubject = new BehaviorSubject<CartItem[]>([]);

  readonly cart$: Observable<CartItem[]> =
    this.cartSubject.asObservable();

  /**
   * Obtener los productos actuales del carrito
   */
  getItems(): CartItem[] {
    return this.cartSubject.value;
  }

  /**
   * Agregar producto al carrito
   */
  addToCart(product: Product, quantity: number = 1): void {

    if (quantity <= 0) {
      return;
    }

    if (product.stock <= 0) {
      return;
    }

    const items = [...this.cartSubject.value];

    const existingItem = items.find(
      item => item.product.id === product.id
    );

    if (existingItem) {

      const newQuantity =
        existingItem.quantity + quantity;

      existingItem.quantity =
        Math.min(newQuantity, product.stock);

    } else {

      items.push({
        product,
        quantity: Math.min(quantity, product.stock)
      });

    }

    this.cartSubject.next(items);
  }

  /**
   * Aumentar cantidad
   */
  increaseQuantity(productId: number): void {

    const items = [...this.cartSubject.value];

    const item = items.find(
      item => item.product.id === productId
    );

    if (!item) {
      return;
    }

    if (item.quantity < item.product.stock) {
      item.quantity++;
    }

    this.cartSubject.next(items);
  }

  /**
   * Disminuir cantidad
   */
  decreaseQuantity(productId: number): void {

    const items = [...this.cartSubject.value];

    const item = items.find(
      item => item.product.id === productId
    );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {

      item.quantity--;

    } else {

      this.removeFromCart(productId);
      return;

    }

    this.cartSubject.next(items);
  }

  /**
   * Eliminar producto
   */
  removeFromCart(productId: number): void {

    const items = this.cartSubject.value.filter(
      item => item.product.id !== productId
    );

    this.cartSubject.next(items);
  }

  /**
   * Vaciar carrito
   */
  clearCart(): void {

    this.cartSubject.next([]);

  }

  /**
   * Cantidad total de unidades
   */
  getTotalItems(): number {

    return this.cartSubject.value.reduce(
      (total, item) => total + item.quantity,
      0
    );

  }

  /**
   * Subtotal
   */
  getSubtotal(): number {

    return this.cartSubject.value.reduce(
      (total, item) =>
        total + (item.product.price * item.quantity),
      0
    );

  }

  /**
   * Total
   *
   * Por ahora es igual al subtotal.
   * Más adelante podemos agregar envío,
   * descuentos o impuestos.
   */
  getTotal(): number {

    return this.getSubtotal();

  }

  /**
   * Saber si el carrito está vacío
   */
  isEmpty(): boolean {

    return this.cartSubject.value.length === 0;

  }

}