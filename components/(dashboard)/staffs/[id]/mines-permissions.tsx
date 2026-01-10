"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMines } from "@/data/mine";
import { getStaffMines } from "@/data/staff";
import {
  assignMineToStaffAction,
  removeMineFromStaffAction,
} from "@/actions/staff";

export function StaffMinePermissions({ staffId }: { staffId: string }) {
  const router = useRouter();
  const [mines, setMines] = useState<any[]>([]);
  const [staffMines, setStaffMines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const hasFullAccess = staffMines.includes("*");

  useEffect(() => {
    async function load() {
      setLoading(true);

      const allMines = await getMines();
      setMines(allMines.data || []);

      const staffMinesResult = await getStaffMines(staffId);
      setStaffMines(staffMinesResult.data || []);

      setLoading(false);
    }

    load();
  }, [staffId]);

  const toggleAll = async (checked: boolean) => {
    setStaffMines(checked ? ["*"] : []);

    if (checked) {
      await assignMineToStaffAction(staffId, "*");
    } else {
      await removeMineFromStaffAction(staffId, "*");
    }

    router.refresh();
  };

  const toggleMine = async (mineId: string, checked: boolean) => {
    if (hasFullAccess) return;

    setStaffMines((prev) =>
      checked ? [...prev, mineId] : prev.filter((id) => id !== mineId)
    );

    if (checked) {
      await assignMineToStaffAction(staffId, mineId);
    } else {
      await removeMineFromStaffAction(staffId, mineId);
    }

    router.refresh();
  };

  if (loading) return null; // or skeleton

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <h3 className="text-lg font-semibold">Mine Access</h3>

      {/* FULL ACCESS */}
      <label className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
        <div>
          <p className="font-medium text-sm">Full Access</p>
          <p className="text-xs text-gray-500">Grants access to all mines</p>
        </div>

        <input
          type="checkbox"
          checked={hasFullAccess}
          onChange={(e) => toggleAll(e.target.checked)}
          className="h-4 w-4"
        />
      </label>

      {!hasFullAccess && (
        <div className="space-y-3">
          {mines.map((mine) => {
            const checked = staffMines.includes(mine.id);

            return (
              <label
                key={mine.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-sm">{mine.name}</p>
                  <p className="text-xs text-gray-500">
                    Created{" "}
                    {new Date(mine.createdAt).toLocaleDateString("en-ZA")}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => toggleMine(mine.id, e.target.checked)}
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
