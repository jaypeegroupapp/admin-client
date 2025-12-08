// definitions/company-credit.ts
export interface ICompanyCredit {
  id?: string;
  companyId?: string;
  mineId?: string;
  creditLimit: number;
  usedCredit: number; // recommended instead of spentSoFar
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
