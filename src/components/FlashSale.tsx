'use client';

import { useState, useEffect } from 'react';
import productsData from '@/data/products.json';

interface Product {
  id: number;
  name: string;
  price_toman: number;
}

// Helper function to convert English digits to Persian
function toPersianDigits(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

// Helper function to format price with commas
function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR');
}

// Get first product only
function getFirstProduct(): Product | null {
  for (const category of productsData.categories) {
    for (const subcategory of category.subcategories) {
      for (const product of subcategory.products) {
        return {
          id: product.id,
          name: product.name,
          price_toman: product.price_toman,
        };
      }
    }
  }
  return null;
}

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [product, setProduct] = useState<Product | null>(null);

  // Calculate time until midnight
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load first product
  useEffect(() => {
    setProduct(getFirstProduct());
  }, []);

  const discountPercent = 10;

  if (!product) return null;

  const originalPrice = product.price_toman;
  const discountedPrice = Math.floor(originalPrice * 0.9);

  return (
    <section 
      className="w-full py-8 md:py-12"
      dir="rtl"
      style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #E879F9 100%)' }}
    >
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          🔥 پیشنهاد شگفت‌انگیز
        </h2>

        {/* Countdown Timer */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <span className="text-white text-lg font-semibold">تا پایان تخفیف:</span>
          <div className="flex items-center gap-1 bg-white/20 rounded-lg px-4 py-2">
            <span className="text-white text-xl font-bold font-mono">
              {toPersianDigits(timeLeft.hours)}
            </span>
            <span className="text-white text-xl">:</span>
            <span className="text-white text-xl font-bold font-mono">
              {toPersianDigits(timeLeft.minutes)}
            </span>
            <span className="text-white text-xl">:</span>
            <span className="text-white text-xl font-bold font-mono">
              {toPersianDigits(timeLeft.seconds)}
            </span>
          </div>
        </div>

        {/* Single Product Card */}
        <div className="max-w-md mx-auto">
          <div
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative"
          >
            {/* Discount Badge */}
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold z-10">
              ٪{toPersianDigits(discountPercent)} تخفیف
            </div>

            {/* Product Name */}
            <h3 className="text-gray-800 font-semibold mb-4 text-center line-clamp-2 h-14">
              {product.name}
            </h3>

            {/* Prices */}
            <div className="mb-6 text-center">
              <p className="text-gray-400 text-sm line-through">
                {formatPrice(originalPrice)} تومان
              </p>
              <p className="text-[#7C3AED] text-2xl font-bold mt-1">
                {formatPrice(discountedPrice)} تومان
              </p>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={() => alert('به سبد اضافه شد')}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300"
            >
              افزودن به سبد
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
