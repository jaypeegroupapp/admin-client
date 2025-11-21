"use client";

import { useRouter } from "next/navigation";
import { InvoiceHeader } from "./header";
import { InvoiceSummary } from "./summary";
import { InvoiceOrdersList } from "./item-list";

export function CompanyInvoiceDetailsClient({
  invoice,
  linkedOrders,
}: {
  invoice: any;
  linkedOrders: any[];
}) {
  const router = useRouter();
  const onBack = () => router.push("/company-invoices");
  const totalInvoiceAmount = invoice.paymentDate
    ? invoice.totalAmount
    : linkedOrders.reduce((acc, item) => acc + item.totalAmount, 0);

  return (
    <div className="space-y-6">
      <InvoiceHeader onBack={onBack} />
      <InvoiceSummary
        invoice={invoice}
        totalInvoiceAmount={totalInvoiceAmount}
      />
      <InvoiceOrdersList orders={linkedOrders} />
    </div>
  );
}
