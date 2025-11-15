import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from '../../hooks/useCart.js';
import { Minus, Plus, Package, Check, Award, X } from 'lucide-react';
import trust_badge from '../../assets/TRUST_BADGE.webp';
import { useProducts } from '../../context/ProductContext.jsx';

export default function ProductDetailPage() {
    const { productId } = useParams();
    const { addItem } = useCart();
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();
    const [product, setProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showLightbox, setShowLightbox] = useState(false);

    useEffect(() => {
        if (products.length > 0) {
            const selectedProduct = products.find(p => p._id === productId);
            setProduct(selectedProduct);
        }
    }, [products, productId]);

    const handleBuyNow = () => {
        addItem(product, quantity, false); // Do not open cart drawer
        navigate('/checkout');
    };

    if (loading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="py-20 text-center">Error: {error.message}</div>;
    }

    if (!product)
        return <div className="py-20 text-center">Product not found</div>;

        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-600 mb-8">
                        <Link to="/" className="hover:underline">
                            Home
                        </Link>{" "}
                        /{" "}
                        <Link
                            to={`/category/${product.p_category}`}
                            className="hover:underline"
                        >
                            Shop
                        </Link>{" "}
                        / {product.p_name}
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
                                    src={product.image_urls[currentImage]}
                                    alt={product.p_name}
                                    className="w-full h-[400px] object-fit"
                                />
                            </div>
    
                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 gap-4">
                                {product.image_urls.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`rounded-lg overflow-hidden border-2 transition ${
                                            currentImage === idx
                                                ? "border-purple-600"
                                                : "border-transparent"
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`View ${idx + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
    
                        {/* Product Info */}
                        <div>
                            <div className="bg-white rounded-xl p-8">
                                <h1 className="text-3xl font-bold mb-4">
                                    {product.p_name}
                                </h1>
    
                                {/* Price */}
                                <div className="mb-6">
                                    <span className="text-4xl font-semibold">
                                        ₨. {product.discount_price.toLocaleString()}
                                    </span>
                                    {product.p_price && (
                                        <span className="ml-3 text-xl text-gray-400 line-through">
                                            {product.p_price.toLocaleString()}
                                        </span>
                                    )}
                                    
                                     <span className=" ml-3 text-1xl font-semibold">{Math.round(((product.p_price - product.discount_price) / product.p_price) * 100)}%</span>
                                </div>
                                <p className="text-gray-700 mb-8">{product.p_subtitle}</p>
    
                                {/* Quantity & Add to Cart */}
                                <div className="flex gap-4 mb-6">
                                    <div className="flex items-center border rounded-lg">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1)
                                                )
                                            }
                                            className="p-3 hover:bg-gray-100"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                        <span className="px-6 font-semibold">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setQuantity(quantity + 1)
                                            }
                                            className="p-3 hover:bg-gray-100"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
    
                                <button
                                    onClick={() =>
                                        addItem(product, quantity)
                                    }
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
                                >
                                    Add to Cart
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition"
                                >
                                    Buy Now
                                </button>
                            </div>
    
                                {/* Trust Badges */}
                                <div className="">
                                    <img 
                                        src={trust_badge} 
                                        alt="Trust Badge" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
    
                                <p className="text-gray-700 mb-8 mt-8">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
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
                            src={product.image_urls[currentImage]}
                            alt={product.p_name}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                )}
            </div>
        );
    }
