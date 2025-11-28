// definitions/company-invoice.ts
export interface ICompanyInvoice {
  id?: string;
  companyId: string;
  companyName?: string;
  status: "pending" | "published" | "paid" | "closed";
  totalAmount: number;
  paymentAmount?: number;
  paymentDate?: string;
  closingBalance?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type InvoiceTab = "All" | "Pending" | "Published" | "Paid" | "Closed";
