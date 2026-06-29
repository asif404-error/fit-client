"use client";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function TransactionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch("/api/payments/transactions", { credentials: "include" });
      return res.json();
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Transactions</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">User Email</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Class</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Amount</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Transaction ID</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data?.data?.map((tx) => (
              <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{tx.userEmail}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{tx.className}</td>
                <td className="px-4 py-3 font-semibold text-green-600">${tx.amount}</td>
                <td className="px-4 py-3 text-slate-400 text-xs font-mono">{tx.transactionId}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {data?.data?.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">No transactions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}