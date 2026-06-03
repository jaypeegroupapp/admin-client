"use client";

import { useRef, startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { SubmitButton } from "@/components/ui/buttons";
import { cashTransactionFormSchema } from "@/validations/cash-transaction";
import { createCashTransactionAction } from "@/actions/cash-transaction";
import { DispenserStatusCard } from "./dispenser-status-card";
import { ProductSelector } from "./product-selector";
import { CustomerDetailsForm } from "./customer-details-form";
import { TransactionSummary } from "./transaction-summary";

const CashTransactionForm = ({ userDispenser }: { userDispenser?: any }) => {
  const initialState = { message: "", errors: {} };
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

  const formRef = useRef<HTMLFormElement>(null);

  const canCreateTransaction =
    userDispenser?.dispenser && userDispenser?.attendance;

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

      <DispenserStatusCard userDispenser={userDispenser} />

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
        <ProductSelector
          register={register}
          errors={errors}
          setValue={setValue}
          productId={productId}
          canCreateTransaction={canCreateTransaction}
        />

        <CustomerDetailsForm
          register={register}
          errors={errors}
          stateError={state?.errors}
          isPending={!canCreateTransaction}
        />

        <input type="hidden" {...register("grid")} />
        <input type="hidden" {...register("plusDiscount")} />

        <TransactionSummary
          productId={productId}
          litresPurchased={litresPurchased}
          stateMessage={state?.message}
        />

        <SubmitButton name="Complete Cash Transaction" isPending={isPending} />
      </form>
    </motion.div>
  );
};

export default CashTransactionForm;
