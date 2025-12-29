"use client";

import { createActionAction } from "@/actions/action";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { actionFormSchema } from "@/validations/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

export default function ActionAddForm({
  action,
  onClose,
}: {
  action?: any;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };
  const actionId = action?.id || "";

  const createActionWithId = createActionAction.bind(null, actionId);
  const [state, formAction, isPending] = useActionState(
    createActionWithId,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      name: action?.name || "",
      description: action?.description || "",
    },
  });

  const onSubmit = handleSubmit(() => {
    const formData = new FormData(formRef.current!);
    startTransition(() => {
      formAction(formData);
      onClose();
    });
  });

  return (
    <motion.div className="bg-white rounded-2xl p-6 w-[420px]">
      <h2 className="font-semibold mb-4">
        {actionId ? "Edit Action" : "Add Action"}
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
        <InputValidated
          label="Action Name"
          name="name"
          placeholder="<resource>:<action> E.g order:create"
          register={register}
          errors={formState.errors}
          stateError={state.errors}
        />

        <InputValidated
          label="Description"
          name="description"
          placeholder="E.g Create Invoice, Create Order, Create Product, etc..."
          register={register}
          errors={formState.errors}
          stateError={state.errors}
        />

        <SubmitButton name="Save Action" isPending={isPending} />
      </form>
    </motion.div>
  );
}
