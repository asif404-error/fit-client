"use client";
import { useForm } from "react-hook-form";
import { useSession } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const categories = ["Yoga", "Cardio", "Weights", "Pilates", "HIIT", "Zumba", "CrossFit", "Boxing"];
const difficulties = ["Beginner", "Intermediate", "Advanced"];

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function AddClassPage() {
  const { data: session } = useSession();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.data.url;
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      let imageUrl = data.image;
      if (data.imageFile?.[0]) {
        imageUrl = await uploadImage(data.imageFile[0]);
      }
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          className: data.className,
          image: imageUrl,
          category: data.category,
          difficultyLevel: data.difficultyLevel,
          duration: data.duration,
          schedule: data.schedule,
          price: parseFloat(data.price),
          description: data.description,
          trainerName: session.user.name,
          trainerEmail: session.user.email,
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) { toast.success("Class submitted for approval!"); reset(); }
      else toast.error(data.message);
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Add New Class</h1>
      <div className="card p-6 max-w-2xl">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Class Name</label>
              <input type="text" className="input-field" {...register("className", { required: true })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Category</label>
              <select className="input-field" {...register("category", { required: true })}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Difficulty Level</label>
              <select className="input-field" {...register("difficultyLevel", { required: true })}>
                <option value="">Select difficulty</option>
                {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Duration (mins)</label>
              <input type="number" className="input-field" {...register("duration", { required: true })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Schedule</label>
              <input type="text" className="input-field" placeholder="e.g. Mon/Wed 8:00 AM" {...register("schedule", { required: true })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Price ($)</label>
              <input type="number" step="0.01" className="input-field" {...register("price", { required: true })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Class Image</label>
            <input type="file" accept="image/*" className="input-field" {...register("imageFile")} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Description</label>
            <textarea className="input-field min-h-[120px] resize-none" {...register("description", { required: true })} />
          </div>
          <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
            {mutation.isPending ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}