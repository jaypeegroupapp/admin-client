"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IOrderItemAggregated, OrderItemTab } from "@/definitions/order-item";
import OrderItemFilter from "./filter";
import OrderItemList from "./list";
import { getAllOrderItems } from "@/data/order-item";
import { OrderItemHeader } from "./header";
import { OrderItemTabs } from "./tabs";

interface Props {
  initialItems: IOrderItemAggregated[];
}

export function OrderItemsClientPage({ initialItems }: Props) {
  const [items, setItems] = useState<IOrderItemAggregated[]>(
    initialItems || []
  );
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<OrderItemTab>("All");

  /** -----------------------------------
   * Fetch fresh items
   * ----------------------------------*/
  const fetchItems = async () => {
    const res = await getAllOrderItems();
    setItems(res || []);
  };

  useEffect(() => {
    fetchItems();
  }, [initialItems]);

  /** -----------------------------------
   * Counts for tabs
   * ----------------------------------*/
  const counts = {
    All: items.length,
    Pending: items.filter((i) => i.status === "pending").length,
    Accepted: items.filter((i) => i.status === "accepted").length,
    Completed: items.filter((i) => i.status === "completed").length,
    Cancelled: items.filter((i) => i.status === "cancelled").length,
  };

  /** -----------------------------------
   * Filtering (Search + Tabs)
   * ----------------------------------*/
  const filtered = items
    .filter((i) =>
      `${i.plateNumber} ${i.companyName || ""} ${i.productName || ""} ${
        i.status
      }`
        .toLowerCase()
        .includes(filterText.toLowerCase())
    )
    .filter((i) => {
      if (activeTab === "Pending") return i.status === "pending";
      if (activeTab === "Accepted") return i.status === "accepted";
      if (activeTab === "Completed") return i.status === "completed";
      if (activeTab === "Cancelled") return i.status === "cancelled";
      return true; // All
    });

  /** -----------------------------------
   * UI
   * ----------------------------------*/
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <OrderItemHeader />

      {/* Tabs + Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center w-full">
        <OrderItemTabs
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          counts={counts}
        />

        <OrderItemFilter onFilterChange={(t) => setFilterText(t)} />
      </div>

      {/* LIST */}
      <OrderItemList initialItems={filtered} />
    </motion.div>
  );
}
