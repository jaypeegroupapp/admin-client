import { LucideIcon } from "lucide-react";
import {
  Home,
  PackageCheck,
  Truck,
  Building2,
  FileText,
  WalletMinimal,
  Package,
  Mountain,
  CreditCard,
  FileCheck2,
  Users,
  Shield,
} from "lucide-react";

export type PagePermission = {
  name: string;
  href: string;
  action: string;
  resource: string;
  icon: LucideIcon;
  section: "main" | "other";
};

export const PAGE_PERMISSIONS: PagePermission[] = [
  {
    name: "Dashboard",
    href: "/",
    action: "read",
    resource: "dashboard",
    icon: Home,
    section: "main",
  },
  {
    name: "Orders",
    href: "/orders",
    action: "read",
    resource: "order",
    icon: PackageCheck,
    section: "main",
  },
  {
    name: "Truck Orders",
    href: "/truck-orders",
    action: "read",
    resource: "truck-order",
    icon: Truck,
    section: "main",
  },

  // --- Admin / Ops ---
  {
    name: "Transporters",
    href: "/companies",
    action: "read",
    resource: "company",
    icon: Building2,
    section: "other",
  },
  {
    name: "Transporter Invoices",
    href: "/company-invoices",
    action: "read",
    resource: "company-invoice",
    icon: FileText,
    section: "other",
  },
  {
    name: "Mine Invoices",
    href: "/mine-invoices",
    action: "read",
    resource: "mine-invoice",
    icon: WalletMinimal,
    section: "other",
  },
  {
    name: "Products",
    href: "/products",
    action: "read",
    resource: "product",
    icon: Package,
    section: "other",
  },
  {
    name: "Mines",
    href: "/mines",
    action: "read",
    resource: "mine",
    icon: Mountain,
    section: "other",
  },
  {
    name: "Transporter Credits",
    href: "/company-credits",
    action: "read",
    resource: "company-credit",
    icon: CreditCard,
    section: "other",
  },
  {
    name: "Credit Approval",
    href: "/company-credit-approvals",
    action: "approve",
    resource: "company-credit",
    icon: FileCheck2,
    section: "other",
  },
  {
    name: "Staff",
    href: "/staffs",
    action: "read",
    resource: "staff",
    icon: Users,
    section: "other",
  },
  {
    name: "Roles",
    href: "/roles",
    action: "read",
    resource: "role",
    icon: Shield,
    section: "other",
  },
];
