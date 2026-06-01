export const productInputFormData = [
  {
    name: "name",
    label: "Product Name",
    placeholder: "Enter product name",
    type: "text",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Short description",
    type: "text",
  },
  {
    name: "grid",
    label: "Grid Price (R)",
    placeholder: "Enter grid price",
    type: "number",
    step: "0.01",
    min: "0",
  },
  {
    name: "discount",
    label: "Discount (R)",
    placeholder: "Enter discount",
    type: "number",
    step: "0.01",
    min: "0",
  },
  {
    name: "minStockThreshold",
    label: "Minimum Stock Threshold (L)",
    placeholder: "Enter minimum threshold in litres",
    type: "number",
    step: "100",
    min: "0",
  },
];
