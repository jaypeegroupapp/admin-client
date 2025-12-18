"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { ICompany } from "@/definitions/company";
import { useRouter } from "next/navigation";

export function CompanyCard({ company }: { company: ICompany }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/companies/${company.id}`);
  };

  return (
    <motion.div
      layout
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer hover:border-gray-400"
    >
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <Building2 className="w-8 h-8" />
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              {company.name}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
              {company.registrationNumber}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">{company.contactEmail}</p>
          <p className="text-sm text-gray-500">{company.contactPhone}</p>
          <p className="text-sm text-gray-700 font-medium mt-2 truncate">
            {company.billingAddress}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
