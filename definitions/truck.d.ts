// definitions/truck.ts
export interface ITruck {
  id?: string;
  userId?: string;
  companyId?: string;
  plateNumber: string;
  registrationNumber: string;
  vinNumber: string;
  make?: string;
  model?: string;
  year?: number;
  colour?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
