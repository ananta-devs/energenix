import React, { useState, useEffect, createContext, useContext } from 'react';
import { Eye, EyeOff, Mail, Phone, Lock, User, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Auth Context
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// Custom Hook for OTP Timer
const useOtpTimer = (initialTime = 30) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(initialTime);
    setIsActive(true);
  };

  return { timeLeft, isActive, startTimer };
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50 max-w-md`}>
      <Icon size={20} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-80 text-xl leading-none">×</button>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, icon: Icon, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Password Input Component
const PasswordInput = ({ label, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock size={20} />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full pl-11 pr-11 py-3 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Button Component
const Button = ({ children, loading, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 size={20} className="animate-spin" />}
      {children}
    </button>
  );
};

// OTP Input Component
const OtpInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (element.value && index < length - 1) {
      element.nextSibling?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      e.target.previousSibling?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center mb-6">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

// Sign Up Page
const SignUpPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast, setUserData } = useAuth();

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
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    fetch('http://localhost:4000/api/auth/signup', {
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
        onNavigate('verify-otp', { from: 'signup', contact: formData.email });
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
          
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          
          <PasswordInput
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />
          
          <Button loading={loading} onClick={handleSubmit}>
            Sign Up
          </Button>
        </div>
        
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('signin')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

// OTP Verification Page
const OtpVerificationPage = ({ onNavigate, pageData }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { timeLeft, isActive, startTimer } = useOtpTimer(30);
  const { showToast } = useAuth();

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  const handleVerify = () => {
    if (otp.length !== 6) {
      showToast('Please enter a valid 6-digit OTP', 'error');
      return;
    }

    setLoading(true);
    fetch('http://localhost:4000/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: pageData.contact, otp }),
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
        localStorage.setItem('token', data.token);
        showToast('Verification successful!', 'success');
        setTimeout(() => onNavigate('signin'), 1000);
      })
      .catch((err) => {
        showToast(err.message, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResend = () => {
    startTimer();
    showToast('OTP resent successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-gray-600 mb-8">
          Enter the 6-digit code sent to<br />
          <span className="font-semibold">{pageData?.contact || 'your email'}</span>
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
          onClick={() => onNavigate(pageData?.from === 'signup' ? 'signup' : 'forgot-password')}
          className="w-full text-center mt-4 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

// Sign In Page
const SignInPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useAuth();

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or phone is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    fetch('http://localhost:4000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.identifier, password: formData.password }),
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
        localStorage.setItem('token', data.token);
        showToast('Login successful!', 'success');
        // You can redirect to another page here, e.g., onNavigate('dashboard');
      })
      .catch((err) => {
        showToast(err.message, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Sign in to your account</p>
        
        <div onKeyPress={handleKeyPress}>
          <InputField
            label="Email or Phone"
            icon={Mail}
            placeholder="john@example.com or +1234567890"
            value={formData.identifier}
            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
            error={errors.identifier}
          />
          
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-sm text-blue-600 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          
          <Button loading={loading} onClick={handleSubmit}>
            Sign In
          </Button>
        </div>
        
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

// Forgot Password Page
const ForgotPasswordPage = ({ onNavigate }) => {
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useAuth();

  const handleSubmit = () => {
    if (!contact.trim()) {
      setError('Email or phone is required');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('OTP sent successfully!', 'success');
      onNavigate('verify-otp', { from: 'forgot-password', contact });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
        <p className="text-gray-600 mb-6">
          Enter your email or phone number and we'll send you an OTP to reset your password
        </p>
        
        <div>
          <InputField
            label="Email or Phone"
            icon={Mail}
            placeholder="john@example.com or +1234567890"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            error={error}
          />
          
          <Button loading={loading} onClick={handleSubmit}>
            Send OTP
          </Button>
        </div>
        
        <button
          onClick={() => onNavigate('signin')}
          className="w-full text-center mt-4 text-gray-600 hover:text-gray-800"
        >
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
};

// Reset Password Page
const ResetPasswordPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useAuth();

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Password reset successful!', 'success');
      setTimeout(() => onNavigate('signin'), 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p className="text-gray-600 mb-6">Enter your new password</p>
        
        <div>
          <PasswordInput
            label="New Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          
          <PasswordInput
            label="Confirm New Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />
          
          <Button loading={loading} onClick={handleSubmit}>
            Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('signin');
  const [pageData, setPageData] = useState(null);
  const [toast, setToast] = useState(null);
  const [userData, setUserData] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
    setPageData(data);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'signup':
        return <SignUpPage onNavigate={handleNavigate} />;
      case 'verify-otp':
        return <OtpVerificationPage onNavigate={handleNavigate} pageData={pageData} />;
      case 'signin':
        return <SignInPage onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case 'reset-password':
        return <ResetPasswordPage onNavigate={handleNavigate} pageData={pageData} />;
      default:
        return <SignInPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthContext.Provider value={{ showToast, userData, setUserData }}>
      <div className="relative">
        {renderPage()}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </AuthContext.Provider>
  );
};

export default App;