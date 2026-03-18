// src/constants/dispenser-stock.ts
export const fillDispenserInputFormData = [
  {
    name: "supplierName",
    label: "Supplier Name",
    placeholder: "Enter supplier name",
    type: "text",
  },
  {
    name: "invoiceNumber",
    label: "Invoice Number",
    placeholder: "Enter invoice number",
    type: "text",
  },
  {
    name: "invoiceUnitPrice",
    label: "Invoice Unit Price (R)",
    type: "number",
    step: "0.01",
    min: "0",
    placeholder: "Enter price per litre",
  },
  {
    name: "gridAtPurchase",
    label: "Grid Selling Price (R)",
    type: "number",
    step: "0.01",
    min: "0",
    placeholder: "Enter selling price per litre",
  },
  {
    name: "discount",
    label: "Discount (R)",
    type: "number",
    step: "0.1",
    min: "0",
    max: "100",
    placeholder: "Enter discount percentage",
  },
  {
    name: "invoiceDate",
    label: "Invoice Date",
    type: "date",
    placeholder: "Select invoice date",
  },
];
