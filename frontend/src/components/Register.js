import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState(""); 
  const navigate = useNavigate();

  // Handle the registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = {
        email,
        username,
        password,
        role,
        ...(role === "doctor" && { specialization, contact }),
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );

      if (response.status === 201) {
        if (role === "patient") {
          setVerificationMessage(
            "Registration successful! Please check your email for the OTP verification."
          );
          alert("Registration successful! OTP sent to your email.");
          navigate("/verify-otp", { state: { email } }); // Redirect to OTP verification page
        } else if (role === "doctor") {
          setVerificationMessage(
            "Registration successful! Please check your email for the verification link."
          );
          alert("Registration successful! Please verify your email.");
        }
      }
    } catch (error) {
      console.error("Registration failed", error);
      if (error.response) {
        setError(`Registration failed: ${error.response.data.error}`);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Registration Form */}
        {!verificationMessage && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Role:</label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            {role === "doctor" && (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Specialization"
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Contact Number"
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Register
            </button>
          </form>
        )}

        {/* Verification Message */}
        {verificationMessage && (
          <div className="p-4 bg-green-100 text-center rounded-lg mb-4">
            <h3 className="text-lg font-semibold">{verificationMessage}</h3>
          </div>
        )}

        {!verificationMessage && (
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
