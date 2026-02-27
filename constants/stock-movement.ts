export const ADDEDSTOCK = "IN";
export const REMOVESTOCK = "OUT";
export const stockInputFormData = [
  {
    name: "quantity",
    label: "Quantity Added",
    type: "number",
    placeholder: "Enter quantity",
  },
  {
    name: "gridAtPurchase",
    label: "Grid at Purchase",
    type: "number",
    step: "0.01",
    placeholder: "Enter current grid",
  },
  {
    name: "discount",
    label: "Discount",
    type: "number",
    step: "0.01",
    placeholder: "Enter discount",
  },
  {
    name: "supplierName",
    label: "Supplier Name",
    placeholder: "Enter supplier name",
  },
  {
    name: "invoiceNumber",
    label: "Invoice Number",
    placeholder: "Enter invoice number",
  },
  {
    name: "invoiceUnitPrice",
    label: "Invoice Unit Price",
    type: "number",
    step: "0.01",
    placeholder: "Enter invoice unit price",
  },
  {
    name: "invoiceDate",
    label: "Invoice Date",
    type: "date",
    placeholder: "Enter invoice date",
  },
];
