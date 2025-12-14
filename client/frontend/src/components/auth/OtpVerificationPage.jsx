import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import OtpInput from "./OtpInput";
import { useAuth } from "../../context/AuthContext";
import useOtpTimer from "../../hooks/useOtpTimer";
import api from "../../utils/api"; // Import api

const OtpVerificationPage = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const { timeLeft, isActive, startTimer } = useOtpTimer(30);
    const { showToast, setAuthToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { from, contact } = location.state || {};

    useEffect(() => {
        startTimer();
    }, [startTimer]);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            showToast("Please enter a valid 6-digit OTP", "error");
            return;
        }

        setLoading(true);

        try {
            if (from === "signin") {
                // Handle sign in with OTP
                const res = await api.post("/auth/verify-signin-otp", {
                    email: contact,
                    otp,
                });
                setAuthToken(res.data.token);
                showToast("Signed in successfully!", "success");
                navigate("/");
            } else {
                // Handle other OTP verifications (signup)
                if (from === "signup") {
                    showToast(
                        "Account created successfully! Please sign in.",
                        "success"
                    );
                    setTimeout(() => navigate("/login"), 1000);
                }
            }
        } catch (err) {
            const message =
                err.response?.data?.msg ||
                err.message ||
                "Something went wrong";
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            if (from === "signin") {
                // Resend OTP for sign in
                await api.post("/auth/signin", { email: contact });
                showToast("OTP resent successfully!", "success");
                startTimer();
            } else {
                // Resend OTP for other cases
                startTimer();
                showToast("OTP resent successfully!", "success");
            }
        } catch (err) {
            const message =
                err.response?.data?.msg ||
                err.message ||
                "Something went wrong";
            showToast(message, "error");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Verify OTP
                </h2>
                <p className="text-gray-600 mb-8">
                    Enter the 6-digit code sent to
                    <br />
                    <span className="font-semibold">
                        {contact || "your email"}
                    </span>
                </p>

                <div>
                    <OtpInput value={otp} onChange={setOtp} />

                    <div className="text-center mb-6">
                        {isActive ? (
                            <p className="text-gray-600">
                                Resend OTP in{" "}
                                <span className="font-semibold text-blue-600">
                                    {timeLeft}s
                                </span>
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
                    onClick={() =>
                        navigate(from === "signup" ? "/signup" : "/login")
                    }
                    className="w-full text-center mt-4 text-gray-600 hover:text-gray-800"
                >
                    ← Back
                </button>
            </div>
        </div>
    );
};

export default OtpVerificationPage;