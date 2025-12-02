import React, { useState, useEffect } from 'react';
import { Link, NavLink as RouterNavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../context/AuthContext.jsx';
import logo from '../../assets/logo.svg';
import { Search, ShoppingCart, User, Menu, X, LogIn } from 'lucide-react';

function NavLink({ children, to }) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `font-medium transition ${
          isActive ? "text-amber-300" : "text-white hover:text-amber-300"
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}

export default function Header() {
  const { itemCount, setIsOpen } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigation = () => {
    navigate("dashboard");
  };

  if (location.pathname === "/dashboard") return null;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white text-black py-2 px-4 text-center text-sm">
        <p>🏷️ Sale is LIVE for a Limited Time🛍️ | We energize and cleanse our crystals before dispatching the orders.</p>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all ${
          isScrolled
            ? "bg-blue-950 shadow-md"
            : "bg-blue-950 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-3 max-w-screen-xl">
          <div className="flex items-center justify-between py-2 w-full">

            {/* LOGO + TEXT */}
            <Link to="/" className="flex items-center space-x-3">

              {/* Logo */}
              <div className="w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={logo}
                  alt="Energenix Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Block */}
              <div className="flex flex-col leading-tight">
                <span
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(to right, #F4D48D, #D4AF37)",
                  }}
                >
                  EnergeniX
                </span>

                <span className="text-gray-300 text-xs sm:text-sm italic">
                  where ancient wisdom meets modern science
                </span>
              </div>

            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/category/all">Shop</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>

            {/* RIGHT SECTION */}
            <div className="flex items-center space-x-4">

              {/* Search (Desktop Only) */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-40 sm:w-56 md:w-64">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search gems..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>

              {/* Auth */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 p-2 rounded-full transition group"
                >
                  <p className="text-white group-hover:text-amber-300">Sign In</p>
                  <LogIn className="w-5 h-5 text-white group-hover:text-amber-300" />
                </Link>
              ) : (
                <button
                  onClick={handleNavigation}
                  className="hidden md:flex p-2 rounded-full cursor-pointer"
                >
                  <User className="w-5 h-5 text-white" />
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 rounded-full cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 text-white hover:text-amber-300" />

                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-700">

              <nav className="flex flex-col space-y-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white py-2 hover:text-amber-300"
                >
                  Home
                </Link>

                <Link
                  to="/category/all"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white py-2 hover:text-amber-300"
                >
                  Shop
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white py-2 hover:text-amber-300"
                >
                  Contact
                </Link>

                {!isAuthenticated && (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white py-2 hover:text-amber-300"
                  >
                    Sign In
                  </Link>
                )}

                {isAuthenticated && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white py-2 hover:text-amber-300"
                    >
                      My Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="text-left text-white py-2 hover:text-amber-300"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </nav>

              {/* Mobile Search */}
              <div className="mt-4 flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search gems..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
