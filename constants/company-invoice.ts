import { s } from "framer-motion/client";

export const confirmPaymentFormData = [
  {
    name: "amount",
    label: "Payment Amount",
    type: "number",
    placeholder: "Enter amount paid",
    step: "0.01",
  },
  {
    name: "paymentDate",
    label: "Payment Date",
    type: "date",
  },
];
