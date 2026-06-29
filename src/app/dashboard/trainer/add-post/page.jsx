"use client";
import { useForm } from "react-hook-form";
import { useSession } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function TrainerAddPostPage() {
  const { data: session } = useSession();
  const { register, handleSubmit, reset } = useForm();

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
    const data = await res.json();
    return data.data.url;
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const imageUrl = await uploadImage(data.imageFile[0]);
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          image: imageUrl,
          description: data.description,
          authorName: session.user.name,
          authorEmail: session.user.email,
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) { toast.success("Post published!"); reset(); }
      else toast.error(data.message);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Add Forum Post</h1>
      <div className="card p-6 max-w-2xl">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Title</label>
            <input type="text" className="input-field" {...register("title", { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Image</label>
            <input type="file" accept="image/*" className="input-field" {...register("imageFile", { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Description</label>
            <textarea className="input-field min-h-[150px] resize-none" {...register("description", { required: true })} />
          </div>
          <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
            {mutation.isPending ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}