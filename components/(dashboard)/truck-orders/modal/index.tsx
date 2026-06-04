"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { IOrderItemAggregated } from "@/definitions/order-item";
import { useRouter } from "next/navigation";
import { completeOrderItemAction } from "@/actions/order-item";
import { getOrderItemById } from "@/data/order-item";
import { ModalHeader } from "./header";
import { TruckInfoCard } from "./cards/truck-info";
import { ProductQuantityCard } from "./cards/product-quantity";
import { CompanyCard } from "./cards/company";
import { StatusPinCard } from "./cards/status-pin";
import { SignatureSection } from "./signature-section";
import { MessageDisplay } from "./message-display";
import { ActionButtons } from "./action-buttons";
import { CompletedOrderSummary } from "./completed-order-summary";

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
  const [isCompleted, setIsCompleted] = useState(item.status === "completed");
  const [fullOrderItem, setFullOrderItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch full order item data when modal opens
  useEffect(() => {
    if (open && isCompleted) {
      fetchFullOrderItem();
    }
  }, [open, isCompleted]);

  const fetchFullOrderItem = async () => {
    setLoading(true);
    try {
      const result = await getOrderItemById(item.id);
      console.log({ result });
      if (result) {
        setFullOrderItem(result);
      }
    } catch (error) {
      console.error("Failed to fetch order item details:", error);
    } finally {
      setLoading(false);
    }
  };

  const tankerStock = userDispenser?.tankerStock || 0;
  // const tankerName = userDispenser?.tankerName || "Unknown";
  // const totalDispensed = userDispenser?.dispenser?.totalDispensed || 0;
  const insufficientStock = tankerStock < item.quantity;
  const hasAttendance = !!userDispenser?.attendance;
  const hasDispenser = !!userDispenser?.dispenser;
  // const attendantName = userDispenser?.attendance?.name;

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
        setFullOrderItem({
          ...fullOrderItem,
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
    setMessage("");
    setSignature(null);
    onClose();
    router.refresh();
  };

  if (loading) {
    return (
      <BaseModal open={open} onClose={handleClose}>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </BaseModal>
    );
  }

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

        {!isCompleted &&
          (item.status === "accepted" || hasExistingSignature) && (
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

        {isCompleted && fullOrderItem && (
          <CompletedOrderSummary completedData={fullOrderItem} />
        )}

        <MessageDisplay message={message} />

        <ActionButtons
          status={isCompleted ? "completed" : item.status}
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
