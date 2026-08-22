'use client';

import { useState, useEffect } from 'react';

interface Slide {
  id: number;
  title: string;
  buttonText: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'تخفیف‌های ویژه فصلی',
    buttonText: 'مشاهده محصولات',
    gradient: 'from-[#7C3AED] to-[#E879F9]',
  },
  {
    id: 2,
    title: 'محصولات پرفروش هفته',
    buttonText: 'خرید الآن',
    gradient: 'from-[#6D28D9] to-[#C026D9]',
  },
  {
    id: 3,
    title: 'راهنمای انتخاب عطر',
    buttonText: 'مطالعه بیشتر',
    gradient: 'from-[#5B21B6] to-[#A855F7]',
  },
  {
    id: 4,
    title: 'روتین مراقبت پوست',
    buttonText: 'مشاهده کیت‌ها',
    gradient: 'from-[#7C3AED] to-[#EC4899]',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden" dir="rtl">
      {/* Slides Container with horizontal slide transition */}
      <div className="relative w-full h-full">
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full h-full relative"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                  {slide.title}
                </h1>
                <button className="bg-white text-[#7C3AED] hover:bg-[#E879F9] hover:text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Left/Right Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full z-10 transition-all duration-300"
        aria-label="اسلاید قبلی"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full z-10 transition-all duration-300"
        aria-label="اسلاید بعدی"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`اسلاید ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
