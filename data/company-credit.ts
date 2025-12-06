"use server";

import {
  getCompanyCreditsByCompanyIdService,
  getCompanyCreditTrailByCompanyIdService,
} from "@/services/company-credit";
import { mapCompanyCredit } from "./mapper";

/* -------------------------  MAPPER  ------------------------- */
function companyCreditMap(credit: any) {
  return {
    id: credit._id.toString(),
    companyId: credit.companyId?.toString(),
    type: credit.type, // "credit-updated", "credit-used"
    amount: credit.amount,
    oldBalance: credit.oldBalance,
    newBalance: credit.newBalance,
    note: credit.description, // UI uses "note"
    date: credit.createdAt, // UI uses "date"
  };
}

/* ------------------  PUBLIC FETCH FUNCTION  ------------------ */
export async function getCompanyCreditTrailsByCompanyId(companyId: string) {
  try {
    const credits = await getCompanyCreditTrailByCompanyIdService(companyId);

    // Ensure it's an array
    const list = Array.isArray(credits) ? credits : [];

    return {
      trail: list.map(companyCreditMap),
    };
  } catch (err) {
    console.error("❌ getCompanyCreditTrailsByCompanyId error:", err);
    return {
      limit: 0,
      balance: 0,
      trail: [],
    };
  }
}

export async function getCompanyCreditsByCompanyId(companyId: string) {
  try {
    const credits = await getCompanyCreditsByCompanyIdService(companyId);
    if (!credits) return { success: true, data: [] };

    return {
      success: true,
      data: credits.map(mapCompanyCredit),
    };
  } catch (err: any) {
    console.error("❌ getCompanyCreditsByCompanyId error:", err);
    return { success: false, data: [] };
  }
}
