import {
  getCompanyCreditApprovalByIdService,
  getCompanyCreditApprovalsService,
} from "@/services/company-credit-approval";
import { companyCreditApprovalMap } from "./mapper";

/* ---------------------------------------------------------
 * PUBLIC FUNCTION: getCompanyCreditApprovals
 * ---------------------------------------------------------*/
export async function getCompanyCreditApprovals(
  page = 0,
  pageSize = 12,
  search = "",
  requester = "all",
  fromDate = "",
  toDate = ""
) {
  try {
    const { data, totalCount, stats } = await getCompanyCreditApprovalsService(
      page,
      pageSize,
      search,
      requester,
      fromDate,
      toDate
    );

    return {
      data: data.map(companyCreditApprovalMap),
      totalCount,
      stats,
    };
  } catch (err) {
    console.error("❌ getCompanyCreditApprovals error:", err);
    return { data: [], totalCount: 0, stats: {} };
  }
}

export async function getCompanyCreditApprovalById(id: string) {
  try {
    const approval = await getCompanyCreditApprovalByIdService(id);
    return approval ? companyCreditApprovalMap(approval) : null;
  } catch (err) {
    console.error("❌ getCompanyCreditApprovalById error:", err);
    return null;
  }
}
