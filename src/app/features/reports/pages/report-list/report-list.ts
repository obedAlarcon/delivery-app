import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Purchase } from '../../../purchases/models/purchase.model';
import { PurchaseService } from '../../../purchases/services/purchase.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../../../orders/models/order.model';
import { OrderService } from '../../../orders/services/order.service';
import * as XLSX from 'xlsx';
import { Inventory } from '../inventory/inventory';
import { Customers } from '../customers/customers';
import { Suppliers } from '../suppliers/suppliers';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
   Inventory,
   Customers,
   Suppliers
  ],
  templateUrl: './report-list.html',
  styleUrl: './report-list.css'
})
export class ReportList {

  // ==========================================
  // Dependencias
  // ==========================================
private cdr = inject(ChangeDetectorRef);
  private orderService = inject(OrderService);

private ngZone = inject(NgZone);
  // ==========================================
  // Filtros
  // ==========================================

  reportType = 'sales';

  dateFrom = '';
  dateTo = '';


  // ==========================================
  // Datos del reporte
  // ==========================================

  orders: Order[] = [];
  purchases: Purchase[] = [];

  loading = false;

  error = '';
private purchaseService = inject(PurchaseService);

  // ==========================================
  // Generar reporte
  // ==========================================
generateReport(): void {
 console.log('TIPO SELECCIONADO:', this.reportType);
   console.log('================================');
  console.log('TIPO SELECCIONADO:', this.reportType);
  console.log('================================');

  this.error = '';
  this.loading = true;

  // ==========================================
  // REPORTE DE VENTAS
  // ==========================================

  if (this.reportType === 'sales') {

    this.orderService.getOrders().subscribe({

      next: (orders) => {

        this.ngZone.run(() => {

          this.orders = this.filterOrdersByDate(orders);

          this.loading = false;

          this.cdr.detectChanges();

        });

      },

      error: (error) => {

        console.error('ERROR EN REPORTE DE VENTAS:', error);

        this.error =
          'No fue posible obtener el reporte de ventas.';

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

    return;
  }


  // ==========================================
  // REPORTE DE COMPRAS
  // ==========================================

  if (this.reportType === 'purchases') {

    this.purchaseService.getPurchases().subscribe({

      next: (purchases) => {

        this.ngZone.run(() => {

          console.log(
            'TOTAL COMPRAS RECIBIDAS:',
            purchases.length
          );

          this.purchases =
            this.filterPurchasesByDate(purchases);

          console.log(
            'COMPRAS DESPUÉS DEL FILTRO:',
            this.purchases
          );

          console.log(
            'CANTIDAD DE COMPRAS:',
            this.purchases.length
          );

          console.log(
            'TOTAL COMPRAS:',
            this.totalPurchases
          );

          this.loading = false;

          this.cdr.detectChanges();

        });

      },

      error: (error) => {

        console.error(
          'ERROR EN REPORTE DE COMPRAS:',
          error
        );

        this.error =
          'No fue posible obtener el reporte de compras.';

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

    return;
  }


  // ==========================================
  // OTROS REPORTES
  // ==========================================

  this.loading = false;

}










// ==========================================
// EXPORTAR COMPRAS A PDF
// ==========================================

exportPurchasesToPDF(): void {

  if (this.purchases.length === 0) {
    return;
  }

  const doc = new jsPDF();

  // ==============================
  // ENCABEZADO
  // ==============================

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');

  doc.text('DELIVERY APP', 14, 20);

  doc.setFontSize(14);

  doc.text('REPORTE DE COMPRAS', 14, 30);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // ==============================
  // PERÍODO
  // ==============================

  let period = 'Todos los registros';

  if (this.dateFrom && this.dateTo) {

    period = `${this.dateFrom} - ${this.dateTo}`;

  } else if (this.dateFrom) {

    period = `Desde ${this.dateFrom}`;

  } else if (this.dateTo) {

    period = `Hasta ${this.dateTo}`;

  }

  doc.text(`Período: ${period}`, 14, 39);


  // ==============================
  // RESUMEN
  // ==============================

  doc.setFont('helvetica', 'bold');

  doc.text(
    `Cantidad de compras: ${this.purchases.length}`,
    14,
    50
  );

  doc.text(
    `Total comprado: $${this.totalPurchases.toLocaleString('es-CO')}`,
    14,
    58
  );


  // ==============================
  // TABLA
  // ==============================

  autoTable(doc, {

    startY: 68,

    head: [[
      'Fecha',
      'Factura',
      'Proveedor',
      'Método de pago',
      'Estado',
      'Total'
    ]],

    body: this.purchases.map(purchase => [

      new Date(
        purchase.createdAt
      ).toLocaleDateString('es-CO'),

      purchase.invoiceNumber,

      purchase.supplier?.company
        || purchase.supplier?.name
        || 'Proveedor no disponible',

      purchase.paymentMethod,

      purchase.status,

      `$${Number(
        purchase.total
      ).toLocaleString('es-CO')}`

    ]),

    foot: [[
      '',
      '',
      '',
      '',
      'TOTAL COMPRAS',
      `$${this.totalPurchases.toLocaleString('es-CO')}`
    ]],

    styles: {
      fontSize: 8
    },

    headStyles: {
      fontStyle: 'bold'
    },

    footStyles: {
      fontStyle: 'bold'
    },

    columnStyles: {

      5: {
        halign: 'right'
      }

    }

  });


  // ==============================
  // PIE
  // ==============================

  const pageHeight =
    doc.internal.pageSize.height;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  doc.text(
    `© ${new Date().getFullYear()} Delivery App`,
    14,
    pageHeight - 10
  );


  // ==============================
  // DESCARGAR
  // ==============================

  const date = new Date()
    .toISOString()
    .split('T')[0];

  doc.save(
    `reporte-compras-${date}.pdf`
  );

}









// ==========================================
// EXPORTAR COMPRAS A EXCEL
// ==========================================

exportPurchasesToExcel(): void {

  if (this.purchases.length === 0) {
    return;
  }

  const data = this.purchases.map(purchase => ({

    Fecha: new Date(
      purchase.createdAt
    ).toLocaleDateString('es-CO'),

    Factura:
      purchase.invoiceNumber,

    Proveedor:
      purchase.supplier?.company
      || purchase.supplier?.name
      || 'Proveedor no disponible',

    'Método de pago':
      purchase.paymentMethod,

    Estado:
      purchase.status,

    Total:
      Number(purchase.total)

  }));


  const worksheet =
    XLSX.utils.json_to_sheet(data);


  const workbook =
    XLSX.utils.book_new();


  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Compras'
  );


  const date = new Date()
    .toISOString()
    .split('T')[0];


  XLSX.writeFile(
    workbook,
    `reporte-compras-${date}.xlsx`
  );

}






  // ==========================================
  // Filtrar pedidos por fecha
  // ==========================================

  private filterOrdersByDate(orders: Order[]): Order[] {

  return orders.filter(order => {

    const orderDate = new Date(order.createdAt);

    // Fecha inicial
    if (this.dateFrom) {

      const [year, month, day] = this.dateFrom
        .split('-')
        .map(Number);

      const fromDate = new Date(
        year,
        month - 1,
        day,
        0,
        0,
        0,
        0
      );

      if (orderDate < fromDate) {
        return false;
      }

    }

    // Fecha final
    if (this.dateTo) {

      const [year, month, day] = this.dateTo
        .split('-')
        .map(Number);

      const toDate = new Date(
        year,
        month - 1,
        day,
        23,
        59,
        59,
        999
      );

      if (orderDate > toDate) {
        return false;
      }

    }

    return true;

  });

}
  // ==========================================
  // Total del reporte
  // ==========================================

  get totalSales(): number {

    return this.orders.reduce(
      (total, order) => total + Number(order.total),
      0
    );

  }
  get totalPurchases(): number {

  return this.purchases.reduce(
    (total, purchase) =>
      total + Number(purchase.total),
    0
  );

}

exportToPDF(): void {

  if (this.orders.length === 0) {
    return;
  }

  const doc = new jsPDF();

  // ==============================
  // ENCABEZADO
  // ==============================

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('DELIVERY APP', 14, 20);

  doc.setFontSize(14);
  doc.text('REPORTE DE VENTAS', 14, 30);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  let period = 'Todos los registros';

  if (this.dateFrom && this.dateTo) {
    period = `${this.dateFrom} - ${this.dateTo}`;
  } else if (this.dateFrom) {
    period = `Desde ${this.dateFrom}`;
  } else if (this.dateTo) {
    period = `Hasta ${this.dateTo}`;
  }

  doc.text(`Período: ${period}`, 14, 39);

  // ==============================
  // RESUMEN
  // ==============================

  doc.setFont('helvetica', 'bold');
  doc.text(`Cantidad de ventas: ${this.orders.length}`, 14, 50);

  doc.text(
    `Total vendido: $${this.totalSales.toLocaleString('es-CO')}`,
    14,
    58
  );

  // ==============================
  // TABLA
  // ==============================

  autoTable(doc, {

    startY: 68,

    head: [[
      'Fecha',
      'Pedido',
      'Cliente',
      'Método de pago',
      'Estado',
      'Total'
    ]],

    body: this.orders.map(order => [

      new Date(order.createdAt).toLocaleDateString('es-CO'),

      `#${order.id}`,

      order.customer?.name || 'Cliente no disponible',

      order.paymentMethod,

      order.status,

      `$${Number(order.total).toLocaleString('es-CO')}`

    ]),

    foot: [[
      '',
      '',
      '',
      '',
      'TOTAL VENTAS',
      `$${this.totalSales.toLocaleString('es-CO')}`
    ]],

    styles: {
      fontSize: 8
    },

    headStyles: {
      fontStyle: 'bold'
    },

    footStyles: {
      fontStyle: 'bold'
    },

    columnStyles: {
      5: {
        halign: 'right'
      }
    }

  });

  // ==============================
  // PIE
  // ==============================

  const pageHeight = doc.internal.pageSize.height;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  doc.text(
    `© ${new Date().getFullYear()} Delivery App`,
    14,
    pageHeight - 10
  );

  // ==============================
  // DESCARGAR
  // ==============================

  const date = new Date()
    .toISOString()
    .split('T')[0];

  doc.save(`reporte-ventas-${date}.pdf`);
}
exportToExcel(): void {

  if (this.orders.length === 0) {
    return;
  }

  const data = this.orders.map(order => ({
    Fecha: new Date(order.createdAt).toLocaleDateString('es-CO'),
    Pedido: `#${order.id}`,
    Cliente: order.customer?.name || 'Cliente no disponible',
    'Método de pago': order.paymentMethod,
    Estado: order.status,
    Total: Number(order.total)
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Ventas'
  );

  const date = new Date()
    .toISOString()
    .split('T')[0];

  XLSX.writeFile(
    workbook,
    `reporte-ventas-${date}.xlsx`
  );
}
private filterPurchasesByDate(
  purchases: Purchase[]
): Purchase[] {

  return purchases.filter(purchase => {

    const purchaseDate =
      new Date(purchase.createdAt);


    // ==========================================
    // FECHA INICIAL
    // ==========================================

    if (this.dateFrom) {

      const [year, month, day] =
        this.dateFrom
          .split('-')
          .map(Number);

      const fromDate = new Date(
        year,
        month - 1,
        day,
        0,
        0,
        0,
        0
      );

      if (purchaseDate < fromDate) {
        return false;
      }

    }


    // ==========================================
    // FECHA FINAL
    // ==========================================

    if (this.dateTo) {

      const [year, month, day] =
        this.dateTo
          .split('-')
          .map(Number);

      const toDate = new Date(
        year,
        month - 1,
        day,
        23,
        59,
        59,
        999
      );

      if (purchaseDate > toDate) {
        return false;
      }

    }

    return true;

  });

}
onReportTypeChange(type: string): void {

  console.log('CAMBIO DE REPORTE:', type);

  this.reportType = type;

  this.orders = [];
  this.purchases = [];
  this.error = '';

}

}