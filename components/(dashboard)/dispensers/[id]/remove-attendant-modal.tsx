// src/components/(dashboard)/dispensers/[id]/remove-attendant-modal.tsx
"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { removeAttendantAction } from "@/actions/dispenser-attendance";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { removeAttendantSchema } from "@/validations/dispenser-attendance";

export function RemoveAttendantModal({
  open,
  onClose,
  attendanceRecord,
  dispenserId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  attendanceRecord: any;
  dispenserId: string;
  onSuccess?: () => void;
}) {
  const initialState = { message: "", errors: {} };
  const [state, formAction, isPending] = useActionState(
    removeAttendantAction.bind(null, attendanceRecord.id),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [calculatedVariance, setCalculatedVariance] = useState<number | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(removeAttendantSchema),
    defaultValues: {
      closingBalance: attendanceRecord.openingBalanceLitres,
    },
  });

  const closingBalance = Number(watch("closingBalance")) || 0;

  // Calculate expected and variance in real-time
  const totalSold = attendanceRecord.totalDispensed || 0;
  const expectedClosing = attendanceRecord.openingBalanceLitres - totalSold;
  const variance = Number(closingBalance) - expectedClosing;
  const variancePercent =
    expectedClosing > 0 ? ((variance / expectedClosing) * 100).toFixed(1) : "0";

  const getVarianceStatus = () => {
    if (Math.abs(variance) < 0.1) {
      return {
        color: "text-green-600",
        bg: "bg-green-50",
        icon: CheckCircle,
        text: "Exact match - No variance",
      };
    } else if (Math.abs(variance) < 1) {
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        icon: AlertTriangle,
        text: "Small variance detected",
      };
    } else {
      return {
        color: "text-red-600",
        bg: "bg-red-50",
        icon: AlertTriangle,
        text: "Large variance detected - Investigate",
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
          End Shift - {(attendanceRecord.userId as any)?.name}
        </h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          {/* Shift Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Shift Summary</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Opening Balance</p>
                <p className="text-lg font-semibold">
                  {attendanceRecord.openingBalanceLitres}L
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Sold</p>
                <p className="text-lg font-semibold text-red-600">
                  -{totalSold}L
                </p>
              </div>
              <div className="col-span-2 border-t border-gray-200 pt-2">
                <p className="text-xs text-gray-500">Expected Closing</p>
                <p className="text-lg font-semibold">
                  {expectedClosing.toFixed(1)}L
                </p>
              </div>
            </div>
          </div>

          {/* Actual Reading Input */}
          <InputValidated
            name="closingBalance"
            label="Actual Closing Reading (from dispenser)"
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
          {closingBalance > 0 && (
            <div className={`${varianceStatus.bg} p-4 rounded-lg space-y-2`}>
              <div className="flex items-start gap-2">
                <VarianceIcon size={20} className={varianceStatus.color} />
                <div>
                  <p className={`text-sm font-medium ${varianceStatus.color}`}>
                    {varianceStatus.text}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Expected</p>
                  <p className="font-medium">{expectedClosing.toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Actual</p>
                  <p className="font-medium">
                    {Number(closingBalance).toFixed(1)}L
                  </p>
                </div>
                <div className="col-span-2 border-t border-gray-200 pt-2">
                  <p className="text-xs text-gray-500">Variance</p>
                  <p
                    className={`text-lg font-semibold ${varianceStatus.color}`}
                  >
                    {variance > 0 ? "+" : ""}
                    {variance.toFixed(2)}L
                    <span className="text-sm ml-1">({variancePercent}%)</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              rows={2}
              placeholder="Add any notes about this shift ending..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Server Error */}
          {state?.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}

          <SubmitButton
            name="End Shift & Record Closing"
            isPending={isPending}
          />
        </form>
      </div>
    </BaseModal>
  );
}
