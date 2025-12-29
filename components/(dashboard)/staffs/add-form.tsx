"use client";

import { createStaffAction } from "@/actions/staff";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { staffFormSchema, STAFF_ROLES } from "@/validations/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Select from "@/components/ui/select-validated";

export default function StaffAddForm({
  staff,
  onClose,
}: {
  staff: any;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };
  const staffId = staff?.id || "";

  const createStaffActionWithId = createStaffAction.bind(null, staffId);

  const [state, formAction, isPending] = useActionState(
    createStaffActionWithId,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: staff?.name || "",
      email: staff?.email || "",
      role: staff?.role || "Admin",
      status: staff?.status || "active",
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
        {staffId ? "Edit Staff" : "Add Staff"}
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        <InputValidated
          label="Staff Name"
          name="name"
          placeholder="Enter staff name"
          register={register}
          errors={errors}
          isPending={isPending}
          stateError={state?.errors}
        />

        <InputValidated
          label="Email Address"
          name="email"
          type="email"
          placeholder="staff@email.com"
          register={register}
          errors={errors}
          isPending={isPending}
          stateError={state?.errors}
        />

        {/* ROLE DROPDOWN */}
        {/* <Select
            label="Role"
            name="mineId"
            register={register}
            errors={errors}
            options={STAFF_ROLES}
          /> */}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700"></label>
          <select
            {...register("role")}
            disabled={isPending}
            className="rounded-md border px-3 py-2 text-sm"
          >
            {STAFF_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-xs text-red-600">{errors.role.message}</p>
          )}
        </div>

        <SubmitButton
          name={staffId ? "Update Staff" : "Add Staff"}
          isPending={isPending}
        />
      </form>
    </motion.div>
  );
}
