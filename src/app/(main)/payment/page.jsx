"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/payment/CheckoutForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession } from "@/lib/auth-client";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const { data: session } = useSession();
  const [clientSecret, setClientSecret] = useState("");

  const { data: classData, isLoading } = useQuery({
    queryKey: ["classForPayment", classId],
    queryFn: async () => {
      const res = await fetch(`/api/classes/${classId}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!classId,
  });

  useEffect(() => {
    if (classData?.data?.price) {
      fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: classData.data.price }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [classData]);

  if (isLoading || !clientSecret) return <LoadingSpinner />;

  const cls = classData?.data;

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Complete Payment</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Secure checkout powered by Stripe</p>
      <div className="card p-6 mb-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-1">{cls?.className}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Trainer: {cls?.trainerName}</p>
        <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-3">${cls?.price}</p>
      </div>
      <div className="card p-6">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm classData={cls} />
        </Elements>
      </div>
    </div>
  );
}