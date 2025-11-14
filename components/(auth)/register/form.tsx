"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Link from "next/link";
import InputValidated from "@/components/ui/input-validated";
import { SubmitButton } from "@/components/ui/buttons";
import { registerFormData } from "@/constants/auth";
import { startTransition, useActionState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserForm, registerUserformSchema } from "@/validations/auth";
import { regsiterUser } from "@/actions/auth";

const RegisterForm = () => {
  const initialState = {
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    regsiterUser,
    initialState
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserForm>({
    resolver: zodResolver(registerUserformSchema),
    defaultValues: {
      name: "",
      email: "",
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
      <div className="w-full mb-6">
        {registerFormData.map((input) => (
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

      <SubmitButton name="Sign Up" isPending={isPending} />
      <p className="mt-5 text-sm text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-gray-700 underline">
          Login here
        </Link>
      </p>
    </motion.form>
  );
};

export default RegisterForm;
