// definitions/company-credit-approval.ts
export interface ICompanyCreditDisableReason {
  id?: string;
  companyCreditId?: string;
  requester: "Transporter" | "Business" | "Mine";
  reason: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreditDisableTab = "All" | "Pending" | "Disabled";
