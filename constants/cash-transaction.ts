// src/constants/cash-transaction.ts
export const cashTransactionInputFormData = [
  {
    name: "companyName",
    label: "Company Name",
    placeholder: "Enter company name",
  },
  {
    name: "plateNumber",
    label: "Plate Number",
    placeholder: "Enter truck plate number",
  },
  {
    name: "driverName",
    label: "Driver Name",
    placeholder: "Enter driver name",
    type: "text",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "Enter phone number",
  },
  {
    name: "litresPurchased",
    label: "Litres Purchased",
    placeholder: "Enter litres",
    type: "number",
    step: "0.1",
    min: "0",
  },
];
