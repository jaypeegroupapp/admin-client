"use client";

import { useEffect, useState } from "react";
import { getActions } from "@/data/action";
import { getRoleActions } from "@/data/role";
import {
  assignActionToRoleAction,
  removeActionFromRoleAction,
} from "@/actions/role";
import { useRouter } from "next/navigation";

export function RolePermissions({ roleId }: { roleId: string }) {
  const router = useRouter();
  const [actions, setActions] = useState<any[]>([]);
  const [roleActions, setRoleActions] = useState<string[]>([]);

  const hasWildcard = roleActions.includes("*");

  useEffect(() => {
    async function load() {
      const actionsResult = await getActions();
      setActions(actionsResult.data || []);

      const roleActionsResult = await getRoleActions(roleId);
      setRoleActions(roleActionsResult.data || []);
    }

    load();
  }, [roleId]);

  const toggleAll = async (checked: boolean) => {
    setRoleActions(checked ? ["*"] : []);

    if (checked) {
      await assignActionToRoleAction(roleId, "*");
    } else {
      await removeActionFromRoleAction(roleId, "*");
    }

    router.refresh();
  };

  const toggle = async (actionId: string, checked: boolean) => {
    if (hasWildcard) return;

    setRoleActions((prev) =>
      checked ? [...prev, actionId] : prev.filter((id) => id !== actionId)
    );

    if (checked) {
      await assignActionToRoleAction(roleId, actionId);
    } else {
      await removeActionFromRoleAction(roleId, actionId);
    }

    router.refresh();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <h3 className="text-lg font-semibold">Permissions</h3>

      {/* SELECT ALL */}
      <label className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
        <div>
          <p className="font-medium text-sm">Full Access</p>
          <p className="text-xs text-gray-500">Grants access to all actions</p>
        </div>

        <input
          type="checkbox"
          checked={hasWildcard}
          onChange={(e) => toggleAll(e.target.checked)}
          className="h-4 w-4"
        />
      </label>

      {!hasWildcard && (
        <div className="space-y-3">
          {actions.map((action) => {
            const checked = roleActions.includes(action.id);

            return (
              <label
                key={action.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-sm">{action.name}</p>
                  <p className="text-xs text-gray-500">{action.resource}</p>
                </div>

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => toggle(action.id, e.target.checked)}
                  className="h-4 w-4"
                />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
