"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import LoadingSpinner from "../shared/LoadingSpinner";

const LatestPosts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["latestPosts"],
    queryFn: async () => {
      const res = await fetch("/api/forum/latest");
      return res.json();
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Latest from the Community</h2>
          <p className="section-subtitle">Stay up to date with tips, advice and stories</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.data?.map((post) => (
            <div key={post._id} className="card overflow-hidden hover:shadow-lg transition-shadow">
              <img src={post.image} alt={post.title} className="w-full h-44 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">by {post.authorName}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
                  {post.description}
                </p>
                <Link
                  href={`/forum/${post._id}`}
                  className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;