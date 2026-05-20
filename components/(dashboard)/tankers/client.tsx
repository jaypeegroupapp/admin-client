"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ITanker } from "@/definitions/tanker";
import { TankerHeader } from "./header";
import { TankerList } from "./list";
import { TankerTabs, TankerTab } from "./tabs";
import TankerModal from "@/components/ui/modal";
import TankerAddForm from "./form";
import { getTankers } from "@/data/tanker";
import TankerFilter from "./filter";

interface Props {
  initialTankers: ITanker[];
}

export function TankerClientPage({ initialTankers }: Props) {
  const [tankers, setTankers] = useState<ITanker[]>(initialTankers || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTanker, setEditingTanker] = useState<ITanker | null>(null);
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<TankerTab>("All");

  const fetchTankers = async () => {
    const res = await getTankers();
    if (res?.success) setTankers(res.data || []);
  };

  useEffect(() => {
    fetchTankers();
  }, []);

  const counts = {
    All: tankers.length,
    Published: tankers.filter((t) => t.isPublished).length,
    Draft: tankers.filter((t) => !t.isPublished).length,
  };

  const filtered = tankers
    .filter((t) => `${t.name}`.toLowerCase().includes(filterText.toLowerCase()))
    .filter((t) => {
      if (activeTab === "Published") return t.isPublished === true;
      if (activeTab === "Draft") return t.isPublished === false;
      return true;
    });

  const handleAdd = () => {
    setEditingTanker(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tanker: ITanker) => {
    setEditingTanker(tanker);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <TankerHeader onAdd={handleAdd} />

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <TankerTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          counts={counts}
        />
        <TankerFilter onFilterChange={(text) => setFilterText(text)} />
      </div>

      <TankerList
        initialTankers={filtered}
        onEdit={handleEdit}
        onRefresh={fetchTankers}
      />

      <TankerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TankerAddForm
          tanker={editingTanker}
          onClose={() => {
            setIsModalOpen(false);
            fetchTankers();
          }}
        />
      </TankerModal>
    </motion.div>
  );
}
