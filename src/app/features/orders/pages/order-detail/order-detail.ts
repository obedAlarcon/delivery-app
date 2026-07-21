import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';

import { jsPDF } from 'jspdf';

import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetail implements OnInit, OnDestroy {


  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);  // ✅


  private destroy$ = new Subject<void>();

  order: Order | null = null;
  loading = false;

  ngOnInit(): void {
    console.log('Entré a OrderDetail');

    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          const id = Number(params.get('id'));
          console.log('ID recibido:', id);
          this.loading = true;
          return this.orderService.getOrder(id);
        })
      )
      .subscribe({
        next: (order) => {
          console.log('Pedido recibido:', order);
            console.log('ORDER DEL DETALLEgg:', order);
          this.order = order;
          this.loading = false;
          this.cdr.detectChanges();  // ✅ Fuerza la actualización
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();  // ✅
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  editOrder(): void {
    if (!this.order) return;
    this.router.navigate(['/orders/edit', this.order.id]);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pendiente': return 'bg-warning text-dark';
      case 'preparando': return 'bg-info';
      case 'en camino': return 'bg-primary';
      case 'entregado': return 'bg-success';
      case 'cancelado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }


    // ... tus otras funciones (goBack, editOrder, etc)

     // ✅ Función 1: Abre pestaña nueva para descargar PDF
     downloadReceipt(): void {
    if (!this.order) return;
 console.log('ENTRÓ AL PDF');

  alert('Entró al método');

  if (!this.order) {
    alert('No hay pedido');
    return;
  }

  console.log(this.order);
console.log(jsPDF);
    const doc = new jsPDF({ 
      orientation: 'portrait', 
      unit: 'mm', 
      format: [80, 250] 
    });

    let y = 10; 

    // 1. Encabezado
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('MI EMPRESA S.A.S', 40, y, { align: 'center' }); y += 5;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('NIT: 900.123.456-7', 40, y, { align: 'center' }); y += 3;
    doc.text('Dirección de la tienda', 40, y, { align: 'center' }); y += 3;
    doc.text('Tel: 3001234567', 40, y, { align: 'center' }); y += 6;

    // Línea
    doc.setLineDashPattern([1, 1], 0);
    doc.line(5, y, 75, y); y += 5;

    // 2. Pedido
    doc.setFontSize(9);
    doc.text(`Pedido: #${this.order.id}`, 5, y); y += 4;
    doc.text(`Fecha: ${new Date(this.order.createdAt).toLocaleString('es-CO')}`, 5, y); y += 4;
    doc.text(`Vendedor: ${this.order.user?.name || ''}`, 5, y); y += 6;
    doc.line(5, y, 75, y); y += 5;

    // 3. Cliente
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENTE', 5, y); y += 4;
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${this.order.customer?.name || ''}`, 5, y); y += 4;
    doc.text(`Tel: ${this.order.customer?.phone || ''}`, 5, y); y += 4;
    doc.text(`Dir: ${this.order.deliveryAddress || ''}`, 5, y); y += 4;
    doc.text(`Ref: ${this.order.deliveryReference || ''}`, 5, y); y += 6;
    doc.line(5, y, 75, y); y += 5;

    // 4. Encabezado de tabla
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Cant.', 5, y);
    doc.text('Producto', 20, y);
    doc.text('Total', 70, y, { align: 'right' }); y += 1;
    doc.line(5, y, 75, y); y += 3;

    // 5. Detalle de productos (Dibujado manualmente)
    doc.setFont('helvetica', 'normal');
    
    if (this.order.orderDetails && this.order.orderDetails.length > 0) {
      for (const item of this.order.orderDetails) {
        // Por si el nombre del producto es muy largo, lo cortamos a 20 caracteres
        const nombreCorto = (item.product?.name || 'Producto').substring(0, 22);
        
        doc.text(`${item.quantity}x`, 5, y);
        doc.text(nombreCorto, 20, y);
        doc.text(`$${item.subtotal?.toLocaleString('es-CO') || '0'}`, 70, y, { align: 'right' }); 
        y += 4;
      }
    } else {
      doc.text('Sin productos', 20, y); y += 4;
    }

    // 6. Total
    y += 2;
    doc.line(5, y, 75, y); y += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: $${Number(this.order.total).toLocaleString('es-CO')}`, 75, y, { align: 'right' }); y += 6;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Pago: ${this.order.paymentMethod}`, 5, y); y += 10;

    // 7. Footer
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text('¡Gracias por su compra!', 40, y, { align: 'center' }); y += 3;
    doc.text('Doc no valido como factura', 40, y, { align: 'center' });

    // 8. Descargar
    doc.save(`Pedido_${this.order.id}.pdf`);
  }
  printReceipt(): void {

  const contenido = document.getElementById('recibo-imprimir');

  if (!contenido) return;

  const ventana = window.open('', '_blank', 'width=350,height=700');

  ventana?.document.write(`
    <html>
      <head>
        <title>Recibo</title>

        <style>

          body{
            font-family: monospace;
            width:80mm;
            margin:0 auto;
            padding:10px;
            font-size:12px;
          }

          table{
            width:100%;
            border-collapse:collapse;
          }

          td,th{
            padding:2px;
            font-size:11px;
          }

          hr{
            border:none;
            border-top:1px dashed #000;
          }

        </style>

      </head>

      <body>

        ${contenido.innerHTML}

      </body>

    </html>
  `);

  ventana?.document.close();
  ventana?.focus();
  ventana?.print();
  ventana?.close();

}
}