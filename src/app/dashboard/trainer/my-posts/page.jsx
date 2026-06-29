"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function MyPostsPage() {
  const { data: session } = useSession();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["trainerPosts", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/forum/trainer/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/forum/${id}`, { method: "DELETE", credentials: "include" });
      return res.json();
    },
    onSuccess: () => { toast.success("Post deleted"); qc.invalidateQueries(["trainerPosts"]); },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Delete this post?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Delete" });
    if (result.isConfirmed) deleteMutation.mutate(id);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">My Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.data?.map((post) => (
          <div key={post._id} className="card p-4 flex gap-4">
            <img src={post.image} alt={post.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">{post.title}</h3>
              <p className="text-xs text-slate-400 mb-3">{new Date(post.createdAt).toLocaleDateString()}</p>
              <button onClick={() => handleDelete(post._id)} className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition">
                Delete
              </button>
            </div>
          </div>
        ))}
        {data?.data?.length === 0 && <p className="col-span-2 text-center py-12 text-slate-400">No posts yet</p>}
      </div>
    </div>
  );
}