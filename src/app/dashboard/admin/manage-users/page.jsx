"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Swal from "sweetalert2";

export default function ManageUsersPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await fetch("/api/users", { credentials: "include" });
      return res.json();
    },
  });

  const blockMutation = useMutation({
    mutationFn: async ({ email, action }) => {
      const res = await fetch(`/api/users/${action}/${email}`, { method: "PATCH", credentials: "include" });
      return res.json();
    },
    onSuccess: (_, { action }) => { toast.success(`User ${action}ed`); qc.invalidateQueries(["allUsers"]); },
  });

  const makeAdminMutation = useMutation({
    mutationFn: async (email) => {
      const res = await fetch(`/api/users/make-admin/${email}`, { method: "PATCH", credentials: "include" });
      return res.json();
    },
    onSuccess: () => { toast.success("User promoted to Admin"); qc.invalidateQueries(["allUsers"]); },
  });

  const handleMakeAdmin = async (email) => {
    const result = await Swal.fire({ title: "Make this user an Admin?", icon: "question", showCancelButton: true, confirmButtonColor: "#4f46e5", confirmButtonText: "Confirm" });
    if (result.isConfirmed) makeAdminMutation.mutate(email);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Manage Users</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data?.data?.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{user.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="capitalize px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-semibold ${user.status === "blocked" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                    {user.status || "active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => blockMutation.mutate({ email: user.email, action: user.status === "blocked" ? "unblock" : "block" })}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${user.status === "blocked" ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-red-100 text-red-600 hover:bg-red-200"}`}
                    >
                      {user.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                    {user.role !== "admin" && (
                      <button onClick={() => handleMakeAdmin(user.email)} className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-200 transition">
                        Make Admin
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}