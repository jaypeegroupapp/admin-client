"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck } from "lucide-react";
import { getTrucksByCompanyId } from "@/data/truck";
import { getProducts } from "@/data/product";
import { CreditMineFacilityTab } from "./credit-mine-facility-tab";
import { AccountStatementTab } from "./account-statement";
import { CompanyOrdersTab } from "./orders";
import { CompanyProductsTab } from "./products";

interface Props {
  activeTab: "trucks" | "orders" | "credit" | "credit-trails" | "products";
  onTabChange: (
    tab: "trucks" | "orders" | "credit" | "credit-trails" | "products",
  ) => void;
  companyId: string;
  debitAmount: number;
  discountAmount: number;
  isGridPlus: boolean;
}

export function CompanyTabs({
  activeTab,
  onTabChange,
  companyId,
  debitAmount,
  discountAmount,
  isGridPlus,
}: Props) {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trucksData = await getTrucksByCompanyId(companyId);
        setTrucks(trucksData || []);

        const productsRes = await getProducts();
        if (productsRes.success) {
          const products =
            productsRes && productsRes.data
              ? productsRes.data.filter((p) => p.isPublished)
              : [];
          setProducts(products);
        }
      } catch (e) {
        console.error("Failed to fetch data", e);
      }
    };

    fetchData();
  }, [companyId]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {["trucks", "orders", "products", "credit", "credit-trails"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab as any)}
              className={`pb-2 font-medium text-sm ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "trucks" && "Trucks"}
              {tab === "orders" && "Orders"}
              {tab === "products" && "Product Prices"}
              {tab === "credit" && "Credit Facility"}
              {tab === "credit-trails" && "Statements"}
            </button>
          ),
        )}
      </div>

      {/* CONTENT */}
      <AnimatePresence mode="wait">
        {activeTab === "trucks" && (
          <motion.div
            key="trucks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {trucks.length === 0 ? (
              <p className="text-sm text-gray-500">
                No trucks linked to this company.
              </p>
            ) : (
              <div className="divide-y divide-gray-200">
                {trucks.map((truck) => (
                  <div
                    key={truck.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <Truck size={18} />
                      </div>
                      <span className="text-gray-800 text-sm font-medium">
                        {truck.make} {truck.model} ({truck.year})
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {truck.plateNumber}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "orders" && <CompanyOrdersTab companyId={companyId} />}

        {activeTab === "products" && (
          <CompanyProductsTab
            discountAmount={discountAmount}
            isGridPlus={isGridPlus}
            products={products}
            companyId={companyId}
          />
        )}

        {activeTab === "credit" && (
          <motion.div
            key="credit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CreditMineFacilityTab companyId={companyId} />
          </motion.div>
        )}

        {activeTab === "credit-trails" && (
          <motion.div
            key="credit-trails"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AccountStatementTab
              companyId={companyId}
              debitAmount={debitAmount}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
