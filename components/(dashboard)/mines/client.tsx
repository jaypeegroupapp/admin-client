"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IMine } from "@/definitions/mine";
import { MineHeader } from "./header";
import MineModal from "@/components/ui/modal";
import MineAddForm from "./add-form";
import { MineList } from "./list";
import MineFilter from "./filter";
import { getMines } from "@/data/mine";

interface Props {
  initialMines: IMine[];
}

export function MinesClientPage({ initialMines }: Props) {
  const [mines, setMines] = useState<IMine[]>(initialMines || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMine, setEditingMine] = useState<IMine | null>(null);
  const [filterText, setFilterText] = useState("");

  const filtered = mines.filter((m) =>
    `${m.name}`.toLowerCase().includes(filterText.toLowerCase())
  );

  const fetchMines = async () => {
    const res = await getMines();
    if (res?.success) setMines(res.data || []);
  };

  useEffect(() => {
    fetchMines();
  }, []);

  const handleAdd = () => {
    setEditingMine(null);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <MineHeader onAdd={handleAdd} />
      <MineFilter onFilterChange={(text) => setFilterText(text)} />
      <MineList initialMines={filtered} />

      <MineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MineAddForm
          mine={editingMine}
          onClose={() => {
            fetchMines();
          }}
        />
      </MineModal>
    </motion.div>
  );
}
