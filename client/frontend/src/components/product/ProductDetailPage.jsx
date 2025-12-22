import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart.js";
import { Minus, Plus, X, Share2, Link2 } from "lucide-react";
import trust_badge from "../../assets/TRUST_BADGE.webp";
import { useProducts } from "../../context/ProductContext.jsx";
import { slugify } from "../../utils/slugify.js";

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
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();
    const [product, setProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showLightbox, setShowLightbox] = useState(false);
    const [selectedPack, setSelectedPack] = useState("Pack of 1");
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const imageContainerRef = useRef(null);

    useEffect(() => {
        if (products.length > 0) {
            const selectedProduct = products.find(
                (p) => slugify(p.p_name) === identifier
            );

            if (selectedProduct) {
                setProduct(selectedProduct);
            } else if (!loading) {
                setProduct(null);
            }
        }
    }, [products, identifier, loading]);

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

    if (loading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="py-20 text-center">Error: {error.message}</div>;
    }

    if (!product)
        return <div className="py-20 text-center">Product not found</div>;

    const packPrices = calculatePackPrices();

    return (
        <div className="min-h-screen bg-gray-50 py-5">
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
                                    className="relative w-full h-[400px] touch-none"
                                    onTouchStart={(e) => {
                                        const touch = e.touches[0];
                                        setTouchStart(touch.clientX);
                                    }}
                                    onTouchMove={(e) => {
                                        if (e.touches.length === 1) {
                                            e.preventDefault();
                                        }
                                        const touch = e.touches[0];
                                        setTouchEnd(touch.clientX);
                                    }}
                                    onTouchEnd={(e) => {
                                        if (!touchStart || !touchEnd) return;

                                        const distance = touchStart - touchEnd;
                                        const isLeftSwipe = distance > 50;
                                        const isRightSwipe = distance < -50;

                                        if (isLeftSwipe || isRightSwipe) {
                                            e.preventDefault();
                                        }

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

                                        setTouchStart(0);
                                        setTouchEnd(0);
                                    }}
                                    onClick={() => setShowLightbox(true)}
                                >
                                    <img
                                        src={product.image_urls[currentImage]}
                                        alt={product.p_name}
                                        className="w-full h-full object-contain cursor-zoom-in"
                                    />
                                    {/* Image Indicator Dots */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                        {product.image_urls.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full transition ${
                                                    currentImage === idx
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
                            {/* Share Button for Desktop */}
                            <button
                                onClick={handleShare}
                                className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
                            >
                                <Share2 className="w-5 h-5 text-gray-700" />
                            </button>

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
                                            className={`px-4 py-2 rounded-lg border-2 transition ${
                                                selectedPack === pack
                                                    ? "border-blue-600 bg-purple-50 text-blue-700"
                                                    : "border-gray-300 hover:border-gray-400 cursor-pointer"
                                            }`}
                                        >
                                            {pack}
                                        </button>
                                    ))}
                                </div>
                                {/* Pack Savings Info */}
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
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-gradient-to-r from-blue-800 to-blue-950 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
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

                            {/* Quantity Selector for Mobile - Only the selector, buttons are fixed */}
                            <div className="lg:hidden mb-6">
                                <h3 className="font-semibold mb-3">Quantity</h3>
                                <div className="flex items-center border rounded-lg w-fit">
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
            </div>

            {/* Share Options Modal for Small Screens - Matching CategoryPage modals */}
            {showShareOptions && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black opacity-70 z-50 lg:hidden"
                        onClick={() => setShowShareOptions(false)}
                    />

                    {/* Modal Content - Slides from bottom */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden animate-slideUp">
                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Share
                                </h3>
                                <button
                                    onClick={() => setShowShareOptions(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-700" />
                                </button>
                            </div>

                            {/* Product Preview */}
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
                                            Buy {product.p_name.split(" ")[0]}{" "}
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

                            {/* Share Options Grid - 4 columns */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {/* Copy Link */}
                                <button
                                    onClick={async (e) => {
                                        const btn = e.currentTarget;
                                        const span = btn.querySelector("span");
                                        const originalText = span.textContent;

                                        try {
                                            await navigator.clipboard.writeText(
                                                window.location.href
                                            );

                                            // Success UI
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
                                            // REMOVE alert - it's annoying and useless
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

                                {/* WhatsApp */}
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

                                {/* Twitter */}
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

                                {/* Native Sharing */}
                                {navigator.share && (
                                    <button
                                        onClick={() => {
                                            navigator.share({
                                                title: product.p_name,
                                                text: product.p_subtitle,
                                                url: window.location.href,
                                            });
                                            setShowShareOptions(false);
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
                        {/* Header */}
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

                        {/* Share Options - ICON TOP, TEXT BOTTOM - 4 COLS */}
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

                        {/* Product Preview */}
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 mb-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={product.image_urls[0]}
                                    alt={product.p_name}
                                    className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                        {product.p_name}
                                    </h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {product.p_subtitle}
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

                        {/* Native Sharing */}
                        {navigator.share && (
                            <button
                                onClick={() => {
                                    navigator.share({
                                        title: product.p_name,
                                        text: product.p_subtitle,
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
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white  shadow-lg p-4 z-40">
                <div className="flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-gradient-to-r from-blue-800 to-indigo-950 text-white py-3 rounded-lg font-semibold transition"
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

            {/* Add padding at the bottom for mobile to prevent content from being hidden behind fixed buttons */}
            <div className="lg:hidden h-20"></div>
        </div>
    );
}
