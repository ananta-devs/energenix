import React, { useState, useEffect } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Search, ShoppingCart, User, Menu, X, Sparkles } from 'lucide-react';

function NavLink({ children, to }) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `font-medium transition ${isActive ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`
      }
    >
      {children}
    </RouterNavLink>
  );
}

export default function Header() {
  const { itemCount, setIsOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-2 px-4 text-center text-sm">
        <p>✨ Free Shipping on Orders Over $1000 | Certified Authentic Gemstones</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              LuxeGems
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/category/all">Shop</NavLink>
            <NavLink to="/about">About</NavLink>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            {/* Icons */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition hidden md:block">
              <User className="w-5 h-5 text-gray-700" />
            </button>
            
            <button onClick={() => setIsOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 hover:text-purple-600">Home</Link>
              <Link to="/category/all" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 hover:text-purple-600">Shop</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 hover:text-purple-600">About</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 hover:text-purple-600">Contact</Link>
            </nav>
            {/* Mobile Search */}
            <div className="mt-4 flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search gems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
