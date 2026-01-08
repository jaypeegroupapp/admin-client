import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border rounded-2xl shadow-sm p-8 max-w-md text-center space-y-4">
        <div className="flex justify-center text-red-500">
          <ShieldAlert size={48} />
        </div>

        <h1 className="text-xl font-semibold text-gray-800">Access Denied</h1>

        <p className="text-sm text-gray-600">
          You don’t have permission to access this page. If you think this is a
          mistake, please contact an administrator.
        </p>

        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
        >
          Go back to Dashboard
        </Link>
      </div>
    </div>
  );
}
