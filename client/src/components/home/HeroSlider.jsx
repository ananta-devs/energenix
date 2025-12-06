import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    title: "Elevate Your Style",
    subtitle: "Discover curated collections that define modern elegance",
    cta: "Shop Collection",
    ctaLink: "/collection"
  },
  {
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80",
    title: "Summer Essentials",
    subtitle: "Breathable fabrics and timeless designs for the season",
    cta: "Explore Now",
    ctaLink: "/summer"
  },
  {
    url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80",
    title: "Heritage Craftsmanship",
    subtitle: "Where tradition meets contemporary design",
    cta: "View Collection",
    ctaLink: "/heritage"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');
  const [loadedImages, setLoadedImages] = useState(new Set([0]));
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Preload images
  useEffect(() => {
    const preloadImage = (index) => {
      const img = new Image();
      img.src = HERO_SLIDES[index].url;
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, index]));
      };
    };

    // Preload next and previous images
    const nextIndex = (currentSlide + 1) % HERO_SLIDES.length;
    const prevIndex = (currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    
    if (!loadedImages.has(nextIndex)) preloadImage(nextIndex);
    if (!loadedImages.has(prevIndex)) preloadImage(prevIndex);
  }, [currentSlide, loadedImages]);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused || isTransitioning) return;
    
    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused, isTransitioning, currentSlide]);

  const handleSlideChange = useCallback((newIndex, dir) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setDirection(dir);
    setCurrentSlide(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  }, [isTransitioning]);

  const handlePrevSlide = () => {
    const newIndex = (currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    handleSlideChange(newIndex, 'prev');
  };

  const handleNextSlide = () => {
    const newIndex = (currentSlide + 1) % HERO_SLIDES.length;
    handleSlideChange(newIndex, 'next');
  };

  const handleDotClick = (index) => {
    if (index === currentSlide) return;
    const dir = index > currentSlide ? 'next' : 'prev';
    handleSlideChange(index, dir);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 75) {
      handleNextSlide();
    }
    if (touchStartX.current - touchEndX.current < -75) {
      handlePrevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrevSlide();
      if (e.key === 'ArrowRight') handleNextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div 
      className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[85vh] max-h-[900px] overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero carousel"
    >
      {/* Slides */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = currentSlide === index;
        const isPrev = (currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length === index;
        const isNext = (currentSlide + 1) % HERO_SLIDES.length === index;
        
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              isActive 
                ? "opacity-100 z-10 scale-100" 
                : "opacity-0 z-0 scale-105"
            } ${
              direction === 'next' && isActive ? "translate-x-0" :
              direction === 'next' && isPrev ? "-translate-x-full" :
              direction === 'prev' && isActive ? "translate-x-0" :
              direction === 'prev' && isNext ? "translate-x-full" :
              ""
            }`}
            aria-hidden={!isActive}
          >
            <div className="relative w-full h-full">
              {/* Image with Ken Burns effect */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.url}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/15 via-transparent to-amber-500/10" />
            </div>

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
                      {slide.title.split(' ')[0]}
                    </span>
                    <span className="block font-medium">
                      {slide.title.split(' ').slice(1).join(' ')}
                    </span>
                  </h1>
                  
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-200 mb-8 sm:mb-10 lg:mb-12 max-w-2xl leading-relaxed">
                    {slide.subtitle}
                  </p>
                  
                  <button
                    onClick={() => window.location.href = slide.ctaLink}
                    className="group relative overflow-hidden bg-white/5 text-white px-8 sm:px-10 lg:px-12 py-3 sm:py-4 border border-white/30 rounded-full font-medium hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-0.5 hover:border-white/50 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent text-sm sm:text-base"
                    aria-label={`${slide.cta} - ${slide.title}`}
                  >
                    <span className="relative z-10">{slide.cta}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevSlide}
        disabled={isTransitioning}
        className="hidden md:flex absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 p-2 sm:p-3 lg:p-4 rounded-full shadow-2xl transition-all duration-300 group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:text-amber-300 transition-colors" />
      </button>
      
      <button
        onClick={handleNextSlide}
        disabled={isTransitioning}
        className="hidden md:flex absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 p-2 sm:p-3 lg:p-4 rounded-full shadow-2xl transition-all duration-300 group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:text-amber-300 transition-colors" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPaused(prev => !prev)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
        aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
      >
        {isPaused ? (
          <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20">
        {HERO_SLIDES.map((_, index) => (
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
                  ? "w-10 sm:w-12 lg:w-14 bg-gradient-to-r from-purple-500 via-purple-600 to-amber-400 shadow-lg shadow-purple-500/50" 
                  : "w-6 sm:w-8 bg-white/40 hover:bg-white/70 group-hover:w-10"
              }`} 
            />
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      {!isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all ease-linear"
            style={{
              width: isTransitioning ? '0%' : '100%',
              transition: isTransitioning ? 'none' : 'width 5000ms linear'
            }}
          />
        </div>
      )}
    </div>
  );
}