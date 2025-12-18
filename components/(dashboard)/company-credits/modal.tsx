"use client";

import { useRef, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";

import { BaseModal } from "@/components/ui/base-modal";
import InputValidated from "@/components/ui/input-validated";
import { SubmitButton } from "@/components/ui/buttons";
import { receiveCompanyCreditPaymentAction } from "@/actions/company-credit";
import { creditFormSchema } from "@/validations/company-credit";
import { creditInputFormData } from "@/constants/company-credit";

export function ReceivePaymentModal({
  companyCreditId,
  open,
  onClose,
}: {
  companyCreditId: string;
  open: boolean;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };

  const actionWithId = receiveCompanyCreditPaymentAction.bind(
    null,
    companyCreditId
  );

  const [state, formAction, isPending] = useActionState(
    actionWithId,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(creditFormSchema),
    defaultValues: {
      amount: "",
      issuedDate: "",
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
        Receive Credit Payment
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        {creditInputFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />
        ))}

        <SubmitButton name="Receive Payment" isPending={isPending} />
      </form>
    </BaseModal>
  );
}
