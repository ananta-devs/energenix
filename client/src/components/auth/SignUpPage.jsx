import React, { useState } from 'react';
import { Mail, Phone, User } from 'lucide-react';
import Button from '../ui/Button';
import InputField from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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
        showToast(data.msg, 'success');
        navigate('/verify-otp', { state: { from: 'signup', contact: formData.email } });
      })
      .catch((err) => {
        showToast(err.message, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-600 mb-6">Sign up to get started</p>
        
        <div>
          <InputField
            label="Full Name"
            icon={User}
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />
          
          <InputField
            label="Email"
            icon={Mail}
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
          
          <InputField
            label="Phone Number"
            icon={Phone}
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
          />
          
          <Button loading={loading} onClick={handleSubmit}>
            Sign Up
          </Button>
        </div>
        
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;