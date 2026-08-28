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
  brand?: string;
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

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price_toman, image, brand')
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
      <section className="w-full py-12" dir="rtl">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="animate-pulse text-xl">در حال بارگذاری...</div>
        </div>
      </section>
    );
  }
  
  if (!product) return null;

  const originalPrice = product.price_toman;
  const discountedPrice = Math.floor(originalPrice * 0.9);

  const bannerUrl = 'https://uvwydvasorygloptlrhm.supabase.co/storage/v1/object/public/PishnahadVizheh/flash-sale-banner.png';

  return (
    <>
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          ✅ به سبد خرید اضافه شد
        </div>
      )}
      
      <section className="relative w-full py-6 md:py-8" dir="rtl">
        <div className="container mx-auto px-4">
          {/* بنر کامل */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={bannerUrl} 
              alt="پیشنهاد شگفت‌انگیز"
              className="w-full h-auto"
            />
            
            {/* کارت محصول کوچک در وسط */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs md:max-w-sm px-2">
              <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-yellow-400">
                
                {/* تایمر */}
                <div className="flex justify-center items-center gap-1 mb-3">
                  <span className="text-gray-700 text-xs font-bold">پایان:</span>
                  <div className="flex items-center">
                    <div className="bg-red-500 rounded px-2 py-0.5 mr-1">
                      <div className="text-white text-sm font-bold font-mono">{toPersianDigits(timeLeft.hours)}</div>
                    </div>
                    <span className="text-red-500 text-sm font-bold mx-0.5">:</span>
                    <div className="bg-red-500 rounded px-2 py-0.5 mr-1">
                      <div className="text-white text-sm font-bold font-mono">{toPersianDigits(timeLeft.minutes)}</div>
                    </div>
                    <span className="text-red-500 text-sm font-bold mx-0.5">:</span>
                    <div className="bg-red-500 rounded px-2 py-0.5 mr-1">
                      <div className="text-white text-sm font-bold font-mono">{toPersianDigits(timeLeft.seconds)}</div>
                    </div>
                  </div>
                </div>

                {/* عکس با بج تخفیف */}
                <Link href={`/product/${product.id}`} className="block relative mb-3">
                  <div className="bg-gray-50 rounded-lg overflow-hidden relative">
                    {/* بج ۱۰٪ */}
                    <div className="absolute top-1 right-1 z-10 bg-gradient-to-br from-red-500 to-pink-600 text-white px-2 py-1 rounded-md">
                      <div className="text-xs font-bold">٪{toPersianDigits(discountPercent)}</div>
                    </div>
                    
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {product.image && product.image.trim() !== '' ? (
                      <img 
                        src={product.image.trim()} 
                        alt={product.name}
                        className="w-full h-32 object-contain p-2"
                      />
                    ) : (
                      <div className="h-32 flex items-center justify-center text-4xl"></div>
                    )}
                  </div>
                </Link>

                {/* نام محصول */}
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-gray-800 font-bold text-xs mb-2 text-center line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* قیمت‌ها */}
                <div className="text-center mb-3">
                  {/* قیمت اصلی خط‌خورده */}
                  <div className="text-gray-400 line-through text-xs mb-1">
                    {formatPrice(originalPrice)} تومان
                  </div>
                  {/* قیمت با تخفیف */}
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-extrabold text-purple-600">{formatPrice(discountedPrice)}</span>
                    <span className="text-gray-700 text-sm font-bold">تومان</span>
                  </div>
                </div>

                {/* دکمه خرید */}
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                >
                   افزودن به سبد خرید
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
