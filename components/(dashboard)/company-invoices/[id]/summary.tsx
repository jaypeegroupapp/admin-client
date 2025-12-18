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
  breakdown,
}: {
  invoice: ICompanyInvoice;
  breakdown: {
    openingBalance: number;
    newOrdersAmount: number;
    totalActivity: number;
    paidWithDebit: number;
    paidWithCredit: number;
    cashPayment: number;
    outstandingBalance: number;
  };
}) {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDebitModal, setShowDebitModal] = useState(false);
  const [isDebitPayment, setIsDebitPayment] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<ICompany | null>(null);

  const formattedPaymentDate = invoice.paymentDate
    ? new Date(invoice.paymentDate).toLocaleDateString("en-ZA")
    : "-";

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    const res = await getCompanyById(invoice.companyId);
    if (res.success && res.data) {
      setCompanyDetails(res.data);
      if (res.data.debitAmount >= breakdown.outstandingBalance) {
        setIsDebitPayment(true);
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between flex-col md:flex-row gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText size={24} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Invoice #{invoice.id?.slice(-6).toUpperCase()} -{" "}
                {invoice.companyName}
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
              Close Invoice <Lock size={16} />
            </button>
          )}
        </div>

        <div className="border-t pt-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Opening Balance</span>
            <span>R {breakdown.openingBalance.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>New Orders (this month)</span>
            <span>R {breakdown.newOrdersAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold border-b pb-2">
            <span>Total Activity</span>
            <span>R {breakdown.totalActivity.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-purple-600">
            <span>Paid with Debit</span>
            <span>- R {breakdown.paidWithDebit.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Paid with Cash</span>
            <span>- R {breakdown.cashPayment.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
            <span>Outstanding Balance</span>
            <span>R {breakdown.outstandingBalance.toFixed(2)}</span>
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
          invoiceBalance={breakdown.outstandingBalance}
          debitAmount={companyDetails.debitAmount}
          open={showDebitModal}
          onClose={() => setShowDebitModal(false)}
        />
      )}
    </>
  );
}
