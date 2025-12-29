import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CookiePolicy = () => {
    const [currentDate, setCurrentDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Set current date for the policy
        setCurrentDate(
            new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
    }, []);

    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Back Button */}
            <button
                onClick={handleBackClick}
                className="mb-6 ml-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Homepage</span>
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Cookie Policy – EnergeniX
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Last updated: {currentDate}
                    </p>
                </div>

                <div className="space-y-8">
                    <section className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                        <p className="text-blue-700">
                            At EnergeniX ("we", "us", "our"), we use cookies and
                            similar technologies to enhance your browsing
                            experience, analyze website traffic, and personalize
                            content. This Cookie Policy explains what cookies
                            are, how we use them, and how you can manage your
                            cookie preferences.
                        </p>
                        <p className="text-blue-700 mt-2">
                            By using our website, you consent to the use of
                            cookies in accordance with this Cookie Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            1. What Are Cookies?
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Cookies are small text files that are placed on your
                            device (computer, tablet, or mobile) when you visit
                            a website. They are widely used to make websites
                            work more efficiently and provide information to the
                            website owners.
                        </p>
                        <div className="bg-gray-100 p-4 mt-4 rounded">
                            <p className="text-gray-700">
                                <strong>LocalStorage:</strong> We also use
                                browser LocalStorage to store certain
                                information locally on your device, such as
                                login session data and user preferences. Unlike
                                cookies, this data is not sent to our servers
                                with every request.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            2. Types of Cookies We Use
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-700 mb-2">
                                    Essential Cookies
                                </h3>
                                <p className="text-gray-700">
                                    Required for the website to function
                                    properly. These cannot be disabled.
                                </p>
                                <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                                    <li>Session management</li>
                                    <li>Security features</li>
                                    <li>Load balancing</li>
                                </ul>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-700 mb-2">
                                    Functionality Cookies
                                </h3>
                                <p className="text-gray-700">
                                    Remember your preferences and choices to
                                    enhance your experience.
                                </p>
                                <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                                    <li>Language preferences</li>
                                    <li>Region settings</li>
                                    <li>Theme preferences</li>
                                </ul>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-700 mb-2">
                                    Analytics Cookies
                                </h3>
                                <p className="text-gray-700">
                                    Help us understand how visitors interact
                                    with our website.
                                </p>
                                <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                                    <li>Page visits</li>
                                    <li>Time spent on site</li>
                                    <li>Error tracking</li>
                                </ul>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-700 mb-2">
                                    LocalStorage Data
                                </h3>
                                <p className="text-gray-700">
                                    Stored locally on your device for enhanced
                                    functionality.
                                </p>
                                <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                                    <li>Login session data</li>
                                    <li>Shopping cart items</li>
                                    <li>User preferences</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            3. Login Session Management
                        </h2>
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                            <p className="text-yellow-800">
                                <strong>Important:</strong> When you log in to
                                your EnergeniX account, we store your
                                authentication data in your browser's
                                LocalStorage for a period of 7 days (168 hours).
                            </p>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="border-l-4 border-green-500 pl-4">
                                <h3 className="font-semibold text-gray-800">
                                    3.1 7-Day Session Storage
                                </h3>
                                <p className="text-gray-700 mt-1">
                                    Your login session data is stored in
                                    LocalStorage and automatically expires after
                                    7 days. After this period, you will need to
                                    log in again to access your account.
                                </p>
                            </div>

                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="font-semibold text-gray-800">
                                    3.2 What is Stored
                                </h3>
                                <p className="text-gray-700 mt-1">
                                    We store minimal authentication data
                                    required to maintain your session:
                                </p>
                                <ul className="list-disc list-inside mt-2 text-gray-700 ml-4">
                                    <li>Authentication token (encrypted)</li>
                                    <li>User ID</li>
                                    <li>Session expiration timestamp</li>
                                    <li>Last login date</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="font-semibold text-gray-800">
                                    3.3 Security Measures
                                </h3>
                                <p className="text-gray-700 mt-1">
                                    All session data stored in LocalStorage is
                                    encrypted and cannot be accessed by
                                    third-party websites. We implement
                                    additional security measures including:
                                </p>
                                <ul className="list-disc list-inside mt-2 text-gray-700 ml-4">
                                    <li>
                                        HTTPS encryption for all data
                                        transmission
                                    </li>
                                    <li>Token rotation and validation</li>
                                    <li>
                                        Automatic logout after 30 minutes of
                                        inactivity
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            4. Managing Your Preferences
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-300 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    4.1 Browser Settings
                                </h3>
                                <p className="text-gray-700">
                                    You can control and/or delete cookies as you
                                    wish through your browser settings. You can
                                    delete all cookies that are already on your
                                    device and set most browsers to prevent them
                                    from being placed.
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <strong>Note:</strong> If you disable
                                    cookies, some features of our website may
                                    not function properly.
                                </p>
                            </div>

                            <div className="bg-white border border-gray-300 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    4.2 Managing LocalStorage
                                </h3>
                                <p className="text-gray-700">
                                    To clear LocalStorage data (including your
                                    login session):
                                </p>
                                <ul className="list-disc list-inside mt-2 text-gray-700 ml-4">
                                    <li>
                                        <strong>Chrome:</strong> Developer Tools
                                        → Application → Storage → Local Storage
                                    </li>
                                    <li>
                                        <strong>Firefox:</strong> Developer
                                        Tools → Storage → Local Storage
                                    </li>
                                    <li>
                                        <strong>Safari:</strong> Developer Tools
                                        → Storage → Local Storage
                                    </li>
                                    <li>
                                        <strong>Edge:</strong> Developer Tools →
                                        Application → Storage → Local Storage
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white border border-gray-300 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    4.3 Manual Logout
                                </h3>
                                <p className="text-gray-700">
                                    You can manually log out at any time by
                                    clicking the "Logout" button in your account
                                    section. This will immediately clear your
                                    session data from LocalStorage.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            5. Third-Party Cookies
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Some third-party services we use may set their own
                            cookies. These include:
                        </p>
                        <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700 ml-4">
                            <li>
                                <strong>Google Analytics:</strong> For website
                                traffic analysis
                            </li>
                            <li>
                                <strong>Razorpay:</strong> For secure payment
                                processing
                            </li>
                            <li>
                                <strong>Social Media Platforms:</strong> For
                                sharing and engagement features
                            </li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                            We do not control these third-party cookies. Please
                            refer to their respective privacy policies for more
                            information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            6. Data Retention
                        </h2>
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                            <p className="text-orange-800">
                                <strong>Session Data:</strong> Login session
                                data stored in LocalStorage is automatically
                                cleared after 7 days. You can manually clear
                                this data at any time through your browser
                                settings or by logging out.
                            </p>
                        </div>
                        <div className="mt-4 bg-gray-100 p-4 rounded">
                            <p className="text-gray-700">
                                <strong>Analytics Data:</strong> Anonymous
                                analytics data is retained for 26 months to help
                                us improve our services and user experience.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            7. Your Rights
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Under applicable data protection laws, you have the
                            right to:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-700 mb-2">
                                    Access & Control
                                </h3>
                                <p className="text-gray-700">
                                    Access the personal data we hold about you
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-700 mb-2">
                                    Deletion
                                </h3>
                                <p className="text-gray-700">
                                    Request deletion of your personal data
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-700 mb-2">
                                    Objection
                                </h3>
                                <p className="text-gray-700">
                                    Object to certain types of processing
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-700 mb-2">
                                    Withdrawal
                                </h3>
                                <p className="text-gray-700">
                                    Withdraw consent at any time
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                            8. Updates to This Policy
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Cookie Policy from time to time
                            to reflect changes in our practices or for other
                            operational, legal, or regulatory reasons. We will
                            notify you of any material changes by posting the
                            new Cookie Policy on this page and updating the
                            "Last updated" date.
                        </p>
                    </section>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
                        <p className="text-blue-700">
                            <strong>Contact Us:</strong> For any questions about
                            our use of cookies or this Cookie Policy, please
                            contact:
                            <br />
                            <br />
                            EnergeniX
                            <br />
                            📧 Email: energenix.official@gmail.com
                            <br />
                            📞 Phone / WhatsApp: +91 94761 56308
                            <br />
                            🕒 Mon–Sat | 10:00 AM – 6:00 PM
                        </p>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-green-700">
                            <strong>Implementation Note:</strong> Our website
                            implements a 7-day login session using browser
                            LocalStorage. After 7 days, your session will
                            automatically expire and you will need to log in
                            again. This enhances security while providing
                            convenience.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
