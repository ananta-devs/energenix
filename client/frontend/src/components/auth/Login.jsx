import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
    LoginIllustration1,
    LoginIllustration2,
    LoginIllustration3,
    LoginIllustration4,
    LoginIllustration5,
    LoginIllustration6,
    LoginIllustration7,
    LoginIllustration8,
} from "../../utils/svg";

const desktopIllustrations = [
    <LoginIllustration1 key="1" className="w-full h-full object-cover" />,
    <LoginIllustration2 key="2" className="w-full h-full object-cover" />,
    <LoginIllustration3 key="3" className="w-full h-full object-cover" />,
    <LoginIllustration4 key="4" className="w-full h-full object-cover" />,
    <LoginIllustration5 key="5" className="w-full h-full object-cover" />,
];

const mobileIllustrations = [
    <LoginIllustration6 key="6" className="w-full h-full object-cover" />,
    <LoginIllustration7 key="7" className="w-full h-full object-cover" />,
    <LoginIllustration8 key="8" className="w-full h-full object-cover" />,
];

export default function LoginPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false); // Unified state for OTP verification mode
    const [currentDesktopSlide, setCurrentDesktopSlide] = useState(0);
    const [currentMobileSlide, setCurrentMobileSlide] = useState(0);

    // Desktop carousel timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDesktopSlide((prev) => (prev + 1) % desktopIllustrations.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    // Mobile carousel timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentMobileSlide((prev) => (prev + 1) % mobileIllustrations.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleGenerateOtp = () => {
        console.log("Generate OTP for login:", { email });
        // Generate OTP logic for login here
        setShowOtpField(true);
    };

    const handleRegister = () => {
        console.log("Registration attempted with:", {
            fullName,
            phoneNumber,
            email,
        });
        // Generate OTP logic for registration here
        setShowOtpField(true);
    };

    const handleVerifyOtp = () => {
        console.log("OTP verification attempted:", { 
            email, 
            otp,
            mode: isRegistering ? "registration" : "login"
        });
        // Handle OTP verification logic here
    };

    const resetForm = () => {
        setShowOtpField(false);
        setOtp("");
        setShowOtp(false);
    };

    const switchToLogin = () => {
        setIsRegistering(false);
        resetForm();
    };

    const switchToRegister = () => {
        setIsRegistering(true);
        resetForm();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">
            {/* Mobile Carousel Section - Visible on small screens only */}
            <div className="lg:hidden w-full h-72 relative overflow-hidden mt-40">
                <div className="absolute inset-0">
                    {mobileIllustrations.map((illustration, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentMobileSlide ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            {illustration}
                        </div>
                    ))}
                </div>
            </div>

            {/* Left Section - Login/Register Form */}
            <div className="w-full lg:w-1/2 bg-gray-100 flex flex-col lg:items-center lg:justify-center p-4 lg:p-8 mt-auto lg:mt-0">
                <div className="w-full max-w-md mx-auto lg:mx-0">
                    {/* Header */}
                    <div className="text-center mb-6 lg:mb-8">
                        <h1 className="text-3xl lg:text-5xl font-bold text-black mb-3 lg:mb-4">
                            {showOtpField 
                                ? "Verify OTP" 
                                : (isRegistering ? "Create Account" : "Welcome back!")}
                        </h1>
                        <p className="text-gray-600 text-sm lg:text-base">
                            {showOtpField
                                ? "Please enter the OTP sent to your email."
                                : (isRegistering
                                    ? "Join Tuga's App and boost your productivity. Get started for free."
                                    : "Simplify your workflow and boost your productivity with Tuga's App. Get started for free.")}
                        </p>
                    </div>

                    {/* Login/Register Form */}
                    <div className="space-y-3 lg:space-y-4">
                        {/* Show different forms based on state */}
                        {showOtpField ? (
                            <>
                                {/* OTP Verification Field (same for both login and registration) */}
                                <div className="relative">
                                    <input
                                        type={showOtp ? "text" : "password"}
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOtp(!showOtp)}
                                        className="absolute right-4 lg:right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showOtp ? (
                                            <EyeOff size={18} lg:size={20} />
                                        ) : (
                                            <Eye size={18} lg:size={20} />
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Login Form */}
                                {!isRegistering ? (
                                    <>
                                        {/* Login: Email Input */}
                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Registration Form */}
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition"
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition"
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition"
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={showOtpField 
                                ? handleVerifyOtp 
                                : (isRegistering ? handleRegister : handleGenerateOtp)}
                            className="w-full bg-black text-white py-3 lg:py-4 rounded-full font-medium hover:bg-gray-800 transition mt-3 lg:mt-4"
                        >
                            {showOtpField ? "Verify OTP" : (isRegistering ? "Register" : "Generate OTP")}
                        </button>

                        {/* Back button for OTP verification mode */}
                        {showOtpField && (
                            <button
                                onClick={resetForm}
                                className="w-full text-center text-gray-600 hover:text-black transition mt-2 text-sm"
                            >
                                ← Back to {isRegistering ? "registration" : "login"}
                            </button>
                        )}
                    </div>

                    {/* Divider - Only show when not in OTP verification mode */}
                    {!showOtpField && (
                        <div className="flex items-center my-4 lg:my-6">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-sm text-gray-500">
                                or continue with
                            </span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>
                    )}

                    {/* Register/Login Link - Only show when not in OTP verification mode */}
                    {!showOtpField && (
                        <p className="text-center text-gray-600 text-sm lg:text-base mb-4 lg:mb-0">
                            {isRegistering ? (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        onClick={switchToLogin}
                                        className="text-black hover:underline font-medium"
                                    >
                                        Login here
                                    </button>
                                </>
                            ) : (
                                <>
                                    Not a member?{" "}
                                    <button
                                        onClick={switchToRegister}
                                        className="text-black hover:underline font-medium"
                                    >
                                        Register now
                                    </button>
                                </>
                            )}
                        </p>
                    )}
                </div>
            </div>

            {/* Right Section - Desktop Full Screen Illustration Carousel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Desktop Illustration Carousel */}
                <div className="absolute inset-0">
                    {desktopIllustrations.map((illustration, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentDesktopSlide ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            {illustration}
                        </div>
                    ))}
                </div>

                {/* Desktop Carousel indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex justify-center gap-2">
                    {desktopIllustrations.map((_, index) => (
                        <div
                            key={index}
                            className={`w-8 h-2 rounded-full transition-all duration-300 ${
                                index === currentDesktopSlide ? "bg-white" : "bg-white/50"
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}