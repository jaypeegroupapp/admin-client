"use client";

import { IMineInvoice } from "@/definitions/mine-invoice";
import { InvoiceHeader } from "./header";
import { InvoiceSummary } from "./summary";
import { InvoiceOrdersTable } from "./table";

type InvoiceOrderItem = {
  id: string;
  orderId: string;
  updateDate: string;
  quantity: number;
  sellingPrice: number;
  truckId: {
    name: string;
    plateNumber: string;
    registrationNumber: string;
  };
};

interface Props {
  invoice: IMineInvoice;
  linkedOrders: InvoiceOrderItem[];
}

export function MineInvoiceDetailsClient({ invoice, linkedOrders }: Props) {
  const openingBalance = invoice.openingBalance || 0;

  // 🔹 New orders total (quantity × price)
  const newOrdersAmount = linkedOrders.reduce(
    (sum, item) => sum + item.quantity * item.sellingPrice,
    0,
  );

  const cashPayment = invoice.paymentAmount || 0;

  const totalActivity = openingBalance + newOrdersAmount;

  const outstandingBalance = totalActivity - cashPayment;

  const breakdown = {
    openingBalance,
    newOrdersAmount,
    totalActivity,
    paidWithDebit: 0, // No longer applicable
    paidWithCredit: 0, // No longer applicable
    cashPayment,
    outstandingBalance,
  };

  return (
    <div className="space-y-6">
      <InvoiceHeader />

      <InvoiceSummary invoice={invoice} breakdown={breakdown} />

      <InvoiceOrdersTable data={linkedOrders} />
    </div>
  );
}
