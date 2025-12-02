import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HERO_SLIDES } from "../../data";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);

  return (
    <div
      className="relative w-full aspect-[16/8] md:aspect-[16/6] lg:aspect-[16/5] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            currentSlide === index 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 translate-x-4"
          }`}
        >
          <div className="relative w-full h-full">
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover scale-105 transition-transform duration-12000 ease-out"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
            {/* Accent gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-amber-500/5" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="px-6 md:px-12 lg:px-24 max-w-screen-2xl mx-auto w-full">
              <div className="max-w-2xl text-white">
                {/* Decorative element */}
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 leading-tight">
                  <span className="font-serif italic text-amber-50">{slide.title.split(' ')[0]}</span>
                  <span className="font-medium"> {slide.title.split(' ').slice(1).join(' ')}</span>
                </h1>
                
                <p className="text-xl md:text-2xl font-light text-gray-200 mb-10 max-w-xl leading-relaxed">
                  {slide.subtitle}
                </p>
                
                <div className="flex items-center gap-6">
                  <Link
                    to={slide.ctaLink}
                    className="group relative overflow-hidden  text-white px-10 py-4 border border-white/30 rounded-full font-medium hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <span className="relative z-10">{slide.cta}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Elegant Prev/Next Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/20 p-4 rounded-full shadow-2xl transition-all duration-300 group hover:scale-110"
      >
        <ChevronLeft className="w-7 h-7 text-white group-hover:text-amber-200 transition-colors" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/20 p-4 rounded-full shadow-2xl transition-all duration-300 group hover:scale-110"
      >
        <ChevronRight className="w-7 h-7 text-white group-hover:text-amber-200 transition-colors" />
      </button>

      {/* Elegant Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group"
          >
            <div className={`h-1 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? "w-12 bg-gradient-to-r from-blue-800 to-amber-400" 
                : "w-8 bg-white/40 hover:bg-white/60"
            }`} />
          </button>
        ))}
      </div>
      
    </div>
  );
}