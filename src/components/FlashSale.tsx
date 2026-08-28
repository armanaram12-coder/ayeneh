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

  const discountPercent = 10; // ✅ ۱۰٪ تخفیف
  
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
  const discountedPrice = Math.floor(originalPrice * 0.9); // ✅ ۱۰٪ تخفیف
  const savedAmount = originalPrice - discountedPrice;

  const bannerUrl = 'https://uvwydvasorygloptlrhm.supabase.co/storage/v1/object/public/PishnahadVizheh/flash-sale-banner.png';

  return (
    <>
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          ✅ به سبد خرید اضافه شد
        </div>
      )}
      
      {/* ✅ بخش پیشنهاد شگفت‌انگیز - طراحی جدید */}
      <section className="relative w-full py-8 md:py-12" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            
            {/* بنر کامل */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={bannerUrl} 
              alt="پیشنهاد شگفت‌انگیز آینه"
              className="w-full h-auto object-contain"
            />
            
            {/* کارت محصول در وسط بنر */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="w-full max-w-xs md:max-w-sm lg:max-w-md">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6 border-2 border-yellow-400/50">
                  
                  {/* تایمر */}
                  <div className="flex justify-center items-center gap-2 mb-4">
                    <span className="text-gray-700 text-sm font-bold">پایان تخفیف:</span>
                    <div className="flex items-center gap-1">
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg px-3 py-1.5 min-w-[50px] shadow-lg">
                        <div className="text-white text-xl font-bold font-mono text-center">{toPersianDigits(timeLeft.hours)}</div>
                      </div>
                      <span className="text-purple-600 text-xl font-bold">:</span>
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg px-3 py-1.5 min-w-[50px] shadow-lg">
                        <div className="text-white text-xl font-bold font-mono text-center">{toPersianDigits(timeLeft.minutes)}</div>
                      </div>
                      <span className="text-purple-600 text-xl font-bold">:</span>
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg px-3 py-1.5 min-w-[50px] shadow-lg">
                        <div className="text-white text-xl font-bold font-mono text-center">{toPersianDigits(timeLeft.seconds)}</div>
                      </div>
                    </div>
                  </div>

                  {/* عکس محصول با بج تخفیف - پایین‌تر */}
                  <Link href={`/product/${product.id}`} className="block mb-4 relative">
                    <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center overflow-hidden relative group">
                      {/* ✅ بج تخفیف در گوشه بالا */}
                      <div className="absolute top-2 right-2 z-20">
                        <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-red-500/50">
                          <div className="text-lg font-bold">٪{toPersianDigits(discountPercent)}</div>
                          <div className="text-[10px] leading-tight">تخفیف</div>
                        </div>
                      </div>
                      
                      {/* عکس محصول - با padding پایین برای نمایش کامل */}
                      {product.image && product.image.trim() !== '' ? (
                        <img 
                          src={product.image.trim()} 
                          alt={product.name}
                          className="w-full h-full object-contain p-6 pb-2 transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-5xl transition-transform duration-500 group-hover:scale-110"></span>
                      )}
                    </div>
                  </Link>

                  {/* نام محصول - بزرگتر و بولد */}
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-gray-800 font-extrabold text-base md:text-lg mb-3 text-center leading-relaxed hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* قیمت‌ها - خیلی بزرگتر و بولد */}
                  <div className="text-center mb-4">
                    {/* قیمت اصلی خط‌خورده */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-gray-400 line-through text-base font-bold">{formatPrice(originalPrice)}</span>
                      <span className="text-gray-400 text-base">تومان</span>
                    </div>
                    
                    {/* قیمت با تخفیف - خیلی بزرگ */}
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-4xl md:text-5xl font-extrabold text-purple-600">{formatPrice(discountedPrice)}</span>
                      <span className="text-gray-700 text-lg font-bold">تومان</span>
                    </div>
                    
                    {/* مبلغ سود */}
                    <div className="bg-green-50 inline-block px-4 py-1.5 rounded-lg mt-2">
                      <span className="text-green-700 text-sm font-bold">
                        {formatPrice(savedAmount)} تومان سود شما
                      </span>
                    </div>
                  </div>

                  {/* دکمه خرید - بزرگ و بولد */}
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-extrabold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
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
