import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart.js";
import { useAuth } from "../../hooks/useAuth.js";
import { Minus, Plus, X, Share2, Link2, Star, Camera, User, ThumbsUp, Flag, MoreVertical } from "lucide-react";
import trust_badge from "../../assets/TRUST_BADGE.webp";
import { useProducts } from "../../context/ProductContext.jsx";
import { slugify } from "../../utils/slugify.js";
import FullPageLoader from "../ui/FullPageLoader.jsx";
import api from "../../utils/api.js";
import Maintenance from "../../pages/Maintenance.jsx";

// Import SVG icons from svg.js
import {
    FacebookIcon,
    WhatsAppIcon,
    TwitterIcon,
    DeviceMultipleIcon,
} from "../../utils/svg.jsx";

export default function ProductDetailPage() {
    const { identifier } = useParams();
    const { addItem } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();
    const [product, setProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showLightbox, setShowLightbox] = useState(false);
    const [selectedPack, setSelectedPack] = useState("Pack of 1");
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchEndX = useRef(0);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [isClosingShareModal, setIsClosingShareModal] = useState(false);
    const imageContainerRef = useRef(null);

    // Review states
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 0,
        title: "",
        comment: "",
        images: [],
        userName: user?.fullName || "",
        userEmail: user?.email || ""
    });

    // Update newReview when user changes
    useEffect(() => {
        if (user) {
            setNewReview(prev => ({
                ...prev,
                userName: user.fullName || "",
                userEmail: user.email || ""
            }));
        }
    }, [user]);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRatingFilter, setSelectedRatingFilter] = useState("all");
    const [sortBy, setSortBy] = useState("mostRecent");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const fileInputRef = useRef(null);
    const [previewImages, setPreviewImages] = useState([]);
    const [expandedReviews, setExpandedReviews] = useState({});
    const [helpfulReviews, setHelpfulReviews] = useState({});

    // Disable background scroll when modal is open
    useEffect(() => {
        if (showShareOptions || showReviewForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showShareOptions, showReviewForm]);

    useEffect(() => {
        if (products.length > 0) {
            const selectedProduct = products.find(
                (p) => slugify(p.p_name) === identifier
            );

            if (selectedProduct) {
                setProduct(selectedProduct);
                // Load reviews for this product
                fetchReviews(selectedProduct._id);
            } else if (!loading) {
                setProduct(null);
            }
        }
    }, [products, identifier, loading]);

    // Fetch real reviews
    const fetchReviews = async (productId) => {
        try {
            const response = await api.get(`/reviews/product/${productId}`);
            if (response.data.success) {
                setReviews(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const calculatePackPrices = () => {
        if (!product)
            return {
                discountedPrice: 0,
                originalPrice: 0,
                discountPercentage: 0,
            };

        const baseDiscountedPrice = product.discount_price;
        const baseOriginalPrice = product.p_price;

        switch (selectedPack) {
            case "Pack of 2": {
                const pack2Discounted = baseDiscountedPrice * 2 * 0.85;
                const pack2Original = baseOriginalPrice * 2;
                return {
                    discountedPrice: pack2Discounted,
                    originalPrice: pack2Original,
                    discountPercentage: Math.round(
                        ((pack2Original - pack2Discounted) / pack2Original) *
                            100
                    ),
                };
            }
            case "Pack of 4 (Family Discount)": {
                const pack4Discounted = baseDiscountedPrice * 4 * 0.8;
                const pack4Original = baseOriginalPrice * 4;
                return {
                    discountedPrice: pack4Discounted,
                    originalPrice: pack4Original,
                    discountPercentage: Math.round(
                        ((pack4Original - pack4Discounted) / pack4Original) *
                            100
                    ),
                };
            }
            default:
                return {
                    discountedPrice: baseDiscountedPrice,
                    originalPrice: baseOriginalPrice,
                    discountPercentage: Math.round(
                        ((baseOriginalPrice - baseDiscountedPrice) /
                            baseOriginalPrice) *
                            100
                    ),
                };
        }
    };

    // Calculate review statistics
    const getReviewStats = () => {
        const total = reviews.length;
        if (total === 0) return { average: 0, total, distribution: [0, 0, 0, 0, 0] };
        
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = (sum / total).toFixed(1);
        
        const distribution = [0, 0, 0, 0, 0];
        reviews.forEach(review => {
            distribution[review.rating - 1]++;
        });
        
        return { average, total, distribution };
    };

    const handleAddToCart = () => {
        addItem(product, quantity, selectedPack, { shouldOpenDrawer: true });
    };

    const handleBuyNow = () => {
        addItem(product, quantity, selectedPack, {
            shouldOpenDrawer: false,
            isBuyNow: true,
        });
        navigate("/checkout");
    };

    const handleShare = () => {
        setShowShareOptions(!showShareOptions);
    };

    // Handle closing share modal with animation
    const handleCloseShareModal = () => {
        setIsClosingShareModal(true);
        setTimeout(() => {
            setShowShareOptions(false);
            setIsClosingShareModal(false);
        }, 300);
    };

    // Review form handlers
    const handleReviewImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);
        setNewReview(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeReviewImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setNewReview(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (newReview.rating === 0) {
            alert("Please select a rating");
            return;
        }

        if (!newReview.userName || !newReview.userEmail) {
            alert("Please provide your name and email");
            return;
        }
        
        setIsSubmittingReview(true);
        
        try {
            const formData = new FormData();
            formData.append('productId', product._id);
            formData.append('rating', newReview.rating);
            formData.append('title', newReview.title);
            formData.append('comment', newReview.comment);
            formData.append('userName', newReview.userName);
            formData.append('userEmail', newReview.userEmail);
            
            newReview.images.forEach((image) => {
                formData.append('images', image);
            });

            const response = await api.post('/reviews', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setReviews(prev => [response.data.data, ...prev]);
                setShowReviewForm(false);
                setNewReview({
                    rating: 0,
                    title: "",
                    comment: "",
                    images: [],
                    userName: user?.fullName || "",
                    userEmail: user?.email || ""
                });
                setPreviewImages([]);
                alert("Review submitted successfully!");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert(error.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Filter and sort reviews
    const getFilteredAndSortedReviews = () => {
        let filtered = [...reviews];
        
        if (selectedRatingFilter !== "all") {
            filtered = filtered.filter(review => review.rating === parseInt(selectedRatingFilter));
        }
        
        switch (sortBy) {
            case "mostRecent":
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "highestRating":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "lowestRating":
                filtered.sort((a, b) => a.rating - b.rating);
                break;
            case "mostHelpful":
                filtered.sort((a, b) => b.helpful - a.helpful);
                break;
            default:
                break;
        }
        
        return filtered;
    };

    const handleHelpfulClick = async (reviewId) => {
        if (helpfulReviews[reviewId]) return;
        
        try {
            const response = await api.post(`/reviews/${reviewId}/helpful`);
            if (response.data.success) {
                setHelpfulReviews(prev => ({ ...prev, [reviewId]: true }));
                setReviews(prev => 
                    prev.map(review => 
                        review._id === reviewId 
                            ? { ...review, helpful: review.helpful + 1 }
                            : review
                    )
                );
            }
        } catch (error) {
            console.error("Error marking review as helpful:", error);
        }
    };

    const toggleReviewExpand = (reviewId) => {
        setExpandedReviews(prev => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }));
    };

    if (loading) {
        return <FullPageLoader />;
    }

    if (error) {
        return <Maintenance />;
    }

    if (!product)
        return <div className="py-20 text-center">Product not found</div>;

    const packPrices = calculatePackPrices();
    const reviewStats = getReviewStats();
    const filteredReviews = getFilteredAndSortedReviews();

    return (
        <div className="min-h-screen bg-gray-50 py-5">
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
            
            <div className="container mx-auto px-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 mb-16">
                    {/* Image Gallery - Mobile Slider / Desktop Gallery */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        {/* Mobile Image Slider - Hidden on large screens */}
                        <div className="lg:hidden relative">
                            <div className="relative bg-white rounded-xl overflow-hidden mb-4">
                                {/* Share Button for Mobile */}
                                <button
                                    onClick={handleShare}
                                    className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
                                >
                                    <Share2 className="w-5 h-5 text-gray-700" />
                                </button>

                                <div
                                    ref={imageContainerRef}
                                    className="relative w-full h-[400px]"
                                    onTouchStart={(e) => {
                                        const touch = e.touches[0];
                                        touchStartX.current = touch.clientX;
                                        touchStartY.current = touch.clientY;
                                        touchEndX.current = touch.clientX;
                                    }}
                                    onTouchMove={(e) => {
                                        const touch = e.touches[0];
                                        const deltaX = touchStartX.current - touch.clientX;
                                        const deltaY = touchStartY.current - touch.clientY;

                                        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                                            if (e.cancelable) {
                                                e.preventDefault();
                                            }
                                            touchEndX.current = touch.clientX;
                                        }
                                    }}
                                    onTouchEnd={() => {
                                        if (!touchStartX.current || !touchEndX.current) return;

                                        const distance = touchStartX.current - touchEndX.current;
                                        const isLeftSwipe = distance > 50;
                                        const isRightSwipe = distance < -50;

                                        if (isLeftSwipe) {
                                            setCurrentImage((prev) =>
                                                prev ===
                                                product.image_urls.length - 1
                                                    ? 0
                                                    : prev + 1
                                            );
                                        } else if (isRightSwipe) {
                                            setCurrentImage((prev) =>
                                                prev === 0
                                                    ? product.image_urls
                                                          .length - 1
                                                    : prev - 1
                                            );
                                        }

                                        touchStartX.current = 0;
                                        touchStartY.current = 0;
                                        touchEndX.current = 0;
                                    }}
                                    onClick={() => setShowLightbox(true)}
                                >
                                    <img
                                        src={product.image_urls[currentImage]}
                                        alt={product.p_name}
                                        className="w-full h-full object-contain cursor-zoom-in"
                                    />
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                        {product.image_urls.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full transition ${currentImage === idx
                                                        ? "bg-white"
                                                        : "bg-white/50"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Image Gallery - Hidden on mobile */}
                        <div className="hidden lg:block relative">
                            <button
                                onClick={handleShare}
                                className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
                            >
                                <Share2 className="w-5 h-5 text-gray-700" />
                            </button>

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

                            <div className="grid grid-cols-4 gap-4">
                                {product.image_urls.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`rounded-lg overflow-hidden border-2 transition ${currentImage === idx
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
                    </div>

                    {/* Product Info - Normal scrolling (no independent scroll) */}
                    <div>
                        <div className="bg-white rounded-xl p-4 lg:p-8">
                            <h1 className="text-2xl lg:text-3xl font-bold mb-4">
                                {product.p_name}
                            </h1>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-3xl lg:text-4xl font-semibold">
                                    ₨.{" "}
                                    {Math.round(
                                        packPrices.discountedPrice
                                    ).toLocaleString()}
                                </span>
                                {packPrices.originalPrice && (
                                    <span className="ml-3 text-lg lg:text-xl text-gray-400 line-through">
                                        ₨.{" "}
                                        {Math.round(
                                            packPrices.originalPrice
                                        ).toLocaleString()}
                                    </span>
                                )}

                                <span className="ml-3 text-lg lg:text-xl font-semibold text-emerald-600">
                                    {packPrices.discountPercentage}% off
                                </span>
                            </div>
                            <p className="text-gray-700 mb-8">
                                {product.p_subtitle}
                            </p>

                            {/* Choose Your Pack */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">
                                    Choose your pack
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        "Pack of 1",
                                        "Pack of 2",
                                        "Pack of 4 (Family Discount)",
                                    ].map((pack) => (
                                        <button
                                            key={pack}
                                            onClick={() =>
                                                setSelectedPack(pack)
                                            }
                                            className={`px-4 py-2 rounded-lg border-2 transition ${selectedPack === pack
                                                    ? "border-blue-600 bg-purple-50 text-blue-700"
                                                    : "border-gray-300 hover:border-gray-400 cursor-pointer"
                                                }`}
                                        >
                                            {pack}
                                        </button>
                                    ))}
                                </div>
                                {selectedPack === "Pack of 2" && (
                                    <p className="text-sm text-emerald-600 mt-2">
                                        🎉 Save 15% on Pack of 2!
                                    </p>
                                )}
                                {selectedPack ===
                                    "Pack of 4 (Family Discount)" && (
                                        <p className="text-sm text-emerald-600 mt-2">
                                            🎉 Save 20% with Family Discount!
                                        </p>
                                    )}
                            </div>

                            {/* Quantity Selector - Hidden on mobile (moved to fixed buttons area) */}
                            <div className="hidden lg:flex gap-4 mb-6">
                                <div className={`flex items-center border rounded-lg ${product.current_stock === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
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
                                    onClick={handleAddToCart}
                                    disabled={product.current_stock === 0}
                                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                                        product.current_stock === 0
                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                            : "bg-gradient-to-r from-blue-800 to-blue-950 text-white hover:from-blue-700 hover:to-indigo-700"
                                    }`}
                                >
                                    {product.current_stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={product.current_stock === 0}
                                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                                        product.current_stock === 0
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700"
                                    }`}
                                >
                                    {product.current_stock === 0 ? "Sold Out" : "Buy Now"}
                                </button>
                            </div>

                            {/* Quantity Selector for Mobile */}
                            <div className="lg:hidden mb-6">
                                <h3 className="font-semibold mb-3">Quantity</h3>
                                <div className={`flex items-center border rounded-lg w-fit ${product.current_stock === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
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
                            </div>

                            {/* Trust Badges */}
                            <div className="mb-8">
                                <img
                                    src={trust_badge}
                                    alt="Trust Badge"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <p className="text-gray-700">
                                {product.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-xl p-4 lg:p-8 mt-8">
                    {/* Reviews Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                Customer Reviews
                            </h2>
                            <p className="text-gray-600 mt-1">
                                See what our customers are saying
                            </p>
                        </div>
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-blue-800 to-indigo-950 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Write a Review
                        </button>
                    </div>

                    {/* Review Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                        {/* Average Rating */}
                        <div className="text-center lg:text-left">
                            <div className="text-5xl font-bold text-gray-900">
                                {reviewStats.average}
                            </div>
                            <div className="flex items-center justify-center lg:justify-start gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${
                                            star <= Math.round(reviewStats.average)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 mt-1">
                                Based on {reviewStats.total} reviews
                            </p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="lg:col-span-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = reviewStats.distribution[rating - 1];
                                const percentage = reviewStats.total > 0 
                                    ? Math.round((count / reviewStats.total) * 100) 
                                    : 0;
                                
                                return (
                                    <div key={rating} className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-medium text-gray-700 w-12">
                                            {rating} stars
                                        </span>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filters and Sort */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <select
                            value={selectedRatingFilter}
                            onChange={(e) => setSelectedRatingFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="mostRecent">Most Recent</option>
                            <option value="highestRating">Highest Rating</option>
                            <option value="lowestRating">Lowest Rating</option>
                            <option value="mostHelpful">Most Helpful</option>
                        </select>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <div key={review._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                                    {/* Review Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                                {review.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {review.userName}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`w-4 h-4 ${
                                                                    star <= review.rating
                                                                        ? "text-yellow-400 fill-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                    {review.verified && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                                            Verified Purchase
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Title */}
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                                        {review.title}
                                    </h5>

                                    {/* Review Comment */}
                                    <p className={`text-gray-700 mb-4 ${!expandedReviews[review._id] && review.comment.length > 200 ? 'line-clamp-3' : ''}`}>
                                        {review.comment}
                                    </p>
                                    {review.comment.length > 200 && (
                                        <button
                                            onClick={() => toggleReviewExpand(review._id)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold mb-4"
                                        >
                                            {expandedReviews[review._id] ? 'Show Less' : 'Read More'}
                                        </button>
                                    )}

                                    {/* Review Images */}
                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                            {review.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Review ${idx + 1}`}
                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition"
                                                    onClick={() => window.open(img, '_blank')}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Review Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleHelpfulClick(review._id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
                                                helpfulReviews[review._id]
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            <ThumbsUp className={`w-4 h-4 ${helpfulReviews[review._id] ? "fill-blue-600" : ""}`} />
                                            <span className="text-sm font-medium">
                                                Helpful ({review.helpful})
                                            </span>
                                        </button>
                                        <button className="text-gray-400 hover:text-gray-600 transition">
                                            <Flag className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Star className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No reviews yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Be the first to share your experience with this product
                                </p>
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-800 to-indigo-950 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105"
                                >
                                    Write a Review
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

{/* Professional Review Form Modal */}
            {showReviewForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">
                                        Share Your Experience
                                    </h3>
                                    <p className="text-blue-100 text-sm mt-1">
                                        Help others make informed decisions
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowReviewForm(false)}
                                    className="p-2 hover:bg-red-500 rounded-lg transition-colors cursor-pointer"
                                    aria-label="Close"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto flex-1">
                            <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                                {/* Product Preview Card */}
                                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-3 border border-gray-200">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                        Reviewing Product
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={product.image_urls[0]}
                                                alt={product.p_name}
                                                className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-md"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-lg leading-tight">
                                                {product.p_name}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {product.p_subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* User Info (Only if not logged in or name/email missing) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newReview.userName}
                                            onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                                            placeholder="Enter your name"
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                                            required
                                            disabled={!!user?.fullName}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={newReview.userEmail}
                                            onChange={(e) => setNewReview(prev => ({ ...prev, userEmail: e.target.value }))}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                                            required
                                            disabled={!!user?.email}
                                        />
                                    </div>
                                </div>

                                {/* Rating Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                                        Overall Rating <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                                    className="focus:outline-none  rounded-lg p-1 transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`w-10 h-10 transition-all ${
                                                            star <= (hoverRating || newReview.rating)
                                                                ? "text-yellow-400 fill-yellow-400 drop-shadow-md"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        {newReview.rating > 0 && (
                                            <div className="hidden lg:block md-block text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                                                {newReview.rating === 5 ? "Excellent!" : 
                                                 newReview.rating === 4 ? "Very Good" : 
                                                 newReview.rating === 3 ? "Good" : 
                                                 newReview.rating === 2 ? "Fair" : "Poor"}
                                            </div>
                                        )}
                                    </div>
                                    {newReview.rating === 0 && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                                            Please select a rating to continue
                                        </p>
                                    )}
                                </div>

                                {/* Review Comment */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                                        Your Review <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                        placeholder="Tell us about your experience with this product. What did you like or dislike? How did it meet your expectations?"
                                        rows="3"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none text-gray-900 placeholder-gray-400"
                                        required
                                    />
                                    <p className="text-xs text-gray-500">
                                        Minimum 20 characters. Be specific and honest.
                                    </p>
                                </div>

                                {/* Image Upload Section */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                                        Add Photos (Optional)
                                    </label>
                                    <p className="text-xs text-gray-600 -mt-1">
                                        Photos help other customers see how the product looks in real life
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-3 items-start">
                                        {/* Upload Button */}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-shrink-0 w-28 h-28 border-3 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-2 group"
                                        >
                                            <Camera className="w-7 h-7 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">
                                                Add Photo
                                            </span>
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleReviewImageUpload}
                                            className="hidden"
                                        />

                                        {/* Image Previews */}
                                        {previewImages.map((img, idx) => (
                                            <div key={idx} className="relative group flex-shrink-0">
                                                <img
                                                    src={img}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-28 h-28 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeReviewImage(idx)}
                                                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Remove image"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            </div>
                                        ))}
                                    </div>

                                    {previewImages.length > 0 && (
                                        <p className="text-xs text-gray-500">
                                            {previewImages.length} {previewImages.length === 1 ? 'photo' : 'photos'} added
                                        </p>
                                    )}
                                </div>

                                {/* Trust Badge */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-sm font-bold text-blue-900 mb-1">
                                                Your Review is Valued
                                            </h5>
                                            <p className="text-xs text-blue-800 leading-relaxed">
                                                All reviews are verified and publicly visible. Your feedback helps us improve and assists other customers in making informed decisions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer with Action Buttons */}
                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmitReview}
                                    disabled={isSubmittingReview || newReview.rating === 0}
                                    className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] cursor-pointer ${
                                        isSubmittingReview || newReview.rating === 0 
                                            ? 'opacity-50 cursor-not-allowed transform-none' 
                                            : ''
                                    }`}
                                >
                                    {isSubmittingReview ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Publishing Review...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Publish Review</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Options Modal for Small Screens */}
            {(showShareOptions || isClosingShareModal) && (
                <>
                    <div
                        className={`fixed inset-0 bg-black z-50 lg:hidden ${isClosingShareModal ? 'animate-fade-out' : 'animate-fade-in'}`}
                        style={{ opacity: isClosingShareModal ? 0 : 0.7 }}
                        onClick={handleCloseShareModal}
                    />

                    <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden ${isClosingShareModal ? 'animate-slide-down' : 'animate-slide-up'}`}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Share
                                </h3>
                                <button
                                    onClick={handleCloseShareModal}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-700" />
                                </button>
                            </div>

                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={product.image_urls[0]}
                                        alt={product.p_name}
                                        className="w-14 h-14 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {product.p_name}
                                        </p>
                                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                            Buy {product.p_name.split(" ")[0]}
                                            online at best price with offers in
                                            India.{" "}
                                            {product.p_name.split(" ")[0]} ...
                                        </p>
                                        <p className="text-sm font-bold text-blue-800 mt-1">
                                            ₨.{" "}
                                            {Math.round(
                                                packPrices.discountedPrice
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <button
                                    onClick={async (e) => {
                                        const btn = e.currentTarget;
                                        const span = btn.querySelector("span");
                                        const originalText = span.textContent;

                                        try {
                                            await navigator.clipboard.writeText(
                                                window.location.href
                                            );

                                            span.textContent = "Copied!";
                                            btn.classList.add("bg-green-50");

                                            setTimeout(() => {
                                                span.textContent = originalText;
                                                btn.classList.remove(
                                                    "bg-green-50"
                                                );
                                            }, 1500);
                                        } catch (err) {
                                            console.error(err);
                                        }
                                    }}
                                    className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mb-2">
                                        <Link2 className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-800 text-center">
                                        Copy Link
                                    </span>
                                </button>

                                <button
                                    onClick={() =>
                                        window.open(
                                            `https://wa.me/?text=${encodeURIComponent(
                                                `${product.p_name} - ${window.location.href}`
                                            )}`,
                                            "_blank"
                                        )
                                    }
                                    className="flex flex-col items-center p-3 rounded-lg hover:bg-green-50 transition-colors active:scale-95"
                                >
                                    <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center mb-2">
                                        <WhatsAppIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-800 text-center">
                                        WhatsApp
                                    </span>
                                </button>

                                <button
                                    onClick={() =>
                                        window.open(
                                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                                window.location.href
                                            )}&text=${encodeURIComponent(
                                                product.p_name
                                            )}`,
                                            "_blank"
                                        )
                                    }
                                    className="flex flex-col items-center p-3 rounded-lg hover:bg-sky-50 transition-colors active:scale-95"
                                >
                                    <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center mb-2">
                                        <TwitterIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-800 text-center">
                                        Twitter/X
                                    </span>
                                </button>

                                {navigator.share && (
                                    <button
                                        onClick={() => {
                                            navigator.share({
                                                title: product.p_name,
                                                text: product.p_subtitle,
                                                url: window.location.href,
                                            });
                                            handleCloseShareModal();
                                        }}
                                        className="flex flex-col items-center p-3 rounded-lg hover:bg-purple-50 transition-colors active:scale-95"
                                    >
                                        <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center mb-2">
                                            <DeviceMultipleIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-800 text-center">
                                            Device
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Desktop Share Options Overlay */}
            {showShareOptions && (
                <div className="hidden lg:flex fixed inset-0 bg-black/50 z-50 items-center justify-center p-4">
                    <div
                        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Share This Product
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Spread the word with friends
                                </p>
                            </div>
                            <button
                                onClick={() => setShowShareOptions(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {[
                                {
                                    name: "Facebook",
                                    color: "from-blue-500 to-blue-600",
                                    icon: (
                                        <FacebookIcon className="w-5 h-5 text-white" />
                                    ),
                                    action: () =>
                                        window.open(
                                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                                window.location.href
                                            )}&quote=${encodeURIComponent(
                                                product.p_name
                                            )}`,
                                            "_blank"
                                        ),
                                },
                                {
                                    name: "Twitter",
                                    color: "white",
                                    icon: (
                                        <TwitterIcon className="w-5 h-5 text-white" />
                                    ),
                                    action: () =>
                                        window.open(
                                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                                window.location.href
                                            )}&text=${encodeURIComponent(
                                                product.p_name
                                            )}`,
                                            "_blank"
                                        ),
                                },
                                {
                                    name: "WhatsApp",
                                    color: "from-emerald-500 to-emerald-600",
                                    icon: (
                                        <WhatsAppIcon className="w-5 h-5 text-white" />
                                    ),
                                    action: () =>
                                        window.open(
                                            `https://wa.me/?text=${encodeURIComponent(
                                                `${product.p_name} - ${window.location.href}`
                                            )}`,
                                            "_blank"
                                        ),
                                },
                                {
                                    name: "Copy Link",
                                    color: "from-gray-600 to-gray-700",
                                    icon: (
                                        <Link2 className="w-5 h-5 text-white" />
                                    ),
                                    action: async () => {
                                        try {
                                            await navigator.clipboard.writeText(
                                                window.location.href
                                            );
                                            alert("Link copied!");
                                        } catch {
                                            alert("Copy failed");
                                        }
                                    },
                                },
                            ].map((option) => (
                                <button
                                    key={option.name}
                                    onClick={option.action}
                                    className="flex flex-col items-center p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition active:scale-95"
                                >
                                    <div
                                        className={`w-10 h-10 bg-gradient-to-br ${option.color} rounded-full flex items-center justify-center shadow mb-2`}
                                    >
                                        {option.icon}
                                    </div>
                                    <span className="text-xs font-medium text-gray-900 text-center">
                                        {option.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 mb-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={product.image_urls[0]}
                                    alt={product.p_name}
                                    className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                        {product.p_name.slice(0, 25)}...
                                    </h4>
                                    <p className="text-sm text-gray-600 truncate">
                                        {product.p_subtitle.slice(0, 50)}...
                                    </p>
                                    <p className="text-lg font-bold text-blue-800 mt-1">
                                        ₨.{" "}
                                        {Math.round(
                                            packPrices.discountedPrice
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {navigator.share && (
                            <button
                                onClick={() => {
                                    navigator.share({
                                        title: product.p_name.slice(0, 25) + "...",
                                        text: product.p_subtitle.slice(0, 50) + "...",
                                        url: window.location.href,
                                    });
                                    setShowShareOptions(false);
                                }}
                                className="w-full py-4 bg-gradient-to-r from-blue-800 to-indigo-950 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition"
                            >
                                Share via Device
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Mobile Fixed Bottom Buttons */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-40">
                <div className="flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.current_stock === 0}
                        className={`flex-1 py-3 rounded-lg font-semibold transition ${
                            product.current_stock === 0
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-800 to-indigo-950 text-white"
                        }`}
                    >
                        {product.current_stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={product.current_stock === 0}
                        className={`flex-1 py-3 rounded-lg font-semibold transition ${
                            product.current_stock === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700"
                        }`}
                    >
                        {product.current_stock === 0 ? "Sold Out" : "Buy Now"}
                    </button>
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

            {/* Add padding at the bottom for mobile */}
            <div className="lg:hidden h-20"></div>
        </div>
    );
}