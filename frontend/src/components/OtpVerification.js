import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;  

  
  const handleOtpVerification = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError('OTP is required');
      return;
    }

    try {
      const otpData = { email, otp };
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', otpData);

      if (response.status === 200) {
        alert('OTP verified successfully!');
        navigate('/login');  
      }
    } catch (error) {
      console.error('OTP verification failed', error);
      if (error.response) {
        setError(`OTP verification failed: ${error.response.data.error}`);
      } else {
        setError('OTP verification failed. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/register');  
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4 text-center">Enter OTP</h3>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleOtpVerification}>
          <div className="mb-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full p-3 ml-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
