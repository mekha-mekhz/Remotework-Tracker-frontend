import { Link } from "react-router-dom";

function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-500 mb-4">
          ✅ Payment Successful
        </h1>

        <p className="text-gray-300 mb-6">
          Your plan has been activated successfully.
        </p>

        <Link
          to="/premium-dashboard"
          className="inline-block bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-xl font-semibold"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Success;
