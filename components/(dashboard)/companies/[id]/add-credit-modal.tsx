"use client";

import { updateCompanyCreditTrailAction } from "@/actions/company-credit";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { creditFormSchema } from "@/validations/company-credit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { BaseModal } from "@/components/ui/base-modal";
import { creditInputFormData } from "@/constants/company-credit";

export function UpdateCreditModal({
  companyId,
  creditLimit,
  open,
  onClose,
}: {
  companyId: string;
  creditLimit: number;
  open: boolean;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };

  const updateCompanyCreditTrailActionWithCompanyId = updateCompanyCreditTrailAction.bind(
    null,
    companyId
  );

  const [state, formAction, isPending] = useActionState(
    updateCompanyCreditTrailActionWithCompanyId,
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
      amount: creditLimit,
      issuedDate: "",
    },
  });

  const onSubmit = handleSubmit(() => {
    const formData = new FormData(formRef.current!);
    formData.append("companyId", companyId);

    startTransition(() => {
      formAction(formData);
      onClose();
    });
  });

  return (
    <BaseModal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Update Credit Limit
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

        <SubmitButton name="Update Credit" isPending={isPending} />
      </form>
    </BaseModal>
  );
}
