"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

const CommentSection = ({ postId }) => {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const { data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await fetch(`/api/forum/${postId}/comments`, { credentials: "include" });
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/forum/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content,
          authorEmail: session.user.email,
          authorName: session.user.name,
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      setContent("");
      toast.success("Comment added!");
      qc.invalidateQueries(["comments", postId]);
    },
  });

  const editMutation = useMutation({
    mutationFn: async (commentId) => {
      const res = await fetch(`/api/forum/${postId}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: editContent }),
      });
      return res.json();
    },
    onSuccess: () => {
      setEditId(null);
      toast.success("Comment updated!");
      qc.invalidateQueries(["comments", postId]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      const res = await fetch(`/api/forum/${postId}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Comment deleted");
      qc.invalidateQueries(["comments", postId]);
    },
  });

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        Comments ({data?.data?.length || 0})
      </h3>

      {session?.user && (
        <div className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="input-field min-h-[100px] resize-none mb-3"
          />
          <button
            onClick={() => addMutation.mutate()}
            disabled={!content.trim()}
            className="btn-primary"
          >
            Post Comment
          </button>
        </div>
      )}

      <div className="space-y-4">
        {data?.data?.map((comment) => (
          <div key={comment._id} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900 dark:text-white text-sm">
                {comment.authorName}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            {editId === comment._id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="input-field resize-none mb-2"
                />
                <div className="flex gap-2">
                  <button onClick={() => editMutation.mutate(comment._id)} className="btn-primary text-sm">
                    Save
                  </button>
                  <button onClick={() => setEditId(null)} className="btn-outline text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-300 text-sm">{comment.content}</p>
            )}
            {session?.user?.email === comment.authorEmail && editId !== comment._id && (
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => { setEditId(comment._id); setEditContent(comment.content); }}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(comment._id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;