"use client";

import InputValidated from "@/components/ui/input-validated";
import { cashTransactionInputFormData } from "@/constants/cash-transaction";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface CustomerDetailsFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  stateError?: any;
  isPending: boolean;
}

export function CustomerDetailsForm({
  register,
  errors,
  stateError,
  isPending,
}: CustomerDetailsFormProps) {
  return (
    <>
      {cashTransactionInputFormData.map((input) => (
        <InputValidated
          key={input.name}
          {...input}
          register={register}
          errors={errors}
          stateError={stateError}
          isPending={isPending}
        />
      ))}
    </>
  );
}
