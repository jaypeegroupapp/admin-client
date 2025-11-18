// definitions/company-invoice.ts
export interface ICompanyInvoice {
  id?: string;
  companyId: string;
  companyName?: string;
  status: "pending" | "published" | "paid" | "closed";
  totalAmount: number;
  paymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
