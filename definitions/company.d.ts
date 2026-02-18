// /definitions/company.ts
export interface ICompany {
  id?: string;
  userId?: string;
  name: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  billingAddress: string;
  vatNumber?: string;
  invoiceFile?: string; // GridFS ObjectId or file URL
  debitAmount: number;
  discountAmount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
