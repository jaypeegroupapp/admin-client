"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IStaff } from "@/definitions/staff";
import { StaffHeader } from "./header";
import StaffModal from "@/components/ui/modal";
import StaffAddForm from "./add-form";
import { StaffList } from "./list";
import StaffFilter from "./filter";
import { StaffTabs, StaffTab } from "./tabs";
import { getStaffs } from "@/data/staff";

export function StaffClientPage({
  initialStaffs,
  roles,
}: {
  initialStaffs: IStaff[];
  roles: { id: string; name: string }[];
}) {
  const [staffs, setStaffs] = useState<IStaff[]>(initialStaffs || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<IStaff | null>(null);
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<StaffTab>("All");

  const fetchStaffs = async () => {
    const res = await getStaffs();
    if (res.success) setStaffs(res.data || []);
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const allCount = staffs.length;
  const activeCount = staffs.filter((s) => s.status === "active").length;
  const inactiveCount = staffs.filter((s) => s.status === "inactive").length;

  const filtered = staffs
    .filter((s) => s.name.toLowerCase().includes(filterText.toLowerCase()))
    .filter((s) => {
      if (activeTab === "Active") return s.status === "active";
      if (activeTab === "Inactive") return s.status === "inactive";
      return true;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <StaffHeader onAdd={() => setIsModalOpen(true)} />

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <StaffTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          counts={{
            All: allCount,
            Active: activeCount,
            Inactive: inactiveCount,
          }}
        />

        <StaffFilter onFilterChange={setFilterText} />
      </div>

      <StaffList staffs={filtered} />

      <StaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <StaffAddForm
          staff={editingStaff}
          roles={roles}
          onClose={() => {
            fetchStaffs();
            setIsModalOpen(false);
          }}
        />
      </StaffModal>
    </motion.div>
  );
}
