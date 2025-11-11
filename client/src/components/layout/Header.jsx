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
        `font-medium transition ${isActive ? 'text-amber-300' : 'text-white hover:text-amber-300'}`
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
  const location = useLocation(); // Get current location
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = () => {
    navigate('dashboard');
  };

  // Hide header on dashboard page
  if (location.pathname === '/dashboard') {
    return null;
  }

  return (
    <>
      {/* Top Bar - Not fixed, pushed down by margin */}
      <div className="bg-white text-black py-2 px-4 text-center text-sm">
        <p>🏷️ Sale is LIVE for a Limited Time🛍️ | We energize and cleanse our crystals before dispatching the orders.</p>
      </div>

      {/* Main Header - Fixed on scroll */}
      <header className={`sticky top-0 left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-blue-950 shadow-md' : 'bg-blue-950 backdrop-blur-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo - Updated with tagline below */}
            <Link to="/" className="flex flex-col group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition overflow-hidden">
                  <img 
                    src={logo} 
                    alt="Energenix Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-2xl font-bold bg-amber-300 bg-clip-text text-transparent">
                  Energenix
                </span>
              </div>
              <span className="hidden md:block text-gray-300 ml-13 -mb-3 font-thin italic">where ancient wisdom meets modern science</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/category/all">Shop</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              {/* Search - Hidden on mobile */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search gems..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>

              {/* User/Auth Icons */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 p-2 rounded-full transition cursor-pointer group"
                >
                  <p className="text-white group-hover:text-amber-300 transition">Sign In</p>
                  <LogIn className=" w-5 h-5 text-white group-hover:text-amber-300 transition" />
                </Link>

              ) : (
                <div className="relative hidden md:block">
                  <button className="flex items-center space-x-1 p-2 rounded-full transition" onClick={() => handleNavigation()}>
                    <User className="w-5 h-5 text-white cursor-pointer" />
                  </button>
                </div>
              )}
              
              <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-full transition">
                <ShoppingCart className="w-5 h-5 text-white cursor-pointer hover:text-amber-300" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
                {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-700">
              <nav className="flex flex-col space-y-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 text-white hover:text-amber-300 transition">Home</Link>
                <Link to="/category/all" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 text-white hover:text-amber-300 transition">Shop</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 text-white hover:text-amber-300 transition">Contact</Link>
                {!isAuthenticated && (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 text-white hover:text-amber-300 transition">Sign In</Link>
                )}
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 text-white hover:text-amber-300 transition">My Profile</Link>
                    <button onClick={handleLogout} className="text-left py-2 text-white hover:text-amber-300 transition">Sign Out</button>
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