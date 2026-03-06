// src/components/(dashboard)/dispensers/client.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IDispenser } from "@/definitions/dispenser";
import { DispenserHeader } from "./header";
import { DispenserList } from "./list";
import { DispenserTabs, DispenserTab } from "./tabs";
import DispenserModal from "@/components/ui/modal";
import DispenserAddForm from "./form";
import { getDispensers } from "@/data/dispenser";
import DispenserFilter from "./filter";

interface Props {
  initialDispensers: IDispenser[];
}

export function DispenserClientPage({ initialDispensers }: Props) {
  const [dispensers, setDispensers] = useState<IDispenser[]>(
    initialDispensers || [],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDispenser, setEditingDispenser] = useState<IDispenser | null>(
    null,
  );

  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<DispenserTab>("All");

  const fetchDispensers = async () => {
    const res = await getDispensers();
    if (res?.success) setDispensers(res.data || []);
  };

  useEffect(() => {
    fetchDispensers();
  }, []);

  /** ----------------------------------------
   * TAB COUNTS
   ----------------------------------------*/
  const counts = {
    All: dispensers.length,
    Published: dispensers.filter((d) => d.isPublished).length,
    Draft: dispensers.filter((d) => !d.isPublished).length,
  };

  /** ----------------------------------------
   * SEARCH + TAB FILTERING
   ----------------------------------------*/
  const filtered = dispensers
    .filter((d) => `${d.name}`.toLowerCase().includes(filterText.toLowerCase()))
    .filter((d) => {
      if (activeTab === "Published") return d.isPublished === true;
      if (activeTab === "Draft") return d.isPublished === false;
      return true;
    });

  const handleAdd = () => {
    setEditingDispenser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (dispenser: IDispenser) => {
    setEditingDispenser(dispenser);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <DispenserHeader onAdd={handleAdd} />

      {/* TABS + SEARCH ROW */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <DispenserTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          counts={counts}
        />

        <DispenserFilter onFilterChange={(text) => setFilterText(text)} />
      </div>

      <DispenserList
        initialDispensers={filtered}
        onEdit={handleEdit}
        onRefresh={fetchDispensers}
      />

      {/* MODAL */}
      <DispenserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <DispenserAddForm
          dispenser={editingDispenser}
          onClose={() => {
            setIsModalOpen(false);
            fetchDispensers();
          }}
        />
      </DispenserModal>
    </motion.div>
  );
}
