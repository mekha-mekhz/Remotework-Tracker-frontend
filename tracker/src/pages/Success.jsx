// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

function Success() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [upgraded, setUpgraded] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/login");
  };

  useEffect(() => {
    const upgradeUser = async () => {
      try {
        await api.post(
          "/upgrade",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUpgraded(true);
      } catch (err) {
        console.error("Upgrade error:", err);
        setUpgraded(false);
      } finally {
        setLoading(false);
      }
    };

    upgradeUser();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-teal-800 to-lime-900 text-white">
        <p className="text-lg animate-pulse">Processing your payment...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-teal-800 to-lime-900 p-6">
      <div className="bg-teal-800 text-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
        {upgraded ? (
          <>
            <h1 className="text-3xl font-bold mb-4 text-lime-300">
              Payment Successful 🎉
            </h1>
            <p className="mb-2">
              Welcome <span className="font-semibold">{user?.name}</span>, your
              account is now upgraded to <span className="text-lime-300">Premium</span>.
            </p>
            <p className="text-teal-200 mb-6">
              You can now access Daily Logs, Productivity Reports, Attendance
              History, and more.
            </p>

            <button
              onClick={goToDashboard}
              className="w-full px-6 py-3 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-600 transition"
            >
              Please Login again ...To enjoy your premium plan
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4 text-red-400">
              Upgrade Failed ❌
            </h1>
            <p className="text-teal-200 mb-6">
              Your payment may have succeeded, but the upgrade did not complete.
              Please contact support.
            </p>

            <button
              onClick={goToDashboard}
              className="w-full px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Success;
