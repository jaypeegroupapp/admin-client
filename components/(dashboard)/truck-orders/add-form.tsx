"use client";

import { createTruckAction } from "@/actions/truck";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { truckFormSchema } from "@/validations/truck";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { truckInputFormData } from "@/constants/truck";

export default function TruckAddForm({
  truck,
  onClose,
}: {
  truck: any;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };
  const truckId = truck?.id || "";

  const createTruckActionWithId = createTruckAction.bind(null, truckId);
  const [state, formAction, isPending] = useActionState(
    createTruckActionWithId,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  console.log({ truck });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(truckFormSchema),
    defaultValues: {
      plateNumber: truck?.plateNumber || "",
      registrationNumber: truck?.registrationNumber || "",
      vinNumber: truck?.vinNumber || "",
      make: truck?.make || "",
      model: truck?.model || "",
      year: truck?.year || "",
      colour: truck?.colour || "",
    },
  });

  const onSubmit = handleSubmit(async () => {
    const formData = new FormData(formRef.current!);
    startTransition(() => {
      formAction(formData);
      onClose();
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl w-full sm:w-[420px] p-6 shadow-lg"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {truckId ? "Edit Truck" : "Add Truck"}
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        {truckInputFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />
        ))}

        {/* 
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("isActive")} />
          <label className="text-sm font-medium text-gray-700">
            Active Truck
          </label>
        </div>
         */}

        <SubmitButton
          name={truckId ? "Update Truck" : "Add Truck"}
          isPending={isPending}
        />
      </form>
    </motion.div>
  );
}
