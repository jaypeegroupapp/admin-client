"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ICompany } from "@/definitions/company";
import { CompanyHeader } from "./header";
import CompanyFilter from "./filter";
import { CompanyList } from "./list";
import CompanyModal from "@/components/ui/modal";
import CompanyForm from "./form";
import { getCompanies } from "@/data/company";

interface Props {
  initialCompanies: ICompany[];
}

export function CompanyClientPage({ initialCompanies }: Props) {
  const [companies, setCompanies] = useState<ICompany[]>(
    initialCompanies || [],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  /** ----------------------------------------
   * FETCH COMPANIES
   ----------------------------------------*/
  const fetchCompanies = async () => {
    const res = await getCompanies();
    if (res?.success) setCompanies(res.data || []);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  /** ----------------------------------------
   * SEARCH FILTER
   ----------------------------------------*/
  const filtered = companies.filter((c) =>
    `${c.name} ${c.registrationNumber} ${c.contactEmail}`
      .toLowerCase()
      .includes(filterText.toLowerCase()),
  );

  /** ----------------------------------------
   * OPEN MODAL
   ----------------------------------------*/
  const handleAdd = () => {
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <CompanyHeader onAdd={handleAdd} />

      <CompanyFilter onFilterChange={(text: string) => setFilterText(text)} />

      <CompanyList initialCompanies={filtered} />

      {/* MODAL */}
      <CompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CompanyForm />
      </CompanyModal>
    </motion.div>
  );
}
