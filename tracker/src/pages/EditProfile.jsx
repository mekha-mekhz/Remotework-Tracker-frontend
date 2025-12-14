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

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/me");
        const user = res.data.user;
        setForm({
          name: user.name,
          email: user.email,
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
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="p-6 text-white">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto bg-gray-900 rounded-lg text-white"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      {msg && <p className="mb-3 text-green-400">{msg}</p>}

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded text-white"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded text-white"
        required
      />

      <input
        type="text"
        name="position"
        placeholder="Position"
        value={form.position}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded text-white"
      />

      <label className="mb-2 block">Profile Photo:</label>
      <input
        type="file"
        name="profilePhoto"
        accept="image/*"
        onChange={handleChange}
        className="mb-4"
      />

      <button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded font-semibold"
      >
        Save Changes
      </button>
    </form>
  );
}

export default EditProfile;
