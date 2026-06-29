"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import CommentSection from "@/components/forum/CommentSection";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";

export default function ForumPostDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["forumPost", id],
    queryFn: async () => {
      const res = await fetch(`/api/forum/${id}`, { credentials: "include" });
      return res.json();
    },
  });

  const voteMutation = useMutation({
    mutationFn: async (type) => {
      const res = await fetch(`/api/forum/${id}/${type}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: session.user.email }),
      });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries(["forumPost", id]),
    onError: () => toast.error("Action restricted"),
  });

  if (isLoading) return <LoadingSpinner />;
  const post = data?.data;
  if (!post) return <p className="text-center py-20">Post not found</p>;

  const hasLiked = post.likes?.includes(session?.user?.email);
  const hasDisliked = post.dislikes?.includes(session?.user?.email);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <img src={post.image} alt={post.title} className="w-full h-72 object-cover rounded-2xl mb-8" />
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{post.title}</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        by {post.authorName} · {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">{post.description}</p>

      <div className="flex gap-4 mb-10">
        <button
          onClick={() => voteMutation.mutate("like")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition ${
            hasLiked
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100"
          }`}
        >
          <FiThumbsUp /> {post.likes?.length || 0}
        </button>
        <button
          onClick={() => voteMutation.mutate("dislike")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition ${
            hasDisliked
              ? "bg-red-500 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-100"
          }`}
        >
          <FiThumbsDown /> {post.dislikes?.length || 0}
        </button>
      </div>

      <CommentSection postId={id} />
    </div>
  );
}