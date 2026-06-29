"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ManagePostsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["allPosts"],
    queryFn: async () => {
      const res = await fetch("/api/forum?page=1&limit=100");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/forum/${id}`, { method: "DELETE", credentials: "include" });
      return res.json();
    },
    onSuccess: () => { toast.success("Post deleted"); qc.invalidateQueries(["allPosts"]); },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Delete this post?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Delete" });
    if (result.isConfirmed) deleteMutation.mutate(id);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Manage Forum Posts</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Author</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data?.data?.map((post) => (
              <tr key={post._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-xs truncate">{post.title}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{post.authorName}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(post._id)} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {data?.data?.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-slate-400">No posts found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}