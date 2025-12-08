"use server";

import {
  approveCompanyCreditApprovalService,
  declineCompanyCreditApprovalService,
} from "@/services/company-credit-approval";

/* -------------------------------------------------------
 * APPROVE COMPANY CREDIT APPROVAL
 * (with optional transaction wrapper)
 * -----------------------------------------------------*/
export async function approveCompanyCreditApprovalAction(approvalId: string) {
  try {
    const result = await approveCompanyCreditApprovalService(approvalId);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ approveCompanyCreditApprovalAction error:", error);
    return {
      success: false,
      message: "Failed to approve credit request.",
    };
  }
}

/* -------------------------------------------------------
 * DECLINE COMPANY CREDIT APPROVAL
 * -----------------------------------------------------*/
export async function declineCompanyCreditApprovalAction(
  approvalId: string,
  reason: string
) {
  try {
    const result = await declineCompanyCreditApprovalService(
      approvalId,
      reason
    );

    if (!result)
      return { success: false, message: "Credit approval request not found." };

    return { success: true };
  } catch (error) {
    console.error("❌ declineCompanyCreditApprovalAction error:", error);
    return {
      success: false,
      message: "Failed to decline credit approval request.",
    };
  }
}
