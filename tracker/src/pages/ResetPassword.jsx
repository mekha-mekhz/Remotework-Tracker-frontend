import React, { useState } from "react";
import api from "../components/api";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/reset-password", form);
      setMsg(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={submit} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      {msg && <p className="mb-3">{msg}</p>}

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="text"
        placeholder="OTP"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, otp: e.target.value })}
      />

      <input
        type="password"
        placeholder="New Password"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Reset Password
      </button>
    </form>
  );
}

export default ResetPassword;
