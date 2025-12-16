"use client";

import { useEffect, useState } from "react";
import { FileText, Check, DollarSign, Lock } from "lucide-react";
import { ICompanyInvoice } from "@/definitions/company-invoice";
import { InvoiceStatusBadge } from "./status-badge";
import { PublishInvoiceModal } from "./publish-modal";
import { ConfirmPaymentModal } from "./confirm-payment-modal";
import { CloseInvoiceModal } from "./close-modal";
import { getCompanyById } from "@/data/company";
import { ICompany } from "@/definitions/company";
import { PayWithDebitModal } from "./debit-payment-modal";

export function InvoiceSummary({
  invoice,
  totalInvoiceAmount,
}: {
  invoice: ICompanyInvoice;
  totalInvoiceAmount: number;
}) {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDebitModal, setShowDebitModal] = useState(false);
  const [isDebitPayment, setIsDebitPayment] = useState(false);

  const formattedPaymentDate = invoice.paymentDate
    ? new Date(invoice.paymentDate).toLocaleDateString("en-ZA")
    : "-";

  const [companyDetails, setCompanyDetails] = useState<ICompany | null>(null);

  useEffect(() => {
    fectchCompany();
  }, []);

  const fectchCompany = async () => {
    const res = await getCompanyById(invoice.companyId);
    if (res.success && res.data) {
      const company = res.data;

      setCompanyDetails(company);
      if (company.debitAmount > totalInvoiceAmount) setIsDebitPayment(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 justify-between">
          {/* Left */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <FileText size={24} />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                Invoice #{invoice.id?.slice(-6).toUpperCase()}
              </h2>

              <p className="text-sm text-gray-500">
                Created on{" "}
                {new Date(invoice.createdAt!).toLocaleDateString("en-ZA")}
              </p>

              <div className="mt-2">
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          {invoice.status === "pending" && (
            <button
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-2 h-8 px-3 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Publish Invoice
              <Check size={16} />
            </button>
          )}

          {invoice.status === "published" && companyDetails && (
            <button
              onClick={() =>
                isDebitPayment
                  ? setShowDebitModal(true)
                  : setShowPaymentModal(true)
              }
              className={`flex items-center gap-2 h-8 px-3 text-sm font-medium text-white rounded-lg transition ${
                isDebitPayment
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isDebitPayment ? "Pay with Debit" : "Confirm Payment"}
              <DollarSign size={16} />
            </button>
          )}

          {invoice.status === "paid" && (
            <button
              onClick={() => setShowCloseModal(true)}
              className="flex items-center gap-2 h-8 px-3 text-sm font-medium bg-gray-700 text-white rounded-lg hover:bg-black transition"
            >
              Close Invoice
              <Lock size={16} />
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 my-4" />

        {/* Invoice Summary Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Company</p>
            <p className="font-medium">{invoice.companyName}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Amount</p>
            <p className="font-semibold text-gray-900">
              R{totalInvoiceAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Opening Balance</p>
            <p className="font-medium">
              R {invoice.openingBalance?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Closing Balance</p>
            <p className="font-medium">
              R {invoice.closingBalance?.toFixed(2)}
            </p>
          </div>{" "}
          <div>
            <p className="text-gray-500">Payment Date</p>
            <p className="font-medium">{formattedPaymentDate}</p>
          </div>
          <div>
            <p className="text-gray-500">Payment Amount</p>
            <p className="font-medium">R {invoice.paymentAmount?.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPublishModal && (
        <PublishInvoiceModal
          invoiceId={invoice.id!}
          open={showPublishModal}
          onClose={() => setShowPublishModal(false)}
        />
      )}

      {companyDetails && showPaymentModal && (
        <ConfirmPaymentModal
          invoiceId={invoice.id!}
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showCloseModal && (
        <CloseInvoiceModal
          invoiceId={invoice.id!}
          open={showCloseModal}
          onClose={() => setShowCloseModal(false)}
        />
      )}

      {companyDetails && showDebitModal && (
        <PayWithDebitModal
          invoiceId={invoice.id!}
          invoiceBalance={invoice.closingBalance!}
          debitAmount={companyDetails.debitAmount}
          open={showDebitModal}
          onClose={() => setShowDebitModal(false)}
        />
      )}
    </>
  );
}
