import { CompanyInvoiceDetailsClient } from "@/components/(dashboard)/company-invoices/[id]/client";
import { getCompanyInvoiceById } from "@/data/company-invoice";
import { getInvoiceOrders } from "@/data/order";
import { notFound } from "next/navigation";

export default async function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const invoice = await getCompanyInvoiceById(id);
  if (!invoice) return notFound();

  const linkedOrders = await getInvoiceOrders(id);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <CompanyInvoiceDetailsClient
        invoice={invoice}
        linkedOrders={linkedOrders}
      />
    </div>
  );
}
