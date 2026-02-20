"use client";

import { Building2, Mail, Phone, MapPin, Wallet, DollarSign } from "lucide-react";
import { ICompany } from "@/definitions/company";

export function CompanySummary({ company }: { company: ICompany }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <Building2 size={28} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">
            {company.name}
          </h2>
          <p className="text-sm text-gray-500">
            Reg No: {company.registrationNumber}
          </p>
          <p className="text-sm text-gray-500">
            VAT: {company.vatNumber || "N/A"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Created on{" "}
            {new Date(company.createdAt!).toLocaleDateString("en-ZA")}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-gray-500" />
          <span>{company.contactEmail}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-gray-500" />
          <span>{company.contactPhone}</span>
        </div><div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500 mt-1" />
          <span>{company.billingAddress}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-500" />
          <span>Discount: R {company.discountAmount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-gray-500" />
          <span>Available Debit: R{company.debitAmount}</span>
        </div>
      </div>
    </div>
  );
}
