"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ManageClassesPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["allClasses"],
    queryFn: async () => {
      const res = await fetch("/api/classes", { credentials: "include" });
      return res.json();
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      const url = action === "delete" ? `/api/classes/${id}` : `/api/classes/${id}/${action}`;
      const method = action === "delete" ? "DELETE" : "PATCH";
      const res = await fetch(url, { method, credentials: "include" });
      return res.json();
    },
    onSuccess: (_, { action }) => { toast.success(`Class ${action}d`); qc.invalidateQueries(["allClasses"]); },
  });

  const handleAction = async (id, action) => {
    if (action === "delete") {
      const result = await Swal.fire({ title: "Delete this class?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Delete" });
      if (!result.isConfirmed) return;
    }
    actionMutation.mutate({ id, action });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Manage Classes</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Class</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Trainer</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data?.data?.map((cls) => (
              <tr key={cls._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{cls.className}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{cls.trainerName}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{cls.category}</td>
                <td className="px-4 py-3">
                  <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-semibold ${
                    cls.status === "approved" ? "bg-green-100 text-green-600" :
                    cls.status === "rejected" ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>
                    {cls.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {cls.status !== "approved" && (
                      <button onClick={() => handleAction(cls._id, "approve")} className="text-xs bg-green-100 text-green-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-200 transition">Approve</button>
                    )}
                    {cls.status !== "rejected" && (
                      <button onClick={() => handleAction(cls._id, "reject")} className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-yellow-200 transition">Reject</button>
                    )}
                    <button onClick={() => handleAction(cls._id, "delete")} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition">Delete</button>
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