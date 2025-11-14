"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IOrder } from "@/definitions/order";
import { OrderHeader } from "./header";
import OrderFilter from "./filter";
import { OrderList } from "./list";
import { getOrders } from "@/data/order";

interface Props {
  initialOrders: IOrder[];
}

export function OrderClientPage({ initialOrders }: Props) {
  const [orders, setOrders] = useState<IOrder[]>(initialOrders || []);
  const [filterText, setFilterText] = useState("");
  const router = useRouter();

  const filtered = orders.filter((o) =>
    `${o.status} ${o.totalAmount}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const fetchOrders = async () => {
    const res = await getOrders();
    if (res?.length) setOrders(res);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAdd = () => {
    router.push("/orders/add");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <OrderHeader />
      <OrderFilter onFilterChange={(text: string) => setFilterText(text)} />
      <OrderList initialOrders={filtered} />
    </motion.div>
  );
}
