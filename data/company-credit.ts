"use server";

import { getCompanyCreditByCompanyIdService } from "@/services/company-credit";

/* -------------------------  MAPPER  ------------------------- */
function companyCreditMap(credit: any) {
  return {
    id: credit._id.toString(),
    companyId: credit.companyId?.toString(),
    type: credit.type, // "credit-added", "credit-used"
    amount: credit.amount,
    oldBalance: credit.oldBalance,
    newBalance: credit.newBalance,
    note: credit.description, // UI uses "note"
    date: credit.createdAt, // UI uses "date"
  };
}

/* ------------------  PUBLIC FETCH FUNCTION  ------------------ */
export async function getCompanyCreditsByCompanyId(companyId: string) {
  try {
    const credits = await getCompanyCreditByCompanyIdService(companyId);

    // Ensure it's an array
    const list = Array.isArray(credits) ? credits : [];

    return {
      trail: list.map(companyCreditMap),
    };
  } catch (err) {
    console.error("❌ getCompanyCreditsByCompanyId error:", err);
    return {
      limit: 0,
      balance: 0,
      trail: [],
    };
  }
}
