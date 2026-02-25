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
    name: "purchasePrice",
    label: "Purchased Price",
    type: "number",
    step: "0.01",
    placeholder: "Enter purchase price",
  },
  {
    name: "sellingPriceAtPurchase",
    label: "Grid at Purchase",
    type: "number",
    step: "0.01",
    placeholder: "Enter current selling price",
  },
  {
    name: "supplierName",
    label: "Supplier Name",
    placeholder: "Reason for adding stock",
  },
  {
    name: "invoiceNumber",
    label: "Invoice Number",
    placeholder: "Enter invoice number",
  },
  {
    name: "invoiceDate",
    label: "Invoice Date",
    type: "date",
    placeholder: "Enter invoice date",
  },
];
