"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Link from "next/link";

export default function FavoritesPage() {
  const { data: session } = useSession();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/users/favorites/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const removeMutation = useMutation({
    mutationFn: async (classId) => {
      const res = await fetch("/api/users/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: session.user.email, classId }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Removed from favorites");
      qc.invalidateQueries(["favorites", session?.user?.email]);
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Favorite Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data?.map((fav) => (
          <div key={fav._id} className="card p-4">
            <img src={fav.image} alt={fav.className} className="w-full h-36 object-cover rounded-lg mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{fav.className}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{fav.trainerName}</p>
            <div className="flex gap-2">
              <Link href={`/classes/${fav.classId}`} className="btn-outline text-xs flex-1 text-center">
                View
              </Link>
              <button
                onClick={() => removeMutation.mutate(fav.classId)}
                className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {data?.data?.length === 0 && (
          <p className="col-span-3 text-center py-12 text-slate-400">No favorites yet</p>
        )}
      </div>
    </div>
  );
}