"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IOrder } from "@/definitions/order";
import { OrderHeader } from "./header";
import OrderFilter from "./filter";
import { OrderList } from "./list";
import { OrderTabs, OrderTab } from "./tabs";
import { getOrders } from "@/data/order";

interface Props {
  initialOrders: IOrder[];
}

export function OrderClientPage({ initialOrders }: Props) {
  const [orders, setOrders] = useState<IOrder[]>(initialOrders || []);
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTab>("All");
  const router = useRouter();

  const fetchOrders = async () => {
    const res = await getOrders();
    if (res?.length) setOrders(res);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /** -----------------------------
   * COUNT LOGIC
   * -----------------------------*/
  const counts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === "pending").length,
    Completed: orders.filter((o) => o.status === "completed").length,
    Accepted: orders.filter((o) => o.status === "accepted").length,
    Cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  /** -----------------------------
   * FILTER: search + tab
   * -----------------------------*/
  const filtered = orders
    .filter((o) =>
      `${o.status} ${o.totalAmount}`
        .toLowerCase()
        .includes(filterText.toLowerCase())
    )
    .filter((o) => {
      if (activeTab === "Pending") return o.status === "pending";
      if (activeTab === "Accepted") return o.status === "accepted";
      if (activeTab === "Completed") return o.status === "completed";
      if (activeTab === "Cancelled") return o.status === "cancelled";
      return true; // All
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <OrderHeader />

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* TAB FILTERS */}
        <OrderTabs
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          counts={counts}
        />

        {/* SEARCH BAR */}
        <OrderFilter onFilterChange={(text: string) => setFilterText(text)} />
      </div>

      {/* LIST */}
      <OrderList initialOrders={filtered} />
    </motion.div>
  );
}
