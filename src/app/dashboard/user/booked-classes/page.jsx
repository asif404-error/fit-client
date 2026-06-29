"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Link from "next/link";

export default function BookedClassesPage() {
  const { data: session } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["userBookings", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/user/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Booked Classes</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Class</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Trainer</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Schedule</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data?.data?.map((booking) => (
              <tr key={booking._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{booking.className}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{booking.trainerName}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{booking.schedule}</td>
                <td className="px-4 py-3">
                  <Link href={`/classes/${booking.classId}`} className="text-indigo-600 hover:underline text-xs font-semibold">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
            {data?.data?.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-slate-400">No booked classes yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}