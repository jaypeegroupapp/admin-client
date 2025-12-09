import { connectDB } from "@/lib/db";
import Company from "@/models/company";
import CompanyCredit from "@/models/company-credit";
import CompanyCreditApproval from "@/models/company-credit-approval";
import AccountStatementTrail from "@/models/account-statement-trail";
import Mine from "@/models/mine";
import mongoose from "mongoose";

/* ---------------------------------------------------------
 * SERVICE (AGGREGATE)
 * ---------------------------------------------------------*/
export async function getCompanyCreditApprovalsService(
  page = 0,
  pageSize = 12,
  search = "",
  status = "all",
  fromDate = "",
  toDate = ""
) {
  await connectDB();

  const term = search.trim();
  const isObjectId = mongoose.Types.ObjectId.isValid(term);
  const termRegex = term ? new RegExp(term, "i") : null;

  /* ----------------------------
   * MATCHES
   * ---------------------------- */
  const match: any = {};

  if (status !== "all") match.status = status;

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) match.createdAt.$lte = new Date(toDate + "T23:59:59.999Z");
  }

  if (term) {
    match.$or = [
      { reason: { $regex: termRegex } },
      { status: { $regex: termRegex } },

      { "company.companyName": { $regex: termRegex } },
      { "mine.name": { $regex: termRegex } },

      // full ObjectId search
      isObjectId ? { _id: new mongoose.Types.ObjectId(term) } : null,

      // ObjectId suffix search
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$_id" },
            regex: term,
            options: "i",
          },
        },
      },
    ].filter(Boolean);
  }

  /* ----------------------------
   * AGGREGATION
   * ---------------------------- */
  const data = await CompanyCreditApproval.aggregate([
    /** JOIN → companyCredits */
    {
      $lookup: {
        from: "companycredits",
        localField: "companyCreditId",
        foreignField: "_id",
        as: "credit",
      },
    },
    { $unwind: { path: "$credit", preserveNullAndEmptyArrays: true } },

    /** JOIN → company */
    {
      $lookup: {
        from: "companies",
        localField: "credit.companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },

    /** JOIN → mine */
    {
      $lookup: {
        from: "mines",
        localField: "credit.mineId",
        foreignField: "_id",
        as: "mine",
      },
    },
    { $unwind: { path: "$mine", preserveNullAndEmptyArrays: true } },

    /** FILTERS */
    { $match: match },

    /** SORT / PAGINATE */
    { $sort: { createdAt: -1 } },
    { $skip: page * pageSize },
    { $limit: pageSize },
  ]);

  const totalCount = await CompanyCreditApproval.countDocuments(match);

  /* ----------------------------
   * STATS
   * ---------------------------- */
  const statsAgg = await CompanyCreditApproval.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const stats = {
    All: await CompanyCreditApproval.countDocuments(),
    Pending: 0,
    Approved: 0,
    Declined: 0,
  };

  statsAgg.forEach((s) => {
    const key = s._id.charAt(0).toUpperCase() + s._id.slice(1);
    if (stats[key as keyof typeof stats] != null)
      stats[key as keyof typeof stats] = s.count;
  });

  return { data, totalCount, stats };
}

export async function getCompanyCreditApprovalByIdService(id: string) {
  await connectDB();

  try {
    let approval = (await CompanyCreditApproval.findById(id)
      .populate({
        path: "companyCreditId",
        model: "CompanyCredit",
        populate: [
          {
            path: "companyId",
            model: Company.modelName,
            select: "companyName",
          },
          {
            path: "mineId",
            model: Mine.modelName,
            select: "name",
          },
        ],
      })
      .lean()) as any;

    if (!approval) return null;

    // 🟦 Restructure to match mapper's expected shape
    approval = {
      ...approval,
      credit: approval.companyCreditId
        ? {
            creditLimit: approval.companyCreditId.creditLimit,
            usedCredit: approval.companyCreditId.usedCredit,
            companyId: approval.companyCreditId.companyId?._id,
            mineId: approval.companyCreditId.mineId?._id,
          }
        : null,

      company: approval.companyCreditId?.companyId
        ? {
            companyName: approval.companyCreditId.companyId.companyName,
          }
        : null,

      mine: approval.companyCreditId?.mineId
        ? {
            name: approval.companyCreditId.mineId.name,
          }
        : null,
    };

    return JSON.parse(JSON.stringify(approval));
  } catch (error) {
    console.error("❌ getCompanyCreditApprovalByIdService error:", error);
    return null;
  }
}

export async function approveCompanyCreditApprovalService(approvalId: string) {
  await connectDB();

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1️⃣ Fetch approval
    const approval = await CompanyCreditApproval.findById(approvalId).session(
      session
    );

    if (!approval) {
      await session.abortTransaction();
      return { success: false, message: "Credit approval not found." };
    }

    if (approval.status !== "pending") {
      await session.abortTransaction();
      return {
        success: false,
        message: "This credit approval request has already been processed.",
      };
    }

    const credit = await CompanyCredit.findById(
      approval.companyCreditId
    ).session(session);

    if (!credit) {
      await session.abortTransaction();
      return {
        success: false,
        message: "This credit does not exist.",
      };
    }

    const oldBalance = credit.creditLimit ?? 0;
    const newBalance = approval.creditLimit!;

    await AccountStatementTrail.create({
      companyId: credit.companyId,
      type: "credit-updated",
      amount: approval.creditLimit!,
      oldBalance,
      newBalance,
      description: "Credit updated via admin",
      mineId: credit.mineId,
    });

    credit.creditLimit = approval.creditLimit!;
    await credit.save({ session });

    // 2️⃣ Update approval → approved
    approval.status = "approved";
    await approval.save({ session });

    // 3️⃣ Commit
    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    console.error(
      "❌ approveCompanyCreditApprovalService transaction error:",
      error
    );

    await session.abortTransaction();
    session.endSession();

    return { success: false, message: "Transaction failed." };
  }
}

export async function declineCompanyCreditApprovalService(
  approvalId: string,
  reason: string
) {
  await connectDB();

  return await CompanyCreditApproval.findByIdAndUpdate(
    approvalId,
    {
      status: "declined",
      declineReason: reason,
      declinedAt: new Date(),
    },
    { new: true }
  ).lean();
}
