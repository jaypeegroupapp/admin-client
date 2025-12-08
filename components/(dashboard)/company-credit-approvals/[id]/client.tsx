"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ICompanyCreditApproval } from "@/definitions/company-credit-approval";
import { CreditApprovalHeader } from "./header";
import { CreditApprovalSummary } from "./summary";

export function CreditApprovalDetailsClient({
  approval,
}: {
  approval: ICompanyCreditApproval;
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <CreditApprovalHeader onBack={() => router.back()} />

      <CreditApprovalSummary approval={approval} />
    </motion.div>
  );
}
