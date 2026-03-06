// src/constants/dispenser.ts
export const dispenserInputFormData = [
  {
    name: "name",
    label: "Dispenser Name",
    placeholder: "Enter dispenser name",
    type: "text",
  },
];

// For form with product selection
export const dispenserCompleteFormData = [
  {
    name: "name",
    label: "Dispenser Name",
    placeholder: "Enter dispenser name",
    type: "text",
  },
  {
    name: "litres",
    label: "Litres",
    placeholder: "Enter litres capacity",
    type: "number",
    step: "0.1",
    min: "0",
  },
];
