"use client";

import InputValidated from "@/components/ui/input-validated";
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

      <InputValidated
        name="quantityAdded"
        label="Quantity Added (Litres)"
        type="number"
        step="0.1"
        min="0.1"
        placeholder="Enter litres added"
        register={register}
        errors={errors}
        isPending={isPending}
        stateError={stateError}
      />

      <InputValidated
        name="actualMeterReading"
        label="Actual Meter Reading After Restock"
        type="number"
        step="0.1"
        min="0"
        placeholder="Enter meter reading"
        register={register}
        errors={errors}
        isPending={isPending}
        stateError={stateError}
      />
    </div>
  );
}
