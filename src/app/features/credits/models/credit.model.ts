export interface Credit {
  id?: number;
  orderId: number;
  precioContado: number;
  porcentajeIncremento: number;
  numeroCuotas: number;
  fechaProximoPago: string;
  estado: CreditStatus;
  precioCredito?: number;
  totalCredito: number;
   totalPagado:number;
valorCuota: number;
}

export type CreditStatus = 'Pendiente' | 'Pagado' | 'Vencido';