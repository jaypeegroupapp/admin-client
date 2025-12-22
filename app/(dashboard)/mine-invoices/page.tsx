import { MineInvoiceClientPage } from "@/components/(dashboard)/mine-invoices/client";
import { getMineInvoices } from "@/data/mine-invoice";

export const dynamic = "force-dynamic";

export default async function MineInvoicesPage() {
  const invoices = await getMineInvoices();
  return <MineInvoiceClientPage initialInvoices={invoices || []} />;
}
