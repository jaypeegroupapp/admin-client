"use client";

import { updateOrderDiscountAction } from "@/actions/company";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { discountFormSchema } from "@/validations/company";
import { discountInputFormData } from "@/constants/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { BaseModal } from "@/components/ui/base-modal";
import Select from "@/components/ui/select-validated";

export function UpdateDiscountModal({
  companyId,
  discountAmount,
  open,
  onClose,
  isGridPlus,
}: {
  companyId: string;
  discountAmount: number;
  open: boolean;
  onClose: () => void;
  isGridPlus: boolean;
}) {
  const initialState = { message: "", errors: {} };

  const [state, formAction, isPending] = useActionState(
    updateOrderDiscountAction.bind(null, companyId),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      discount: discountAmount || 10,
      isGridPlus: isGridPlus ? "true" : "false",
    },
  });

  const onSubmit = (evt: any) => {
    evt.preventDefault();
    handleSubmit(() => {
      const formData = new FormData(formRef.current!);

      startTransition(() => {
        formAction(formData);
      });
    })(evt);
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Update Product Price
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        {discountInputFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />
        ))}

        <Select
          label="Grid Type"
          name="isGridPlus"
          register={register}
          errors={errors}
          options={[
            { _id: "true", name: "Plus" },
            { _id: "false", name: "Minus" },
          ]}
        />

        <SubmitButton name="Submit" isPending={isPending} />
      </form>
    </BaseModal>
  );
}
