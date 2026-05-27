"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import { connectDispenserToTankerAction } from "@/actions/tanker-dispenser";
import { connectDispenserSchema } from "@/validations/tanker-dispenser";
import { getUnassignedDispensers } from "@/data/tanker-dispenser";
import { DispenserSearch } from "./search";
import { DispenserList } from "./list";

export function ConnectDispenserModal({
  open,
  onClose,
  onSuccess,
  tankerId,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tankerId: string;
}) {
  const initialState = { message: "", errors: {} };
  const [state, formAction, isPending] = useActionState(
    connectDispenserToTankerAction.bind(null, tankerId),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [dispensers, setDispensers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDispenser, setSelectedDispenser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(connectDispenserSchema),
  });

  const loadDispensers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUnassignedDispensers();
      if (result.success) {
        setDispensers(result.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      loadDispensers();
      setSelectedDispenser(null);
      setSearchTerm("");
      reset();
      // Reset form action state
      if (state?.message) {
        // Force reset of state by re-rendering
      }
    }
  }, [open, loadDispensers, reset]);

  // Handle successful connection
  useEffect(() => {
    if (state?.success) {
      // Call onSuccess first
      onSuccess?.();
      // Then close modal
      onClose();
    }
  }, [state?.success, onSuccess, onClose]);

  const filteredDispensers = dispensers.filter((dispenser) =>
    dispenser.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onSubmit = handleSubmit(() => {
    if (!selectedDispenser) {
      return;
    }
    const formData = new FormData(formRef.current!);
    startTransition(() => {
      formAction(formData);
    });
  });

  const handleSelectDispenser = (dispenser: any) => {
    setSelectedDispenser(dispenser);
    setValue("dispenserId", dispenser.id);
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Connect Dispenser to Tanker
        </h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <DispenserSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <DispenserList
            dispensers={filteredDispensers}
            selectedDispenser={selectedDispenser}
            loading={loading}
            onSelect={handleSelectDispenser}
          />

          <input type="hidden" {...register("dispenserId")} />
          {errors.dispenserId && (
            <p className="text-sm text-red-600">{errors.dispenserId.message}</p>
          )}

          {state?.message && !state?.success && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}

          <SubmitButton name="Connect Dispenser" isPending={isPending} />
        </form>
      </div>
    </BaseModal>
  );
}
