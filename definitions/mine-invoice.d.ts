export interface IMineInvoice {
  id?: string;
  mineId: string;
  mineName?: string;
  companyId: string;
  companyName?: string;
  status: "pending" | "published" | "paid" | "closed";
  totalAmount: number;
  paymentAmount: number;
  openingBalance: number;
  closingBalance: number;
  paymentDate?: Date;
  createdAt?: string;
  updatedAt?: string;
}

export type InvoiceTab = "All" | "Pending" | "Published" | "Paid" | "Closed";
