"use client";

import { useRef, startTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { SubmitButton } from "@/components/ui/buttons";
import InputValidated from "@/components/ui/input-validated";
import { cashTransactionFormSchema } from "@/validations/cash-transaction";
import { cashTransactionInputFormData } from "@/constants/cash-transaction";
import { createCashTransactionAction } from "@/actions/cash-transaction";
import { getProducts } from "@/data/product";

const CashTransactionForm = () => {
  type ActionState = {
    message: string;
    errors: Record<string, string | string[]>;
  };

  const initialState: ActionState = { message: "", errors: {} };
  const [products, setProducts] = useState<any[]>([]);
  const [state, formAction, isPending] = useActionState(
    createCashTransactionAction,
    initialState,
  );

  /* const [mines, setMines] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCredit, setEditingCredit] = useState<any | null>(null);

  const loadCredits = async () => {
    const resCredit = await getCompanyCreditsByCompanyId(companyId);
    if (resCredit.success) setCredits(resCredit.data);

    const creditMineNames = resCredit.data.map((c: any) => c.mineName);

    const res = await getMines();
    if (res.success && res.data) {
      setMines(
        res.data
          .filter((mine: any) => !creditMineNames.includes(mine.name))
          .map((mine: any) => ({ _id: mine.id, name: mine.name })),
      );
    }
  }; */

  const loadProducts = async () => {
    // Implement product loading logic here
    const resProducts = await getProducts();
    if (resProducts.success && resProducts.data) {
      // Handle loaded products, e.g., set state
      setProducts(resProducts.data);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cashTransactionFormSchema),
    defaultValues: {
      companyName: "",
      plateNumber: "",
      driverName: "",
      phoneNumber: "",
      litresPurchased: 0,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl w-full sm:w-[420px] p-6 shadow-lg"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Add Cash Transaction
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
        {cashTransactionInputFormData.map((input) => (
          <InputValidated
            key={input.name}
            {...input}
            register={register}
            errors={errors}
            stateError={state?.errors}
            isPending={isPending}
          />
        ))}

        <SubmitButton name="Save Cash Transaction" isPending={isPending} />
      </form>
    </motion.div>
  );
};

export default CashTransactionForm;
