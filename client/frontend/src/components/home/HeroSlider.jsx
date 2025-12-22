import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { slugify } from "../../utils/slugify";
import api from "../../utils/api";
import { Link } from "react-router-dom";

export default function HeroSlider() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState("next");
    const [loadedImages, setLoadedImages] = useState(new Set());
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const autoPlayIntervalRef = useRef(null);

    // Memoized handlers
    const handleSlideChange = useCallback(
        (newIndex, dir) => {
            if (isTransitioning || slides.length === 0) return;

            setIsTransitioning(true);
            setDirection(dir);
            
            // Preload the new slide image before transition
            if (!loadedImages.has(newIndex)) {
                const img = new Image();
                img.src = slides[newIndex].url;
                img.onload = () => {
                    setLoadedImages(prev => new Set([...prev, newIndex]));
                    // Start transition after image is loaded
                    setCurrentSlide(newIndex);
                    setTimeout(() => setIsTransitioning(false), 700);
                };
            } else {
                // If already loaded, transition immediately
                setCurrentSlide(newIndex);
                setTimeout(() => setIsTransitioning(false), 700);
            }
        },
        [isTransitioning, slides, loadedImages]
    );

    const handlePrevSlide = useCallback(() => {
        if (slides.length === 0) return;
        const newIndex = (currentSlide - 1 + slides.length) % slides.length;
        handleSlideChange(newIndex, "prev");
    }, [slides.length, currentSlide, handleSlideChange]);

    const handleNextSlide = useCallback(() => {
        if (slides.length === 0) return;
        const newIndex = (currentSlide + 1) % slides.length;
        handleSlideChange(newIndex, "next");
    }, [slides.length, currentSlide, handleSlideChange]);

    const handleDotClick = useCallback(
        (index) => {
            if (index === currentSlide || isTransitioning) return;
            const dir = index > currentSlide ? "next" : "prev";
            handleSlideChange(index, dir);
        },
        [currentSlide, isTransitioning, handleSlideChange]
    );

    // Fetch slides
    useEffect(() => {
        const fetchHeroSlides = async () => {
            try {
                const response = await api.get("/heroslider");
                const formattedSlides = response.data.data.map((slide) => ({
                    ...slide,
                    url: slide.image.url,
                    cta: "Shop Now",
                    ctaLink: `/category/${
                        slide.slug || slugify(slide.product_category)
                    }`,
                }));
                setSlides(formattedSlides);
                
                // Preload first image
                if (formattedSlides.length > 0) {
                    const img = new Image();
                    img.src = formattedSlides[0].url;
                    img.onload = () => {
                        setLoadedImages(prev => new Set([...prev, 0]));
                    };
                }
            } catch (err) {
                setError("Failed to load slider data. Please try again later.");
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroSlides();
    }, []);

    // Preload adjacent images
    useEffect(() => {
        if (slides.length === 0) return;

        const preloadImage = (index) => {
            if (loadedImages.has(index)) return;
            
            const img = new Image();
            img.src = slides[index].url;
            img.onload = () => {
                setLoadedImages(prev => new Set([...prev, index]));
            };
        };

        // Preload next and previous slides
        const nextIndex = (currentSlide + 1) % slides.length;
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        
        preloadImage(nextIndex);
        preloadImage(prevIndex);
        
        // Also preload one more ahead/behind for smoother transitions
        const nextNextIndex = (currentSlide + 2) % slides.length;
        const prevPrevIndex = (currentSlide - 2 + slides.length) % slides.length;
        
        preloadImage(nextNextIndex);
        preloadImage(prevPrevIndex);
    }, [currentSlide, slides, loadedImages]);

    // Auto-play with better interval management
    useEffect(() => {
        if (isPaused || isTransitioning || slides.length <= 1) return;

        const startAutoPlay = () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
            
            autoPlayIntervalRef.current = setInterval(() => {
                handleNextSlide();
            }, 5000);
        };

        startAutoPlay();

        return () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
        };
    }, [isPaused, isTransitioning, slides.length, handleNextSlide]);

    // Touch handlers for mobile swipe
    const handleTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchMove = useCallback((e) => {
        touchEndX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(() => {
        const diff = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (diff > minSwipeDistance) {
            handleNextSlide();
        } else if (diff < -minSwipeDistance) {
            handlePrevSlide();
        }
    }, [handlePrevSlide, handleNextSlide]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                handlePrevSlide();
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                handleNextSlide();
            }
            if (e.key === " ") {
                e.preventDefault();
                setIsPaused(prev => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handlePrevSlide, handleNextSlide]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[85vh] max-h-[900px] bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[85vh] max-h-[900px] bg-red-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <p>Something went wrong.</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (slides.length === 0) {
        return null;
    }

    return (
        <div
            className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[85vh] max-h-[900px] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label="Hero carousel"
        >
            {/* Background container to prevent color flashes */}
            <div className="absolute inset-0 bg-gray-900 z-0">
                {/* Preloaded background images - always present */}
                {slides.map((slide, index) => (
                    <div
                        key={`bg-${slide._id}`}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                            index === currentSlide 
                                ? 'opacity-100' 
                                : 'opacity-0 pointer-events-none'
                        }`}
                        aria-hidden="true"
                    >
                        <div className="relative w-full h-full">
                            <div className="absolute inset-0 overflow-hidden">
                                <img
                                    src={slide.url}
                                    alt=""
                                    className={`w-full h-full object-cover ${
                                        index === currentSlide 
                                            ? 'scale-110' 
                                            : 'scale-100'
                                    } transition-transform duration-[8000ms] ease-out`}
                                    loading="lazy"
                                />
                            </div>
                            {/* Static gradient overlays */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/15 via-transparent to-amber-500/10" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Slides content */}
            {slides.map((slide, index) => {
                const isActive = currentSlide === index;

                return (
                    <div
                        key={slide._id}
                        className={`absolute inset-0 z-10 transition-all duration-700 ease-out ${
                            isActive
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                        } ${direction === "next" && !isActive 
                            ? "-translate-x-full" 
                            : direction === "prev" && !isActive 
                            ? "translate-x-full" 
                            : "translate-x-0"
                        }`}
                        aria-hidden={!isActive}
                    >
                        {/* Content */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 max-w-screen-2xl mx-auto">
                                <div
                                    className={`max-w-3xl transition-all duration-1000 delay-200 ${
                                        isActive
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-8"
                                    }`}
                                >
                                    {/* Decorative line */}
                                    <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-transparent mb-6 sm:mb-8" />

                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-4 sm:mb-6 leading-tight text-white">
                                        <span className="block font-serif italic text-amber-50 mb-1 sm:mb-2">
                                            {slide.title.split(" ")[0]}
                                        </span>
                                        <span className="block font-medium">
                                            {slide.title
                                                .split(" ")
                                                .slice(1)
                                                .join(" ")}
                                        </span>
                                    </h1>

                                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-200 mb-8 sm:mb-10 lg:mb-12 max-w-2xl leading-relaxed">
                                        {slide.subtitle}
                                    </p>

                                    <Link
                                        to={slide.ctaLink}
                                        onClick={(e) => e.currentTarget.blur()}
                                        className="group relative overflow-hidden bg-white/5 text-white px-8 sm:px-10 lg:px-12 py-3 sm:py-4 border border-white/30 rounded-full font-medium hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 hover:border-white/50 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent text-sm sm:text-base"
                                        aria-label={`${slide.cta} - ${slide.title}`}
                                    >
                                        <span className="relative z-10">
                                            {slide.cta}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-900 to-blue-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Buttons */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={handlePrevSlide}
                        disabled={isTransitioning}
                        className="hidden md:flex absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 p-2 sm:p-3 lg:p-4 rounded-full shadow-2xl transition-all duration-300 group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50 z-30"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:text-amber-300 transition-colors" />
                    </button>

                    <button
                        onClick={handleNextSlide}
                        disabled={isTransitioning}
                        className="hidden md:flex absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 p-2 sm:p-3 lg:p-4 rounded-full shadow-2xl transition-all duration-300 group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50 z-30"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:text-amber-300 transition-colors" />
                    </button>
                </>
            )}

            {/* Play/Pause Button */}
            {slides.length > 1 && (
                <button
                    onClick={() => setIsPaused(prev => !prev)}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 z-30"
                    aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                >
                    {isPaused ? (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                </button>
            )}

            {/* Indicators */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-30">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            disabled={isTransitioning}
                            className="group focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === currentSlide ? "true" : "false"}
                        >
                            <div
                                className={`h-1 rounded-full transition-all duration-500 ${
                                    index === currentSlide
                                        ? "w-10 sm:w-12 lg:w-14 bg-gradient-to-r from-blue-500 via-blue-600 to-amber-400 shadow-lg shadow-blue-500/50"
                                        : "w-6 sm:w-8 bg-white/40 hover:bg-white/70 group-hover:w-10"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            {!isPaused && slides.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all ease-linear"
                        style={{
                            width: isTransitioning ? "0%" : "100%",
                            transition: isTransitioning
                                ? "none"
                                : "width 5000ms linear",
                        }}
                    />
                </div>
            )}
        </div>
    );
}