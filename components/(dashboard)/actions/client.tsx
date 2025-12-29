"use client";

import { useEffect, useState } from "react";
import { IAction } from "@/definitions/action";
import ActionModal from "@/components/ui/modal";
import ActionAddForm from "./form";
import { ActionList } from "./list";
import { ActionHeader } from "./header";

export function ActionsClientPage({
  initialActions,
}: {
  initialActions: IAction[];
}) {
  const [actions, setActions] = useState<IAction[]>(initialActions);
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    setOpen(true);
  };

  useEffect(() => {
    setActions(initialActions);
  }, [initialActions]);

  return (
    <div className="space-y-6">
      <ActionHeader onAdd={handleAdd} />

      <ActionList actions={actions} />

      <ActionModal isOpen={open} onClose={() => setOpen(false)}>
        <ActionAddForm onClose={() => setOpen(false)} />
      </ActionModal>
    </div>
  );
}
