import React, { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { Link, NavLink as RouterNavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../context/AuthContext.jsx';
import logo from '../../assets/logo.svg';
import { Search, ShoppingCart, User, X, LogIn, Home, ShoppingBag, Mail, UserCircle, LogOut } from 'lucide-react';

// ============================ Memoized Components ============================
const NavLink = React.memo(({ children, to, onClick }) => {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `font-medium transition-all duration-300 ${isActive 
          ? "text-amber-300" 
          : "text-white hover:text-amber-300 hover:translate-x-1"
        }`
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
  />
));

const SidebarContent = React.memo(({ isOpen, children }) => (
  <div
    className={`fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-blue-950 to-blue-900 shadow-2xl z-50 transform transition-all duration-300 ease-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}
  >
    {children}
  </div>
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
  
  // Refs for detecting outside clicks
  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);
  const suggestionsRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape key for sidebar and search
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) handleCloseSidebar();
        if (showSearch) {
          setShowSearch(false);
          setShowSuggestions(false);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, showSearch]);

  // Handle outside clicks for search suggestions (Desktop)
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
        // Only hide suggestions, not the entire search bar on mobile
        setShowSuggestions(false);
      }
    };

    // Add event listener only when suggestions are visible
    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions, showSearch]);

  // Prevent page scroll when scrolling inside suggestions
  useEffect(() => {
    const preventPageScroll = (e) => {
      const target = e.target;
      const isInSuggestions = 
        (suggestionsRef.current && suggestionsRef.current.contains(target)) ||
        (mobileSuggestionsRef.current && mobileSuggestionsRef.current.contains(target));
      
      if (isInSuggestions) {
        // Prevent the event from bubbling up to prevent page scroll
        e.stopPropagation();
      }
    };

    // Add passive: false to allow preventDefault
    document.addEventListener('wheel', preventPageScroll, { passive: false });
    document.addEventListener('touchmove', preventPageScroll, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', preventPageScroll);
      document.removeEventListener('touchmove', preventPageScroll);
    };
  }, []);

  // Mock search suggestions (replace with actual API call)
  const getSearchSuggestions = useCallback((query) => {
    if (!query.trim()) return [];
    
    const mockProducts = [
      'Amethyst Crystal',
      'Rose Quartz',
      'Clear Quartz',
      'Citrine Stone',
      'Black Tourmaline'
    ];
    
    return mockProducts.filter(product => 
      product.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  const searchSuggestions = getSearchSuggestions(searchQuery);

  // Navigation handlers
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    handleCloseSidebar();
  }, [logout, navigate]);

  const handleNavigation = useCallback(() => {
    navigate('/dashboard');
    handleCloseSidebar();
  }, [navigate]);

  const handleCloseSidebar = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setMobileMenuOpen(true);
    setShowSearch(false); // Close search if open
    setShowSuggestions(false); // Close suggestions
  }, []);

  const handleNavClick = useCallback(() => {
    handleCloseSidebar();
  }, [handleCloseSidebar]);

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
      setShowSearch(false);
      setShowSuggestions(false);
      setSearchQuery('');
      handleCloseSidebar();
    }
  }, [searchQuery, navigate, handleCloseSidebar]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSearch(false);
    setShowSuggestions(false);
    handleCloseSidebar();
  }, [navigate, handleCloseSidebar]);

  const handleSearchInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    // Show suggestions when user types
    if (e.target.value.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, []);

  const handleSearchInputFocus = useCallback(() => {
    if (searchQuery.trim()) {
      setShowSuggestions(true);
    }
  }, [searchQuery]);

  // Handle scroll within suggestions
  const handleSuggestionsScroll = useCallback((e) => {
    // Prevent the scroll event from bubbling to the parent
    e.stopPropagation();
  }, []);

  // Desktop search submit handler
  const handleDesktopSearchSubmit = useCallback((e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input && input.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
    }
  }, [navigate]);

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
      >
        <div className="container mx-auto px-3 max-w-screen-xl">
          <div className="flex items-center justify-between py-2 w-full">
            {/* LOGO + TEXT */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={logo}
                  alt="Energenix Logo"
                  className="w-full h-full object-cover"
                  loading="lazy"
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/category/all">Shop</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>

            {/* RIGHT SECTION */}
            <div className="flex items-center space-x-4">
              {/* Search (Desktop Only) */}
              <div ref={searchContainerRef} className="hidden md:block relative">
                <form onSubmit={handleDesktopSearchSubmit} className="relative">
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-40 sm:w-56 md:w-64">
                    <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search gems..."
                      className="bg-transparent outline-none text-sm w-full"
                      onChange={handleSearchInputChange}
                      onFocus={handleSearchInputFocus}
                      value={searchQuery}
                    />
                  </div>
                </form>
                
                {/* Desktop Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-search"
                    style={{ maxHeight: '400px' }}
                  >
                    <div 
                      className="overflow-y-auto overscroll-contain" 
                      style={{ maxHeight: '300px' }}
                      onWheel={handleSuggestionsScroll}
                      onTouchMove={handleSuggestionsScroll}
                    >
                      <div className="py-2">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-800 flex items-center gap-3 transition-colors"
                          >
                            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 sticky bottom-0">
                      <button
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                )}
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
                  className="hidden md:flex p-2 rounded-full cursor-pointer hover:bg-blue-900 transition"
                  aria-label="Go to dashboard"
                >
                  <User className="w-5 h-5 text-white" />
                </button>
              )}

              {/* Cart (Desktop Only) */}
              <button
                onClick={() => setIsOpen(true)}
                className="hidden md:block relative p-2 rounded-full cursor-pointer hover:bg-blue-900 transition"
                aria-label={`Open cart (${itemCount} items)`}
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Search Icon */}
              <button
                onClick={handleSearchClick}
                className="md:hidden p-2 rounded-full cursor-pointer hover:bg-blue-900 transition"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-white" />
              </button>

              {/* Mobile Menu Toggle - Custom Hamburger */}
              <button
                onClick={mobileMenuOpen ? handleCloseSidebar : handleOpenSidebar}
                className="lg:hidden relative w-10 h-10 flex items-center justify-center group"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <div className="relative w-6 h-5 flex flex-col justify-center items-center">
                  <span
                    className={`absolute h-0.5 w-6 bg-white rounded-full transform transition-all duration-300 ${
                      mobileMenuOpen
                        ? 'rotate-45 translate-y-0'
                        : '-translate-y-2 group-hover:w-5'
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 bg-white rounded-full transform transition-all duration-300 ${
                      mobileMenuOpen ? 'w-0 opacity-0' : 'w-6 opacity-100'
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-6 bg-white rounded-full transform transition-all duration-300 ${
                      mobileMenuOpen
                        ? '-rotate-45 translate-y-0'
                        : 'translate-y-2 group-hover:w-5'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden px-4 pb-4 animate-fade-in">
            <div ref={mobileSearchContainerRef} className="relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-lg">
                  <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchInputFocus}
                    placeholder="Search gems..."
                    className="bg-transparent outline-none text-sm w-full text-gray-800"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSearchClose}
                    className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </form>
              
              {/* Mobile Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div 
                  ref={mobileSuggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-search"
                  style={{ maxHeight: '70vh' }}
                >
                  <div 
                    className="overflow-y-auto overscroll-contain" 
                    style={{ maxHeight: '60vh' }}
                    onWheel={handleSuggestionsScroll}
                    onTouchMove={handleSuggestionsScroll}
                  >
                    <div className="py-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-800 flex items-center gap-3 transition-colors"
                        >
                          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 sticky bottom-0">
                    <button
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                        setShowSearch(false);
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                </div>
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
            className="p-2 hover:bg-blue-800 rounded-lg transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider font-medium">
              Navigation
            </h3>
            <nav className="space-y-3">
              <Link
                to="/"
                onClick={handleNavClick}
                className="flex items-center gap-3 text-white py-3 hover:text-amber-300 transition group"
              >
                <Home className="w-5 h-5 text-gray-400 group-hover:text-amber-300" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/category/all"
                onClick={handleNavClick}
                className="flex items-center gap-3 text-white py-3 hover:text-amber-300 transition group"
              >
                <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-amber-300" />
                <span>Shop</span>
              </Link>
              
              <Link
                to="/contact"
                onClick={handleNavClick}
                className="flex items-center gap-3 text-white py-3 hover:text-amber-300 transition group"
              >
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-amber-300" />
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
                  className="flex items-center gap-3 text-white py-3 hover:text-amber-300 transition group"
                >
                  <LogIn className="w-5 h-5 text-gray-400 group-hover:text-amber-300" />
                  <span>Sign In</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 text-white py-3 hover:text-amber-300 transition group"
                  >
                    <UserCircle className="w-5 h-5 text-gray-400 group-hover:text-amber-300" />
                    <span>My Profile</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-white py-3 hover:text-red-400 transition group w-full text-left"
                  >
                    <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
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
              className="flex items-center justify-between w-full p-3 bg-blue-800 hover:bg-blue-700 rounded-lg transition group"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white font-medium">Your Cart</p>
                  <p className="text-gray-400 text-sm">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              {itemCount > 0 && (
                <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  {itemCount}
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