"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IMine } from "@/definitions/mine";
import { MineHeader } from "./header";
import { MineSummary } from "./summary";
import { MineTabs } from "./tabs";
import MineAddForm from "../add-form";
import MineModal from "@/components/ui/modal";
import { DeleteMineModal } from "./delete-modal";

export function MineDetailsClient({ mine }: { mine: IMine }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"info" | "orders">("orders");
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
        <MineHeader
          mineName={mine.name}
          onBack={() => router.back()}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />

        <MineSummary mine={mine} />

        <MineTabs
          mineId={mine.id!}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </motion.div>

      {/* EDIT */}
      <MineModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <MineAddForm
          mine={mine}
          onClose={() => {
            setIsEditOpen(false);
            router.refresh();
          }}
        />
      </MineModal>

      {/* DELETE */}
      <DeleteMineModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        mineId={mine.id!}
      />
    </>
  );
}
