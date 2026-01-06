'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
}

export default function HeroCarousel({ initialSlides }: { initialSlides: Slide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = initialSlides.length > 0 ? initialSlides : [
    {
      id: 'default-1',
      title: "Expert Legal Solutions",
      subtitle: "FOR YOUR BUSINESS",
      description: "We provide comprehensive legal services tailored to your specific biological and legal needs.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1920",
      ctaText: "Our Services"
    }
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
            <span className="text-sm tracking-[0.4em] font-medium uppercase mb-4 animate-fadeInUp">
              {slide.subtitle}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-wide mb-6 animate-fadeInUp delay-100">
              {slide.title}
            </h1>
            <p className="max-w-2xl text-lg md:text-xl font-light text-gray-200 mb-10 animate-fadeInUp delay-200">
              {slide.description}
            </p>
            <button className="px-8 py-3 bg-[#004d66] hover:bg-[#003d52] text-white text-sm font-bold tracking-[0.2em] uppercase transition-all animate-fadeInUp delay-300">
              {slide.ctaText}
            </button>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide ? "bg-white w-8" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
