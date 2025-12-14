import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";
import logo from "../../assets/logo.svg";

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

  // Hide footer on dashboard page
  if (location.pathname === "/dashboard") return null;
  // Hide footer on category or product pages only if it's a small screen
  if (isSmallScreen && (location.pathname.startsWith("/category") || location.pathname.startsWith("/product"))) return null;

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 max-w-screen-xl">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* BRAND BLOCK */}
          <div className="w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 overflow-hidden rounded-lg flex-shrink-0 bg-gray-800">
                <img
                  src={logo}
                  alt="Energenix Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold">Energenix</span>
            </div>

            <p className="text-gray-400 mb-4 leading-relaxed">
              Where ancient wisdom meets modern science.
            </p>

            <div className="flex space-x-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                <button
                  key={idx}
                  className="p-2 bg-gray-800 border border-gray-700 rounded-full hover:bg-blue-950 transition"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* QUICK LINKS + CUSTOMER SERVICE */}
          <div className="grid grid-cols-2 gap-8 sm:col-span-1 lg:col-span-2">
            
            {/* QUICK LINKS */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition">
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
              <h3 className="font-bold text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2">
                {["Shipping Information", "Returns & Exchanges", "Certification"].map(
                  (item, idx) => (
                    <li key={idx}>
                      <a className="text-gray-400 hover:text-white transition cursor-pointer">
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="w-full">
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe for exclusive offers and updates.
            </p>

            <div className="flex w-full">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 outline-none text-white placeholder-gray-400 focus:border-blue-800"
              />
              <button className="px-4 py-2 bg-gray-800 border border-gray-700 border-l-0 rounded-r-lg hover:bg-blue-950 transition flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p className="mb-4 md:mb-0">&copy; 2025 Energenix. All rights reserved.</p>

          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link to="/cookie" className="hover:text-white transition">
              Cookie Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
