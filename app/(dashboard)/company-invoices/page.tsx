// app/dashboard/company-invoices/page.tsx

import { CompanyInvoiceClientPage } from "@/components/(dashboard)/company-invoices/client";
import { getCompanyInvoices } from "@/data/company-invoice";

export const dynamic = "force-dynamic";

export default async function CompanyInvoicesPage() {
  const invoices = await getCompanyInvoices();
  return <CompanyInvoiceClientPage initialInvoices={invoices || []} />;
}
