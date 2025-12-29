"use client";

import { IAction } from "@/definitions/action";
import { ActionCard } from "./card";

export function ActionList({ actions }: { actions: IAction[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => (
        <ActionCard key={action.id} action={action} />
      ))}
    </div>
  );
}
