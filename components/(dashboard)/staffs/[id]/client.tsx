"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IStaff } from "@/definitions/staff";
import { StaffHeader } from "./header";
import { StaffSummary } from "./summary";
import { StaffTabs } from "./tabs";
import StaffAddForm from "../add-form";
import StaffModal from "@/components/ui/modal";
import { DeleteStaffModal } from "./delete-modal";

export function StaffDetailsClient({ staff }: { staff: IStaff }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"info" | "mines">("mines");
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
        <StaffHeader
          staffName={staff.name}
          onBack={() => router.back()}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />

        <StaffSummary staff={staff} />

        <StaffTabs
          staffId={staff.id!}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </motion.div>

      {/* EDIT */}
      <StaffModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <StaffAddForm
          staff={staff}
          roles={[]}
          onClose={() => {
            setIsEditOpen(false);
            router.refresh();
          }}
        />
      </StaffModal>

      {/* DELETE */}
      <DeleteStaffModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        staffId={staff.id!}
      />
    </>
  );
}
