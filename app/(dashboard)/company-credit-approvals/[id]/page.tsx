import { notFound } from "next/navigation";
import { getCompanyCreditApprovalById } from "@/data/company-credit-approval";
import { CreditApprovalDetailsClient } from "@/components/(dashboard)/company-credit-approvals/[id]/client";

export default async function CreditApprovalDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const approval = await getCompanyCreditApprovalById(id);
  if (!approval) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <CreditApprovalDetailsClient approval={approval} />
    </div>
  );
}
