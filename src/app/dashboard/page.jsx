"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function DashboardRedirect() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const { data: userData } = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/users/${session.user.email}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  useEffect(() => {
    if (!isPending && userData) {
      const role = userData?.data?.role;
      if (role === "admin") router.replace("/dashboard/admin/overview");
      else if (role === "trainer") router.replace("/dashboard/trainer/overview");
      else router.replace("/dashboard/user/overview");
    }
  }, [userData, isPending]);

  return <LoadingSpinner />;
}