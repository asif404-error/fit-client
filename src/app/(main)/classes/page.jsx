"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ClassCard from "@/components/classes/ClassCard";
import ClassFilter from "@/components/classes/ClassFilter";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const LIMIT = 9;

export default function ClassesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["classes", search, selectedCategory, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      const res = await fetch(`/api/classes/approved?${params}`);
      return res.json();
    },
  });

  const totalPages = Math.ceil((data?.total || 0) / LIMIT);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="section-title mb-2">All Classes</h1>
        <p className="section-subtitle">Find the perfect class for your fitness journey</p>
      </div>
      <ClassFilter
        search={search}
        setSearch={(val) => { setSearch(val); setPage(1); }}
        selectedCategory={selectedCategory}
        setSelectedCategory={(val) => { setSelectedCategory(val); setPage(1); }}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((cls) => <ClassCard key={cls._id} cls={cls} />)}
          </div>
          {data?.data?.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400 mt-16 text-lg">
              No classes found. Try a different search or category.
            </p>
          )}

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