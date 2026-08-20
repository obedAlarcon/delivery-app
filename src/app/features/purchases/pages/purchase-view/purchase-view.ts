import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import html2pdf from 'html2pdf.js';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { PurchaseService } from '../../services/purchase.service';
import { Purchase, PurchaseDetail } from '../../models/purchase.model';

@Component({
  selector: 'app-purchase-view',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './purchase-view.html',
  styleUrl: './purchase-view.css'
})
export class PurchaseView implements OnInit {

  private purchaseService = inject(PurchaseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // <-- Agregado

  purchase?: Purchase;
  loading = true;

  ngOnInit(): void {
    
    // <-- CAMBIO CRÍTICO: Usar params en vez de snapshot
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      
      if (id) {
        this.loading = true; // Resetear por si cambian los params
        this.cdr.detectChanges(); // Forzar que el HTML muestre "Cargando..."
        this.loadPurchase(id);
      }
    });
  }

  loadPurchase(id: number) {
    this.purchaseService.getById(id).subscribe({
      next: (data: any) => {
        console.log('CAMPOS:', JSON.stringify(data.purchaseDetails, null, 2));
        this.purchase = data;
        this.loading = false;
        this.cdr.detectChanges(); // <-- Forzar que el HTML se actualice inmediatamente
      },
      error: (error: any) => {
        console.error('Error cargando compra', error);
        this.loading = false;
        this.cdr.detectChanges(); // <-- Forzar actualización aunque sea error
      }
    });
  }

  money(value: number) {
    return new Intl.NumberFormat(
      'es-CO',
      {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }
    ).format(value);
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-CO');
  }

  back() {
    this.router.navigate(['/purchases']);
  }

  // Calcular descuento total
  getBaseSubtotal(): number {
    if (!this.purchase?.purchaseDetails) return 0;
    return this.purchase.purchaseDetails.reduce((sum, d) => {
      return sum + (Number(d.cost) * Number(d.quantity));
    }, 0);
  }

  getTotalDiscount(): number {
    if (!this.purchase?.purchaseDetails) return 0;
    return this.purchase.purchaseDetails.reduce((sum, d) => {
      const base = Number(d.cost) * Number(d.quantity);
      return sum + (base * Number(d.discount) / 100);
    }, 0);
  }

  getTotalTaxes(): number {
    if (!this.purchase?.purchaseDetails) return 0;
    return this.purchase.purchaseDetails.reduce((sum, d) => {
      return sum + Number(d.taxes?.[0]?.amount || 0);
    }, 0);
  }

  getDetailTotal(detail: PurchaseDetail): number {
    return Number(detail.subtotal || 0) + Number(detail.taxes?.[0]?.amount || 0);
  }

  printInvoice(): void {
  window.print();
}




downloadInvoice(): void {

  const invoice = document.querySelector(
    '.invoice-container'
  ) as HTMLElement;

  if (!invoice) {
    return;
  }

  const options = {
    margin: 10,

    filename: `Factura-${this.purchase?.invoiceNumber || 'compra'}.pdf`,

    image: {
      type: 'jpeg' as const,
      quality: 0.98
    },

    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    },

    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const
    },

    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'] as const
    }
  };

  html2pdf()
    .set(options)
    .from(invoice)
    .save();
}

}