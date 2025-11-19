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
      className="relative w-full aspect-[16/8] md:aspect-[16/6] lg:aspect-[16/5] overflow-hidden -mt-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.url}
            alt={slide.title}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 flex items-center">
            <div className="px-4 md:px-8 lg:px-16 max-w-screen-xl mx-auto">
              <div className="max-w-2xl text-white">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8">{slide.subtitle}</p>
                <Link
                  to={slide.ctaLink}
                  className="bg-white text-purple-900 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition transform hover:scale-105"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev/Next Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50 w-3"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
