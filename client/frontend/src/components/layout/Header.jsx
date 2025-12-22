import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'; // Added useRef
import { Link, NavLink as RouterNavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api';
import { slugify } from '../../utils/slugify';
import logo from '../../assets/logo.svg';
import { Search, ShoppingCart, User, X, LogIn, Home, ShoppingBag, Mail, UserCircle, LogOut } from 'lucide-react';

// ============================ Memoized Components ============================
const NavLink = React.memo(({ children, to, onClick }) => {
  const baseClasses = "font-medium transition-all duration-300";
  
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        `${baseClasses} ${isActive 
          ? "text-amber-300" 
          : "text-white hover:text-amber-300 hover:translate-x-1"}`
      }
    >
      {children}
    </RouterNavLink>
  );
});

const SidebarBackdrop = React.memo(({ isOpen, onClick }) => (
  <div
    onClick={onClick}
    className={`fixed inset-0 bg-black z-40 transition-all duration-300 ${
      isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}
    aria-hidden={!isOpen}
  />
));

const SidebarContent = React.memo(({ isOpen, children }) => (
  <aside
    className={`fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-blue-950 to-blue-900 shadow-2xl z-50 transform transition-all duration-300 ease-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}
    aria-label="Sidebar menu"
  >
    {children}
  </aside>
));

const Logo = React.memo(() => (
  <Link to="/" className="flex items-center space-x-3 group">
    <div className="w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center bg-white/5">
      <img
        src={logo}
        alt="Energenix Logo"
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        loading="eager"
        width={56}
        height={56}
      />
    </div>
    <div className="flex flex-col leading-tight">
      <span
        className="text-2xl font-bold bg-clip-text text-transparent"
        style={{
          backgroundImage: 'linear-gradient(to right, #F4D48D, #D4AF37)',
        }}
      >
        EnergeniX
      </span>
      <span className="text-gray-300 text-xs sm:text-sm italic">
        where ancient wisdom meets modern science
      </span>
    </div>
  </Link>
));

const CartIcon = React.memo(({ itemCount, onClick }) => (
  <button
    onClick={onClick}
    className="relative p-2 rounded-full cursor-pointer hover:bg-blue-900 transition focus:outline-none focus:ring-2 focus:ring-amber-300"
    aria-label={`Open cart (${itemCount} items)`}
  >
    <ShoppingCart className="w-5 h-5 text-white" aria-hidden="true" />
    {itemCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
        {itemCount > 99 ? '99+' : itemCount}
      </span>
    )}
  </button>
));

const SearchSuggestions = React.memo(({ 
  suggestions, 
  onSuggestionClick,
  isMobile = false
}) => {
  const containerRef = useRef(null);
  
  const handleScroll = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-search ${
        isMobile ? 'max-h-[70vh]' : ''
      }`}
    >
      <div 
        className={`overflow-y-auto overscroll-contain ${
          isMobile ? 'max-h-[60vh]' : 'max-h-[300px]'
        }`}
        onWheel={handleScroll}
        onTouchMove={handleScroll}
      >
        <div className="py-2">
          {suggestions.map((product) => (
            <Link
              key={product._id}
              to={`/product/${slugify(product.p_name)}`}
              onClick={(e) => {
                e.stopPropagation();
                onSuggestionClick(product);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-800 flex items-center gap-3 transition-colors focus:outline-none focus:bg-gray-100"
            >
              {product.image_urls?.[0] ? (
                <img 
                  src={product.image_urls[0]} 
                  alt={product.p_name} 
                  className="w-8 h-8 object-cover rounded flex-shrink-0"
                  loading="lazy"
                  width={32}
                  height={32}
                />
              ) : (
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
              )}
              <div className="flex flex-col overflow-hidden min-w-0">
                <span className="truncate font-medium">{product.p_name}</span>
                <span className="text-xs text-gray-500">₹{product.discount_price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});

const HamburgerButton = React.memo(({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="lg:hidden relative w-10 h-10 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-full"
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
  >
    <div className="relative w-6 h-5 flex flex-col justify-center items-center">
      <span
        className={`absolute h-0.5 w-6 bg-white rounded-full transform transition-all duration-300 ${
          isOpen
            ? 'rotate-45 translate-y-0'
            : '-translate-y-2 group-hover:w-5'
        }`}
      />
      <span
        className={`absolute h-0.5 bg-white rounded-full transform transition-all duration-300 ${
          isOpen ? 'w-0 opacity-0' : 'w-6 opacity-100'
        }`}
      />
      <span
        className={`absolute h-0.5 w-6 bg-white rounded-full transform transition-all duration-300 ${
          isOpen
            ? '-rotate-45 translate-y-0'
            : 'translate-y-2 group-hover:w-5'
        }`}
      />
    </div>
  </button>
));

// ============================ Main Header Component ============================
const Header = () => {
  const { itemCount, setIsOpen } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Refs for detecting outside clicks
  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);

  // Throttle scroll handler
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar and search on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearch(false);
    setShowSuggestions(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Handle escape key for sidebar and search
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false); // Direct setter usage
        if (showSearch) {
          setShowSearch(false);
          setShowSuggestions(false);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, showSearch]);

  // Handle outside clicks for search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Desktop search
      if (searchContainerRef.current && 
          !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      
      // Mobile search
      if (mobileSearchContainerRef.current && 
          !mobileSearchContainerRef.current.contains(event.target) &&
          showSearch) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showSuggestions, showSearch]);

  // Search API Call with Debounce and AbortController
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const response = await api.get('/products/search', {
            params: { query: searchQuery },
            signal
          });
          
          setSearchSuggestions(response.data);
          
          const isExactMatch = response.data.some(p => 
            p.p_name.toLowerCase() === searchQuery.toLowerCase()
          );

          if (response.data.length > 0 && !isExactMatch) {
            setShowSuggestions(true);
          } else {
            setShowSuggestions(false);
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error("Error searching products", error);
            setSearchSuggestions([]);
          }
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [searchQuery]);

  // Navigation handlers
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    // handleCloseSidebar handled by useEffect
  }, [logout, navigate]);

  const handleNavigation = useCallback(() => {
    navigate('/dashboard');
    // handleCloseSidebar handled by useEffect
  }, [navigate]);

  const handleCloseSidebar = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setMobileMenuOpen(true);
    setShowSearch(false);
    setShowSuggestions(false);
  }, []);

  const handleNavClick = useCallback(() => {
    // handleCloseSidebar handled by useEffect
  }, []);

  const handleSearchClick = useCallback(() => {
    setShowSearch(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setShowSearch(false);
    setSearchQuery('');
    setShowSuggestions(false);
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // Closing handled by useEffect
    }
  }, [searchQuery, navigate]);

  const handleSuggestionClick = useCallback((product) => {
    // We only update the query here to reflect what was clicked.
    // Navigation is handled by the Link component.
    // Closing is handled by the useEffect on location change.
    setSearchQuery(product.p_name);
  }, []);

  const handleSearchInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearchInputFocus = useCallback(() => {
    if (searchQuery.trim()) {
      setShowSuggestions(true);
    }
  }, [searchQuery]);

  const handleDesktopSearchSubmit = useCallback((e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input && input.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
    }
  }, [navigate]);

  const handleViewAllResults = useCallback(() => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    // Closing handled by useEffect
  }, [navigate, searchQuery]);

  // Memoized navigation items
  const navigationItems = useMemo(() => [
    { to: '/', label: 'Home' },
    { to: '/category/all', label: 'Shop' },
    { to: '/contact', label: 'Contact' }
  ], []);

  // Don't show header on dashboard
  if (location.pathname === '/dashboard') return null;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white text-black py-2 px-4 text-center text-sm">
        <p className="lg:hidden">🏷️ Sale is LIVE for a Limited Time.</p>
        <p className="hidden lg:block">🏷️ Sale is LIVE for a Limited Time🛍️ | We energize and cleanse our crystals before dispatching the orders.</p>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-blue-950 shadow-lg'
            : 'bg-blue-950 backdrop-blur-sm'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-3 max-w-screen-xl">
          <div className="flex items-center justify-between py-2 w-full">
            {/* LOGO + TEXT */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8" aria-label="Main navigation">
              {navigationItems.map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT SECTION */}
            <div className="flex items-center space-x-4">
              {/* Search (Desktop Only) */}
              <div ref={searchContainerRef} className="hidden md:block relative">
                <form onSubmit={handleDesktopSearchSubmit} className="relative">
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-40 sm:w-56 md:w-64">
                    <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="bg-transparent outline-none text-sm w-full focus:ring-0"
                      onChange={handleSearchInputChange}
                      onFocus={handleSearchInputFocus}
                      value={searchQuery}
                      aria-label="Search products"
                    />
                    {isSearching && (
                      <div className="ml-2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </form>
                
                {/* Desktop Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <SearchSuggestions
                    suggestions={searchSuggestions}
                    onSuggestionClick={handleSuggestionClick}
                    searchQuery={searchQuery}
                    onViewAllClick={handleViewAllResults}
                  />
                )}
              </div>

              {/* Auth */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 p-2 rounded-full transition group focus:outline-none focus:ring-2 focus:ring-amber-300"
                  aria-label="Sign in"
                >
                  <User className="w-5 h-5 text-white group-hover:text-amber-300" aria-hidden="true" />
                </Link>
              ) : (
                <button
                  onClick={handleNavigation}
                  className="hidden md:flex p-2 rounded-full cursor-pointer hover:bg-blue-900 transition focus:outline-none focus:ring-2 focus:ring-amber-300"
                  aria-label="Go to dashboard"
                >
                  <User className="w-5 h-5 text-white" aria-hidden="true" />
                </button>
              )}

              {/* Cart (Desktop Only) */}
              <CartIcon itemCount={itemCount} onClick={() => setIsOpen(true)} />

              {/* Mobile Search Icon */}
              <button
                onClick={handleSearchClick}
                className="md:hidden p-2 rounded-full cursor-pointer hover:bg-blue-900 transition focus:outline-none focus:ring-2 focus:ring-amber-300"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-white" aria-hidden="true" />
              </button>

              {/* Mobile Menu Toggle */}
              <HamburgerButton isOpen={mobileMenuOpen} onClick={mobileMenuOpen ? handleCloseSidebar : handleOpenSidebar} />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden px-4 pb-4 animate-fade-in">
            <div ref={mobileSearchContainerRef} className="relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-lg">
                  <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchInputFocus}
                    placeholder="Search products..."
                    className="bg-transparent outline-none text-sm w-full text-gray-800 focus:ring-0"
                    autoFocus
                    aria-label="Search products"
                  />
                  {isSearching && (
                    <div className="mx-2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  <button
                    type="button"
                    onClick={handleSearchClose}
                    className="ml-2 p-1 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  </button>
                </div>
              </form>
              
              {/* Mobile Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <SearchSuggestions
                  suggestions={searchSuggestions}
                  onSuggestionClick={handleSuggestionClick}
                  searchQuery={searchQuery}
                  onViewAllClick={handleViewAllResults}
                  isMobile={true}
                />
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sidebar Backdrop */}
      <SidebarBackdrop isOpen={mobileMenuOpen} onClick={handleCloseSidebar} />

      {/* Sidebar Content */}
      <SidebarContent isOpen={mobileMenuOpen}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Energenix Logo"
              className="w-10 h-10 rounded-lg"
              loading="lazy"
              width={40}
              height={40}
            />
            <div>
              <span
                className="text-lg font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #F4D48D, #D4AF37)',
                }}
              >
                EnergeniX
              </span>
              <p className="text-gray-400 text-xs">Menu</p>
            </div>
          </div>
          <button
            onClick={handleCloseSidebar}
            className="p-2 hover:bg-blue-800 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" aria-hidden="true" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider font-medium">
              Navigation
            </h3>
            <nav className="space-y-3" aria-label="Sidebar navigation">
              <Link
                to="/"
                onClick={handleNavClick}
                className="flex items-center gap-3 text-white py-3 hover:text-amber-300 transition group focus:outline-none focus:text-amber-300"
              >
                <Home className="w-5 h-5 text-gray-400 group-hover:text-amber-300" aria-hidden="true" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/category/all"
                onClick={handleNavClick}
                className="flex items-center gap-3 text-white py-3 hover:text-amber-300 transition group focus:outline-none focus:text-amber-300"
              >
                <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-amber-300" aria-hidden="true" />
                <span>Shop</span>
              </Link>
              
              <Link
                to="/contact"
                onClick={handleNavClick}
                className="flex items-center gap-3 text-white py-3 hover:text-amber-300 transition group focus:outline-none focus:text-amber-300"
              >
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-amber-300" aria-hidden="true" />
                <span>Contact</span>
              </Link>
            </nav>
          </div>

          {/* User Section */}
          <div className="space-y-4 pt-4 border-t border-blue-700">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider font-medium">
              Account
            </h3>
            <div className="space-y-3">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="flex items-center gap-3 text-white py-3 hover:text-amber-300 transition group focus:outline-none focus:text-amber-300"
                >
                  <LogIn className="w-5 h-5 text-gray-400 group-hover:text-amber-300" aria-hidden="true" />
                  <span>Sign In</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 text-white py-3 hover:text-amber-300 transition group focus:outline-none focus:text-amber-300"
                  >
                    <UserCircle className="w-5 h-5 text-gray-400 group-hover:text-amber-300" aria-hidden="true" />
                    <span>My Profile</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-white py-3 hover:text-red-400 transition group w-full text-left focus:outline-none focus:text-red-400"
                    type="button"
                  >
                    <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="pt-4 border-t border-blue-700">
            <button
              onClick={() => {
                setIsOpen(true);
                handleCloseSidebar();
              }}
              className="flex items-center justify-between w-full p-3 bg-blue-800 hover:bg-blue-700 rounded-lg transition group focus:outline-none focus:ring-2 focus:ring-amber-300"
              type="button"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-white" aria-hidden="true" />
                <div>
                  <p className="text-white font-medium">Your Cart</p>
                  <p className="text-gray-400 text-sm">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              {itemCount > 0 && (
                <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-700">
          <p className="text-gray-400 text-xs text-center">
            where ancient wisdom meets modern science
          </p>
        </div>
      </SidebarContent>
    </>
  );
};

export default React.memo(Header);