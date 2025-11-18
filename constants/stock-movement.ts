export const stockInputFormData = [
  {
    name: "quantity",
    label: "Quantity Added",
    type: "number",
    placeholder: "Enter quantity",
  },
  {
    name: "purchasedPrice",
    label: "Purchased Price",
    type: "number",
    step: "0.01",
    placeholder: "Enter purchase price",
  },
  {
    name: "sellingPriceAtPurchase",
    label: "Selling Price at Purchase",
    type: "number",
    step: "0.01",
    placeholder: "Enter current selling price",
  },
  {
    name: "reason",
    label: "Reason (optional)",
    type: "textarea",
    placeholder: "Reason for adding stock",
  },
];
