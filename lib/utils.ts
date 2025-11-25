import { months } from "@/constants/dashboard";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fillMissingMonths(
  results: { month: number; [key: string]: number }[],
  field: string
) {
  const monthMap = new Map(results.map((r) => [r.month, r]));

  return months.map((name, index) => {
    const monthNumber = index + 1; // 1–12

    return {
      month: name,
      [field]: monthMap.get(monthNumber)?.[field] ?? 0,
    };
  });
}
