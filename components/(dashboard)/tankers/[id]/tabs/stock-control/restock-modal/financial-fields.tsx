"use client";

import InputValidated from "@/components/ui/input-validated";
import { financialFormData } from "@/validations/tanker-stock";
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
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
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
