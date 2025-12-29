export interface IAction {
  id?: string;
  name: string; // e.g. "invoice.pay"
  description?: string;
  resource: string; // e.g. "invoice"
  createdAt?: string;
  updatedAt?: string;
}
