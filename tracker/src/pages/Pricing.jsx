import React from "react";
import { useAuth } from "../context/Authcontext";

function Pricing() {
  const { user, token } = useAuth();
  const handlePayment = async (planId) => {
    if (!user) {
      alert("Please login to purchase a plan");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/pay/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend response:", text);
        throw new Error("Checkout session failed");
      }

      const data = await response.json();
      if (!data.url) throw new Error("Stripe Checkout URL missing");

      window.location.href = data.url;
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Check console.");
    }
  };

  const plans = [
    {
      _id: "692c3d4bbf6444979b405ec3",
      name: "Starter",
      price: 299,
      features: [
        "Basic attendance",
        "Daily check-in/check-out",
        "Limited dashboard access",
        "Email support",
      ],
    },
    {
      _id: "692c3d93bf6444979b405ec5",
      name: "Premium",
      price: 799,
      features: [
        "Real-time attendance",
        "GPS logs",
        "Daily & weekly reports",
        "Leave management",
        "Export reports",
        "Priority support",
      ],
    },
    {
      _id: "692c3daabf6444979b405ec7",
      name: "Enterprise",
      price: 1499,
      features: [
        "All Premium Features",
        "Advanced analytics",
        "Multiple admins",
        "Custom roles",
        "HRMS integration",
        "Dedicated account manager",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-teal-950 to-gray-900 text-white px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">
        Choose Your Plan
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="p-6 rounded-2xl border border-teal-800 bg-gray-900 shadow-xl hover:shadow-teal-900/40 transition"
          >
            <h2 className="text-2xl font-semibold mb-2 text-teal-400">
              {plan.name}
            </h2>

            <p className="text-gray-300 mb-4">₹{plan.price} / month</p>

            <ul className="text-gray-400 mb-6 space-y-1">
              {plan.features.map((f, idx) => (
                <li key={idx}>• {f}</li>
              ))}
            </ul>

            <button
              onClick={() => handlePayment(plan._id)}
              className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-xl font-semibold transition"
            >
              Buy {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
