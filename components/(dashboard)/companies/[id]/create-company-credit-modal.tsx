"use client";

import { updateCompanyCreditAction } from "@/actions/company-credit";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import Select from "@/components/ui/select-validated";
import Textarea from "@/components/ui/textarea-validated";
import { creditMineFormSchema } from "@/validations/company-credit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BaseModal } from "@/components/ui/base-modal";
import { creditMineInputFormData } from "@/constants/company-credit";

export function CreateCompanyCreditModal({
  companyId,
  mines,
  editingCredit,
  open,
  onClose,
}: {
  companyId: string;
  mines: { _id: string; name: string }[];
  editingCredit?: any | null;
  open: boolean;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };

  const [state, formAction, isPending] = useActionState(
    updateCompanyCreditAction.bind(null, companyId),
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(creditMineFormSchema),
    defaultValues: {
      creditLimit: editingCredit?.creditLimit || "",
      requester: editingCredit?.requester || "",
      reason: editingCredit?.reason || "",
      mineId: editingCredit?.mineId || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData(formRef.current!);
    formData.append("companyId", companyId);

    if (editingCredit) {
      formData.append("creditId", editingCredit.id);
    }

    startTransition(() => {
      formAction(formData);
      onClose();
    });
  });

  return (
    <BaseModal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {editingCredit ? "Update Credit" : "Create Company Credit"}
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        {creditMineInputFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />
        ))}

        {/* Hide mine selection when editing */}
        {!editingCredit && (
          <Select
            label="Mine"
            name="mineId"
            register={register}
            errors={errors}
            options={mines}
          />
        )}

        <Select
          label="Requester"
          name="requester"
          register={register}
          errors={errors}
          options={[
            { _id: "Transporter", name: "Transporter" },
            { _id: "Business", name: "Business" },
            { _id: "Mine", name: "Mine" },
          ]}
        />

        <Textarea
          label="Reason"
          name="reason"
          placeholder="Enter reason for credit request"
          register={register}
          errors={errors}
        />

        <div>
          <label className="text-sm font-medium text-gray-800">Document</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
            {...register("document")}
            className="rounded-md border px-3 py-2 bg-white w-100"
          />
          {errors.document && (
            <p className="text-sm text-red-500">
              {errors.document.message as string}
            </p>
          )}
        </div>

        <SubmitButton
          name={editingCredit ? "Update Credit" : "Submit Credit Request"}
          isPending={isPending}
        />
      </form>
    </BaseModal>
  );
}
