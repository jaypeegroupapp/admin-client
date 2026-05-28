export const dispenserInputFormData = [
  {
    name: "name",
    label: "Dispenser Name",
    placeholder: "Enter dispenser name",
    type: "text",
  },
];

export const dispenserCompleteFormData = [
  {
    name: "name",
    label: "Dispenser Name",
    placeholder: "Enter dispenser name",
    type: "text",
  },
  {
    name: "totalDispensed",
    label: "Initial Meter Reading (Litres)",
    placeholder: "Enter current meter reading",
    type: "number",
    step: "0.1",
    min: "0",
  },
];
