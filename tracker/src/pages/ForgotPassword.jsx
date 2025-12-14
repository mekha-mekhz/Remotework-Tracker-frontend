import React, { useState } from "react";
import api from "../components/api";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/forgot-password", { email });
      setMsg(res.data.message);

      // ✅ Navigate to reset password page after OTP sent
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1000);

    } catch (err) {
      setMsg(err.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <form onSubmit={submit} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

      {msg && <p className="mb-3 text-green-600">{msg}</p>}

      <input
        type="email"
        placeholder="Enter email"
        required
        className="border p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Send OTP
      </button>
    </form>
  );
}

export default ForgotPassword;
