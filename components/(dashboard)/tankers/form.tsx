"use client";

import { createTankerAction } from "@/actions/tanker";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { tankerFormSchema, tankerCompleteFormData } from "@/validations/tanker";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useActionState,
  startTransition,
  useRef,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { getPublishedProducts } from "@/data/product";
import { IProduct } from "@/definitions/product";

export default function TankerAddForm({
  tanker,
  onClose,
}: {
  tanker: any;
  onClose: () => void;
}) {
  const initialState = { message: "", errors: {} };
  const tankerId = tanker?.id || "";

  const createTankerActionWithId = createTankerAction.bind(null, tankerId);
  const [state, formAction, isPending] = useActionState(
    createTankerActionWithId,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getPublishedProducts();
      if (res?.success) setProducts(res.data || []);
    };
    fetchProducts();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tankerFormSchema),
    defaultValues: {
      name: tanker?.name || "",
      capacity: tanker?.capacity || 1,
      isPublished: tanker?.isPublished || false,
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
        {tankerId ? "Edit Tanker" : "Add Tanker"}
      </h2>

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
        {tankerCompleteFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            isPending={isPending}
            stateError={state?.errors}
          />
        ))}

        <div className="flex flex-col mb-4">
          <label className="text-black text-sm mb-1">Product</label>
          <select
            {...register("productId")}
            defaultValue={tanker?.productId || ""}
            className="w-full px-4 py-2 rounded-full bg-white text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.productId && (
            <span className="text-red-400 text-xs mt-1">
              {errors.productId?.message}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            {...register("isPublished")}
            defaultChecked={tanker?.isPublished || false}
            className="w-4 h-4"
          />
          <label className="text-sm text-gray-700">Published</label>
        </div>

        <SubmitButton
          name={tankerId ? "Update Tanker" : "Add Tanker"}
          isPending={isPending}
        />
      </form>
    </motion.div>
  );
}
