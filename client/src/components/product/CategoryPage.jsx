import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, X } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import { useProducts } from '../../context/ProductContext.jsx';
import { slugify } from '../../utils/slugify.js';

export default function CategoryPage() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState('featured');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

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
        setShowFilterModal(false);
        setShowSortModal(false);
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

  const uniqueCategories = useMemo(() => {
    const categories = [];
    products.forEach(p => {
      if (p.p_category && !categories.some(cat => cat._id === p.p_category._id)) {
        categories.push({ _id: p.p_category._id, name: p.p_category.product_category });
      }
    });
    return categories;
  }, [products]);

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
    if (currentCategory._id === 'all') return true;
    return p.p_category && p.p_category._id === currentCategory._id;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.discount_price - b.discount_price;
    if (sortBy === 'price-high') return b.discount_price - a.discount_price;
    return 0;
  });

  // Close modal handler
  const closeModal = () => {
    setShowFilterModal(false);
    setShowSortModal(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-0 sm:px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Hidden on small screens, shown on large */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
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
                      className="mr-2" 
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
                        className="mr-2" 
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
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Under 1,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">1,000 - 3,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">3,000 - 5,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Over 5,000</span>
                  </label>
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
                  className="px-4 py-2 border rounded-lg outline-none focus:border-purple-600"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
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
      {showFilterModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black opacity-70 z-50 lg:hidden"
            onClick={closeModal}
          />
          
          {/* Modal Content - Slides from bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden animate-slideUp">
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h3 className="text-xl font-bold">Filters</h3>
                <button 
                  onClick={closeModal}
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
                      className="mr-3 w-5 h-5" 
                      checked={currentCategory?._id === 'all'}
                      onChange={() => {
                        navigate('/category/all');
                        closeModal();
                      }}
                    />
                    <span className="text-base">All Products</span>
                  </label>
                  {uniqueCategories.map(cat => (
                    <label key={cat._id} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="modal-category" 
                        className="mr-3 w-5 h-5" 
                        checked={currentCategory?._id === cat._id}
                        onChange={() => {
                          navigate(`/category/${slugify(cat.name)}`);
                          closeModal();
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
                  <label className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="mr-3 w-5 h-5" />
                    <span className="text-base">Under 1,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="mr-3 w-5 h-5" />
                    <span className="text-base">1,000 - 3,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="mr-3 w-5 h-5" />
                    <span className="text-base">3,000 - 5,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="mr-3 w-5 h-5" />
                    <span className="text-base">Over 5,000</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sort Modal for Small Screens */}
      {showSortModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black opacity-70 z-50 lg:hidden"
            onClick={closeModal}
          />
          
          {/* Modal Content - Slides from bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden animate-slideUp">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h3 className="text-xl font-bold">Sort By</h3>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sort Options */}
              <div className="space-y-4">
                <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="sort-option" 
                    className="mr-3 w-5 h-5" 
                    value="price-low"
                    checked={sortBy === 'price-low'}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      closeModal();
                    }}
                  />
                  <span className="text-base">Price: Low to High</span>
                </label>
                
                <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="sort-option" 
                    className="mr-3 w-5 h-5" 
                    value="price-high"
                    checked={sortBy === 'price-high'}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      closeModal();
                    }}
                  />
                  <span className="text-base">Price: High to Low</span>
                </label>
                
                <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="sort-option" 
                    className="mr-3 w-5 h-5" 
                    value="rating"
                    checked={sortBy === 'rating'}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      closeModal();
                    }}
                  />
                  <span className="text-base">Highest Rated</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}