'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { addToCart } from '@/lib/cart';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price_toman: number;
  image?: string;
}

function toPersianDigits(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR');
}

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // ✅ خواندن محصول از Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      // گرفتن اولین محصول (یا می‌توانی ID خاصی را مشخص کنی)
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price_toman, image')
        .order('id', { ascending: true })
        .limit(1)
        .single();
      
      if (data && !error) {
        setProduct(data);
      }
      setLoading(false);
    };
    
    fetchProduct();
  }, []);

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

  const handleAddToCart = async () => {
    if (!product) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('برای افزودن محصول به سبد خرید، لطفاً ابتدا وارد حساب کاربری خود شوید.');
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }

    await addToCart(session.user.id, {
      id: product.id,
      name: product.name,
      price: product.price_toman,
    });
    
    window.dispatchEvent(new Event('cartUpdated'));
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const discountPercent = 10;
  
  if (loading) {
    return (
      <section className="w-full py-8 md:py-12" dir="rtl" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #E879F9 100%)' }}>
        <div className="container mx-auto px-4 text-center text-white">
          در حال بارگذاری...
        </div>
      </section>
    );
  }
  
  if (!product) return null;

  const originalPrice = product.price_toman;
  const discountedPrice = Math.floor(originalPrice * 0.9);

  return (
    <>
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          ✅ به سبد خرید اضافه شد
        </div>
      )}
      
      <section className="w-full py-8 md:py-12" dir="rtl" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #E879F9 100%)' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            🔥 پیشنهاد شگفت‌انگیز
          </h2>

          <div className="flex justify-center items-center gap-2 mb-8">
            <span className="text-white text-lg font-semibold">تا پایان تخفیف:</span>
            <div className="flex items-center gap-1 bg-white/20 rounded-lg px-4 py-2">
              <span className="text-white text-xl font-bold font-mono">{toPersianDigits(timeLeft.hours)}</span>
              <span className="text-white text-xl">:</span>
              <span className="text-white text-xl font-bold font-mono">{toPersianDigits(timeLeft.minutes)}</span>
              <span className="text-white text-xl">:</span>
              <span className="text-white text-xl font-bold font-mono">{toPersianDigits(timeLeft.seconds)}</span>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative">
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold z-10">
                ٪{toPersianDigits(discountPercent)} تخفیف
              </div>

              <Link href={`/product/${product.id}`}>
                {/* ✅ نمایش عکس محصول */}
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {product.image && product.image.trim() !== '' ? (
                    <img src={product.image.trim()} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">🧴</span>
                  )}
                </div>
                
                <h3 className="text-gray-800 font-semibold mb-4 text-center line-clamp-2 h-14 cursor-pointer hover:text-[#7C3AED] transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="mb-6 text-center">
                <p className="text-gray-400 text-sm line-through">
                  {formatPrice(originalPrice)} تومان
                </p>
                <p className="text-[#7C3AED] text-2xl font-bold mt-1">
                  {formatPrice(discountedPrice)} تومان
                </p>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300"
              >
                افزودن به سبد
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
