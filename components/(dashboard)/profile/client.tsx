"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { logout } from "@/actions/auth";

interface Props {
  user: {
    email?: string;
  };
  staff?: { name: string } | undefined;
}

export function ProfileClient({ user, staff }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto mt-10 p-8 border border-gray-200 rounded-2xl bg-white shadow-sm space-y-8"
    >
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">Manage your account details</p>
      </div>

      <div className="border-t border-gray-100 pt-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600">Full Name</p>
          <p className="text-gray-900 font-medium">{staff?.name || "—"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Email Address</p>
          <p className="text-gray-900 font-medium">{user?.email || "—"}</p>
        </div>

        {/* {user?.role && (
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="text-gray-900 font-medium capitalize">{user.role}</p>
          </div>
        )} */}
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className={`px-6 py-2 rounded-lg text-white font-medium transition ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-black"
          }`}
        >
          {isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </motion.div>
  );
}
