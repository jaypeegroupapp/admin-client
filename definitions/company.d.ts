// /definitions/company.ts
export interface ICompany {
  id?: string;
  userId?: string;
  companyName: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  billingAddress: string;
  vatNumber?: string;
  invoiceFile?: string; // GridFS ObjectId or file URL
  creditLimit?: number; // Total credit approved
  balance?: number; // Remaining available credit
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
