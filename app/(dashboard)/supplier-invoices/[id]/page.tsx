import { SupplierInvoiceDetailsClient } from "@/components/(dashboard)/supplier-invoices/[id]/client";
import { getSupplierInvoiceById } from "@/data/supplier-invoice";
import { notFound } from "next/navigation";

export default async function SupplierInvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const invoice = await getSupplierInvoiceById(id);
  if (!invoice) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <SupplierInvoiceDetailsClient invoice={invoice} />
    </div>
  );
}
