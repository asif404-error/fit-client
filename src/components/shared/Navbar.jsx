"use client";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiSun, FiMoon, FiMenu, FiX, FiBell } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const qc = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/users/${session.user.email}`, {
        credentials: "include",
      });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/notifications/${session.user.email}`, {
        credentials: "include",
      });
      return res.json();
    },
    enabled: !!session?.user?.email,
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries(["notifications", session?.user?.email]),
  });

  const role = userData?.data?.role || "user";
  const unreadCount = notifications?.data?.filter((n) => !n.read).length || 0;

  const getDashboardLink = () => {
    if (role === "admin") return "/dashboard/admin/overview";
    if (role === "trainer") return "/dashboard/trainer/overview";
    return "/dashboard/user/overview";
  };

  const handleLogout = async () => {
    await signOut();
    await fetch("/api/auth/clear-token", { method: "POST", credentials: "include" });
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/classes", label: "All Classes" },
    { href: "/forum", label: "Community Forum" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-black text-indigo-600">Fit</span>
            <span className="text-2xl font-black text-orange-500">Nexus</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
              >
                {link.label}
              </Link>
            ))}
            {session?.user && (
              <Link
                href={getDashboardLink()}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {session?.user && (
              <>

                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
                  >
                    <FiBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                        {notifications?.data?.length === 0 && (
                          <p className="text-center text-slate-400 text-sm py-6">
                            No notifications
                          </p>
                        )}
                        {notifications?.data?.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => !notif.read && markReadMutation.mutate(notif._id)}
                            className={`px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition ${
                              !notif.read ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
                            }`}
                          >
                            <p className="text-sm text-slate-700 dark:text-slate-200">
                              {notif.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </p>
                            {!notif.read && (
                              <span className="inline-block mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                                Click to mark as read
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <img
                  src={session.user.image || "/logo.png"}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500"
                />

                <button
                  onClick={handleLogout}
                  className="btn-primary text-sm hidden md:block"
                >
                  Logout
                </button>
              </>
            )}

            {!session?.user && (
              <Link href="/login" className="btn-primary text-sm hidden md:block">
                Login
              </Link>
            )}

            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium px-2"
              >
                {link.label}
              </Link>
            ))}
            {session?.user && (
              <Link
                href={getDashboardLink()}
                onClick={() => setMenuOpen(false)}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium px-2"
              >
                Dashboard
              </Link>
            )}
            {session?.user ? (
              <button onClick={handleLogout} className="btn-primary text-sm w-full">
                Logout
              </button>
            ) : (
              <Link href="/login" className="btn-primary text-sm text-center">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;