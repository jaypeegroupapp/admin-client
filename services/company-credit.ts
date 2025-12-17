// /services/company-credit-service.ts
import { connectDB } from "@/lib/db";
import AccountStatementTrail from "@/models/account-statement-trail";
import mongoose, { Types } from "mongoose";
import Company from "@/models/company";
import { AddCreditData } from "@/definitions/account-statement-trail";
import CompanyCredit from "@/models/company-credit";
import CompanyCreditApproval from "@/models/company-credit-approval";

export async function getCompanyCreditsService(
  page = 0,
  pageSize = 12,
  search = "",
  status = "all",
  fromDate = "",
  toDate = ""
) {
  await connectDB();

  const term = search.trim();
  const regex = term ? new RegExp(term, "i") : null;

  const match: any = {};

  if (status !== "all") match.status = status;

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) match.createdAt.$lte = new Date(toDate + "T23:59:59.999Z");
  }

  if (term) {
    match.$or = [
      { "company.companyName": { $regex: regex } },
      { "mine.name": { $regex: regex } },
    ];
  }

  const data = await CompanyCredit.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "mines",
        localField: "mineId",
        foreignField: "_id",
        as: "mine",
      },
    },
    { $unwind: { path: "$mine", preserveNullAndEmptyArrays: true } },

    { $match: match },
    { $sort: { createdAt: -1 } },
    { $skip: page * pageSize },
    { $limit: pageSize },
  ]);

  const totalCount = await CompanyCredit.countDocuments(match);

  const statsAgg = await CompanyCredit.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const stats = {
    All: await CompanyCredit.countDocuments(),
    Settled: 0,
    Owing: 0,
  };

  statsAgg.forEach((s) => {
    if (s._id === "settled") stats.Settled = s.count;
    if (s._id === "owing") stats.Owing = s.count;
  });

  return { data, totalCount, stats };
}

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

interface ReceiveCreditPaymentData {
  amount: number;
  paymentDate: string;
  reason?: string;
}

export async function receiveCompanyCreditPaymentService(
  companyCreditId: string,
  data: ReceiveCreditPaymentData
) {
  await connectDB();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const credit = await CompanyCredit.findById(companyCreditId).session(
      session
    );

    if (!credit) throw new Error("Company credit not found");

    const oldUsedCredit = credit.usedCredit;

    // Apply payment
    credit.usedCredit = Math.max(0, credit.usedCredit - data.amount);

    credit.status = credit.usedCredit > 0 ? "owing" : "settled";

    await credit.save({ session });

    // Credit trail
    await AccountStatementTrail.create(
      [
        {
          companyId: credit.companyId,
          mineId: credit.mineId,
          type: "invoice-payment",
          amount: data.amount,
          oldBalance: oldUsedCredit,
          newBalance: credit.usedCredit,
          description: data.reason || "Company credit payment",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      oldUsedCredit,
      newUsedCredit: credit.usedCredit,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ receiveCompanyCreditPaymentService error:", error);
    throw new Error(error.message || "Failed to process credit payment");
  }
}
