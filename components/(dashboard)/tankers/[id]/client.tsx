"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ITanker } from "@/definitions/tanker";
import { IProduct } from "@/definitions/product";
import { TankerHeader } from "./header";
import { TankerSummary } from "./summary";
import { TankerTabs } from "./tabs";
import TankerAddForm from "../form";
import TankerModal from "@/components/ui/modal";
import { DeleteTankerModal } from "./delete-modal";

interface ConnectedDispenser {
  id: string;
  name: string;
  currentStock: number;
  isPublished: boolean;
}

export function TankerDetailsClient({
  tanker,
  product,
  connectedDispensers,
}: {
  tanker: ITanker;
  product: IProduct | null | undefined;
  connectedDispensers: ConnectedDispenser[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "info" | "dispensers" | "stock" | "spillage" | "history"
  >("info");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    router.refresh();
    setRefreshKey((prev) => prev + 1);
  }, [router]);

  return (
    <>
      <motion.div
        key={refreshKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <TankerHeader
          tankerName={tanker.name}
          onBack={() => router.back()}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />

        <TankerSummary
          tanker={tanker}
          product={product}
          connectedDispensersCount={connectedDispensers.length}
        />

        <TankerTabs
          tankerId={tanker.id!}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tankerStock={tanker.stockLevel}
          tankerCapacity={tanker.capacity}
          connectedDispensers={connectedDispensers}
          onRefresh={handleRefresh}
        />
      </motion.div>

      <TankerModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <TankerAddForm
          tanker={tanker}
          onClose={() => {
            setIsEditOpen(false);
            handleRefresh();
          }}
        />
      </TankerModal>

      <DeleteTankerModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        tankerId={tanker.id!}
      />
    </>
  );
}
