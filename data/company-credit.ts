"use server";

import {
  getCompanyCreditsByCompanyIdService,
  getCompanyCreditTrailByCompanyIdService,
} from "@/services/company-credit";
import { mapCompanyCredit } from "./mapper";
import { getCompanyCreditsService } from "@/services/company-credit";
import { ICompanyCredit } from "@/definitions/company-credit";

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

function companiesCreditMap(i: any): ICompanyCredit {
  return {
    id: i._id.toString(),
    companyId: i.companyId?._id.toString(),
    mineId: i.mineId?._id.toString(),

    creditLimit: i.creditLimit,
    usedCredit: i.usedCredit,
    status: i.status || "settled",

    companyName: i.company?.name,
    mineName: i.mine?.name,

    createdAt: i.createdAt,
    updatedAt: i.updatedAt,
  };
}

export async function getCompanyCredits(
  page = 0,
  pageSize = 12,
  search = "",
  status = "all",
  fromDate = "",
  toDate = ""
) {
  try {
    const { data, totalCount, stats } = await getCompanyCreditsService(
      page,
      pageSize,
      search,
      status,
      fromDate,
      toDate
    );

    return {
      data: data.map(companiesCreditMap),
      totalCount,
      stats,
    };
  } catch (err) {
    console.error("❌ getCompanyCredits error:", err);
    return { data: [], totalCount: 0, stats: {} };
  }
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
