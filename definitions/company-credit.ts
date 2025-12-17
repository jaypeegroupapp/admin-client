// definitions/company-credit.ts
export interface ICompanyCredit {
  id?: string;
  companyId?: string;
  mineId?: string;
  creditLimit: number;
  usedCredit: number; // recommended instead of spentSoFar
  status: "settled" | "owing";
  mineName?: string;
  companyName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CompanyCreditState = {
  errors?: {
    creditLimit?: string[];
    mineId?: string[];
    requester?: string[];
    reason?: string[];
    document?: string[];
  };
  message?: string | null;
};
