// app/dashboard/supplier-invoices/page.tsx

import { SupplierInvoiceClientPage } from "@/components/(dashboard)/supplier-invoices/client";
import { getSupplierInvoices } from "@/data/supplier-invoice";

export const dynamic = "force-dynamic";

export default async function SupplierInvoicesPage() {
  const invoices = await getSupplierInvoices();
  return <SupplierInvoiceClientPage initialInvoices={invoices || []} />;
}
