import { MineInvoiceDetailsClient } from "@/components/(dashboard)/mine-invoices/[id]/client";
import { getMineInvoiceById } from "@/data/mine-invoice";
import { getMineInvoiceOrders } from "@/data/order";
import { notFound } from "next/navigation";

export default async function MineInvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const invoice = await getMineInvoiceById(id);
  if (!invoice) return notFound();

  const linkedOrders = await getMineInvoiceOrders(id);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <MineInvoiceDetailsClient invoice={invoice} linkedOrders={linkedOrders} />
    </div>
  );
}
