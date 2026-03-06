// src/components/(dashboard)/dispensers/[id]/client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IDispenser } from "@/definitions/dispenser";
import { IProduct } from "@/definitions/product";
import { DispenserHeader } from "./header";
import { DispenserSummary } from "./summary";
import { DispenserTabs } from "./tabs";
import DispenserAddForm from "../form";
import DispenserModal from "@/components/ui/modal";
import { DeleteDispenserModal } from "./delete-modal";

export function DispenserDetailsClient({
  dispenser,
  totalUsage,
  product,
}: {
  dispenser: IDispenser;
  totalUsage: number;
  product: IProduct | null;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "usage" | "settings">(
    "info",
  );

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
        <DispenserHeader
          dispenserName={dispenser.name}
          onBack={() => router.back()}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />

        <DispenserSummary
          dispenser={dispenser}
          totalUsage={totalUsage}
          product={product}
        />

        <DispenserTabs
          dispenserId={dispenser.id!}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </motion.div>

      {/* EDIT DISPENSER */}
      <DispenserModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <DispenserAddForm
          dispenser={dispenser}
          onClose={() => {
            setIsEditOpen(false);
            router.refresh();
          }}
        />
      </DispenserModal>

      {/* DELETE DISPENSER */}
      <DeleteDispenserModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        dispenserId={dispenser.id!}
      />
    </>
  );
}
