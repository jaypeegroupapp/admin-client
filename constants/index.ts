export type IconKey =
  | "dashboard"
  | "orders"
  | "truckOrders"
  | "companies"
  | "companyInvoices"
  | "mineInvoices"
  | "products"
  | "mines"
  | "companyCredits"
  | "creditApproval"
  | "staff"
  | "roles"
  | "profile";

export type PagePermission = {
  name: string;
  href: string;
  action: string;
  resource: string;
  icon: IconKey; // ✅ string, not LucideIcon
  section: "main" | "other";
};

export const PAGE_PERMISSIONS: PagePermission[] = [
  {
    name: "Dashboard",
    href: "/",
    action: "read",
    resource: "dashboard",
    icon: "dashboard",
    section: "main",
  },
  {
    name: "Orders",
    href: "/orders",
    action: "read",
    resource: "order",
    icon: "orders",
    section: "main",
  },
  {
    name: "Truck Orders",
    href: "/truck-orders",
    action: "read",
    resource: "truck-order",
    icon: "truckOrders",
    section: "main",
  },

  // --- Admin / Ops ---
  {
    name: "Transporters",
    href: "/companies",
    action: "read",
    resource: "company",
    icon: "companies",
    section: "other",
  },
  {
    name: "Transporter Invoices",
    href: "/company-invoices",
    action: "read",
    resource: "company-invoice",
    icon: "companyInvoices",
    section: "other",
  },
  {
    name: "Mine Invoices",
    href: "/mine-invoices",
    action: "read",
    resource: "mine-invoice",
    icon: "mineInvoices",
    section: "other",
  },
  {
    name: "Products",
    href: "/products",
    action: "read",
    resource: "product",
    icon: "products",
    section: "other",
  },
  {
    name: "Mines",
    href: "/mines",
    action: "read",
    resource: "mine",
    icon: "mines",
    section: "other",
  },
  {
    name: "Transporter Credits",
    href: "/company-credits",
    action: "read",
    resource: "company-credit",
    icon: "companyCredits",
    section: "other",
  },
  {
    name: "Credit Approval",
    href: "/company-credit-approvals",
    action: "approve",
    resource: "company-credit-approval",
    icon: "creditApproval",
    section: "other",
  },
  {
    name: "Staff",
    href: "/staffs",
    action: "read",
    resource: "staff",
    icon: "staff",
    section: "other",
  },
  {
    name: "Roles",
    href: "/roles",
    action: "read",
    resource: "role",
    icon: "roles",
    section: "other",
  },
  {
    name: "Profile",
    href: "/profile",
    action: "read",
    resource: "user",
    icon: "profile",
    section: "other",
  },
];
