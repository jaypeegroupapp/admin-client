"use client";

import { useRouter } from "next/navigation";
import { InvoiceHeader } from "./header";
import { InvoiceSummary } from "./summary";
import { InvoiceOrdersList } from "./item-list";
import { IOrder } from "@/definitions/order";

export function CompanyInvoiceDetailsClient({
  invoice,
  linkedOrders,
}: {
  invoice: any;
  linkedOrders: IOrder[];
}) {
  const router = useRouter();
  const onBack = () => router.push("/company-invoices");

  const openingBalance = invoice.openingBalance || 0;

  const newOrdersAmount = linkedOrders.reduce(
    (acc, o) => acc + o.totalAmount,
    0
  );

  const paidWithDebit = linkedOrders.reduce(
    (acc, o) => acc + (o.debit || 0),
    0
  );

  const paidWithCredit = linkedOrders.reduce(
    (acc, o) => acc + (o.credit || 0),
    0
  );

  const cashPayment = invoice.paymentAmount || 0;

  const totalActivity = openingBalance + newOrdersAmount;

  const outstandingBalance = totalActivity - paidWithDebit - cashPayment;

  return (
    <div className="space-y-6">
      <InvoiceHeader onBack={onBack} />

      <InvoiceSummary
        invoice={invoice}
        breakdown={{
          openingBalance,
          newOrdersAmount,
          totalActivity,
          paidWithDebit,
          paidWithCredit,
          cashPayment,
          outstandingBalance,
        }}
      />

      <InvoiceOrdersList orders={linkedOrders} />
    </div>
  );
}
