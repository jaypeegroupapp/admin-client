"use client";

import InputValidated from "@/components/ui/input-validated";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface DateFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isPending: boolean;
  stateError?: any;
}

export function RestockDateField({
  register,
  errors,
  isPending,
  stateError,
}: DateFieldProps) {
  return (
    <InputValidated
      name="restockDate"
      label="Restock Date"
      type="date"
      register={register}
      errors={errors}
      isPending={isPending}
      stateError={stateError}
    />
  );
}