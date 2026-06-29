"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import StatCard from "@/components/dashboard/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { FiBook, FiHeart } from "react-icons/fi";

export default function UserOverview() {
  const { data: session } = useSession();

  const { data: bookings, isLoading: bLoading } = useQuery({
    queryKey: ["userBookings", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/user/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const { data: userData, isLoading: uLoading } = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/users/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const { data: application } = useQuery({
    queryKey: ["application", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/trainer-applications/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const { data: favorites } = useQuery({
    queryKey: ["favorites", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/users/favorites/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  if (bLoading || uLoading) return <LoadingSpinner />;

  const user = userData?.data;
  const app = application?.data;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">My Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard title="Booked Classes" value={bookings?.data?.length || 0} icon={<FiBook />} color="indigo" />
        <StatCard title="Favorite Classes" value={favorites?.data?.length || 0} icon={<FiHeart />} color="orange" />
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Profile Details</h2>
        <div className="flex items-center gap-4 mb-4">
          <img src={user?.image || "/logo.png"} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-semibold capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {app && (
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-3">Trainer Application</h2>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
              app.status === "approved" ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" :
              app.status === "rejected" ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" :
              "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
            }`}>
              {app.status}
            </span>
          </div>
          {app.status === "rejected" && app.feedback && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              Feedback: {app.feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
}