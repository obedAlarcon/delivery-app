import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
    // Estado del menú
  isOpen = signal(false);

  // Abrir / cerrar
  toggle(): void {
    this.isOpen.update(value => !value);
  }

  // Abrir
  open(): void {
    this.isOpen.set(true);
  }

  // Cerrar
  close(): void {
    this.isOpen.set(false);
  }
}
