"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IMine } from "@/definitions/mine";
import { MineHeader } from "./header";
import MineModal from "@/components/ui/modal";
import MineAddForm from "./add-form";
import { MineList } from "./list";
import MineFilter from "./filter";
import { MineTabs, MineTab } from "./tabs";
import { getMines } from "@/data/mine";

interface Props {
  initialMines: IMine[];
}

export function MinesClientPage({ initialMines }: Props) {
  const [mines, setMines] = useState<IMine[]>(initialMines || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMine, setEditingMine] = useState<IMine | null>(null);
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<MineTab>("All");

  const fetchMines = async () => {
    const res = await getMines();
    if (res?.success) setMines(res.data || []);
  };

  useEffect(() => {
    fetchMines();
  }, []);

  /** COUNT LOGIC */
  const allCount = mines.length;
  const activeCount = mines.filter((m) => m.isActive).length;
  const inactiveCount = mines.filter((m) => !m.isActive).length;

  /** FILTER LOGIC */
  const filtered = mines
    .filter((m) => `${m.name}`.toLowerCase().includes(filterText.toLowerCase()))
    .filter((m) => {
      if (activeTab === "Active") return m.isActive === true;
      if (activeTab === "Inactive") return m.isActive === false;
      return true;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <MineHeader onAdd={() => setIsModalOpen(true)} />

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* TABS */}
        <MineTabs
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          counts={{
            All: allCount,
            Active: activeCount,
            Inactive: inactiveCount,
          }}
        />

        {/* SEARCH FILTER */}
        <MineFilter onFilterChange={(text) => setFilterText(text)} />
      </div>

      {/* LIST */}
      <MineList initialMines={filtered} />

      {/* MODAL */}
      <MineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MineAddForm
          mine={editingMine}
          onClose={() => {
            fetchMines();
            setIsModalOpen(false);
          }}
        />
      </MineModal>
    </motion.div>
  );
}
