// /services/company-credit-service.ts
import { connectDB } from "@/lib/db";
import AccountStatementTrail from "@/models/account-statement-trail";
import mongoose, { Types } from "mongoose";
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
      .sort({ createdAt: -1 })
      .limit(10) // newest first
      .lean();

    return credits;
  } catch (err: any) {
    console.error("❌ getCompanyCreditTrailByCompanyIdService error:", err);
    return [];
  }
}

export async function addDebitToCompanyService(
  companyId: string,
  data: AddCreditData
) {
  await connectDB();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const company = await Company.findById(companyId).session(session);
    if (!company) throw new Error("Company not found");

    const companyCredit = await CompanyCredit.findOne({ companyId }).session(
      session
    );
    if (!companyCredit) throw new Error("Company credit not found");

    let payment = data.amount;
    let excess = 0;

    const oldDebitFinal = company.debitAmount - company.usedDebit;

    // -----------------------------------------
    // 1️⃣ PAY DOWN USED CREDIT FIRST
    // -----------------------------------------
    if (companyCredit.usedCredit > 0) {
      if (payment >= companyCredit.usedCredit) {
        // Overpay: clear credit and send excess to debit
        payment -= companyCredit.usedCredit;
        companyCredit.usedCredit = 0;
      } else {
        // Not enough: only reduce credit
        companyCredit.usedCredit -= payment;
        payment = 0;
      }
    }

    // -----------------------------------------
    // 2️⃣ REMAINING PAYMENT GOES TO DEBIT ACCOUNT
    // -----------------------------------------
    if (payment > 0) {
      excess = payment;
      // reset usedDebit and add excess
      company.debitAmount = oldDebitFinal + excess;
      company.usedDebit = 0;
    } else {
      // No excess, just reset usedDebit
      company.debitAmount = oldDebitFinal;
      company.usedDebit = 0;
    }

    const newDebitFinal = company.debitAmount;

    // Save both with transaction
    await companyCredit.save({ session });
    await company.save({ session });

    // -----------------------------------------
    // 3️⃣ ACCOUNT TRAIL
    // -----------------------------------------
    await AccountStatementTrail.create(
      [
        {
          companyId: company._id,
          type: "debit-added",
          amount: data.amount,
          oldBalance: oldDebitFinal,
          newBalance: newDebitFinal,
          description: data.reason || "Debit updated via admin",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      oldDebit: oldDebitFinal,
      newDebit: newDebitFinal,
      appliedToCredit: data.amount - excess,
      excessAddedToDebit: excess,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ addDebitToCompanyService failed:", error);
    throw new Error(error.message || "Failed processing debit payment");
  }
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
