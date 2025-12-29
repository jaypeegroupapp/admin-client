"use client";

import { createRoleAction } from "@/actions/role";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { roleFormSchema } from "@/validations/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

export default function RoleAddForm({
  role,
  onClose,
}: {
  role?: any;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };
  const roleId = role?.id || "";

  const actionWithId = createRoleAction.bind(null, roleId);
  const [state, formAction, isPending] = useActionState(
    actionWithId,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
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
        {roleId ? "Edit Role" : "Add Role"}
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
        <InputValidated
          label="Role Name"
          name="name"
          placeholder="E.g station-attendant"
          register={register}
          errors={formState.errors}
          stateError={state.errors}
        />

        <InputValidated
          label="Description"
          name="description"
          placeholder="E.g Station Attendant"
          register={register}
          errors={formState.errors}
          stateError={state.errors}
        />

        <SubmitButton name="Save Role" isPending={isPending} />
      </form>
    </motion.div>
  );
}
