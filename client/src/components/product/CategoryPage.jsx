import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import { useProducts } from '../../context/ProductContext.jsx';
import { slugify } from '../../utils/slugify.js';

export default function CategoryPage() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState('featured');
  const [currentCategory, setCurrentCategory] = useState(null);

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

  const currentCategoryName = currentCategory ? currentCategory.name : '';
  
  const filteredProducts = products.filter(p => {
    if (!currentCategory) return false;
    if (currentCategory._id === 'all') return true;
    return p.p_category && p.p_category._id === currentCategory._id;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.discount_price - b.discount_price;
    if (sortBy === 'price-high') return b.discount_price - a.discount_price;
    return 0;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
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
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{currentCategoryName}</h2>
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}