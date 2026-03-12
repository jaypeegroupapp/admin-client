// src/components/(dashboard)/cash-transactions/form.tsx
"use client";

import {
  useRef,
  startTransition,
  useActionState,
  useState,
  useEffect,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { cashTransactionFormSchema } from "@/validations/cash-transaction";
import { cashTransactionInputFormData } from "@/constants/cash-transaction";
import { createCashTransactionAction } from "@/actions/cash-transaction";
import { getPublishedProducts } from "@/data/product";
import { Package, AlertCircle, Droplet } from "lucide-react";

const CashTransactionForm = ({ userDispenser }: { userDispenser?: any }) => {
  type ActionState = {
    message: string;
    errors: Record<string, string | string[]>;
  };

  const initialState: ActionState = { message: "", errors: {} };
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [state, formAction, isPending] = useActionState(
    createCashTransactionAction,
    initialState,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cashTransactionFormSchema),
    defaultValues: {
      companyName: "",
      plateNumber: "",
      driverName: "",
      phoneNumber: "",
      litresPurchased: 0,
      productId: "",
    },
  });

  const litresPurchased = Number(watch("litresPurchased")) || 0;
  const productId = watch("productId");

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Update grid and plusDiscount when product changes
  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setValue("grid", product.grid || 0);
        setValue("plusDiscount", product.discount || 0);
      }
    }
  }, [productId, products, setValue]);

  const loadProducts = async () => {
    setLoading(true);
    const resProducts = await getPublishedProducts();
    if (resProducts.success && resProducts.data) {
      setProducts(resProducts.data);
    }
    setLoading(false);
  };

  const formRef = useRef<HTMLFormElement>(null);

  const calculatedTotal =
    litresPurchased *
    ((selectedProduct?.grid || 0) + (selectedProduct?.discount || 0));

  // Check if user has dispenser assigned and is logged in
  const canCreateTransaction =
    userDispenser?.dispenser && userDispenser?.attendance;
  const hasEnoughStock =
    canCreateTransaction && userDispenser.dispenser.litres >= litresPurchased;

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl w-full sm:w-[420px] p-6 shadow-lg"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        New Cash Transaction
      </h2>

      {/* Dispenser Status Warning */}
      {userDispenser && !userDispenser.attendance && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
          <p className="text-sm text-yellow-700">
            You are not logged into your dispenser. Please log in first.
          </p>
        </div>
      )}

      {userDispenser && userDispenser.attendance && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <Droplet size={16} className="text-green-600" />
          <div className="text-sm text-green-700">
            <span className="font-medium">{userDispenser.dispenser.name}</span>{" "}
            - Available Stock:{" "}
            <span className="font-bold">{userDispenser.dispenser.litres}L</span>
          </div>
        </div>
      )}

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
        {/* Product Selection */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Product *</label>
          <div className="relative">
            <Package
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              {...register("productId")}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading || !canCreateTransaction}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - R{product.grid || 0}/L
                </option>
              ))}
            </select>
          </div>
          {errors.productId && (
            <p className="text-sm text-red-600">{errors.productId.message}</p>
          )}
        </div>

        {/* Customer Details */}
        {cashTransactionInputFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            stateError={state?.errors}
            isPending={!canCreateTransaction}
            //disabled={!canCreateTransaction}
          />
        ))}

        {/* Hidden fields for grid and plusDiscount */}
        <input type="hidden" {...register("grid")} />
        <input type="hidden" {...register("plusDiscount")} />

        {/* Price Preview */}
        {selectedProduct && litresPurchased > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <h3 className="text-sm font-medium text-blue-800">
              Transaction Summary
            </h3>
            <div className="flex justify-between text-sm">
              <span>Price per Litre:</span>
              <span className="font-medium">
                R{" "}
                {(
                  (selectedProduct.grid || 0) + (selectedProduct.discount || 0)
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Litres:</span>
              <span className="font-medium">{litresPurchased}L</span>
            </div>
            <div className="flex justify-between text-base font-semibold border-t border-blue-200 pt-2">
              <span>Total Amount:</span>
              <span className="text-green-600">
                R {calculatedTotal.toFixed(2)}
              </span>
            </div>

            {/* Stock Warning */}
            {userDispenser &&
              litresPurchased > userDispenser.dispenser.litres && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-600 mt-0.5" />
                  <p className="text-xs text-red-700">
                    Insufficient stock! Available:{" "}
                    {userDispenser.dispenser.litres}L
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Server Error */}
        {state?.message && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5" />
            <p className="text-sm text-red-600">{state.message}</p>
          </div>
        )}

        <SubmitButton
          name="Complete Cash Transaction"
          // isPending={isPending}
          isPending={
            !canCreateTransaction ||
            litresPurchased > (userDispenser?.dispenser?.litres || 0)
          }
        />
      </form>
    </motion.div>
  );
};

export default CashTransactionForm;
