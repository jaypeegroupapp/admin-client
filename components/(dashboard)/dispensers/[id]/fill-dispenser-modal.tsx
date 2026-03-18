// src/components/(dashboard)/dispensers/[id]/fill-dispenser-modal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { fillDispenserAction } from "@/actions/dispenser-stock-record";
import { fillDispenserInputFormData } from "@/constants/dispenser-stock-record";
import {
  fillDispenserSchema,
} from "@/validations/dispenser-stock-record";

export function FillDispenserModal({
  open,
  onClose,
  dispenserId,
  currentBalance,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  dispenserId: string;
  currentBalance: number;
  onSuccess?: () => void;
}) {
  const initialState = { message: "", errors: {}, success: false };
  const [state, formAction, isPending] = useActionState(
    fillDispenserAction.bind(null, dispenserId),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [showInvoiceFields, setShowInvoiceFields] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fillDispenserSchema),
    defaultValues: {
      purchasedQuantity: 0,
      actualMeterReading: currentBalance,
      discount: 0,
      fillDate: new Date().toISOString().split("T")[0],
    },
  });

  // Watch values for calculations
  const purchasedQuantity = Number(watch("purchasedQuantity") ?? 0);
  const actualMeterReading = Number(watch("actualMeterReading") ?? 0);
  const invoiceUnitPrice = Number(watch("invoiceUnitPrice") ?? 0);
  const gridAtPurchase = Number(watch("gridAtPurchase") ?? 0);
  const discount = Number(watch("discount") ?? 0);

  // Calculations
  const calculatedExpected = currentBalance + purchasedQuantity;
  const variance = actualMeterReading - calculatedExpected;
  const variancePercent =
    calculatedExpected > 0
      ? ((variance / calculatedExpected) * 100).toFixed(1)
      : "0";

  // Financial calculations
  const totalCost =
    (Number(purchasedQuantity) || 0) * (Number(invoiceUnitPrice) || 0);
  const potentialRevenue =
    (Number(purchasedQuantity) || 0) * (Number(gridAtPurchase) || 0);
  const profit = potentialRevenue - totalCost;
  const profitMargin =
    totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : "0";

  const onSubmit = handleSubmit(() => {
    const formData = new FormData(formRef.current!);

    // Add opening balance to form data
    formData.set("openingBalance", currentBalance.toString());

    startTransition(() => {
      formAction(formData);
      if (onSuccess) {
        onSuccess();
        reset();
      }
      onClose();
    });
  });

  // Show errors from server action
  useEffect(() => {
    if (state?.errors) {
      console.log("Server errors:", state.errors);
    }
  }, [state]);

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Record Dispenser Fill
        </h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          {/* Current Balance Display */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-600 font-medium">
              Current Balance (Opening)
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {currentBalance.toFixed(1)}L
            </p>
            <input type="hidden" name="openingBalance" value={currentBalance} />
          </div>

          {/* Quantity Fields - Always visible */}
          <div className="border-b border-gray-200 pb-4 mb-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Fill Details
            </h3>

            <InputValidated
              name="purchasedQuantity"
              label="Purchased Quantity (Litres)"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="Enter purchased litres"
              register={register}
              errors={errors}
              isPending={isPending}
              stateError={state?.errors}
            />

            <InputValidated
              name="actualMeterReading"
              label="Actual Meter Reading After Fill"
              type="number"
              step="0.1"
              min="0"
              placeholder="Enter meter reading"
              register={register}
              errors={errors}
              isPending={isPending}
              stateError={state?.errors}
            />
          </div>

          {/* Toggle for Invoice Fields */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="showInvoiceFields"
              checked={showInvoiceFields}
              onChange={(e) => setShowInvoiceFields(e.target.checked)}
              className="w-4 h-4"
            />
            <label
              htmlFor="showInvoiceFields"
              className="text-sm font-medium text-gray-700"
            >
              Add Purchase Invoice Details
            </label>
          </div>

          {/* Supplier Invoice Fields (conditionally shown) */}
          {showInvoiceFields && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
              <h3 className="text-sm font-medium text-gray-700">
                Purchase Invoice Details
              </h3>

              {fillDispenserInputFormData.map((input) => (
                <InputValidated
                  key={input.name}
                  {...input}
                  register={register}
                  errors={errors}
                  isPending={isPending}
                  stateError={state?.errors}
                />
              ))}
            </div>
          )}

          {/* Fill Date */}
          <InputValidated
            name="fillDate"
            label="Fill Date"
            type="date"
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />

          {/* Notes */}
          <div className="flex flex-col mb-4">
            <label className="text-black text-sm mb-1">Notes (Optional)</label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="Add any notes about this fill..."
              className="w-full px-4 py-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Live Calculation Preview */}
          {purchasedQuantity > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Calculation Preview
              </h3>

              {/* Volume Calculations */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Opening Balance:</span>
                  <span className="font-medium">
                    {currentBalance.toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchased:</span>
                  <span className="font-medium text-green-600">
                    +{Number(purchasedQuantity).toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1">
                  <span className="text-gray-600">Expected Closing:</span>
                  <span className="font-medium">
                    {calculatedExpected.toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actual Reading:</span>
                  <span className="font-medium">
                    {actualMeterReading.toFixed(1)}L
                  </span>
                </div>
                {actualMeterReading > 0 && (
                  <div
                    className={`flex justify-between font-medium p-2 rounded mt-1 ${
                      Math.abs(variance) < 0.1
                        ? "bg-green-100 text-green-700"
                        : Math.abs(variance) < 1
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span>Variance:</span>
                    <span>
                      {variance > 0 ? "+" : ""}
                      {variance.toFixed(2)}L ({variancePercent}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Financial Calculations (if invoice fields are filled) */}
              {showInvoiceFields && invoiceUnitPrice > 0 && (
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">
                    Financial Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-medium">
                        R{totalCost.toFixed(2)}
                      </span>
                    </div>
                    {gridAtPurchase > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Potential Revenue:
                          </span>
                          <span className="font-medium">
                            R{potentialRevenue.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profit:</span>
                          <span
                            className={`font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            R{profit.toFixed(2)} ({profitMargin}%)
                          </span>
                        </div>
                      </>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Discount Applied:</span>
                        <span>R {discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Server Error Message */}
          {state?.message && !state.success && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}

          <SubmitButton name="Record Fill" isPending={isPending} />
        </form>
      </div>
    </BaseModal>
  );
}
