"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import { restockTankerAction } from "@/actions/tanker-stock";
import { restockTankerSchema } from "@/validations/tanker-stock";
import { CurrentStockDisplay } from "./current-stock-display";
import { RestockQuantityField } from "./quantity-field";
import { FinancialFieldsToggle } from "./financial-fields-toggle";
import { FinancialFields } from "./financial-fields";
import { RestockDateField } from "./date-field";
import { RestockNotesField } from "./notes-field";
import { RestockPreview } from "./preview";

export function RestockTankerModal({
  open,
  onClose,
  tankerId,
  currentStock,
  capacity,
}: {
  open: boolean;
  onClose: () => void;
  tankerId: string;
  currentStock: number;
  capacity: number;
}) {
  const initialState = { message: "", errors: {}, success: false };
  const [state, formAction, isPending] = useActionState(
    restockTankerAction.bind(null, tankerId),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [showFinancialFields, setShowFinancialFields] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(restockTankerSchema),
    defaultValues: {
      quantityAdded: 0,
      discount: 0,
      restockDate: new Date().toISOString().split("T")[0],
    },
  });

  const quantityAdded = Number(watch("quantityAdded")) || 0;
  const invoiceUnitPrice = Number(watch("invoiceUnitPrice")) || 0;
  const gridAtPurchase = Number(watch("gridAtPurchase")) || 0;
  const discount = Number(watch("discount")) || 0;

  const onSubmit = handleSubmit(() => {
    const formData = new FormData(formRef.current!);
    startTransition(() => {
      formAction(formData);
      onClose();
    });
  });

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Record Tanker Restock
        </h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <CurrentStockDisplay
            currentStock={currentStock}
            capacity={capacity}
          />

          <RestockQuantityField
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />

          <FinancialFieldsToggle
            show={showFinancialFields}
            onToggle={setShowFinancialFields}
          />

          {showFinancialFields && (
            <FinancialFields
              register={register}
              errors={errors}
              isPending={isPending}
              stateError={state?.errors}
            />
          )}

          <RestockDateField
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />

          <RestockNotesField
            register={register}
            errors={errors}
            isPending={isPending}
          />

          <RestockPreview
            quantityAdded={quantityAdded}
            currentStock={currentStock}
            capacity={capacity}
            invoiceUnitPrice={invoiceUnitPrice}
            gridAtPurchase={gridAtPurchase}
            discount={discount}
            showFinancialFields={showFinancialFields}
          />

          {state?.message && !state.success && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}

          <SubmitButton name="Record Restock" isPending={isPending} />
        </form>
      </div>
    </BaseModal>
  );
}
