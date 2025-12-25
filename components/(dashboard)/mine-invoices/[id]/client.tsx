"use client";

import { IMineInvoice } from "@/definitions/mine-invoice";
import { IOrder } from "@/definitions/order";
import { InvoiceHeader } from "./header";
import { InvoiceSummary } from "./summary";
import { InvoiceOrdersList } from "./list";

interface Props {
  invoice: IMineInvoice;
  linkedOrders: IOrder[];
}

export function MineInvoiceDetailsClient({ invoice, linkedOrders }: Props) {
  const openingBalance = invoice.openingBalance || 0;
  const newOrdersAmount = linkedOrders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0
  );

  const paidWithDebit = linkedOrders.reduce(
    (sum, o) => sum + Number(o.debit || 0),
    0
  );

  const paidWithCredit = linkedOrders.reduce(
    (sum, o) => sum + Number(o.credit || 0),
    0
  );

  const cashPayment = invoice.paymentAmount || 0;

  const totalActivity = openingBalance + newOrdersAmount;

  const outstandingBalance = totalActivity - paidWithDebit - cashPayment;

  const breakdown = {
    openingBalance,
    newOrdersAmount,
    totalActivity,
    paidWithDebit,
    paidWithCredit,
    cashPayment,
    outstandingBalance,
  };

  return (
    <div className="space-y-6">
      <InvoiceHeader />

      <InvoiceSummary invoice={invoice} breakdown={breakdown} />

      <InvoiceOrdersList orders={linkedOrders} />
    </div>
  );
}
