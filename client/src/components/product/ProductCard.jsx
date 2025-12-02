import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);

  const {
    _id,
    p_name = "Unnamed Product",
    p_price = 0,
    discount_price = p_price,
    image_urls = [],
    featured,
    bestseller,
    trending,
  } = product || {};

  const finalPrice = Number(discount_price) || 0;
  const originalPrice = Number(p_price) || 0;

  const discountPercent =
    originalPrice > 0
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : 0;

  const imageUrl =
    image_urls.length > 0
      ? image_urls[0]
      : "https://via.placeholder.com/300x300?text=No+Image";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm transition-all duration-300 overflow-hidden flex flex-col h-full">

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
        {featured && (
          <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Featured
          </span>
        )}
        {bestseller && (
          <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Bestseller
          </span>
        )}
        {trending && (
          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Trending
          </span>
        )}
      </div>

      {/* Image */}
      <Link
        to={`/product/${_id}`}
        className="relative h-64 overflow-hidden cursor-pointer block flex-shrink-0"
      >
        <img
          src={imageUrl}
          alt={p_name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-950 transition line-clamp-2">
          <Link to={`/product/${_id}`}>{p_name}</Link>
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto mb-4">
          <div>
            <span className="text-2xl font-semibold">₨. {finalPrice.toLocaleString()}</span>
            {originalPrice > finalPrice && (
              <>
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {originalPrice.toLocaleString()}
                </span>
                <span className="ml-2 text-xl font-semibold text-green-600">
                  {discountPercent}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full py-3 rounded-lg font-semibold border-2 border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white transition cursor-pointer"
        >
          Add to Cart
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="absolute bottom-3 right-3 bg-black/90 text-white px-4 py-2 rounded-lg shadow-xl z-20 flex items-center space-x-2">
          <Check className="w-5 h-5 text-green-400" />
          <span>Added to cart!</span>
        </div>
      )}
    </div>
  );
}
