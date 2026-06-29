"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function MyClassesPage() {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const [editClass, setEditClass] = useState(null);
  const [attendeesClass, setAttendeesClass] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["trainerClasses", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/classes/trainer/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const { data: attendees } = useQuery({
    queryKey: ["attendees", attendeesClass],
    queryFn: async () => {
      const res = await fetch(`/api/classes/${attendeesClass}/attendees`, { credentials: "include" });
      return res.json();
    },
    enabled: !!attendeesClass,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/classes/${id}`, { method: "DELETE", credentials: "include" });
      return res.json();
    },
    onSuccess: () => { toast.success("Class deleted"); qc.invalidateQueries(["trainerClasses"]); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => { toast.success("Class updated!"); setEditClass(null); qc.invalidateQueries(["trainerClasses"]); },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Delete this class?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Delete" });
    if (result.isConfirmed) deleteMutation.mutate(id);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">My Classes</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Class</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data?.data?.map((cls) => (
              <tr key={cls._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{cls.className}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{cls.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    cls.status === "approved" ? "bg-green-100 text-green-600" :
                    cls.status === "rejected" ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>
                    {cls.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditClass(cls)} className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-200 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(cls._id)} className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition">
                      Delete
                    </button>
                    <button onClick={() => setAttendeesClass(cls._id)} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-200 transition">
                      Students
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Edit Class</h2>
            <div className="space-y-3">
              <input defaultValue={editClass.className} onChange={(e) => setEditClass({ ...editClass, className: e.target.value })} className="input-field" placeholder="Class Name" />
              <input defaultValue={editClass.price} type="number" onChange={(e) => setEditClass({ ...editClass, price: e.target.value })} className="input-field" placeholder="Price" />
              <input defaultValue={editClass.schedule} onChange={(e) => setEditClass({ ...editClass, schedule: e.target.value })} className="input-field" placeholder="Schedule" />
              <textarea defaultValue={editClass.description} onChange={(e) => setEditClass({ ...editClass, description: e.target.value })} className="input-field resize-none" placeholder="Description" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => updateMutation.mutate({ id: editClass._id, data: editClass })} className="btn-primary flex-1">Save</button>
              <button onClick={() => setEditClass(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {attendeesClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Enrolled Students</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {attendees?.data?.map((b) => (
                <div key={b._id} className="flex justify-between text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-slate-900 dark:text-white">{b.userName}</span>
                  <span className="text-slate-500">{b.userEmail}</span>
                </div>
              ))}
              {attendees?.data?.length === 0 && <p className="text-center text-slate-400">No students enrolled yet</p>}
            </div>
            <button onClick={() => setAttendeesClass(null)} className="btn-outline w-full mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}