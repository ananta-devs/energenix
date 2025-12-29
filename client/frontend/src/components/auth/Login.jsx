import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    LoginGifBig, LoginGifSm
} from "../../utils/svg";
import { useAuth } from "../../context/AuthContext";
import { dataService } from "../../utils/dataService";
import useOtpTimer from "../../hooks/useOtpTimer";

export default function LoginPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
    });
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [showOtpDigits, setShowOtpDigits] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { setAuthToken } = useAuth();
    const navigate = useNavigate();
    const { timeLeft, isActive, startTimer } = useOtpTimer(30);
    
    const otpInputRefs = useRef([]);

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
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
                formData.email.trim().toLowerCase()
            )
        ) {
            setErrors({ email: "Invalid email address" });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            await dataService.checkEmail(formData.email);
            await dataService.signIn(formData.email);
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
            const res = await dataService.signUp(formData);
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
        const otpString = otp.join("");
        
        if (otpString.length !== 6) {
            toast.error("Please fill all 6 digits of the OTP");
            return;
        }

        setLoading(true);

        try {
            if (isRegistering) {
                const res = await dataService.verifyOtp(formData.email, otpString);
                setAuthToken(res.data.token);
                toast.success("Account created and signed in successfully!");
                setIsRegistering(false);
                resetForm();
                navigate("/");
            } else {
                const res = await dataService.verifySignInOtp(
                    formData.email,
                    otpString
                );
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
            const type = isRegistering ? 'signup' : 'signin';
            await dataService.resendOtp(formData.email, type);
            toast.success("OTP resent successfully!");
            startTimer();
            setOtp(["", "", "", "", "", ""]);
            if (otpInputRefs.current[0]) {
                otpInputRefs.current[0].focus();
            }
        } catch (err) {
            const message = err.response?.data?.msg || "Something went wrong";
            toast.error(message);
        }
    };

    const resetForm = () => {
        setShowOtpField(false);
        setOtp(["", "", "", "", "", ""]);
        setShowOtpDigits(false);
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

    // OTP Input Handlers
    const handleOtpChange = (index, value) => {
        // Allow only numbers
        if (!/^\d*$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only the last character
        setOtp(newOtp);

        // Auto focus to next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // If current input is empty, focus on previous input and clear it
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                otpInputRefs.current[index - 1]?.focus();
            } else if (otp[index]) {
                // If current input has value, just clear it
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
        
        // Handle paste
        if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                const pastedText = text.replace(/\D/g, '').slice(0, 6);
                const newOtp = [...otp];
                pastedText.split('').forEach((char, idx) => {
                    if (idx < 6) {
                        newOtp[idx] = char;
                    }
                });
                setOtp(newOtp);
                
                // Focus on the next empty input or the last one
                const nextEmptyIndex = newOtp.findIndex(val => val === '');
                const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
                otpInputRefs.current[focusIndex]?.focus();
            });
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        pastedText.split('').forEach((char, idx) => {
            if (idx < 6) {
                newOtp[idx] = char;
            }
        });
        setOtp(newOtp);
        
        // Focus on the next empty input or the last one
        const nextEmptyIndex = newOtp.findIndex(val => val === '');
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        otpInputRefs.current[focusIndex]?.focus();
    };

    // Focus first input when OTP field is shown
    useEffect(() => {
        if (showOtpField && otpInputRefs.current[0]) {
            setTimeout(() => {
                otpInputRefs.current[0]?.focus();
            }, 100);
        }
    }, [showOtpField]);

    const isOtpComplete = otp.every(digit => digit !== "");

    return (
        <>
            <div className="min-h-screen bg-white flex flex-col lg:flex-row">
                {/* Mobile Image */}
                <div className="lg:hidden flex justify-center items-center w-full mt-20 px-4">
                    <img src={LoginGifSm} alt="" className="max-w-md w-full h-auto object-contain"/>
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
                                    <div className="flex flex-col items-center">
                                        <div className="flex justify-center space-x-2 lg:space-x-3 mb-4">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => otpInputRefs.current[index] = el}
                                                    type={showOtpDigits ? "text" : "password"}
                                                    inputMode="numeric"
                                                    pattern="\d*"
                                                    maxLength="1"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    onPaste={handleOtpPaste}
                                                    className="w-12 h-12 lg:w-14 lg:h-14 text-center text-xl lg:text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition"
                                                    autoComplete="one-time-code"
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-center space-x-2 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowOtpDigits(!showOtpDigits)}
                                                className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition"
                                            >
                                                {showOtpDigits ? (
                                                    <>
                                                        <EyeOff size={16} className="mr-1" />
                                                        Hide OTP
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye size={16} className="mr-1" />
                                                        Show OTP
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="text-center mb-2">
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
                                disabled={loading || (showOtpField && !isOtpComplete)}
                                className={`w-full py-3 lg:py-4 rounded-full font-medium transition cursor-pointer ${
                                    showOtpField && !isOtpComplete
                                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                        : "bg-blue-900 text-white hover:bg-blue-950"
                                } ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
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
                                                className="text-green-700 hover:underline font-medium cursor-pointer"
                                            >
                                                Login here
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Not a member?{" "}
                                            <button
                                                onClick={switchToRegister}
                                                className="text-green-700 hover:underline font-medium cursor-pointer"
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