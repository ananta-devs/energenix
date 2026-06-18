import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, X } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import { useProducts } from '../../context/ProductContext.jsx';
import { slugify } from '../../utils/slugify.js';
import FullPageLoader from "../ui/FullPageLoader.jsx";
import Maintenance from "../../pages/Maintenance.jsx";

export default function CategoryPage() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState('featured');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [isClosingFilterModal, setIsClosingFilterModal] = useState(false);
  const [isClosingSortModal, setIsClosingSortModal] = useState(false);

  const priceRanges = useMemo(() => [
    { key: '<1000', label: 'Under 1,000' },
    { key: '1000-3000', label: '1,000 - 3,000' },
    { key: '3000-5000', label: '3,000 - 5,000' },
    { key: '>5000', label: 'Over 5,000' },
  ], []);

  const handlePriceRangeChange = (rangeKey) => {
    setSelectedPriceRanges(prev =>
      prev.includes(rangeKey)
        ? prev.filter(r => r !== rangeKey)
        : [...prev, rangeKey]
    );
  };

  const clearFilters = () => {
    setSelectedPriceRanges([]);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showFilterModal || showSortModal) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Store scroll position in sessionStorage for restoration
      sessionStorage.setItem('scrollPosition', scrollY.toString());
      
      return () => {
        // Restore scroll position
        const savedScrollY = parseInt(sessionStorage.getItem('scrollPosition') || '0', 10);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, savedScrollY);
        sessionStorage.removeItem('scrollPosition');
      };
    }
  }, [showFilterModal, showSortModal]);

  // Close modals when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showFilterModal) {
          handleCloseFilterModal();
        }
        if (showSortModal) {
          handleCloseSortModal();
        }
      }
    };
    
    // Prevent body scroll when modal is open
    const handleTouchMove = (e) => {
      if (showFilterModal || showSortModal) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [showFilterModal, showSortModal]);

  // Handle closing filter modal with animation
  const handleCloseFilterModal = () => {
    setIsClosingFilterModal(true);
    setTimeout(() => {
      setShowFilterModal(false);
      setIsClosingFilterModal(false);
    }, 300); // Match the CSS animation duration
  };

  // Handle closing sort modal with animation
  const handleCloseSortModal = () => {
    setIsClosingSortModal(true);
    setTimeout(() => {
      setShowSortModal(false);
      setIsClosingSortModal(false);
    }, 300); // Match the CSS animation duration
  };

  const uniqueCategories = useMemo(() => {
    const categories = [];
    products.forEach(p => {
      if (p.p_category && !categories.some(cat => cat._id === p.p_category._id)) {
        categories.push({ _id: p.p_category._id, name: p.p_category.product_category });
      }
    });
    return categories;
  }, [products]);

  const availablePriceRanges = useMemo(() => {
    return priceRanges.filter(range => {
      return products.some(p => {
        const price = p.discount_price;
        if (range.key === '<1000') return price < 1000;
        if (range.key === '1000-3000') return price >= 1000 && price <= 3000;
        if (range.key === '3000-5000') return price >= 3000 && price <= 5000;
        if (range.key === '>5000') return price > 5000;
        return false;
      });
    });
  }, [products, priceRanges]);

  useEffect(() => {
    if (identifier === 'all') {
      setCurrentCategory({ _id: 'all', name: 'All Products' });
      return;
    }

    if (uniqueCategories.length > 0) {
      const foundCategory = uniqueCategories.find(c => 
        c._id === identifier || slugify(c.name) === identifier
      );

      if (foundCategory) {
        setCurrentCategory(foundCategory);
        const categorySlug = slugify(foundCategory.name);
        if (identifier !== categorySlug) {
          navigate(`/category/${categorySlug}`, { replace: true });
        }
      } else if (!loading) {
        setCurrentCategory(null);
      }
    }
  }, [identifier, uniqueCategories, navigate, loading]);
  
  const filteredProducts = products.filter(p => {
    if (!currentCategory) return false;
    
    // Category filter
    const inCategory = currentCategory._id === 'all' || (p.p_category && p.p_category._id === currentCategory._id);
    if (!inCategory) return false;

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      const price = p.discount_price;
      const matchesPrice = selectedPriceRanges.some(range => {
        if (range === '<1000') return price < 1000;
        if (range === '1000-3000') return price >= 1000 && price <= 3000;
        if (range === '3000-5000') return price >= 3000 && price <= 5000;
        if (range === '>5000') return price > 5000;
        return false;
      });
      if (!matchesPrice) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.discount_price - b.discount_price;
    if (sortBy === 'price-high') return b.discount_price - a.discount_price;
    return 0;
  });

  if (loading) {
    return <FullPageLoader />;
  }

  if (error) {
    return <Maintenance />;
  }

  return (
    <div className="min-h-screen bg-gray-50 mb-10 lg:mb-0">
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes slideDown {
            from {
              transform: translateY(0);
              opacity: 1;
            }
            to {
              transform: translateY(100%);
              opacity: 0;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 0.7;
            }
          }
          
          @keyframes fadeOut {
            from {
              opacity: 0.7;
            }
            to {
              opacity: 0;
            }
          }
          
          .animate-slide-up {
            animation: slideUp 0.3s ease-out forwards;
          }
          
          .animate-slide-down {
            animation: slideDown 0.3s ease-in forwards;
          }
          
          .animate-fade-in {
            animation: fadeIn 0.2s ease-out forwards;
          }
          
          .animate-fade-out {
            animation: fadeOut 0.2s ease-in forwards;
          }
        `}
      </style>
      
      <div className="container mx-auto px-0 sm:px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Hidden on small screens, shown on large */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                {selectedPriceRanges.length > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm font-medium text-blue-800 hover:text-blue-950"
                  >
                    Clear
                  </button>
                )}
                <Filter className="w-5 h-5 text-gray-400" />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Category</h4>
                <div className="space-y-2">
                  <label key="all" className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      className="mr-2 accent-blue-800" 
                      checked={currentCategory?._id === 'all'}
                      onChange={() => navigate('/category/all')}
                    />
                    <span className="text-sm">All Products</span>
                  </label>
                  {uniqueCategories.map(cat => (
                    <label key={cat._id} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="category" 
                        className="mr-2 accent-blue-800" 
                        checked={currentCategory?._id === cat._id}
                        onChange={() => navigate(`/category/${slugify(cat.name)}`)}
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  {availablePriceRanges.map(range => (
                    <label key={range.key} className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-2 accent-blue-800"
                        checked={selectedPriceRanges.includes(range.key)}
                        onChange={() => handlePriceRangeChange(range.key)}
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            
            {/* Toolbar - Hidden on small screens, shown on large */}
            <div className="hidden sm:flex bg-white p-4 rounded-xl shadow-sm mb-6 flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-600">{filteredProducts.length} products found</p>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg outline-none focus:border-blue-800"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid - 2 columns on small screens, 3 on large */}
            {/* Removed outer margins and added inner half-gaps */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 -mx-1 sm:mx-0 gap-y-4 sm:gap-2 lg:gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product._id}
                  className={`px-1 sm:px-0 ${index % 2 === 0 ? 'pr-0.5' : 'pl-0.5'} sm:pr-0 sm:pl-0`}
                >
                  <ProductCard 
                    product={product} 
                    hideAddToCartOnMobile={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar for Small Screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between gap-2 z-40 shadow-lg">
        <button 
          onClick={() => setShowFilterModal(true)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filter
        </button>
        <button 
          onClick={() => setShowSortModal(true)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <List className="w-5 h-5" />
          Sort
        </button>
      </div>

      {/* Filter Modal for Small Screens */}
      {(showFilterModal || isClosingFilterModal) && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black z-50 lg:hidden ${isClosingFilterModal ? 'animate-fade-out' : 'animate-fade-in'}`}
            style={{ opacity: isClosingFilterModal ? 0 : 0.7 }}
            onClick={handleCloseFilterModal}
          />
          
          {/* Modal Content - Slides from bottom */}
          <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden ${isClosingFilterModal ? 'animate-slide-down' : 'animate-slide-up'}`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h3 className="text-xl font-bold">Filters</h3>
                {selectedPriceRanges.length > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm font-medium text-blue-800 hover:text-blue-950"
                  >
                    Clear
                  </button>
                )}
                <button 
                  onClick={handleCloseFilterModal}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-lg">Category</h4>
                <div className="space-y-3">
                  <label key="all" className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="modal-category" 
                      className="mr-3 w-5 h-5 accent-blue-800" 
                      checked={currentCategory?._id === 'all'}
                      onChange={() => {
                        navigate('/category/all');
                        handleCloseFilterModal();
                      }}
                    />
                    <span className="text-base">All Products</span>
                  </label>
                  {uniqueCategories.map(cat => (
                    <label key={cat._id} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="modal-category" 
                        className="mr-3 w-5 h-5 accent-blue-800" 
                        checked={currentCategory?._id === cat._id}
                        onChange={() => {
                          navigate(`/category/${slugify(cat.name)}`);
                          handleCloseFilterModal();
                        }}
                      />
                      <span className="text-base">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-lg">Price Range</h4>
                <div className="space-y-3">
                  {availablePriceRanges.map(range => (
                    <label key={range.key} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-5 h-5 accent-blue-800" 
                        checked={selectedPriceRanges.includes(range.key)}
                        onChange={() => handlePriceRangeChange(range.key)}
                      />
                      <span className="text-base">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t">
                <button 
                  onClick={handleCloseFilterModal}
                  className="w-full bg-blue-950 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sort Modal for Small Screens */}
      {(showSortModal || isClosingSortModal) && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black z-50 lg:hidden ${isClosingSortModal ? 'animate-fade-out' : 'animate-fade-in'}`}
            style={{ opacity: isClosingSortModal ? 0 : 0.7 }}
            onClick={handleCloseSortModal}
          />
          
          {/* Modal Content - Slides from bottom */}
          <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden ${isClosingSortModal ? 'animate-slide-down' : 'animate-slide-up'}`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h3 className="text-xl font-bold">Sort By</h3>
                <button 
                  onClick={handleCloseSortModal}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sort Options */}
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="sort-option" 
                    className="mr-3 w-5 h-5 accent-blue-800" 
                    value="price-low"
                    checked={sortBy === 'price-low'}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      handleCloseSortModal();
                    }}
                  />
                  <span className="text-base">Price: Low to High</span>
                </label>
                
                <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="sort-option" 
                    className="mr-3 w-5 h-5 accent-blue-800" 
                    value="price-high"
                    checked={sortBy === 'price-high'}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      handleCloseSortModal();
                    }}
                  />
                  <span className="text-base">Price: High to Low</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}