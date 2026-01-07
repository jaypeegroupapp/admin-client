"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import InputValidated from "@/components/ui/input-validated";
import { SubmitButton } from "@/components/ui/buttons";
import { loginFormData } from "@/constants/auth";
import { loginUserformSchema, LoginUserForm } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, startTransition, useActionState } from "react";
import { loginUser } from "@/actions/auth";

const LoginForm = () => {
  const initialState = {
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserForm>({
    resolver: zodResolver(loginUserformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
      <div className="w-full mb-6">
        {loginFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            stateError={state.errors}
            isPending={isPending}
          />
        ))}
      </div>

      <SubmitButton name="Login" isPending={isPending} />

      {/* Error message from action */}
      {state?.message && (
        <p className="text-red-600 text-sm mt-2">{state.message}</p>
      )}
    </motion.form>
  );
};

export default LoginForm;
