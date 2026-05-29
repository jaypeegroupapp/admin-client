"use client";

import { useState } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";
import { ModalHeader } from "./header";
import { TransactionStatus } from "./transaction-status";
import { CompanyInfo } from "./company-info";
import { TruckDriverInfo } from "./truck-driver-info";
import { ProductPricingInfo } from "./product-pricing-info";
import { TransactionReference } from "./transaction-reference";
import { DispenserInfo } from "./dispenser-info";
import { ActionButtons } from "./action-buttons";

export function CashTransactionDetailModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: ICashTransactionAggregated;
}) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="space-y-4 max-h-[90vh] overflow-y-auto p-1 print:overflow-visible print:max-h-none">
        <ModalHeader onClose={onClose} />

        <TransactionStatus item={item} />
        <CompanyInfo item={item} />
        <TruckDriverInfo item={item} />
        <ProductPricingInfo item={item} />
        <TransactionReference item={item} />

        {item.dispenserName && (
          <DispenserInfo
            dispenserName={item.dispenserName}
            attendantName={item.attendantName}
          />
        )}

        <ActionButtons onClose={onClose} onPrint={handlePrint} />
      </div>
    </BaseModal>
  );
}
