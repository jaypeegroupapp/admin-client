"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ICompany } from "@/definitions/company";
import { CompanyHeader } from "./header";
import CompanyFilter from "./filter";
import { CompanyList } from "./list";
import { getCompanies } from "@/data/company";

interface Props {
  initialCompanies: ICompany[];
}

export function CompanyClientPage({ initialCompanies }: Props) {
  const [companies, setCompanies] = useState<ICompany[]>(
    initialCompanies || []
  );
  const [filterText, setFilterText] = useState("");
  const router = useRouter();

  const filtered = companies.filter((c) =>
    `${c.name} ${c.registrationNumber} ${c.contactEmail}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const fetchCompanies = async () => {
    const res = await getCompanies();
    if (res?.data?.length) setCompanies(res.data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAdd = () => {
    router.push("/companies/add");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <CompanyHeader />
      <CompanyFilter onFilterChange={(text: string) => setFilterText(text)} />
      <CompanyList initialCompanies={filtered} />
    </motion.div>
  );
}
