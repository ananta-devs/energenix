import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import OtpInput from './OtpInput';
import { useAuth } from '../../context/AuthContext';
import useOtpTimer from '../../hooks/useOtpTimer';
import { API_BASE_URL } from '../../utils/api';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { timeLeft, isActive, startTimer } = useOtpTimer(30);
  const { showToast, setAuthToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { from, contact } = location.state || {};

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  const handleVerify = () => {
    if (otp.length !== 6) {
      showToast('Please enter a valid 6-digit OTP', 'error');
      return;
    }

    setLoading(true);
    
    if (from === 'signin') {
      // Handle sign in with OTP
      fetch(`${API_BASE_URL}/auth/verify-signin-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: contact, otp }),
      })
        .then(async (res) => {
          if (res.ok) {
            return res.json();
          } else {
            const errorData = await res.json();
            throw new Error(errorData.msg || 'Something went wrong');
          }
        })
        .then((data) => {
          setAuthToken(data.token);
          showToast('Signed in successfully!', 'success');
          navigate('/');
        })
        .catch((err) => {
          showToast(err.message, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Handle other OTP verifications (signup)
      fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: contact, otp, from: from }),
      })
        .then(async (res) => {
          if (res.ok) {
            return res.json();
          } else {
            const errorData = await res.json();
            throw new Error(errorData.msg || 'Something went wrong');
          }
        })
        .then((data) => {
          if (from === 'signup') {
            showToast('Account created successfully! Please sign in.', 'success');
            setTimeout(() => navigate('/login'), 1000);
          }
        })
        .catch((err) => {
          showToast(err.message, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleResend = () => {
    if (from === 'signin') {
      // Resend OTP for sign in
      fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: contact }),
      })
        .then(async (res) => {
          if (res.ok) {
            showToast('OTP resent successfully!', 'success');
            startTimer();
          } else {
            const errorData = await res.json();
            throw new Error(errorData.msg || 'Something went wrong');
          }
        })
        .catch((err) => {
          showToast(err.message, 'error');
        });
    } else {
      // Resend OTP for other cases
      startTimer();
      showToast('OTP resent successfully!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-gray-600 mb-8">
          Enter the 6-digit code sent to<br />
          <span className="font-semibold">{contact || 'your email'}</span>
        </p>
        
        <div>
          <OtpInput value={otp} onChange={setOtp} />
          
          <div className="text-center mb-6">
            {isActive ? (
              <p className="text-gray-600">
                Resend OTP in <span className="font-semibold text-blue-600">{timeLeft}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 font-semibold hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
          
          <Button loading={loading} onClick={handleVerify}>
            Verify OTP
          </Button>
        </div>
        
        <button
          onClick={() => navigate(from === 'signup' ? '/signup' : '/login')}
          className="w-full text-center mt-4 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationPage;