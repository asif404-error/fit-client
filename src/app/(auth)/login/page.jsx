"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [loading, setLoading] = useState(false);

  const issueToken = async () => {
    await fetch("/api/auth/issue-token", { method: "POST", credentials: "include" });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });
    if (result.error) {
      toast.error(result.error.message || "Login failed");
      setLoading(false);
      return;
    }
    await issueToken();
    toast.success("Welcome back!");
    router.push(redirect);
    setLoading(false);
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: redirect });
    await issueToken();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-black text-indigo-600">Fit</span>
            <span className="text-3xl font-black text-orange-500">Nexus</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4 mb-1">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-sm text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-slate-300 dark:border-slate-600 rounded-lg py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition"
        >
          <FcGoogle size={20} /> Continue with Google
        </button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}