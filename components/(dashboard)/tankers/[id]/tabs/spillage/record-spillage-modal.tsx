"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { recordSpillageAction } from "@/actions/tanker-spillage";
import {
  recordSpillageSchema,
  spillageFormData,
} from "@/validations/tanker-spillage";

export function RecordSpillageModal({
  open,
  onClose,
  tankerId,
  currentStock,
}: {
  open: boolean;
  onClose: () => void;
  tankerId: string;
  currentStock: number;
}) {
  const initialState = { message: "", errors: {} };
  const [state, formAction, isPending] = useActionState(
    recordSpillageAction.bind(null, tankerId),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recordSpillageSchema),
    defaultValues: {
      quantity: 0,
      type: "TRANSFER",
    },
  });

  const quantity = Number(watch("quantity")) || 0;

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
          Record Spillage
        </h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-yellow-600">
              Recording spillage will deduct from tanker stock
            </p>
          </div>

          {spillageFormData.map((input) => (
            <InputValidated
              key={input.name}
              {...input}
              register={register}
              errors={errors}
              isPending={isPending}
              stateError={state?.errors}
            />
          ))}

          {quantity > 0 && (
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Stock to be deducted:</span>
                <span className="font-medium text-red-600">-{quantity}L</span>
              </div>
            </div>
          )}

          {state?.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}

          <SubmitButton name="Record Spillage" isPending={isPending} />
        </form>
      </div>
    </BaseModal>
  );
}
