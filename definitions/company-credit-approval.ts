// definitions/company-credit-approval.ts
export interface ICompanyCreditApproval {
  id?: string;
  companyCreditId?: string; // reference to CompanyCredit
  creditLimit?: number;
  requester: "Transporter" | "Business" | "Mine";
  reason: string;
  document?: string; // url of uploaded document
  createdAt?: Date;
  updatedAt?: Date;
}
