import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ setToken, role }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patientId");
    localStorage.removeItem("role");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-teal-500 to-teal-700 p-4 shadow-md mb-4 rounded-lg">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-white font-bold text-2xl">
          Home
        </Link>
        {token ? (
          <>
            {role === "patient" && (
              <>
                <Link
                  to="/doctors"
                  className="text-white hover:text-gray-200 transition duration-300"
                >
                  Find Doctors
                </Link>
                <Link to="/chat" className="text-white hover:text-gray-200 transition duration-300">
                  Chat
                </Link>
                <Link
                  to="/status"
                  className="text-white hover:text-gray-200 transition duration-300"
                >
                  Consultation Status
                </Link>
              </>
            )}
            {role === "doctor" && (
              <>
                <Link
                  to="/doctor-availability"
                  className="text-white hover:text-gray-200 transition duration-300"
                >
                  Doctor Availability
                </Link>
                <Link to="/chat" className="text-white hover:text-gray-200 transition duration-300">
                  Chat
                </Link>
                <Link
                  to="/doctor-requests"
                  className="text-white hover:text-gray-200 transition duration-300"
                >
                  Consultation Requests
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white hover:text-gray-200 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white hover:text-gray-200 transition duration-300"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
