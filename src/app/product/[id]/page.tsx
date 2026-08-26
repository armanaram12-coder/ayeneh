'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { addToCart } from '@/lib/cart';
import { toggleFavorite, isFavorite } from '@/lib/favorites';

interface Product {
  id: number;
  name: string;
  price_toman: number;
  brand?: string;
  gender?: string;
  type?: string;
  volume_ml?: number;
  volume_gram?: number;
  stock?: number;
  image?: string;
  description?: string;
  category?: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  const productId = typeof params?.id === 'string' ? parseInt(params.id, 10) : 0;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState('');

  useEffect(() => {
    if (productId === 0) return;
    
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (data && !error) {
        // ✅ دیباگ: در کنسول مرورگر (F12) دقیقاً می‌بینی سوپابیس چه چیزی فرستاده
        console.log("✅ داده محصول از سوپابیس:", data);
        console.log("🖼️ مقدار فیلد image:", data.image);
        setProduct(data);
      } else {
        console.error("❌ خطا در دریافت محصول:", error);
        setProduct(null);
      }
      setLoading(false);
    };

    fetchProduct();

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        const fav = await isFavorite(session.user.id, productId);
        setIsFavoriteState(fav);
      }
    };
    checkUser();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('برای افزودن به سبد خرید، لطفاً وارد شوید.');
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }

    await addToCart(session.user.id, {
      id: product.id,
      name: product.name,
      price: product.price_toman,
    });
    
    setShowToast('✅ به سبد خرید اضافه شد');
    setTimeout(() => setShowToast(''), 2000);
  };

  const handleToggleFavorite = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('برای افزودن به علاقه‌مندی‌ها، لطفاً وارد شوید.');
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }

    const result = await toggleFavorite(session.user.id, product!.id);
    setIsFavoriteState(result);
    setShowToast(result ? '❤️ به علاقه‌مندی‌ها اضافه شد' : '💔 از علاقه‌مندی‌ها حذف شد');
    setTimeout(() => setShowToast(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-purple-600 text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">محصول یافت نشد</h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    );
  }

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  return (
    <>
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          {showToast}
        </div>
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <button onClick={() => router.push('/')} className="hover:text-purple-600">صفحه اصلی</button>
            <span>/</span>
            <span className="text-purple-600 font-semibold">{product.name}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  {/* ✅ اصلاح شده: بررسی trim و اضافه کردن onError برای دیباگ */}
                  {product.image && product.image.trim() !== '' ? (
                    <img 
                      src={product.image.trim()} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("❌ مرورگر نتوانست عکس را لود کند. لینک:", product.image);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-9xl">🧴</span>
                  )}
                </div>
                
                <button
                  onClick={handleToggleFavorite}
                  className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 ${isFavoriteState ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                    viewBox="0 0 24 24"
                    fill={isFavoriteState ? 'currentColor' : 'none'}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col">
                {product.brand && (
                  <span className="text-sm text-purple-600 font-semibold mb-2">برند: {product.brand}</span>
                )}
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-[#7C3AED]">{formatPrice(product.price_toman)} تومان</span>
                  {product.stock !== undefined && (
                    <span className={`text-sm px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock > 0 ? 'موجود در انبار' : 'ناموجود'}
                    </span>
                  )}
                </div>

                <div className="bg-purple-50 rounded-xl p-4 mb-6 space-y-2">
                  <h3 className="font-bold text-gray-800 mb-3">مشخصات محصول</h3>
                  {product.category && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">دسته‌بندی:</span>
                      <span className="font-semibold text-gray-800">{product.category}</span>
                    </div>
                  )}
                  {product.gender && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">جنسیت:</span>
                      <span className="font-semibold text-gray-800">{product.gender}</span>
                    </div>
                  )}
                  {product.type && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">نوع:</span>
                      <span className="font-semibold text-gray-800">{product.type}</span>
                    </div>
                  )}
                  {product.volume_ml && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">حجم:</span>
                      <span className="font-semibold text-gray-800">{product.volume_ml} میلی‌لیتر</span>
                    </div>
                  )}
                  {product.volume_gram && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">وزن:</span>
                      <span className="font-semibold text-gray-800">{product.volume_gram} گرم</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-2">توضیحات</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description || `${product.name} از برند ${product.brand || 'تراست'} با کیفیت عالی و قیمت مناسب.`}</p>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
                  >
                    افزودن به سبد خرید
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors"
                  >
                    خرید سریع
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🚚</div>
                    <p className="text-xs text-gray-600">ارسال سریع</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">✅</div>
                    <p className="text-xs text-gray-600">ضمانت اصالت</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">💰</div>
                    <p className="text-xs text-gray-600">بهترین قیمت</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">محصولات مرتبط</h2>
            <RelatedProducts currentProductId={productId} currentCategory={product.category} />
          </div>
        </div>
      </div>
    </>
  );
}

function RelatedProducts({ currentProductId, currentCategory }: { currentProductId: number; currentCategory?: string }) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!currentCategory) return;

    const fetchRelated = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', currentCategory)
        .neq('id', currentProductId)
        .limit(4);
      
      if (data) {
        setRelatedProducts(data);
      }
    };

    fetchRelated();
  }, [currentCategory, currentProductId]);

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {relatedProducts.map(p => (
        <div 
          key={p.id} 
          onClick={() => router.push(`/product/${p.id}`)}
          className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            {p.image && p.image.trim() !== '' ? (
              <img src={p.image.trim()} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">🧴</span>
            )}
          </div>
          <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{p.name}</h3>
          <p className="text-[#7C3AED] font-bold">{formatPrice(p.price_toman)} تومان</p>
        </div>
      ))}
    </div>
  );
}
