"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import LoadingSpinner from "../shared/LoadingSpinner";

const FeaturedClasses = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["featuredClasses"],
    queryFn: async () => {
      const res = await fetch("/api/classes/featured");
      return res.json();
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Featured Classes</h2>
          <p className="section-subtitle">Top-rated classes loved by our community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((cls) => (
            <div key={cls._id} className="card p-0 overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={cls.image}
                alt={cls.className}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full">
                    {cls.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    🔥 {cls.bookingCount} bookings
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-1">
                  {cls.className}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  👤 {cls.trainerName}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  ⏱ {cls.duration} mins · 💵 ${cls.price}
                </p>
                <Link href={`/classes/${cls._id}`} className="btn-primary text-sm w-full text-center block">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedClasses;