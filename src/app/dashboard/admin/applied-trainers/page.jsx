"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function AppliedTrainersPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["trainerApplications"],
    queryFn: async () => {
      const res = await fetch("/api/trainer-applications", { credentials: "include" });
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, email }) => {
      const res = await fetch(`/api/trainer-applications/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      return res.json();
    },
    onSuccess: () => { toast.success("Trainer approved!"); setSelected(null); qc.invalidateQueries(["trainerApplications"]); },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, email }) => {
      const res = await fetch(`/api/trainer-applications/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, feedback }),
      });
      return res.json();
    },
    onSuccess: () => { toast.success("Application rejected"); setSelected(null); qc.invalidateQueries(["trainerApplications"]); },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Applied Trainers</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Specialty</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data?.data?.map((app) => (
              <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{app.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{app.email}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{app.specialty}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelected(app)} className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold">
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {data?.data?.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-slate-400">No pending applications</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Application Details</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1"><strong>Name:</strong> {selected.name}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1"><strong>Email:</strong> {selected.email}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1"><strong>Experience:</strong> {selected.experience} years</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4"><strong>Specialty:</strong> {selected.specialty}</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write feedback (required for rejection)..."
              className="input-field resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => approveMutation.mutate({ id: selected._id, email: selected.email })} className="btn-primary flex-1">Approve</button>
              <button onClick={() => rejectMutation.mutate({ id: selected._id, email: selected.email })} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-lg transition">Reject</button>
              <button onClick={() => setSelected(null)} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}