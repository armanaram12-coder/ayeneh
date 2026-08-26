'use client';

import { useState, useEffect } from 'react';

interface Slide {
  id: number;
  title: string;
  buttonText: string;
  image?: string;    // ✅ لینک عکس از سوپابیس (اختیاری)
  gradient?: string; // ✅ گرادیان جایگزین در صورت نبود عکس (اختیاری)
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'تخفیف‌های ویژه فصلی',
    buttonText: 'مشاهده محصولات',
    // ✅ لینک عکس آپلود شده در سوپابیس را اینجا بگذار:
    image: 'https://uvwydvasorygloptlrhm.supabase.co/storage/v1/object/public/sliders/slide1.jpg', 
  },
  {
    id: 2,
    title: 'محصولات پرفروش هفته',
    buttonText: 'خرید الآن',
    image: 'https://uvwydvasorygloptlrhm.supabase.co/storage/v1/object/public/sliders/slide2.jpg',
  },
  {
    id: 3,
    title: 'راهنمای انتخاب عطر',
    buttonText: 'مطالعه بیشتر',
    // ✅ اگر هنوز عکس آپلود نکردی، این خط را فعال کن تا گرادیان نشان داده شود:
    // gradient: 'from-[#5B21B6] to-[#A855F7]',
    image: 'https://uvwydvasorygloptlrhm.supabase.co/storage/v1/object/public/sliders/slide3.jpg',
  },
  {
    id: 4,
    title: 'روتین مراقبت پوست',
    buttonText: 'مشاهده کیت‌ها',
    image: 'https://uvwydvasorygloptlrhm.supabase.co/storage/v1/object/public/sliders/slide4.jpg',
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
      <div className="relative w-full h-full">
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              
              {/* ✅ پس‌زمینه: اگر عکس بود عکس، اگر نبود گرادیان */}
              <div className="absolute inset-0">
                {slide.image ? (
                  <>
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    {/* لایه تاریک روی عکس برای خوانایی بهتر متن */}
                    <div className="absolute inset-0 bg-black/40" />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
                )}
              </div>
              
              {/* محتوا (متن و دکمه) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
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

      {/* دکمه‌های ناوبری (قبلی/بعدی) */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full z-20 transition-all duration-300 backdrop-blur-sm"
        aria-label="اسلاید قبلی"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full z-20 transition-all duration-300 backdrop-blur-sm"
        aria-label="اسلاید بعدی"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* نقاط ناوبری (Dots) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80 w-3'
            }`}
            aria-label={`اسلاید ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
