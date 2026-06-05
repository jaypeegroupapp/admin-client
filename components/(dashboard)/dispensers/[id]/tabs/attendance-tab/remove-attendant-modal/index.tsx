"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import { removeAttendantAction } from "@/actions/dispenser-attendance";
import { removeAttendantSchema } from "@/validations/dispenser-attendance";
import { ShiftSummary } from "./shift-summary";
import { VarianceCalculation } from "./variance-calculation";
import { NotesField } from "./notes-field";
import InputValidated from "@/components/ui/input-validated";

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
  const initialState = { message: "", errors: {} };
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

  // CORRECT FORMULA: Meter reading increases as product is dispensed
  const openingBalance = attendanceRecord.openingBalanceLitres || 0;
  const totalSold = attendanceRecord.totalDispensed || 0;
  const expectedClosing = openingBalance + totalSold;
  const variance = closingBalance - expectedClosing;
  const variancePercent =
    expectedClosing > 0
      ? (variance / expectedClosing) * 100
      : totalSold > 0
        ? (variance / totalSold) * 100
        : 0;

  const onSubmit = handleSubmit(() => {
    const formData = new FormData(formRef.current!);
    startTransition(() => {
      formAction(formData);
      if (onSuccess) onSuccess();
      onClose();
    });
  });

  const isFirstShift = openingBalance === 0 && totalSold > 0;

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          End Shift - {attendanceRecord.attendantName}
        </h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <ShiftSummary
            openingBalance={openingBalance}
            totalSold={totalSold}
            expectedClosing={expectedClosing}
            isFirstShift={isFirstShift}
          />

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

          {closingBalance > 0 && (
            <VarianceCalculation
              expectedClosing={expectedClosing}
              actualClosing={closingBalance}
              variance={variance}
              variancePercent={variancePercent}
              totalSold={totalSold}
            />
          )}

          <NotesField
            register={register}
            errors={errors}
            isPending={isPending}
          />

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
