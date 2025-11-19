// definitions/supplier-invoice.ts

export interface ISupplierInvoice {
  id?: string;
  name: string;
  status: "pending" | "paid" | "closed";
  paymentDate?: string | null;
  invoiceNumber: string;
  invoiceDate: string;
  stockMovementId: string;
  totalAmount?: number;
  productName?: string;
  createdAt?: string;
  updatedAt?: string;
}
