import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 px-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-black text-indigo-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
}