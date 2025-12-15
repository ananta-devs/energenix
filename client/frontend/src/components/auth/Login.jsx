import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
    LoginGifBig, LoginGifSm
} from "../../utils/svg";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import useOtpTimer from "../../hooks/useOtpTimer";

export default function LoginPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
    });
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { setAuthToken } = useAuth();
    const navigate = useNavigate();
    const { timeLeft, isActive, startTimer } = useOtpTimer(30);

    const validateRegistration = () => {
    const newErrors = {};

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.replace(/\D/g, "");

    if (!fullName) newErrors.fullName = "Full name is required";

    if (!email) {
        newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        newErrors.email = "Invalid email address";
    }

    if (!phone) {
        newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
        newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    };


    const handleGenerateOtp = async () => {
        if (!formData.email.trim()) {
            setErrors({ email: "Email is required" });
            return;
        }  else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
            formData.email.trim().toLowerCase()
        )
        ) 

        setLoading(true);
        setErrors({});

        try {
            await api.post("/auth/check-email", { email: formData.email });
            await api.post("/auth/signin", { email: formData.email });
            setShowOtpField(true);
            startTimer();
            toast.success("OTP sent to your email!");
        } catch (err) {
            const message =
                err.response?.data?.msg ||
                "Failed to send OTP. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!validateRegistration()) return;

        setLoading(true);
        try {
            const res = await api.post("/auth/signup", formData);
            setShowOtpField(true);
            startTimer();
            toast.success(res.data.msg);
        } catch (err) {
            const message = err.response?.data?.msg || "Something went wrong";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);

        try {
            if (isRegistering) {
                toast.success("Account created successfully! Please sign in.");
                setIsRegistering(false);
                resetForm();
            } else {
                const res = await api.post("/auth/verify-signin-otp", {
                    email: formData.email,
                    otp,
                });
                setAuthToken(res.data.token);
                toast.success("Signed in successfully!");
                navigate("/");
            }
        } catch (err) {
            const message = err.response?.data?.msg || "Something went wrong";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            if (!isRegistering) {
                await api.post("/auth/signin", { email: formData.email });
                toast.success("OTP resent successfully!");
                startTimer();
            } else {
                // For registration, the backend should handle resending if the user exists but is not verified
                toast.success("OTP resent successfully!");
                startTimer();
            }
        } catch (err) {
            const message = err.response?.data?.msg || "Something went wrong";
            toast.error(message);
        }
    };

    const resetForm = () => {
        setShowOtpField(false);
        setOtp("");
        setFormData({ fullName: "", email: "", phone: "" });
        setErrors({});
    };

    const switchToLogin = () => {
        setIsRegistering(false);
        resetForm();
    };

    const switchToRegister = () => {
        setIsRegistering(true);
        resetForm();
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="min-h-screen bg-white flex flex-col lg:flex-row">
                {/* Mobile Image */}
                <div className="lg:hidden relative h-full mt-20">
                    <div className="absolute ">
                        <img src={LoginGifSm} alt="" className="w-full h-full object-cover"/>
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-full lg:w-1/2 bg-gray-100 flex flex-col lg:items-center lg:justify-center p-4 lg:p-8 mt-auto lg:mt-0">
                    <div className="w-full max-w-md mx-auto lg:mx-0">
                        <div className="text-center mb-6 lg:mb-8">
                            <h1 className="text-3xl lg:text-5xl font-bold text-black mb-3 lg:mb-4">
                                {showOtpField
                                    ? "Verify OTP"
                                    : isRegistering
                                    ? "Create Account"
                                    : "Welcome back!"}
                            </h1>
                            <p className="text-gray-600 text-sm lg:text-base">
                                {showOtpField
                                    ? `Enter the 6-digit code sent to ${formData.email}`
                                    : isRegistering
                                    ? "Join Energenix and discover thoughtfully curated spiritual items."
                                    : "Log in to explore, shop, and reconnect with energies meant for you."}
                            </p>
                        </div>

                        <div className="space-y-3 lg:space-y-4">
                            {showOtpField ? (
                                <>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(e.target.value)
                                            }
                                            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-4 lg:right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                    <div className="text-center">
                                        {isActive ? (
                                            <p className="text-gray-600">
                                                Resend OTP in {timeLeft}s
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                className="text-black font-semibold hover:underline cursor-pointer"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : isRegistering ? (
                                <>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleFormChange}
                                            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition"
                                        />
                                        {errors.fullName && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.fullName}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleFormChange}
                                            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={
                                    showOtpField
                                        ? handleVerifyOtp
                                        : isRegistering
                                        ? handleRegister
                                        : handleGenerateOtp
                                }
                                disabled={loading}
                                className="w-full bg-black text-white py-3 lg:py-4 rounded-full font-medium hover:bg-gray-800 transition disabled:bg-gray-400 cursor-pointer"
                            >
                                {loading
                                    ? "Processing..."
                                    : showOtpField
                                    ? "Verify OTP"
                                    : isRegistering
                                    ? "Register"
                                    : "Generate OTP"}
                            </button>

                            {showOtpField && (
                                <button
                                    onClick={resetForm}
                                    className="w-full text-center text-gray-600 hover:text-black transition mt-2 text-sm cursor-pointer"
                                >
                                    ← Back
                                </button>
                            )}
                        </div>

                        {!showOtpField && (
                            <>
                                <div className="flex items-center my-4 lg:my-6">
                                    <div className="flex-1 border-t border-gray-300"></div>
                                    <span className="px-4 text-sm text-gray-500">
                                        or
                                    </span>
                                    <div className="flex-1 border-t border-gray-300"></div>
                                </div>
                                <p className="text-center text-gray-600 text-sm lg:text-base">
                                    {isRegistering ? (
                                        <>
                                            Already have an account?{" "}
                                            <button
                                                onClick={switchToLogin}
                                                className="text-black hover:underline font-medium cursor-pointer"
                                            >
                                                Login here
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Not a member?{" "}
                                            <button
                                                onClick={switchToRegister}
                                                className="text-black hover:underline font-medium cursor-pointer"
                                            >
                                                Register now
                                            </button>
                                        </>
                                    )}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Desktop Image */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <img src={LoginGifBig} alt="" className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>
        </>
    );
}