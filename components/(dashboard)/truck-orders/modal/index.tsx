"use client";

import { BaseModal } from "@/components/ui/base-modal";
import { useRef, useState, useTransition } from "react";
import { IOrderItemAggregated } from "@/definitions/order-item";
import { useRouter } from "next/navigation";
import { completeOrderItemAction } from "@/actions/order-item";
import { ModalHeader } from "./header";
import { TruckInfoCard } from "./truck-info-card";
import { ProductQuantityCard } from "./cards/product-quantity";
import { CompanyCard } from "./cards/company";
import { StatusPinCard } from "./cards/status-pin";
import { TankerDispenserInfo } from "./tanker-dispenser-info";
import { SignatureSection } from "./signature-section";
import { MessageDisplay } from "./message-display";
import { ActionButtons } from "./action-buttons";

export function OrderItemDetailModal({
  open,
  onClose,
  item,
  userDispenser,
}: {
  open: boolean;
  onClose: () => void;
  item: IOrderItemAggregated;
  userDispenser?: any;
}) {
  const sigPadRef = useRef<any>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedData, setCompletedData] = useState<any>(null);
  const router = useRouter();

  const tankerStock = userDispenser?.tankerStock || 0;
  const tankerName = userDispenser?.tankerName || "Unknown";
  const totalDispensed = userDispenser?.dispenser?.totalDispensed || 0;
  const insufficientStock = tankerStock < item.quantity;
  const hasAttendance = !!userDispenser?.attendance;
  const hasDispenser = !!userDispenser?.dispenser;
  const attendantName =
    userDispenser?.dispenser?.attendanceName ||
    userDispenser?.attendance?.attendantName ||
    "Unknown Attendant";

  const canFulfill =
    item.status === "accepted" &&
    hasDispenser &&
    hasAttendance &&
    !insufficientStock;

  const hasExistingSignature = Boolean(item.signature);

  const handleClear = () => {
    sigPadRef.current?.clear();
    setSignature(null);
  };

  const handleSubmit = () => {
    if (!signature) {
      setMessage("❌ Please sign before completing.");
      return;
    }
    setMessage("");
    startTransition(async () => {
      const result = await completeOrderItemAction(item.id, signature);
      if (result.success) {
        setMessage("✅ Order completed successfully!");
        setIsCompleted(true);
        setCompletedData({
          ...result.data,
          completedAt: new Date().toISOString(),
        });
      } else {
        setMessage(result.message || "❌ Failed to complete order.");
      }
    });
  };

  const handlePrint = () => {
    window.print();
    router.refresh();
  };

  const handleClose = () => {
    setIsCompleted(false);
    setCompletedData(null);
    setMessage("");
    setSignature(null);
    router.refresh();
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <BaseModal open={open} onClose={handleClose}>
      <div className="space-y-5 max-h-[90vh] overflow-y-auto p-1 print:overflow-visible print:max-h-none">
        <ModalHeader onClose={handleClose} />

        <TruckInfoCard item={item} />
        <ProductQuantityCard item={item} />
        <CompanyCard item={item} />
        <StatusPinCard
          item={item}
          orderItemNumber={item.id?.slice(-6).toUpperCase()}
        />

        {item.status === "accepted" && !isCompleted && (
          <TankerDispenserInfo
            tankerName={tankerName}
            tankerStock={tankerStock}
            totalDispensed={totalDispensed}
            insufficientStock={insufficientStock}
            hasAttendance={hasAttendance}
            hasDispenser={hasDispenser}
            canFulfill={canFulfill}
            attendance={userDispenser?.attendance}
            dispenserName={userDispenser?.dispenser?.name}
            attendantName={attendantName}
            quantity={item.quantity}
          />
        )}

        {(item.status === "accepted" || hasExistingSignature) &&
          !isCompleted && (
            <SignatureSection
              hasExistingSignature={hasExistingSignature}
              existingSignature={item.signature}
              canFulfill={canFulfill}
              signature={signature}
              sigPadRef={sigPadRef}
              onSignatureChange={setSignature}
              onClear={handleClear}
            />
          )}

        {isCompleted && completedData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 print:bg-white print:border print:border-gray-300">
            <h3 className="font-semibold text-green-800 mb-3 text-lg">
              ✅ Order Completed
            </h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <span className="text-gray-600">Dispenser:</span>
                </p>
                <p className="font-medium">{completedData.dispenserName}</p>

                <p>
                  <span className="text-gray-600">Tanker:</span>
                </p>
                <p className="font-medium">{completedData.tankerName}</p>

                <p>
                  <span className="text-gray-600">Litres Sold:</span>
                </p>
                <p className="font-medium text-blue-600">
                  {completedData.litresSold}L
                </p>

                <p>
                  <span className="text-gray-600">Tanker Remaining:</span>
                </p>
                <p className="font-medium">
                  {completedData.tankerRemainingStock}L
                </p>

                <p>
                  <span className="text-gray-600">Meter Reading:</span>
                </p>
                <p className="font-medium">
                  {completedData.meterReading.toLocaleString()}L
                </p>

                <p>
                  <span className="text-gray-600">Station Attendant:</span>
                </p>
                <p className="font-medium">{completedData.attendantName}</p>

                <p>
                  <span className="text-gray-600">Shift Started:</span>
                </p>
                <p className="font-medium">
                  {completedData.loginTime
                    ? new Date(completedData.loginTime).toLocaleString()
                    : "N/A"}
                </p>

                <p>
                  <span className="text-gray-600">Opening Meter:</span>
                </p>
                <p className="font-medium">
                  {completedData.openingBalance?.toLocaleString() || 0}L
                </p>

                <p>
                  <span className="text-gray-600">Completed At:</span>
                </p>
                <p className="font-medium">
                  {formatDateTime(completedData.completedAt)}
                </p>
              </div>
            </div>
          </div>
        )}

        <MessageDisplay message={message} />

        <ActionButtons
          status={item.status}
          hasExistingSignature={hasExistingSignature}
          isCompleted={isCompleted}
          isPending={isPending}
          signature={signature}
          canFulfill={canFulfill}
          hasDispenser={hasDispenser}
          hasAttendance={hasAttendance}
          insufficientStock={insufficientStock}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onPrint={handlePrint}
        />
      </div>
    </BaseModal>
  );
}
