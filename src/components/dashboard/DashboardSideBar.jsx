"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FiHome, FiBook, FiHeart, FiUser, FiPlus, FiList,
  FiFileText, FiUsers, FiCheckSquare, FiDollarSign,
  FiShield, FiLogOut, FiMessageSquare,
} from "react-icons/fi";

const userLinks = [
  { href: "/dashboard/user/overview", label: "Overview", icon: <FiHome /> },
  { href: "/dashboard/user/booked-classes", label: "Booked Classes", icon: <FiBook /> },
  { href: "/dashboard/user/favorites", label: "Favorites", icon: <FiHeart /> },
  { href: "/dashboard/user/apply-trainer", label: "Apply as Trainer", icon: <FiUser /> },
];

const trainerLinks = [
  { href: "/dashboard/trainer/overview", label: "Overview", icon: <FiHome /> },
  { href: "/dashboard/trainer/add-class", label: "Add Class", icon: <FiPlus /> },
  { href: "/dashboard/trainer/my-classes", label: "My Classes", icon: <FiList /> },
  { href: "/dashboard/trainer/add-post", label: "Add Forum Post", icon: <FiFileText /> },
  { href: "/dashboard/trainer/my-posts", label: "My Posts", icon: <FiMessageSquare /> },
];

const adminLinks = [
  { href: "/dashboard/admin/overview", label: "Overview", icon: <FiHome /> },
  { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: <FiUsers /> },
  { href: "/dashboard/admin/applied-trainers", label: "Applied Trainers", icon: <FiCheckSquare /> },
  { href: "/dashboard/admin/manage-trainers", label: "Manage Trainers", icon: <FiShield /> },
  { href: "/dashboard/admin/manage-classes", label: "Manage Classes", icon: <FiList /> },
  { href: "/dashboard/admin/transactions", label: "Transactions", icon: <FiDollarSign /> },
  { href: "/dashboard/admin/add-post", label: "Add Forum Post", icon: <FiFileText /> },
  { href: "/dashboard/admin/manage-posts", label: "Manage Posts", icon: <FiMessageSquare /> },
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const { data: userData } = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/users/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const role = userData?.data?.role || "user";
  const links = role === "admin" ? adminLinks : role === "trainer" ? trainerLinks : userLinks;

  const handleLogout = async () => {
    await signOut();
    await fetch("/api/auth/clear-token", { method: "POST", credentials: "include" });
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <Link href="/">
          <span className="text-xl font-black text-indigo-600">Fit</span>
          <span className="text-xl font-black text-orange-500">Nexus</span>
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <img
            src={session?.user?.image || "/logo.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[130px]">
              {session?.user?.name}
            </p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-semibold capitalize">
              {role}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              pathname === link.href
                ? "bg-indigo-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;