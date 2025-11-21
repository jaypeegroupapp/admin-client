"use client";

import { useRouter } from "next/navigation";
import { InvoiceHeader } from "./header";
import { SupplierInvoiceSummary } from "./summary";
import { SupplierInvoiceStockMovements } from "./list";

export function SupplierInvoiceDetailsClient({ invoice }: { invoice: any }) {
  const router = useRouter();
  const onBack = () => router.push("/supplier-invoices");

  const totalInvoiceAmount = invoice.totalAmount;

  return (
    <div className="space-y-6">
      <InvoiceHeader onBack={onBack} />
      <SupplierInvoiceSummary
        invoice={invoice}
        totalInvoiceAmount={totalInvoiceAmount}
      />
      {/* <SupplierInvoiceStockMovements stockMovements={invoice.stockMovements} /> */}
    </div>
  );
}
