import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token'); 

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Verification token is missing.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/auth/mail-verification/${token}`);
        if (response.status === 200) {
          setIsVerified(true);
          setTimeout(() => {
            navigate('/login'); 
          }, 3000);
        }
      } catch (error) {
        setError('Email verification failed. Please check the token or try again later.');
      }
    };

    verifyEmail(); 

  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {isVerified ? (
          <div className="text-green-500 text-center">
            <h3 className="font-bold">Your email has been verified successfully!</h3>
            <p>You will be redirected to the login page shortly.</p>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="font-semibold">Verifying your email...</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
