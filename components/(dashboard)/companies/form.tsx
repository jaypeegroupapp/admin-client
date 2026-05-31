"use client";

import { useRef, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { createCompanyAction } from "@/actions/company";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { CompanyFormData, companyFormSchema } from "@/validations/company";
import { companyInputFormData } from "@/constants/company";

const CompanyEditForm = ({
  company,
  onClose,
}: {
  company?: any;
  onClose: () => void;
}) => {
  type ActionState = {
    message: string;
    errors: Record<string, string | string[]>;
  };
  const initialState: ActionState = { message: "", errors: {} };
  const companyId = company?.id || "";

  const createCompanyActionWithId = createCompanyAction.bind(null, companyId);
  const [state, formAction, isPending] = useActionState(
    createCompanyActionWithId,
    initialState,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || "",
      registrationNumber: company?.registrationNumber || "",
      contactEmail: company?.contactEmail || "",
      contactPhone: company?.contactPhone || "",
      billingAddress: company?.billingAddress || "",
      vatNumber: company?.vatNumber || "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message && !state?.errors) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl w-full sm:w-[420px] p-6 shadow-lg"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {companyId ? "Edit Company" : "Add Company"}
      </h2>

      <form
        ref={formRef}
        onSubmit={(evt) => {
          evt.preventDefault();
          handleSubmit(() => {
            const formData = new FormData(formRef.current!);
            startTransition(() => formAction(formData));
          })(evt);
        }}
        className="flex flex-col gap-4"
      >
        {companyInputFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            stateError={state?.errors}
            isPending={isPending}
          />
        ))}

        {state?.message && state?.errors && (
          <p className="text-red-600 text-center text-sm mt-3">
            {state.message}
          </p>
        )}

        <SubmitButton
          name={companyId ? "Update Company" : "Save Company"}
          isPending={isPending}
        />
      </form>
    </motion.div>
  );
};

export default CompanyEditForm;
