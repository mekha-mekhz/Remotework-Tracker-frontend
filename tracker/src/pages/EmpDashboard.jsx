import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

function EmpDashboard() {
  const { user } = useAuth();
  const isPremium = user?.premium;

  // 🔒 Locked Tile
  const LockedTile = ({ title, desc }) => (
    <div
      className="
        relative p-5 rounded-2xl
        bg-white/10 backdrop-blur-md
        border border-white/20
        shadow-xl overflow-hidden
      "
    >
      <div className="blur-sm pointer-events-none">
        <h2
          className="
            text-xl font-semibold
            bg-gradient-to-r from-lime-300 to-teal-300
            text-transparent bg-clip-text
          "
        >
          {title}
        </h2>
        <p className="text-gray-300 mt-2">{desc}</p>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <span
          className="
            bg-gradient-to-r from-lime-400 to-teal-400
            text-black px-4 py-1 rounded-full
            font-semibold shadow
          "
        >
          🔒 Premium Only
        </span>
      </div>
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
      <h1
        className="
          text-3xl font-bold mb-8
          bg-gradient-to-r from-lime-300 to-teal-300
          text-transparent bg-clip-text
        "
      >
        Employee Dashboard
      </h1>

      {/* Dashboard Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Work Profile */}
        <Link
          to="/profile"
          className="
            p-5 rounded-2xl
            bg-white/10 backdrop-blur-md
            border border-white/20
            hover:border-teal-300
            shadow-xl transition
          "
        >
          <h2 className="text-xl font-semibold text-teal-300">
            Work Profile
          </h2>
          <p className="text-gray-300 mt-2">
            View and update your employee profile
          </p>
        </Link>

        {/* Time Tracker */}
        <Link
          to="/time"
          className="
            p-5 rounded-2xl
            bg-white/10 backdrop-blur-md
            border border-white/20
            hover:border-lime-300
            shadow-xl transition
          "
        >
          <h2 className="text-xl font-semibold text-lime-300">
            Time Tracker
          </h2>
          <p className="text-gray-300 mt-2">
            Track work hours in real-time
          </p>
        </Link>

        {/* 🔒 Locked for Non-Premium */}
        {!isPremium ? (
          <>
            <LockedTile title="Daily Activity Log" desc="Log tasks and work activities" />
            <LockedTile title="Productivity Goals" desc="Set and track your goals" />
            <LockedTile title="Productivity Dashboard" desc="Work analytics & insights" />
            <LockedTile title="My Tasks" desc="View and update tasks" />
            <LockedTile title="Communicate" desc="Chat with manager" />
            <LockedTile title="Notifications" desc="Deadlines & alerts" />
            <LockedTile title="Weekly & Monthly Reports" desc="Performance reports" />
          </>
        ) : (
          <>
            {/* ✅ Premium Tiles */}
            {[
              ["Daily Activity Log", "/daily-log"],
              ["Productivity Goals", "/goals"],
              ["Productivity Dashboard", "/productivity"],
              ["My Tasks", "/tasks"],
              ["Communicate", "/chat"],
              ["Notifications", "/notifications"],
              ["Weekly & Monthly Reports", "/reports"],
            ].map(([title, path]) => (
              <Link
                key={title}
                to={path}
                className="
                  p-5 rounded-2xl
                  bg-white/10 backdrop-blur-md
                  border border-white/20
                  hover:border-teal-300
                  shadow-xl transition
                "
              >
                <h2
                  className="
                    text-xl font-semibold
                    bg-gradient-to-r from-lime-300 to-teal-300
                    text-transparent bg-clip-text
                  "
                >
                  {title}
                </h2>
                <p className="text-gray-300 mt-2">
                  Access {title.toLowerCase()}
                </p>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default EmpDashboard;
