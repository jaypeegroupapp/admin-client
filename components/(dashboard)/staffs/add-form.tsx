"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputValidated from "@/components/ui/input-validated";
import { SubmitButton } from "@/components/ui/buttons";
import { staffFormSchema, StaffForm } from "@/validations/staff";
import { createStaffAction } from "@/actions/staff";
import { startTransition, useActionState, useRef } from "react";
import { motion } from "framer-motion";

type RoleOption = {
  id: string;
  name: string;
};

export default function StaffAddForm({
  staff,
  roles,
  onClose,
}: {
  staff: any | null;
  roles: RoleOption[];
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };

  const [state, formAction, isPending] = useActionState(
    createStaffAction.bind(null, staff?.id ?? ""),
    initialState
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffForm>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: staff?.name ?? "",
      email: staff?.email ?? "",
      role: staff?.roleId ?? "",
      status: staff?.status ?? "active",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl w-full sm:w-[420px] p-6 shadow-lg"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Staff</h2>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(() => {
            startTransition(() => {
              formAction(new FormData(formRef.current!));
            });
          })(e);
        }}
        className="space-y-4"
      >
        <InputValidated
          label="Full Name"
          name="name"
          register={register}
          errors={errors}
          stateError={state.errors}
          isPending={isPending}
        />

        {!staff && (
          <InputValidated
            label="Email Address"
            name="email"
            type="email"
            register={register}
            errors={errors}
            stateError={state.errors}
            isPending={isPending}
          />
        )}

        {/* 🔽 ROLE DROPDOWN */}
        {!staff && (
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              {...register("role")}
              disabled={isPending}
              className="w-full px-4 py-2 rounded-full bg-white text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>
        )}

        {/* STATUS */}
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            {...register("status")}
            className="w-full px-4 py-2 rounded-full bg-white text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <SubmitButton
          name={staff ? "Update Staff" : "Create Staff"}
          isPending={isPending}
        />
      </form>
    </motion.div>
  );
}
