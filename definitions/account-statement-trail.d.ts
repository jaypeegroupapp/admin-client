
// models/company-credit-trail.ts
export interface IAccountStatementTrail {
  id?: string;
  companyId?: string;
  mineId?: string;
  type:
    | "credit-updated"
    | "order-debit"
    | "invoice-payment"
    | "admin-adjustment";
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
