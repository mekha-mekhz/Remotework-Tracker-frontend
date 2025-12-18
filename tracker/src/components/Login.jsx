import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";
import { useAuth } from "../context/Authcontext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // ✅ State for frontend validation errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Manual frontend validation
  const validate = () => {
    const tempErrors = {};

    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // ✅ Valid if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // ❌ Stop submission if validation fails

    setLoading(true);
    try {
      console.log("📨 Sending login request:", formData);

      const res = await api.post("/login", formData);

      if (!res.data || !res.data.user || !res.data.token) {
        throw new Error("Invalid server response");
      }

      console.log("✅ Login Response:", res.data);

      login(res.data.user, res.data.token); // Save token + user in context
      alert("Login Successful!");

      const role = res.data.user.role;

      if (res.data.user.premium) navigate("/premiumdashboard");
      else if (role === "admin") navigate("/admin");
      else if (role === "manager") navigate("/taskmanager");
      else navigate("/dashboard");

    } catch (err) {
      console.error("❌ Login Error:", err?.response?.data || err);
      alert(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 
      bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md border border-white/20 
        rounded-2xl p-8 w-full max-w-sm shadow-2xl"
      >
        <h2 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r 
          from-lime-300 to-teal-300 text-transparent bg-clip-text">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-3 mb-1 bg-black/20 text-white rounded-lg 
          focus:ring-2 focus:ring-teal-300"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-3 mb-1 bg-black/20 text-white rounded-lg 
          focus:ring-2 focus:ring-teal-300"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r 
            from-lime-400 to-teal-400 text-black font-semibold shadow-lg 
            hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Login"}
        </button>

        <p className="text-right mb-4">
          <Link to="/forgot-password" className="text-teal-300 hover:underline text-sm">
            Forgot Password?
          </Link>
        </p>

        <p className="text-center mt-4 text-gray-300 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-teal-300 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
