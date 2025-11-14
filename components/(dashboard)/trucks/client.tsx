// components/(dashboard)/trucks/client.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ITruck } from "@/definitions/truck";
import { TruckHeader } from "./header";
import TruckModal from "@/components/ui/modal";
import TruckAddForm from "./add-form";
import { TruckList } from "./list";
import TruckFilter from "./filter";
import { deleteTruckAction } from "@/actions/truck";
import { getTrucks } from "@/data/truck";
import DeleteModal from "@/components/ui/delete-modal";

interface Props {
  initialTrucks: ITruck[];
}

export function TruckClientPage({ initialTrucks }: Props) {
  const [trucks, setTrucks] = useState<ITruck[]>(initialTrucks || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<ITruck | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTruck, setDeletingTruck] = useState<ITruck | null>(null);

  const [filterText, setFilterText] = useState("");

  const filtered = trucks.filter((t) =>
    `${t.plateNumber} ${t.make || ""} ${t.model || ""}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const fetchTrucks = async () => {
    const res = await getTrucks();
    setTrucks(res || []);
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleAdd = () => {
    setEditingTruck(null);
    setIsModalOpen(true);
  };

  const handleEdit = (truck: ITruck) => {
    setEditingTruck(truck);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (truck: ITruck) => {
    setDeletingTruck(truck);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTruck?.id) return;
    const res = await deleteTruckAction(deletingTruck.id);
    if (res?.success) {
      setTrucks((p) => p.filter((x) => x.id !== deletingTruck.id));
    }
    setIsDeleteOpen(false);
    setDeletingTruck(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <TruckHeader onAdd={handleAdd} />
      <TruckFilter onFilterChange={(text) => setFilterText(text)} />
      <TruckList
        initialTrucks={filtered}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <TruckModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TruckAddForm
          truck={editingTruck}
          onClose={() => {
            fetchTrucks();
          }}
        />
      </TruckModal>

      <DeleteModal
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingTruck?.plateNumber || ""}
      />
    </motion.div>
  );
}
