"use client";
import { useForm } from "react-hook-form";
import { useSession } from "@/lib/auth-client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const specialties = ["Yoga", "Weights", "Cardio", "Pilates", "HIIT", "Zumba", "CrossFit", "Boxing"];

export default function ApplyTrainerPage() {
  const { data: session } = useSession();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data: application, isLoading } = useQuery({
    queryKey: ["application", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/trainer-applications/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/trainer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          email: session.user.email,
          name: session.user.name,
          appliedAt: new Date().toISOString(),
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) toast.success("Application submitted successfully!");
      else toast.error(data.message);
    },
    onError: () => toast.error("Something went wrong"),
  });

  if (isLoading) return <LoadingSpinner />;

  if (application?.data) {
    return (
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Trainer Application</h1>
        <div className="card p-6">
          <p className="text-slate-600 dark:text-slate-300 mb-4">You have already submitted an application.</p>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
            application.data.status === "approved" ? "bg-green-100 text-green-600" :
            application.data.status === "rejected" ? "bg-red-100 text-red-600" :
            "bg-yellow-100 text-yellow-600"
          }`}>
            Status: {application.data.status}
          </span>
          {application.data.feedback && (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              Feedback: {application.data.feedback}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Apply as Trainer</h1>
      <div className="card p-6 max-w-lg">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              Experience (years)
            </label>
            <input
              type="number"
              min="0"
              className="input-field"
              {...register("experience", { required: "Experience is required" })}
            />
            {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              Specialty
            </label>
            <select className="input-field" {...register("specialty", { required: "Specialty is required" })}>
              <option value="">Select specialty</option>
              {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty.message}</p>}
          </div>
          <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
            {mutation.isPending ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}