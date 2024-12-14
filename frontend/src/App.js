import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DoctorList from "./components/DoctorList";
import Status from "./components/Status";
import Navbar from "./components/Navbar";
import DoctorDashboard from "./components/DoctorDashboard";
import DoctorConsultationRequests from "./components/DoctorConsultationRequests";
import EmailVerification from "./components/EmailVerification";
import OtpVerification from "./components/OtpVerification";
import DoctorAvailability from "./components/DoctorAvailability";
import { PatientProvider } from "./components/PatientContext";
import Chat from "./components/Chat";

const App = () => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken) {
      setToken(storedToken);
    }

    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    setRole("");
    localStorage.clear();
  };

  return (
    <PatientProvider>
      <Router>
        <div className="container mx-auto p-4">
          {token && (
            <Navbar token={token} setToken={handleLogout} role={role} />
          )}
          <Routes>
            <Route
              path="/login"
              index
              element={
                !token ? (
                  <Login setToken={setToken} setRole={setRole} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/register"
              element={!token ? <Register /> : <Navigate to="/" />}
            />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/verify-otp" element={<OtpVerification />} />

            <Route
              path="/"
              element={
                token ? (
                  role === "patient" ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/doctor-dashboard" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/doctor-dashboard"
              element={
                token && role === "doctor" ? (
                  <DoctorDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/doctors"
              element={
                token && role === "patient" ? (
                  <DoctorList userRole={role} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/status"
              element={
                token && role === "patient" ? (
                  <Status userRole={role} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/doctor-availability"
              element={
                token && role === "doctor" ? (
                  <DoctorAvailability />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/doctor-requests"
              element={
                token && role === "doctor" ? (
                  <DoctorConsultationRequests />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

<Route
  path="/chat"
  element={
    token && role ? (
      <Chat />
    ) : (
      <Navigate to="/login" />
    )
  }
/>
  
          </Routes>
        </div>
      </Router>
    </PatientProvider>
  );
};

export default App;
