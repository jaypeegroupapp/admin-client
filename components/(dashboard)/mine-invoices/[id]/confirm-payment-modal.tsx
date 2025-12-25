"use client";

import { confirmInvoicePaymentAction } from "@/actions/mine-invoice";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { confirmMinePaymentSchema } from "@/validations/company-invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { BaseModal } from "@/components/ui/base-modal";
import { confirmPaymentFormData } from "@/constants/company-invoice";

export function ConfirmPaymentModal({
  invoiceId,
  outstanding,
  open,
  onClose,
}: {
  invoiceId: string;
  outstanding: number;
  open: boolean;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };

  const confirmPaymentActionWithId = confirmInvoicePaymentAction.bind(
    null,
    invoiceId
  );

  const [state, formAction, isPending] = useActionState(
    confirmPaymentActionWithId,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(confirmMinePaymentSchema),
    defaultValues: {
      amount: outstanding.toFixed(2),
      paymentDate: "",
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
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Confirm Payment
      </h2>
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        {confirmPaymentFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />
        ))}
        <SubmitButton name="Confirm Payment" isPending={isPending} />
      </form>{" "}
    </BaseModal>
  );
}
