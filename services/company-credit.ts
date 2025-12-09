// /services/company-credit-service.ts
import { connectDB } from "@/lib/db";
import AccountStatementTrail from "@/models/account-statement-trail";
import { Types } from "mongoose";
import Company from "@/models/company";
import { AddCreditData } from "@/definitions/account-statement-trail";
import CompanyCredit from "@/models/company-credit";
import CompanyCreditApproval from "@/models/company-credit-approval";

/* ------------------  SERVICE FUNCTION  ------------------ */
export async function getCompanyCreditTrailByCompanyIdService(
  companyId: string
) {
  try {
    await connectDB();

    const credits = await AccountStatementTrail.find({
      companyId: new Types.ObjectId(companyId),
    })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return credits;
  } catch (err: any) {
    console.error("❌ getCompanyCreditTrailByCompanyIdService error:", err);
    return [];
  }
}

export async function updateCompanyCreditTrailService(
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
  await AccountStatementTrail.create({
    companyId: company._id,
    type: "debit-added",
    amount: data.amount,
    oldBalance,
    newBalance,
    description: data.reason || "Credit updated via admin",
  });

  return company;
}

export async function getCompanyCreditsByCompanyIdService(companyId: string) {
  await connectDB();

  return await CompanyCredit.find({
    companyId: new Types.ObjectId(companyId),
  })
    .populate("mineId") // so we get mine.name
    .lean();
}

export async function updateCompanyCreditService(companyId: string, data: any) {
  await connectDB();

  const { creditId, creditLimit, mineId, requester, reason, document } = data;

  if (creditId) {
    console.log("Updating existing credit record");
    // 🔹 UPDATE existing credit record
    const existingCredit = await CompanyCredit.findOne({
      _id: new Types.ObjectId(creditId),
      companyId: new Types.ObjectId(companyId),
    });

    if (!existingCredit) {
      throw new Error("Credit record not found");
    }

    // Store approval record
    await CompanyCreditApproval.create({
      companyCreditId: existingCredit._id,
      creditLimit,
      requester,
      reason,
      document,
    });

    return existingCredit;
  } else {
    // 🔹 CREATE new credit record
    const companyCredit = await CompanyCredit.create({
      companyId,
      mineId,
    });

    // Store approval record
    await CompanyCreditApproval.create({
      companyCreditId: companyCredit._id,
      creditLimit,
      requester,
      reason,
      document,
    });

    return companyCredit;
  }
}
