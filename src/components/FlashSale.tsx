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

  const discountPercent = 20; // ✅ تا ۲۰٪ تخفیف (هماهنگ با بنر)
  
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
  const discountedPrice = Math.floor(originalPrice * 0.8); // ✅ ۲۰٪ تخفیف
  const savedAmount = originalPrice - discountedPrice;

  // ✅ لینک بنر شما
  const bannerUrl = 'https://uvwydvasorygloptlrhm.supabase.co/storage/v1/object/public/PishnahadVizheh/ChatGPT%20Image%20Aug%2028,%202026,%2001_47_51%20AM.png';

  return (
    <>
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          ✅ به سبد خرید اضافه شد
        </div>
      )}
      
      {/* ✅ بخش پیشنهاد شگفت‌انگیز با بنر ثابت */}
      <section className="relative w-full overflow-hidden" dir="rtl">
        
        {/* ✅ بنر به عنوان پس‌زمینه کامل */}
        <div className="relative w-full" style={{ aspectRatio: '12/5' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={bannerUrl} 
            alt="پیشنهاد شگفت‌انگیز"
            className="w-full h-full object-cover"
          />
          
          {/* ✅ کارت محصول در وسط بنر (جایی که خالی است) */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-md lg:max-w-lg">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-yellow-400/50">
                
                {/* تایمر بالای کارت */}
                <div className="flex justify-center items-center gap-2 mb-4">
                  <span className="text-gray-700 text-sm font-medium">پایان تخفیف:</span>
                  <div className="flex items-center gap-1">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg px-2 py-1 min-w-[45px]">
                      <div className="text-white text-lg font-bold font-mono text-center">{toPersianDigits(timeLeft.hours)}</div>
                    </div>
                    <span className="text-purple-600 text-lg font-bold">:</span>
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg px-2 py-1 min-w-[45px]">
                      <div className="text-white text-lg font-bold font-mono text-center">{toPersianDigits(timeLeft.minutes)}</div>
                    </div>
                    <span className="text-purple-600 text-lg font-bold">:</span>
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg px-2 py-1 min-w-[45px]">
                      <div className="text-white text-lg font-bold font-mono text-center">{toPersianDigits(timeLeft.seconds)}</div>
                    </div>
                  </div>
                </div>

                {/* عکس محصول */}
                <Link href={`/product/${product.id}`} className="block mb-4">
                  <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                    {product.image && product.image.trim() !== '' ? (
                      <img 
                        src={product.image.trim()} 
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-7xl transition-transform duration-500 group-hover:scale-110">🧴</span>
                    )}
                  </div>
                </Link>

                {/* نام محصول */}
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-gray-800 font-bold text-lg mb-3 text-center line-clamp-2 hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* قیمت‌ها */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-gray-400 line-through text-sm">{formatPrice(originalPrice)}</span>
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                      تا ٪{toPersianDigits(discountPercent)} تخفیف
                    </span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-purple-600">{formatPrice(discountedPrice)}</span>
                    <span className="text-gray-600 text-sm">تومان</span>
                  </div>
                  <div className="text-green-600 text-xs mt-1 font-medium">
                    {formatPrice(savedAmount)} تومان سود شما
                  </div>
                </div>

                {/* دکمه خرید */}
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold text-base hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
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
