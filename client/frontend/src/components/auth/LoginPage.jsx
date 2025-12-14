import React, { useState } from "react";
import { Mail } from "lucide-react";
import Button from "../ui/Button";
import InputField from "../ui/Input";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, showToast } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!email.trim()) {
            setError("Email is required");
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Invalid email format");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const checkEmailRes = await api.post("/auth/check-email", {
                email,
            });
            // If status is 200, email exists, proceed with login
            if (checkEmailRes.status === 200) {
                try {
                    const success = await login(email);
                    if (success) {
                        navigate("/verify-otp", {
                            state: { from: "signin", contact: email },
                        });
                    } else {
                        // login function returns false if there was an issue sending OTP
                        // or other non-email-existence related issues that were not caught by checkEmail.
                        // In this specific case, login only returns false if OTP failed to send
                        // or other unhandled errors that are not email existence.
                        showToast(
                            "Failed to send OTP. Please try again.",
                            "error"
                        );
                    }
                } catch (loginErr) {
                    // Catch errors specifically from the login (signin) API call
                    showToast(
                        loginErr.response?.data?.msg ||
                            "Login failed. Please try again.",
                        "error"
                    );
                }
            }
        } catch (checkEmailErr) {
            if (
                checkEmailErr.response &&
                checkEmailErr.response.status === 400
            ) {
                // Email does not exist - this is the intended path for unregistered emails
                showToast("This email is not registered yet.", "error");
            } else {
                // Other API errors from check-email
                showToast(
                    checkEmailErr.response?.data?.msg ||
                        "Something went wrong during email check.",
                    "error"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Welcome Back
                </h2>
                <p className="text-gray-600 mb-6">Sign in to your account</p>

                <div onKeyPress={handleKeyPress}>
                    <InputField
                        label="Email"
                        icon={Mail}
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={error}
                    />

                    <Button loading={loading} onClick={handleSubmit}>
                        Send OTP
                    </Button>
                </div>

                <p className="text-center mt-6 text-gray-600">
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate("/signup")}
                        className="text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
