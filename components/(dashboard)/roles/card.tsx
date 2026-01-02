"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { IRole } from "@/definitions/role";
import { useRouter } from "next/navigation";

export function RoleCard({ role }: { role: IRole }) {
  const router = useRouter();

  return (
    <motion.div
      layout
      onClick={() => router.push(`/roles/${role.id}`)}
      className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Shield className="text-gray-500" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold">{role.name}</h3>
          <p className="text-xs text-gray-500">
            Role ID: {role.id?.slice(-6).toUpperCase()}
          </p>
        </div>
      </div>

      {role.description && (
        <p className="text-sm text-gray-600">{role.description}</p>
      )}
    </motion.div>
  );
}
