import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail,  } from "lucide-react";
import logo from "../../assets/logo.svg";
import { WhatsAppIcon } from "../../utils/svg.jsx"

export default function Footer() {
    const location = useLocation();
    const [isSmallScreen, setIsSmallScreen] = useState(false); // State to track screen size

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768); // Define small screen breakpoint (e.g., 768px for md)
        };

        checkScreenSize(); // Initial check
        window.addEventListener("resize", checkScreenSize); // Add event listener for resize

        return () => window.removeEventListener("resize", checkScreenSize); // Cleanup on unmount
    }, []);

    const socialLinks = [
        {
            icon: Facebook,
            url: "https://www.facebook.com/share/172iW9tyXi/",
        },
        {
            icon: Instagram,
            url: "https://www.instagram.com/official_energenix?igsh=MWd2bWE2eXRkajJyOQ==",
        },
        {
            icon: Twitter,
            url: "#", // replace or remove if unused
        },
        {
            icon: Mail,
            url: "mailto:energenix.0@gmail.com",
        },
    ];

    // Hide footer on dashboard page
    if (location.pathname === "/dashboard") return null;
    // Hide footer on category or product pages only if it's a small screen
    if (
        isSmallScreen &&
        (location.pathname.startsWith("/category") ||
            location.pathname.startsWith("/product"))
    )
        return null;

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-4">
            <div className="container mx-auto px-4 max-w-screen-xl">
                    <div className="lg:hidden md:hidden w-full text-center pb-3">
                        <div className="flex items-center justify-center space-x-3 mb-2 ">
                            <div className="w-12 h-12 rounded-lg bg-gray-800">
                                <img
                                    src={logo}
                                    alt="Energenix Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-2xl font-bold">
                                Energenix
                            </span>
                        </div>

                        <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                            Where ancient wisdom meets modern science.
                        </p>

                        <div className="flex space-x-3 items-center justify-center mb-3">
                            {socialLinks.map(({ icon, url }, idx) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-800 border border-gray-700 rounded-full hover:bg-blue-950 transition"
                                    aria-label="social link"
                                >
                                    {React.createElement(icon, {
                                        className: "w-5 h-5",
                                    })}
                                </a>
                            ))}
                        </div>
                    </div>
                {/* TOP GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-3">
                    {/* BRAND BLOCK */}
                    <div className="w-full hidden md:block lg:block">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 overflow-hidden rounded-lg flex-shrink-0 bg-gray-800">
                                <img
                                    src={logo}
                                    alt="Energenix Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-2xl font-bold">
                                Energenix
                            </span>
                        </div>

                        <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                            Where ancient wisdom meets modern science.
                        </p>

                        <div className="flex space-x-3">
                            {socialLinks.map(({ icon, url }, idx) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-800 border border-gray-700 rounded-full hover:bg-blue-950 transition"
                                    aria-label="social link"
                                >
                                    {React.createElement(icon, {
                                        className: "w-5 h-5",
                                    })}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* QUICK LINKS + CUSTOMER SERVICE */}
                    <div className="grid grid-cols-2 gap-8 sm:col-span-1 lg:col-span-2">
                        {/* QUICK LINKS */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">
                                Quick Links
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        to="/"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/category/all"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        Shop
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about-us"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/contact"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* CUSTOMER SERVICE */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">
                                Customer Service
                            </h3>
                            <ul className="space-y-2">
                                {[
                                    { label: 'Shipping Information', path: '/shipping-information' },
                                    { label: 'Returns & Exchanges', path: '/returns-exchanges' }
                                ].map(({ label, path }) => (
                                    <li key={path}>
                                    <Link
                                        to={path}
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        {label}
                                    </Link>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>
                        {/* WhatsApp CTA Card */}

                    <div className="hidden lg:block">
                        <div className="flex items-center mb-4 ">
                            <div className="w-10 h-10">
                                <WhatsAppIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-3">
                                <h4 className=" text-md">Join Community</h4>
                                <p className="text-gray-300 text-sm ">Get latest updates earlier.</p>
                            </div>
                        </div>
                        <a
                            href="https://chat.whatsapp.com/LnqCmrMi2gx0TBruxh6MXT"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-linear-to-r from-[#128082] to-emerald-600 hover:from-emerald-600 hover:to-[#128082] text-white py-2 px-2 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/50"
                        >
                            Join WhatsApp Community
                        </a>
                    </div>
                </div>
                <div className="lg:hidden px-15 py-5">
                        <div className="flex items-center mb-4 justify-center">
                            <div className="w-10 h-10">
                                <WhatsAppIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-3">
                                <h4 className=" text-md">Join Community</h4>
                                <p className="text-gray-300 text-sm ">Get latest updates earlier.</p>
                            </div>
                        </div>
                        <a
                            href="https://chat.whatsapp.com/LnqCmrMi2gx0TBruxh6MXT"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-linear-to-r from-[#128082] to-emerald-600 hover:from-emerald-600 hover:to-[#128082] text-white py-2 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/50"
                        >
                            Join WhatsApp Community
                        </a>
                </div>

                {/* BOTTOM BAR */}
                <div className="pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                    <p className="mb-4 md:mb-0 text-white">
                        GSTIN: 19HXIPD8906E1Z8
                    </p>

                    <p className="mb-4 md:mb-0">
                        &copy; 2025 Energenix. All rights reserved.
                    </p>

                    <div className="flex space-x-6">
                        <Link
                            to="/privacy-policy"
                            className="hover:text-white transition"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms-and-conditions"
                            className="hover:text-white transition"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            to="/cookie-policy"
                            className="hover:text-white transition"
                        >
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
