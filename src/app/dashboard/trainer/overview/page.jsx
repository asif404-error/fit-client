"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import StatCard from "@/components/dashboard/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { FiList, FiUsers } from "react-icons/fi";

export default function TrainerOverview() {
  const { data: session } = useSession();

  const { data: classes, isLoading } = useQuery({
    queryKey: ["trainerClasses", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/classes/trainer/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const { data: userData } = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/users/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  if (isLoading) return <LoadingSpinner />;

  const totalStudents = classes?.data?.reduce((sum, cls) => sum + (cls.bookingCount || 0), 0) || 0;
  const user = userData?.data;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Trainer Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard title="Total Classes" value={classes?.data?.length || 0} icon={<FiList />} color="indigo" />
        <StatCard title="Total Students" value={totalStudents} icon={<FiUsers />} color="orange" />
      </div>
      <div className="card p-6">
        <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Profile Details</h2>
        <div className="flex items-center gap-4">
          <img src={user?.image || "/logo.png"} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 font-semibold">
              Trainer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}