"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import StatCard from "@/components/dashboard/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { FiUsers, FiList, FiBook } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#4f46e5", "#f97316", "#10b981", "#f59e0b"];

export default function AdminOverview() {
  const { data: session } = useSession();

  const { data: users } = useQuery({ queryKey: ["allUsers"], queryFn: async () => { const res = await fetch("/api/users", { credentials: "include" }); return res.json(); } });
  const { data: classes } = useQuery({ queryKey: ["allClasses"], queryFn: async () => { const res = await fetch("/api/classes", { credentials: "include" }); return res.json(); } });
  const { data: bookings } = useQuery({ queryKey: ["allBookings"], queryFn: async () => { const res = await fetch("/api/bookings", { credentials: "include" }); return res.json(); } });
  const { data: userData } = useQuery({ queryKey: ["user", session?.user?.email], queryFn: async () => { const res = await fetch(`/api/users/${session.user.email}`, { credentials: "include" }); return res.json(); }, enabled: !!session?.user?.email });

  const categoryData = classes?.data?.reduce((acc, cls) => {
    const existing = acc.find((item) => item.name === cls.category);
    if (existing) existing.value++;
    else acc.push({ name: cls.category, value: 1 });
    return acc;
  }, []) || [];

  const bookingChartData = [
    { name: "Users", value: users?.data?.filter((u) => u.role === "user").length || 0 },
    { name: "Trainers", value: users?.data?.filter((u) => u.role === "trainer").length || 0 },
    { name: "Admins", value: users?.data?.filter((u) => u.role === "admin").length || 0 },
  ];

  const user = userData?.data;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Admin Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Users" value={users?.data?.length || 0} icon={<FiUsers />} color="indigo" />
        <StatCard title="Total Classes" value={classes?.data?.length || 0} icon={<FiList />} color="orange" />
        <StatCard title="Total Bookings" value={bookings?.data?.length || 0} icon={<FiBook />} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Users by Role</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bookingChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Classes by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Admin Profile</h2>
        <div className="flex items-center gap-4">
          <img src={user?.image || "/logo.png"} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 font-semibold">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}