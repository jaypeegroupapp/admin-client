"use client";

import { Check, ClipboardList, FileText, X } from "lucide-react";
import { ICompanyCreditApproval } from "@/definitions/company-credit-approval";
import { useState } from "react";
import { DeclineCreditModal } from "./decline-modal";
import { ApproveCreditModal } from "./approve-modal";
import { ViewDocumentModal } from "./document-modal";
import { StatusBadge } from "./status-badge";

export function CreditApprovalSummary({
  approval,
}: {
  approval: ICompanyCreditApproval & {
    mineName: string;
  };
}) {
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  // Convert stored filename → API URL
  const documentUrl = approval.document
    ? `/api/documents/${approval.document}`
    : null;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            <ClipboardList size={24} />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">
              Credit Approval #{approval.id?.slice(-6).toUpperCase()}
            </h2>

            <p className="text-sm text-gray-500">
              Requested on{" "}
              {approval.createdAt
                ? new Date(approval.createdAt).toLocaleDateString("en-ZA")
                : "N/A"}
            </p>
            <div className="mt-2">
              <StatusBadge status={approval.status || "pending"} />
            </div>
          </div>

          {approval.status === "pending" && (
            <div className="flex flex-row gap-2">
              {/* Accept */}
              <button
                onClick={() => setShowApproveModal(true)}
                className="flex items-center justify-between gap-1 rounded-lg h-8 px-3 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition"
              >
                Accept
                <Check size={16} />
              </button>

              {/* Decline */}
              <button
                onClick={() => setShowDeclineModal(true)}
                className="flex items-center justify-between gap-1 rounded-lg h-8 px-3 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
              >
                Decline
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 my-4" />

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Requester</p>
            <p className="font-medium">{approval.requester}</p>
          </div>
          <div>
            <p className="text-gray-500">Credit Limit Requested</p>
            <p className="font-semibold text-gray-900">
              R{approval.creditLimit?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Mine</p>
            <p className="font-semibold text-gray-900">{approval.mineName}</p>
          </div>
          <div>
            <p className="text-gray-500">Last Updated</p>
            <p className="font-medium">
              {approval.updatedAt
                ? new Date(approval.updatedAt).toLocaleDateString("en-ZA")
                : "N/A"}
            </p>
          </div>{" "}
          <div className="col-span-2">
            <p className="text-gray-500">Reason</p>
            <p className="font-medium">{approval.reason}</p>
          </div>
        </div>

        {/* Document Viewer */}
        {documentUrl && (
          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-2">Attached Document</p>

            <button
              onClick={() => setShowDocumentModal(true)}
              className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
            >
              <FileText size={18} />
              View Document
            </button>
          </div>
        )}
      </div>

      {/* Document Modal */}
      {showDocumentModal && (
        <ViewDocumentModal
          open={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          documentUrl={documentUrl}
        />
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <ApproveCreditModal
          approvalId={approval.id!}
          open={showApproveModal}
          onClose={() => setShowApproveModal(false)}
        />
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <DeclineCreditModal
          approvalId={approval.id!}
          open={showDeclineModal}
          onClose={() => setShowDeclineModal(false)}
        />
      )}
    </>
  );
}
