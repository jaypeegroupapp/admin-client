"use client";

import { createProductAction } from "@/actions/product";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { productFormSchema } from "@/validations/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { productInputFormData } from "@/constants/product";

export default function ProductAddForm({
  product,
  onClose,
}: {
  product: any;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };
  const productId = product?.id || "";

  const createProductActionWithId = createProductAction.bind(null, productId);
  const [state, formAction, isPending] = useActionState(
    createProductActionWithId,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      stock: product?.stock || "",
      isPublished: product?.isPublished || false,
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
        {productId ? "Edit Product" : "Add Product"}
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        {productInputFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />
        ))}

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            {...register("isPublished")}
            className="accent-blue-600"
          />
          <label className="text-sm font-medium text-gray-700">
            Publish Product
          </label>
        </div>

        <SubmitButton
          name={productId ? "Update Product" : "Add Product"}
          isPending={isPending}
        />
      </form>
    </motion.div>
  );
}
