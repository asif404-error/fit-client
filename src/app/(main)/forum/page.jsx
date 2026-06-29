"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ForumCard from "@/components/forum/ForumCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const LIMIT = 9;

export default function ForumPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["forumPosts", page],
    queryFn: async () => {
      const res = await fetch(`/api/forum?page=${page}&limit=${LIMIT}`);
      return res.json();
    },
  });

  const totalPages = Math.ceil((data?.total || 0) / LIMIT);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title mb-2">Community Forum</h1>
        <p className="section-subtitle">Tips, stories and knowledge from our trainers and admins</p>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((post) => <ForumCard key={post._id} post={post} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    page === p
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}