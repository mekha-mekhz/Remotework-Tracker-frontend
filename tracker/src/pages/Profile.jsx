import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../components/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/me");
        setProfile(res.data.user);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        Loading...
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        No profile data found.
      </div>
    );

  return (
    <div
      className="
        min-h-screen p-6
        bg-gradient-to-br from-gray-900 via-gray-800 to-black
        text-white
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1
          className="
            text-3xl font-bold
            bg-gradient-to-r from-lime-300 to-teal-300
            text-transparent bg-clip-text
          "
        >
          My Profile
        </h1>

        <Link
          to="/edit-profile"
          className="
            px-5 py-2 rounded-lg
            bg-gradient-to-r from-lime-400 to-teal-400
            text-black font-semibold
            hover:opacity-90 transition
          "
        >
          Edit Profile
        </Link>
      </div>

      {/* Profile Card */}
      <div
        className="
          bg-white/10 backdrop-blur-md
          border border-white/20
          rounded-2xl shadow-2xl
          p-6 flex items-center gap-6
        "
      >
        {/* Profile Photo */}
        <img
          src={
            profile?.profilePhoto && profile.profilePhoto.startsWith("http")
              ? profile.profilePhoto
              : "/default.jpg"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-teal-300 object-cover"
          onError={(e) => (e.target.src = "/default.jpg")}
        />

        {/* Basic Details */}
        <div>
          <h2 className="text-2xl font-semibold text-teal-300">
            {profile.name}
          </h2>
          <p className="text-gray-300 capitalize">{profile.role}</p>
          <p className="text-gray-400">{profile.email}</p>
        </div>
      </div>

      {/* Personal Details */}
      <div
        className="
          mt-8 p-6 rounded-2xl
          bg-white/10 backdrop-blur-md
          border border-white/20
          shadow-xl
        "
      >
        <h2
          className="
            text-xl font-semibold mb-4
            bg-gradient-to-r from-lime-300 to-teal-300
            text-transparent bg-clip-text
          "
        >
          Personal Details
        </h2>

        <div className="space-y-2 text-gray-300">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Position:</strong> {profile.position || "—"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={profile.isActive ? "text-lime-300" : "text-red-400"}>
              {profile.isActive ? "Active" : "Inactive"}
            </span>
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
