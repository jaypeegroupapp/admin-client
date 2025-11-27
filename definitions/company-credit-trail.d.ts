// models/company-credit-trail.ts
export interface ICompanyCreditTrail {
  id?: string;
  companyId?: string;
  type: "credit-updated" | "order-debit" | "invoice-paid" | "admin-adjustment";
  amount: number;
  oldBalance: number;
  newBalance: number;
  description?: string;
  createdAt?: Date;
}

export interface AddCreditData {
  amount: number;
  reason?: string;
  issuedDate?: string | Date;
}
