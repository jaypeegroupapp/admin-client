"use client";

import InputValidated from "@/components/ui/input-validated";
import { financialFormData } from "@/constants/tanker-stock";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface FinancialFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isPending: boolean;
  stateError?: any;
}

export function FinancialFields({
  register,
  errors,
  isPending,
  stateError,
}: FinancialFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">
        Purchase Invoice Details (Required)
      </h3>

      {financialFormData.map((input) => (
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
