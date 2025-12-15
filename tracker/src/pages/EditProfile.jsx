import React, { useEffect, useState } from "react";
import api from "../components/api";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    profilePhoto: null,
  });

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/me");
        const user = res.data.user;

        setForm({
          name: user.name || "",
          email: user.email || "",
          position: user.position || "",
          profilePhoto: null,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setForm({ ...form, profilePhoto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("position", form.position);
      if (form.profilePhoto) data.append("profilePhoto", form.profilePhoto);

      const res = await api.put("/user/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg(res.data.message || "Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md
          bg-white/10 backdrop-blur-md
          border border-white/20
          rounded-2xl shadow-2xl
          p-6 text-white
        "
      >
        <h2
          className="
            text-2xl font-bold mb-6 text-center
            bg-gradient-to-r from-lime-300 to-teal-300
            text-transparent bg-clip-text
          "
        >
          Edit Profile
        </h2>

        {/* Success / Error */}
        {msg && <p className="mb-4 text-lime-300 text-sm">{msg}</p>}
        {error && <p className="mb-4 text-red-400 text-sm">{error}</p>}

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="
            w-full mb-4 px-4 py-2 rounded-lg
            bg-black/40 border border-white/20
            focus:outline-none focus:border-teal-400
          "
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="
            w-full mb-4 px-4 py-2 rounded-lg
            bg-black/40 border border-white/20
            focus:outline-none focus:border-teal-400
          "
          required
        />

        {/* Position */}
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          className="
            w-full mb-4 px-4 py-2 rounded-lg
            bg-black/40 border border-white/20
            focus:outline-none focus:border-teal-400
          "
        />

        {/* Profile Photo */}
        <label className="block mb-2 text-sm text-gray-300">
          Profile Photo
        </label>
        <input
          type="file"
          name="profilePhoto"
          accept="image/*"
          onChange={handleChange}
          className="mb-6 text-sm text-gray-300"
        />

        {/* Submit */}
        <button
          type="submit"
          className="
            w-full py-2 rounded-lg font-semibold
            bg-gradient-to-r from-lime-400 to-teal-400
            text-black hover:opacity-90 transition
          "
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
