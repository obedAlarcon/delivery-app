export interface Purchase {


  id: number;


  supplierId: number;


  userId: number;


  invoiceNumber: string;


  paymentMethod: string;


  notes?: string | null;


  status: string;


  total: number;


  createdAt: string;




  user?: {

    name: string;

    role: string;

  };




  supplier?: {

    id: number;

    name: string;

    company: string;

    nit?: string;

    contactPerson?: string | null;

  };




  purchaseDetails?: PurchaseDetail[];


}






export interface PurchaseDetail {


  id: number;


  purchaseId: number;


  productId: number;


  quantity: number;


  cost: number;


  discount: number;


  subtotal: number;


  taxAmount: number;





  product?: {


    id: number;

    name: string;


  };





  taxes?: {


    id: number;

    percentage: number;

    amount: number;



    tax?: {


      id: number;

      name: string;


    };


  }[];


}