"use client";

import InputValidated from "@/components/ui/input-validated";
import { quantityFormData } from "@/validations/tanker-stock";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface QuantityFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isPending: boolean;
  stateError?: any;
}

export function RestockQuantityFields({
  register,
  errors,
  isPending,
  stateError,
}: QuantityFieldsProps) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-2">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Restock Details
      </h3>

      {quantityFormData.map((input) => (
        <InputValidated
          key={input.name}
          {...input}
          register={register}
          errors={errors}
          isPending={isPending}
          stateError={stateError}
        />
      ))}
    </div>
  );
}
