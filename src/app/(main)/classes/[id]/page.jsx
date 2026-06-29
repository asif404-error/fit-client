"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const res = await fetch(`/api/classes/${id}`, { credentials: "include" });
      return res.json();
    },
  });

  const { data: bookingCheck } = useQuery({
    queryKey: ["bookingCheck", id, session?.user?.email],
    queryFn: async () => {
      const res = await fetch(
        `/api/bookings/check?userEmail=${session.user.email}&classId=${id}`,
        { credentials: "include" }
      );
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const { data: favoriteCheck, refetch: refetchFavorite } = useQuery({
    queryKey: ["favoriteCheck", id, session?.user?.email],
    queryFn: async () => {
      const res = await fetch(
        `/api/users/favorites/check?email=${session.user.email}&classId=${id}`,
        { credentials: "include" }
      );
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/users/favorites", {
        method: favoriteCheck?.isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: session.user.email, classId: id }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success(favoriteCheck?.isFavorite ? "Removed from favorites" : "Added to favorites!");
      refetchFavorite();
    },
    onError: () => toast.error("Something went wrong"),
  });

  const handleBookNow = () => {
    if (!session?.user) return router.push("/login");
    if (bookingCheck?.booked) return toast.error("You have already booked this class");
    router.push(`/payment?classId=${id}`);
  };

  if (isLoading) return <LoadingSpinner />;
  const cls = data?.data;
  if (!cls) return <p className="text-center py-20">Class not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <img src={cls.image} alt={cls.className} className="w-full h-72 object-cover rounded-2xl mb-8" />
      <div className="flex flex-wrap gap-3 mb-4">
        <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold">
          {cls.category}
        </span>
        <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-semibold">
          {cls.difficultyLevel}
        </span>
      </div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{cls.className}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-1">👤 Trainer: {cls.trainerName}</p>
      <p className="text-slate-500 dark:text-slate-400 mb-1">⏱ Duration: {cls.duration} mins</p>
      <p className="text-slate-500 dark:text-slate-400 mb-1">📅 Schedule: {cls.schedule}</p>
      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">💵 ${cls.price}</p>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">{cls.description}</p>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleBookNow}
          disabled={bookingCheck?.booked}
          className={`btn-primary ${bookingCheck?.booked ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {bookingCheck?.booked ? "Already Booked" : "Book Now"}
        </button>
        <button
          onClick={() => {
            if (!session?.user) return router.push("/login");
            favoriteMutation.mutate();
          }}
          className="btn-outline"
        >
          {favoriteCheck?.isFavorite ? "Remove Favorite" : "Add to Favorites"}
        </button>
      </div>
    </div>
  );
}