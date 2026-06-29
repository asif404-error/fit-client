import Link from "next/link";

const ForumCard = ({ post }) => {
  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">by {post.authorName}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
          {post.description}
        </p>
        <Link href={`/forum/${post._id}`} className="btn-primary text-sm inline-block">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default ForumCard;