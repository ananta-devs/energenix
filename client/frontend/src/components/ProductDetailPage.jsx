import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { PRODUCTS } from '../data.js';
import ProductCard from './ProductCard.jsx';
import { Star, Minus, Plus, Heart, Package, Check, Award, X } from 'lucide-react';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const selectedProduct = PRODUCTS.find(p => p.id === parseInt(productId));
  const { addItem } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!selectedProduct) return <div className="py-20 text-center">Product not found</div>;

  const relatedProducts = PRODUCTS.filter(p => 
    p.category === selectedProduct.category && p.id !== selectedProduct.id
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:underline">Home</Link> / <Link to={`/category/${selectedProduct.category}`} className="hover:underline">Shop</Link> / {selectedProduct.title}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div 
              className="bg-white rounded-xl overflow-hidden mb-4 cursor-zoom-in"
              onClick={() => setShowLightbox(true)}
            >
              <img
                src={selectedProduct.images[currentImage]}
                alt={selectedProduct.title}
                className="w-full h-[500px] object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`rounded-lg overflow-hidden border-2 transition ${currentImage === idx ? 'border-purple-600' : 'border-transparent'}`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl p-8">
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {selectedProduct.featured && (
                  <span className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full font-semibold">
                    Featured
                  </span>
                )}
                {selectedProduct.bestseller && (
                  <span className="bg-amber-100 text-amber-600 text-xs px-3 py-1 rounded-full font-semibold">
                    Bestseller
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{selectedProduct.title}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-gray-600">({selectedProduct.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-purple-600">${selectedProduct.price.toLocaleString()}</span>
                {selectedProduct.originalPrice && (
                  <span className="ml-3 text-xl text-gray-400 line-through">${selectedProduct.originalPrice.toLocaleString()}</span>
                )}
              </div>

              <p className="text-gray-700 mb-8">{selectedProduct.description}</p>

              {/* Specifications */}
              <div className="border-t border-b py-6 mb-6">
                <h3 className="font-bold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Carat Weight:</span>
                    <span className="ml-2 font-semibold">{selectedProduct.specs.carat}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Color:</span>
                    <span className="ml-2 font-semibold">{selectedProduct.specs.color}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Clarity:</span>
                    <span className="ml-2 font-semibold">{selectedProduct.specs.clarity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cut:</span>
                    <span className="ml-2 font-semibold">{selectedProduct.specs.cut}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Origin:</span>
                    <span className="ml-2 font-semibold">{selectedProduct.specs.origin}</span>
                  </div>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => addItem(selectedProduct, quantity)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
                >
                  Add to Cart
                </button>

                <button className="p-3 border rounded-lg hover:bg-gray-50 transition">
                  <Heart className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Stock Info */}
              <div className="flex items-center text-sm text-gray-600 mb-6">
                <Package className="w-4 h-4 mr-2" />
                <span>{selectedProduct.stock} in stock</span>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Check className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-xs font-semibold">Certified Authentic</p>
                </div>
                <div className="text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-xs font-semibold">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-xs font-semibold">30-Day Return</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedProduct.images[currentImage]}
            alt={selectedProduct.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
