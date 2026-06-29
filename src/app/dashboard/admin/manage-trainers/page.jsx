"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ManageTrainersPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await fetch("/api/users", { credentials: "include" });
      return res.json();
    },
  });

  const trainers = data?.data?.filter((u) => u.role === "trainer") || [];

  const demoteMutation = useMutation({
    mutationFn: async (email) => {
      const res = await fetch(`/api/trainer-applications/demote/${email}`, { method: "PATCH", credentials: "include" });
      return res.json();
    },
    onSuccess: () => { toast.success("Trainer demoted to User"); qc.invalidateQueries(["allUsers"]); },
  });

  const handleDemote = async (email) => {
    const result = await Swal.fire({ title: "Demote this trainer?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Demote" });
    if (result.isConfirmed) demoteMutation.mutate(email);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Manage Trainers</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {trainers.map((trainer) => (
              <tr key={trainer._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{trainer.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{trainer.email}</td>
                <td className="px-4 py-3">
                  <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-semibold ${trainer.status === "blocked" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                    {trainer.status || "active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDemote(trainer.email)} className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition">
                    Demote to User
                  </button>
                </td>
              </tr>
            ))}
            {trainers.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-slate-400">No trainers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}