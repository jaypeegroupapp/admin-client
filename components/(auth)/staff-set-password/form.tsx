"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import InputValidated from "@/components/ui/input-validated";
import { SubmitButton } from "@/components/ui/buttons";
import { startTransition, useActionState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetPasswordForm, setPasswordFormSchema } from "@/validations/auth";
import { registerExistingUser } from "@/actions/auth";

const Form = ({ id }: { id: string }) => {
  const initialState = {
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    registerExistingUser.bind(null, id),
    initialState
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordForm>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <motion.form
      ref={formRef}
      onSubmit={(evt) => {
        evt.preventDefault();
        handleSubmit(() => {
          const formData = new FormData(formRef.current!);
          startTransition(() => {
            formAction(formData);
          });
        })(evt);
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full"
    >
      <div className="w-full mb-6 space-y-4">
        <InputValidated
          label="Password"
          name="password"
          type="password"
          register={register}
          errors={errors}
          stateError={state.errors}
          isPending={isPending}
        />

        <InputValidated
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={register}
          errors={errors}
          stateError={state.errors}
          isPending={isPending}
        />
      </div>

      <SubmitButton name="Set Password" isPending={isPending} />
    </motion.form>
  );
};

export default Form;
