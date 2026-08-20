export interface Supplier {
  id: number;
  name: string;
  company: string;
  nit: string;
  email: string;
  phone: string;
  address: string;
  contactPerson?: string | null;
  observations?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDto {
  name: string;
  company: string;
  nit: string;
  email: string;
  phone: string;
  address: string;
  contactPerson?: string | null;
  observations?: string | null;
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {
  isActive?: boolean;
}