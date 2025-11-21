"use client";

import { createMineAction } from "@/actions/mine";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { mineFormSchema } from "@/validations/mine";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

export default function MineAddForm({
  mine,
  onClose,
}: {
  mine: any;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };
  const mineId = mine?.id || "";

  const createMineActionWithId = createMineAction.bind(null, mineId);
  const [state, formAction, isPending] = useActionState(
    createMineActionWithId,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mineFormSchema),
    defaultValues: {
      name: mine?.name || "",
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
        {mineId ? "Edit Mine" : "Add Mine"}
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        <InputValidated
          label="Mine Name"
          name="name"
          placeholder="Enter mine name"
          register={register}
          errors={errors}
          isPending={isPending}
          stateError={state?.errors}
        />

        <SubmitButton
          name={mineId ? "Update Mine" : "Add Mine"}
          isPending={isPending}
        />
      </form>
    </motion.div>
  );
}
