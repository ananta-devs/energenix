import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { Star, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
        {product.featured && (
          <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Featured
          </span>
        )}
        {product.bestseller && (
          <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Bestseller
          </span>
        )}
        {product.trending && (
          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Trending
          </span>
        )}
      </div>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative h-64 overflow-hidden cursor-pointer block flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Contents */}
      <div className="p-5 flex-grow flex flex-col min-h-[180px]">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition cursor-pointer line-clamp-2">
            <Link to={`/product/${product.id}`}>{product.title}</Link>
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>

        {/* Specs */}
        <div className="flex items-center space-x-3 mb-3 text-xs text-gray-600 flex-wrap">
          <span>{product.specs.carat} ct</span>
          <span>•</span>
          <span>{product.specs.color}</span>
          <span>•</span>
          <span>{product.specs.clarity}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4 mt-auto">
          <div>
            <span className="text-2xl font-bold text-purple-600">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full relative py-3 rounded-lg font-semibold text-transparent bg-clip-text border-2 border-blue-950 bg-origin-border hover:scale-105 transition mt-auto cursor-pointer"
        >
          <span className="block text-transparent bg-clip-text bg-blue-950">
            Add to Cart
          </span>
        </button>
      
      </div>

      {/* Toast */}
      {showToast && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white px-6 py-3 rounded-lg shadow-xl z-20">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-400" />
            <span>Added to cart!</span>
          </div>
        </div>
      )}
    </div>
  );
}