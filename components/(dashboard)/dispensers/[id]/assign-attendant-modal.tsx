// src/components/(dashboard)/dispensers/[id]/assign-attendant-modal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import { assignAttendantAction } from "@/actions/dispenser-attendance";
import { Search, User } from "lucide-react";
import { assignAttendantSchema } from "@/validations/dispenser-attendance";
import { getAvailableAttendants } from "@/data/dispenser-attendance";

export function AssignAttendantModal({
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
  const initialState = { message: "", errors: {} };
  const [state, formAction, isPending] = useActionState(
    assignAttendantAction.bind(null, dispenserId),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [attendants, setAttendants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAttendant, setSelectedAttendant] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assignAttendantSchema),
    defaultValues: {
      openingBalance: currentBalance,
    },
  });

  const openingBalance = Number(watch("openingBalance")) || 0;

  useEffect(() => {
    if (open) {
      loadAttendants();
    }
  }, [open]);

  const loadAttendants = async () => {
    const result = await getAvailableAttendants();
    if (result.success) {
      setAttendants(result.data);
    } else {
      // Handle error - maybe show toast notification
      console.error("Failed to load attendants:", result.message);
    }
  };

  const filteredAttendants = attendants.filter((attendant) =>
    attendant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onSubmit = handleSubmit(() => {
    const formData = new FormData(formRef.current!);
    startTransition(() => {
      formAction(formData);
      if (onSuccess) onSuccess();
      onClose();
    });
  });

  const handleSelectAttendant = (attendant: any) => {
    setSelectedAttendant(attendant);
    setValue("attendantId", attendant.id);
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Assign Station Attendant
        </h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          {/* Current Balance Display */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-600 font-medium">
              Current Dispenser Reading
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {currentBalance.toFixed(1)}L
            </p>
            <p className="text-xs text-blue-600 mt-1">
              This will be recorded as opening balance for the shift
            </p>
          </div>

          <input
            type="hidden"
            {...register("openingBalance")}
            value={openingBalance}
          />

          {/* Attendant Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Select Attendant
            </label>

            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search attendants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Attendant List */}
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y">
              {filteredAttendants.length === 0 ? (
                <p className="text-sm text-gray-500 p-4 text-center">
                  No attendants available
                </p>
              ) : (
                filteredAttendants.map((attendant) => (
                  <div
                    key={attendant.id}
                    onClick={() => handleSelectAttendant(attendant)}
                    className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition ${
                      selectedAttendant?.id === attendant.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{attendant.name}</p>
                      <p className="text-xs text-gray-500">{attendant.email}</p>
                    </div>
                    {selectedAttendant?.id === attendant.id && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                ))
              )}
            </div>

            <input type="hidden" {...register("attendantId")} />
            {errors.attendantId && (
              <p className="text-sm text-red-600">
                {errors.attendantId.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              rows={2}
              placeholder="Add any notes about this assignment..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Server Error */}
          {state?.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}

          <SubmitButton name="Assign Attendant" isPending={isPending} />
        </form>
      </div>
    </BaseModal>
  );
}
