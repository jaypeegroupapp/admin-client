"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { SubmitButton } from "@/components/ui/buttons";
import { connectDispenserToTankerAction } from "@/actions/tanker-dispenser";
import { connectDispenserSchema } from "@/validations/tanker-dispenser";
import { getUnassignedDispensers } from "@/data/tanker-dispenser";
import { Search, Fuel } from "lucide-react";

export function ConnectDispenserModal({
  open,
  onClose,
  tankerId,
}: {
  open: boolean;
  onClose: () => void;
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(connectDispenserSchema),
  });

  useEffect(() => {
    if (open) {
      loadDispensers();
    }
  }, [open]);

  const loadDispensers = async () => {
    const result = await getUnassignedDispensers();
    if (result.success) {
      setDispensers(result.data);
    }
  };

  const filteredDispensers = dispensers.filter((dispenser) =>
    dispenser.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onSubmit = handleSubmit(() => {
    const formData = new FormData(formRef.current!);
    startTransition(() => {
      formAction(formData);
      onClose();
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
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Select Dispenser
            </label>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search dispensers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y">
              {filteredDispensers.length === 0 ? (
                <p className="text-sm text-gray-500 p-4 text-center">
                  No unassigned dispensers available
                </p>
              ) : (
                filteredDispensers.map((dispenser) => (
                  <div
                    key={dispenser.id}
                    onClick={() => handleSelectDispenser(dispenser)}
                    className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition ${
                      selectedDispenser?.id === dispenser.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Fuel size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{dispenser.name}</p>
                      <p className="text-xs text-gray-500">
                        Current stock: {dispenser.litres || 0}L
                      </p>
                    </div>
                    {selectedDispenser?.id === dispenser.id && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                ))
              )}
            </div>

            <input type="hidden" {...register("dispenserId")} />
            {errors.dispenserId && (
              <p className="text-sm text-red-600">
                {errors.dispenserId.message}
              </p>
            )}
          </div>

          {state?.message && (
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
