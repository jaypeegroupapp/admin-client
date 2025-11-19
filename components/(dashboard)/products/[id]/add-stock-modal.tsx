"use client";

import { createStockMovementAction } from "@/actions/stock-movement";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { stockFormSchema } from "@/validations/stock-movement";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { stockInputFormData } from "@/constants/stock-movement";
import { BaseModal } from "@/components/ui/base-modal";

export function AddStockModal({
  productId,
  open,
  onClose,
}: {
  productId: string;
  open: boolean;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };

  // Bind the productId just like createProductAction
  const createStockMovementActionWithId = createStockMovementAction.bind(
    null,
    productId,
    "IN"
  );

  const [state, formAction, isPending] = useActionState(
    createStockMovementActionWithId,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      quantity: "",
      purchasePrice: "",
      sellingPriceAtPurchase: "",
      reason: "",
    },
  });

  const onSubmit = handleSubmit(() => {
    const formData = new FormData(formRef.current!);

    startTransition(() => {
      formAction(formData);
      onClose();
    });
  });

  return (
    <BaseModal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Stock</h2>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        {stockInputFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />
        ))}

        <SubmitButton name="Add Stock" isPending={isPending} />
      </form>
    </BaseModal>
  );
}
