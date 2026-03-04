"use client";

import { disableCompanyCreditAction } from "@/actions/company-credit";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import Select from "@/components/ui/select-validated";
import Textarea from "@/components/ui/textarea-validated";
import { creditDisableMineFormSchema } from "@/validations/company-credit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { BaseModal } from "@/components/ui/base-modal";
import { creditMineInputFormData } from "@/constants/company-credit";

export function DisableCompanyCreditModal({
  companyId,
  mines,
  editingCredit,
  open,
  onClose,
  isDisableMode = false,
}: {
  companyId: string;
  mines: { _id: string; name: string }[];
  editingCredit?: any | null;
  open: boolean;
  onClose: () => void;
  isDisableMode?: boolean;
}) {
  const initialState = { message: "", errors: {} };

  const [state, formAction, isPending] = useActionState(
    disableCompanyCreditAction.bind(null, companyId),
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(creditDisableMineFormSchema),
    defaultValues: {
      requester: "",
      reason: "",
      creditId: editingCredit?.creditId || "",
    },
  });

  const onSubmit = (evt: any) => {
    evt.preventDefault();

    handleSubmit(() => {
      const formData = new FormData(formRef.current!);
      formData.append("companyId", companyId);

      if (editingCredit) {
        formData.append("creditId", editingCredit.id);
      }

      if (isDisableMode) {
        formData.append("disable", "true");
      }

      startTransition(() => {
        formAction(formData);
      });
    })(evt);
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isDisableMode
          ? "Disable Credit Facility"
          : editingCredit
            ? "Update Credit"
            : "Create Company Credit"}
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        {!isDisableMode &&
          creditMineInputFormData.map((input) => (
            <InputValidated
              key={input.name}
              {...input}
              register={register}
              errors={errors}
              isPending={isPending}
              stateError={state?.errors}
            />
          ))}

        {!editingCredit && !isDisableMode && (
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
          label="Comments"
          name="reason"
          placeholder="Enter reason"
          register={register}
          errors={errors}
        />

        <SubmitButton
          name={
            isDisableMode
              ? "Disable Credit Facility"
              : editingCredit
                ? "Update Credit"
                : "Submit Credit Request"
          }
          isPending={isPending}
        />
      </form>
    </BaseModal>
  );
}
