import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CreditService } from '../credit-service';
import { Credit } from '../models/credit.model';

@Component({
  selector: 'app-credit-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './credit-detail.html',
  styleUrl: './credit-detail.css'
})
export class CreditDetail implements OnInit {

  private creditService = inject(CreditService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  credit: Credit | null = null;
  loading = true;

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.loading = false;

      Swal.fire({
        icon: 'error',
        title: 'Crédito no encontrado',
        text: 'No se recibió un ID de crédito válido.'
      });

      this.router.navigate(['/credits']);
      return;
    }

    this.loadCredit(id);
  }

  loadCredit(id: number): void {

    this.loading = true;

    this.creditService.getCredit(id).subscribe({

      next: (credit) => {

        console.log('Crédito:', credit);

        this.credit = credit;
        this.loading = false;

  this.cdr.detectChanges();
      },

                 






      

      error: (err) => {

        console.error('Error cargando crédito:', err);

        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No fue posible cargar la información del crédito.'
        });

        this.router.navigate(['/credits']);
      }

    });
  }

  get saldoPendiente(): number {

    if (!this.credit) {
      return 0;
    }

    return Math.max(
      this.credit.totalCredito - this.credit.totalPagado,
      0
    );
  }
  

  get porcentajePagado(): number {

    if (!this.credit || this.credit.totalCredito <= 0) {
      return 0;
    }

    return Math.min(
      (this.credit.totalPagado / this.credit.totalCredito) * 100,
      100
    );
  }

  get cuotasPagadas(): number {

    if (!this.credit || this.credit.valorCuota <= 0) {
      return 0;
    }

    return Math.floor(
      this.credit.totalPagado / this.credit.valorCuota
    );
  }

  get cuotasPendientes(): number {

    if (!this.credit) {
      return 0;
    }

    return Math.max(
      this.credit.numeroCuotas - this.cuotasPagadas,
      0
    );
  }

  get estadoClase(): string {

    switch (this.credit?.estado) {

      case 'Pagado':
        return 'status-paid';

      case 'Vencido':
        return 'status-overdue';

      default:
        return 'status-pending';
    }
  }

  volver(): void {
    this.router.navigate(['/credits']);
  }




registrarPago(): void {

  console.log('>>> REGISTRAR PAGO EJECUTADO');

  if (!this.credit) {
    console.log('>>> NO HAY CRÉDITO');
    return;
  }

  const credit = this.credit;

  // Convertir DECIMAL de PostgreSQL a números
  const totalCredito = Number(credit.totalCredito);
  const totalPagado = Number(credit.totalPagado);
  const valorCuota = Number(credit.valorCuota);

  console.log('TOTAL CRÉDITO:', totalCredito);
  console.log('TOTAL PAGADO:', totalPagado);
  console.log('VALOR CUOTA:', valorCuota);

  const saldoPendiente =
    totalCredito - totalPagado;

  console.log('SALDO:', saldoPendiente);

  if (saldoPendiente <= 0) {

    Swal.fire({
      icon: 'info',
      title: 'Crédito pagado',
      text: 'Este crédito ya está completamente pagado.'
    });

    return;
  }

  const valorPago = Math.min(
    valorCuota,
    saldoPendiente
  );

  const nuevoTotalPagado =
    totalPagado + valorPago;

  const nuevoEstado =
    nuevoTotalPagado >= totalCredito
      ? 'Pagado'
      : 'Pendiente';

  console.log('VALOR PAGO:', valorPago);
  console.log('NUEVO TOTAL PAGADO:', nuevoTotalPagado);
  console.log('NUEVO ESTADO:', nuevoEstado);

  Swal.fire({

    icon: 'question',

    title: 'Registrar pago',

    html: `
      <p>¿Deseas registrar esta cuota?</p>

      <strong style="font-size: 20px;">
        ${valorPago.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0
        })}
      </strong>
    `,

    showCancelButton: true,

    confirmButtonText: 'Registrar pago',

    cancelButtonText: 'Cancelar',

    confirmButtonColor: '#198754'

  }).then((result) => {

    if (!result.isConfirmed) {
      return;
    }

    this.creditService.updateCredit(

      credit.id!,

      {
        totalPagado: nuevoTotalPagado,
        estado: nuevoEstado
      }

    ).subscribe({

      next: (creditActualizado) => {

        this.credit = creditActualizado;

        this.cdr.detectChanges();

        Swal.fire({

          icon: 'success',

          title: 'Pago registrado',

          text: `Se registró una cuota de ${valorPago.toLocaleString(
            'es-CO',
            {
              style: 'currency',
              currency: 'COP',
              maximumFractionDigits: 0
            }
          )}`,

          confirmButtonColor: '#198754'

        });

      },

      error: (error) => {

        console.error(
          'Error registrando pago:',
          error
        );

        Swal.fire({

          icon: 'error',

          title: 'Error',

          text: 'No fue posible registrar el pago.'

        });

      }

    });

  });

}




}