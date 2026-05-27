"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { transferToDispenserAction } from "@/actions/tanker-transfer";
import { transferToDispenserSchema } from "@/validations/tanker-transfer";

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  tankerId: string;
  dispenserId: string;
  dispenserName: string;
  currentTankerStock: number;
}

export function TransferToDispenserModal({
  open,
  onClose,
  tankerId,
  dispenserId,
  dispenserName,
  currentTankerStock,
}: TransferModalProps) {
  const initialState = { message: "", errors: {} };
  const [state, formAction, isPending] = useActionState(
    transferToDispenserAction.bind(null, tankerId, dispenserId),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transferToDispenserSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  const quantity = Number(watch("quantity")) || 0;
  const remainingAfterTransfer = currentTankerStock - quantity;

  const onSubmit = handleSubmit(() => {
    const formData = new FormData(formRef.current!);
    startTransition(() => {
      formAction(formData);
      onClose();
    });
  });

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Transfer to Dispenser
        </h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">From Tanker:</span>
              <span className="font-medium">
                {currentTankerStock}L available
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">To Dispenser:</span>
              <span className="font-medium">{dispenserName}</span>
            </div>
          </div>

          <InputValidated
            name="quantity"
            label="Transfer Quantity (Litres)"
            type="number"
            step="0.1"
            min="0.1"
            max={currentTankerStock}
            placeholder="Enter litres to transfer"
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />

          {quantity > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining in Tanker:</span>
                <span
                  className={`font-medium ${
                    remainingAfterTransfer < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {Math.max(0, remainingAfterTransfer)}L
                </span>
              </div>
            </div>
          )}

          <InputValidated
            name="notes"
            label="Notes (Optional)"
            type="text"
            placeholder="Add any notes about this transfer"
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />

          {state?.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}

          <SubmitButton name="Transfer" isPending={isPending} />
        </form>
      </div>
    </BaseModal>
  );
}
