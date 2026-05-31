"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ICompany } from "@/definitions/company";
import { CompanyHeader } from "./header";
import { CompanySummary } from "./summary";
import { CompanyTabs } from "./tabs";
import CompanyFormModal from "@/components/ui/modal";
import CompanyEditForm from "../form";
import { DeleteCompanyModal } from "./delete-modal";

export function CompanyDetailsClient({ company }: { company: ICompany }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "trucks" | "orders" | "credit" | "credit-trails" | "products"
  >("orders");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <CompanyHeader
          name={company.name}
          onBack={() => router.back()}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
        <CompanySummary company={company} />
        <CompanyTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          companyId={company.id!}
          debitAmount={company.debitAmount ?? 0}
          discountAmount={company.discountAmount ?? 0}
          isGridPlus={company.isGridPlus ?? false}
        />
      </motion.div>

      {/* EDIT COMPANY MODAL */}
      <CompanyFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <CompanyEditForm
          company={company}
          onClose={() => {
            setIsEditOpen(false);
            router.refresh();
          }}
        />
      </CompanyFormModal>

      {/* DELETE COMPANY MODAL */}
      <DeleteCompanyModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        companyId={company.id!}
      />
    </>
  );
}
