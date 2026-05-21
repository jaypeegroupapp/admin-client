"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { restockTankerAction } from "@/actions/tanker-stock";
import {
  restockTankerSchema,
  restockInputFormData,
} from "@/validations/tanker-stock";

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
  const initialState = { message: "", errors: {} };
  const [state, formAction, isPending] = useActionState(
    restockTankerAction.bind(null, tankerId),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(restockTankerSchema),
    defaultValues: {
      quantityAdded: 0,
    },
  });

  const quantityAdded = Number(watch("quantityAdded")) || 0;
  const newStock = currentStock + quantityAdded;
  const willExceedCapacity = newStock > capacity;

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
          Record Tanker Restock
        </h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-600 font-medium">Current Stock</p>
            <p className="text-2xl font-bold text-blue-700">{currentStock}L</p>
            <p className="text-xs text-blue-600 mt-1">Capacity: {capacity}L</p>
          </div>

          {restockInputFormData.map((input) => (
            <InputValidated
              key={input.name}
              {...input}
              register={register}
              errors={errors}
              isPending={isPending}
              stateError={state?.errors}
            />
          ))}

          {quantityAdded > 0 && (
            <div
              className={`p-3 rounded-lg ${willExceedCapacity ? "bg-red-50" : "bg-green-50"}`}
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">New Stock Level:</span>
                <span
                  className={`font-medium ${willExceedCapacity ? "text-red-600" : "text-green-600"}`}
                >
                  {newStock}L {willExceedCapacity && "(Exceeds capacity!)"}
                </span>
              </div>
            </div>
          )}

          {state?.message && (
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
