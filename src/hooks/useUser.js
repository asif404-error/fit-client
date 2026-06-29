"use client";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  const { data: session, isPending: sessionLoading } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/users/${session.user.email}`, {
        credentials: "include",
      });
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  return {
    user: data?.data || null,
    session: session?.user || null,
    loading: sessionLoading || isLoading,
  };
};

export default useUser;