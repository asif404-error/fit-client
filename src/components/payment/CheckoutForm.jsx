"use client";
import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const CheckoutForm = ({ classData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { data: session } = useSession();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/dashboard/user/booked-classes` },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          classId: classData._id,
          className: classData.className,
          trainerName: classData.trainerName,
          trainerEmail: classData.trainerEmail,
          schedule: classData.schedule,
          userEmail: session.user.email,
          userName: session.user.name,
          price: classData.price,
        }),
      });

      await fetch("/api/payments/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userEmail: session.user.email,
          amount: classData.price,
          transactionId: paymentIntent.id,
          classId: classData._id,
          className: classData.className,
        }),
      });

      toast.success("Payment successful! Class booked.");
      router.push("/dashboard/user/booked-classes");
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-6" />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary w-full"
      >
        {processing ? "Processing..." : `Pay $${classData?.price}`}
      </button>
    </form>
  );
};

export default CheckoutForm;