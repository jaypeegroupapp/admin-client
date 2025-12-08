// definitions/company-credit-approval.ts
export interface ICompanyCreditApproval {
  id?: string;
  companyCreditId?: string; // reference to CompanyCredit
  creditLimit?: number;
  requester: "Transporter" | "Business" | "Mine";
  reason: string;
  declinedReason?: string;
  status?: "pending" | "approved" | "declined";
  document?: string; // url of uploaded document
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreditApprovalTab = "All" | "Pending" | "Approved" | "Declined";
