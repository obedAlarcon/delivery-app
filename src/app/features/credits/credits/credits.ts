import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditService } from '../credit-service';
import { Credit } from '../models/credit.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credits.html',
  styleUrl: './credits.css'
})
export class Credits implements OnInit {
private router = inject(Router);
  private creditService = inject(CreditService);
private cdr = inject(ChangeDetectorRef);
  credits: Credit[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCredits();
  }

  // ==========================
  // Cargar créditos
  // ==========================

  loadCredits(): void {

    this.loading = true;
    this.errorMessage = '';

    this.creditService.getCredits().subscribe({

      next: (data) => {

        this.credits = data.map(credit => ({
          ...credit,
          precioCredito: this.calculateCreditPrice(
            credit.precioContado,
            credit.porcentajeIncremento
            
          )
          
        }));

        this.loading = false;
this.cdr.markForCheck();

      },

      error: (error) => {

        console.error('Error al cargar créditos:', error);

        this.errorMessage = 'No se pudieron cargar los créditos.';

        this.loading = false;

      }

    });
  }

  // ==========================
  // Calcular precio a crédito
  // ==========================

  calculateCreditPrice(
    precioContado: number,
    porcentajeIncremento: number
  ): number {

    return precioContado *
      (1 + porcentajeIncremento / 100);
  }
verDetalle(id: number): void {
  this.router.navigate(['/credits', id]);
}
}