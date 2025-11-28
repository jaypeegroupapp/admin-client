"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IOrderItemAggregated } from "@/definitions/order-item";
import OrderItemFilter from "./filter";
import OrderItemList from "./list";
import { getAllOrderItems } from "@/data/order-item";
import { OrderItemHeader } from "./header";

interface Props {
  initialItems: IOrderItemAggregated[];
}

export function OrderItemsClientPage({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems || []);
  const [filterText, setFilterText] = useState("");

  const filtered = items.filter((i) =>
    `${i.plateNumber} ${i.companyName || ""} ${i.productName || ""} ${i.status}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const fetchItems = async () => {
    const res = await getAllOrderItems();
    setItems(res || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <OrderItemHeader />

      <OrderItemFilter onFilterChange={(t) => setFilterText(t)} />

      <OrderItemList initialItems={filtered} />
    </motion.div>
  );
}
