"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ICompany } from "@/definitions/company";
import { CompanyHeader } from "./header";
import { CompanySummary } from "./summary";
import { CompanyTabs } from "./tabs";

export function CompanyDetailsClient({ company }: { company: ICompany }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"trucks" | "orders">("orders");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <CompanyHeader
        onBack={() => router.back()}
        companyName={company.companyName}
      />
      <CompanySummary company={company} />
      <CompanyTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        companyId={company.id!}
      />
    </motion.div>
  );
}
