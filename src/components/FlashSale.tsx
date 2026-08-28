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

  const discountPercent = 20;
  
  if (loading) {
    return (
      <section className="w-full py-12" dir="rtl">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="animate-pulse text-xl">در حال بارگذاری پیشنهاد شگفت‌انگیز...</div>
        </div>
      </section>
    );
  }
  
  if (!product) return null;

  const originalPrice = product.price_toman;
  const discountedPrice = Math.floor(originalPrice * 0.8);
  const savedAmount = originalPrice - discountedPrice;

  const bannerUrl = 'https://uvwydvasorygloptlrhm.supabase.co/storage/v1/object/public/PishnahadVizheh/flash-sale-banner.png';

  return (
    <>
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          ✅ به سبد خرید اضافه شد
        </div>
      )}
      
      {/* ✅ بخش پیشنهاد شگفت‌انگیز - بنر کامل بدون برش */}
      <section className="relative w-full py-8 md:py-12" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            
            {/* ✅ بنر کامل با object-contain (بدون برش) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={bannerUrl} 
              alt="پیشنهاد شگفت‌انگیز آینه"
              className="w-full h-auto object-contain"
            />
            
            {/* ✅ کارت محصول در وسط بنر */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="w-full max-w-xs md:max-w-sm lg:max-w-md">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6 border-2 border-yellow-400/50">
                  
                  {/* تایمر */}
                  <div className="flex justify-center items-center gap-2 mb-3">
                    <span className="text-gray-700 text-xs font-medium">پایان:</span>
                    <div className="flex items-center gap-1">
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-md px-2 py-1 min-w-[40px]">
                        <div className="text-white text-base font-bold font-mono text-center">{toPersianDigits(timeLeft.hours)}</div>
                      </div>
                      <span className="text-purple-600 text-base font-bold">:</span>
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-md px-2 py-1 min-w-[40px]">
                        <div className="text-white text-base font-bold font-mono text-center">{toPersianDigits(timeLeft.minutes)}</div>
                      </div>
                      <span className="text-purple-600 text-base font-bold">:</span>
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-md px-2 py-1 min-w-[40px]">
                        <div className="text-white text-base font-bold font-mono text-center">{toPersianDigits(timeLeft.seconds)}</div>
                      </div>
                    </div>
                  </div>

                  {/* عکس محصول */}
                  <Link href={`/product/${product.id}`} className="block mb-3">
                    <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center overflow-hidden relative group">
                      {product.image && product.image.trim() !== '' ? (
                        <img 
                          src={product.image.trim()} 
                          alt={product.name}
                          className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-5xl transition-transform duration-500 group-hover:scale-110"></span>
                      )}
                    </div>
                  </Link>

                  {/* نام محصول */}
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-gray-800 font-bold text-sm md:text-base mb-2 text-center line-clamp-2 hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* قیمت‌ها */}
                  <div className="text-center mb-3">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-gray-400 line-through text-xs">{formatPrice(originalPrice)}</span>
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                        تا ٪{toPersianDigits(discountPercent)} تخفیف
                      </span>
                    </div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-bold text-purple-600">{formatPrice(discountedPrice)}</span>
                      <span className="text-gray-600 text-xs">تومان</span>
                    </div>
                    <div className="text-green-600 text-xs mt-1 font-medium">
                      {formatPrice(savedAmount)} تومان سود شما
                    </div>
                  </div>

                  {/* دکمه خرید */}
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                     افزودن به سبد خرید
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
