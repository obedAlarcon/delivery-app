export interface Customer {
  id:number;
  name: string;
  email: string;
  phone: string;
  address: string;
  reference?: string | null;
  isActive?: boolean;
}



export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  reference?: string | null;
  isActive?: boolean;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  reference?: string | null;
  isActive?: boolean;
}