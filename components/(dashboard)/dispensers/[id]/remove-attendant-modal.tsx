"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { removeAttendantAction } from "@/actions/dispenser-attendance";
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { removeAttendantSchema } from "@/validations/dispenser-attendance";

export function RemoveAttendantModal({
  open,
  onClose,
  attendanceRecord,
  currentMeterReading,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  attendanceRecord: any;
  currentMeterReading: number;
  onSuccess?: () => void;
}) {
  const initialState = { message: "", errors: {}, warnings: false };
  const [state, formAction, isPending] = useActionState(
    removeAttendantAction.bind(null, attendanceRecord.id),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(removeAttendantSchema),
    defaultValues: {
      closingBalance: currentMeterReading.toFixed(2),
    },
  });

  const closingBalance = Number(watch("closingBalance")) || 0;

  // Calculate expected and variance (CORRECT FORMULA)
  const totalDispensed = attendanceRecord.totalDispensed || 0;
  const openingBalance = attendanceRecord.openingBalanceLitres || 0;

  // Expected closing = opening balance + total dispensed (meter reading increases)
  const expectedClosing = openingBalance + totalDispensed;
  const variance = closingBalance - expectedClosing;

  // Calculate variance percentage based on total dispensed
  const variancePercent =
    totalDispensed > 0 ? (variance / totalDispensed) * 100 : 0;

  const isFirstShift = openingBalance === 0 && totalDispensed > 0;
  const isNewDispenser = currentMeterReading === 0 && totalDispensed === 0;

  const getVarianceStatus = () => {
    if (isNewDispenser) {
      return {
        color: "text-gray-500",
        bg: "bg-gray-50",
        icon: TrendingUp,
        text: "No activity - Shift ended with no transactions",
      };
    }
    if (Math.abs(variance) < 0.1) {
      return {
        color: "text-green-600",
        bg: "bg-green-50",
        icon: CheckCircle,
        text: "✓ Exact match - Meter reading is correct",
      };
    } else if (Math.abs(variancePercent) < 5) {
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        icon: AlertTriangle,
        text: "⚠ Small variance detected - Please verify",
      };
    } else {
      return {
        color: "text-red-600",
        bg: "bg-red-50",
        icon: AlertTriangle,
        text: "❗ Large variance detected - Investigation required",
      };
    }
  };

  const varianceStatus = getVarianceStatus();
  const VarianceIcon = varianceStatus.icon;

  const onSubmit = handleSubmit(() => {
    const formData = new FormData(formRef.current!);
    startTransition(() => {
      formAction(formData);
      if (onSuccess) onSuccess();
      onClose();
    });
  });

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          End Shift - {attendanceRecord.attendantName}
        </h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          {/* Shift Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Shift Summary</h3>

            {isFirstShift && (
              <div className="p-2 bg-blue-100 rounded-lg mb-2">
                <p className="text-xs text-blue-700">
                  <strong>ℹ️ First Shift:</strong> This is the first shift on
                  this dispenser. Starting meter reading was 0, which is correct
                  for a new dispenser.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Opening Meter</p>
                <p className="text-lg font-semibold">
                  {openingBalance.toLocaleString()}L
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Dispensed</p>
                <p className="text-lg font-semibold text-green-600">
                  +{totalDispensed.toLocaleString()}L
                </p>
              </div>
              <div className="col-span-2 border-t border-gray-200 pt-2">
                <p className="text-xs text-gray-500">Expected Closing Meter</p>
                <p className="text-lg font-semibold text-blue-600">
                  {expectedClosing.toLocaleString()}L
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Opening + Dispensed = {openingBalance} + {totalDispensed} ={" "}
                  {expectedClosing}L
                </p>
              </div>
            </div>
          </div>

          {/* Actual Reading Input */}
          <InputValidated
            name="closingBalance"
            label="Actual Closing Meter Reading"
            type="number"
            step="0.1"
            min="0"
            placeholder="Enter actual meter reading"
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />

          {/* Variance Calculation */}
          {closingBalance > 0 && !isNewDispenser && (
            <div className={`${varianceStatus.bg} p-4 rounded-lg space-y-2`}>
              <div className="flex items-start gap-2">
                <VarianceIcon size={20} className={varianceStatus.color} />
                <p className={`text-sm font-medium ${varianceStatus.color}`}>
                  {varianceStatus.text}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Expected</p>
                  <p className="font-medium">
                    {expectedClosing.toLocaleString()}L
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Actual</p>
                  <p className="font-medium">
                    {closingBalance.toLocaleString()}L
                  </p>
                </div>
                <div className="col-span-2 border-t border-gray-200 pt-2">
                  <p className="text-xs text-gray-500">Variance</p>
                  <p
                    className={`text-lg font-semibold ${varianceStatus.color}`}
                  >
                    {variance > 0 ? "+" : ""}
                    {variance.toFixed(2)}L
                    <span className="text-sm ml-1">
                      ({Math.abs(variancePercent).toFixed(1)}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success message for first shift */}
          {isFirstShift && closingBalance > 0 && Math.abs(variance) < 0.1 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>✓ Perfect!</strong> First shift completed successfully.
                Meter reading correctly shows {closingBalance.toLocaleString()}L
                after dispensing {totalDispensed.toLocaleString()}L.
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Notes{" "}
              {Math.abs(variancePercent) >= 5 && (
                <span className="text-red-500">(Required)</span>
              )}
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder={
                Math.abs(variancePercent) >= 5
                  ? "Please explain the reason for the variance..."
                  : "Add any notes about this shift (optional)..."
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Server Error */}
          {state?.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}

          <SubmitButton name="End Shift" isPending={isPending} />
        </form>
      </div>
    </BaseModal>
  );
}
