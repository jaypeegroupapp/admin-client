// /services/company-credit-service.ts
import { connectDB } from "@/lib/db";
import CompanyCreditTrail from "@/models/company-credit-trail";
import { Types } from "mongoose";
import Company from "@/models/company";
import { AddCreditData } from "@/definitions/company-credit-trail";

/* ------------------  SERVICE FUNCTION  ------------------ */
export async function getCompanyCreditByCompanyIdService(companyId: string) {
  try {
    await connectDB();

    const credits = await CompanyCreditTrail.find({
      companyId: new Types.ObjectId(companyId),
    })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return credits;
  } catch (err: any) {
    console.error("❌ getCompanyCreditByCompanyIdService error:", err);
    return [];
  }
}

export async function updateCompanyCreditService(
  companyId: string,
  data: AddCreditData
) {
  await connectDB();

  const company = await Company.findById(companyId);
  if (!company) throw new Error("Company not found");

  const oldBalance = company.balance ?? 0;
  const newBalance = oldBalance + data.amount;

  // Update company balances
  company.balance = data.amount;
  company.creditLimit = data.amount;
  await company.save();

  // Record credit trail
  await CompanyCreditTrail.create({
    companyId: company._id,
    type: "credit-updated",
    amount: data.amount,
    oldBalance,
    newBalance,
    description: data.reason || "Credit updated via admin",
  });

  return company;
}
