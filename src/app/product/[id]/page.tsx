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

// ✅ داده‌های اختصاصی و شیک برای محصول کرم خاویار (ID: 72)
const product72Details = {
  highlights: [
    'حاوی پروتئین آدیپونکتین با عملکردی شبیه هورمون استروژن',
    'غنی از اسیدهای چرب ضروری امگا-3 و 6 و پپتایدهای مغذی',
    'حاوی ترکیب موثره خاویار در ویال شیشه‌ای جداگانه',
    'سیستم بازسازی هوشمند ۳۶۰ درجه',
    'افزایش تولید کلاژن و الاستین و جوانسازی سلول‌ها',
    'ترمیم اختصاصی پوست با تکنولوژی انحصاری بایولاک'
  ],
  fullDescription: `پوست انسان به‌عنوان بزرگ‌ترین عضو بدن، در معرض عوامل مختلفی قرار دارد که می‌توانند به سلامت و زیبایی آن آسیب برسانند. مهم‌ترین عواملی که به پوست ما آسیب می‌رسانند، افزایش سن، تاثیر پرتوهای مضر خورشید، استرس‌ها، آلودگی‌های محیطی و تغییرات هورمونی هستند. این عوامل به مرور زمان پوست را دچار افتادگی و چین و چروک می‌کنند.
  
  کرم خاویار تراست اسمارت با بهره‌گیری از ترکیبات فعال آمینواسیدی، ویتامین‌ها، مواد معدنی و آنتی‌اکسیدان‌های بی‌نظیر موجود در خاویار، به طور هوشمندانه‌ای به بازسازی سد دفاعی پوست‌های آسیب‌دیده کمک کرده و پوست را جوان و شاداب می‌سازد. این محصول با دارا بودن تکنولوژی انحصاری بایولاک از خروج رطوبت جلوگیری کرده و به سفت شدن پوست کمک می‌کند.`,
  benefits: [
    'سیستم بازسازی هوشمند ۳۶۰ درجه با نفوذ عمقی به پوست',
    'افزایش تولید کلاژن و الاستین برای کاهش چین و چروک',
    'رطوبت‌رسانی عمیق و تغذیه پوست با ترکیبات پپتیدی',
    'حفاظت در برابر اشعه UV و مهار رنگدانه ملانین',
    'بهبود بافت، نرمی و درخشندگی طبیعی پوست'
  ],
  ingredients: [
    { name: 'عصاره خاویار رویال', desc: 'غنی از آنتی‌اکسیدان و آمینواسید، افزایش‌دهنده ساخت کلاژن و استحکام پوست.' },
    { name: 'ایزوفلاون بامبو', desc: 'بازسازی سلول‌های پوستی، نرم‌کننده و مهارکننده قوی رادیکال‌های آزاد.' },
    { name: 'مارین کلاژن', desc: 'کلاژن دریایی قوی برای تکثیر سلولی، ترمیم آسیب‌ها و سفت‌کنندگی پوست.' },
    { name: 'Duraquench IQ', desc: 'آبرسانی هوشمند، تقویت سد دفاعی و جلوگیری از خروج رطوبت با خاصیت ضدالتهابی.' },
    { name: 'عصاره سلول بنیادی رز آلپ', desc: 'لیفتینگ طبیعی، افزایش مقاومت سلول‌ها در برابر تغییرات دمایی و محیطی.' },
    { name: 'ماتریکسیل', desc: 'پپتید موثر در ساخت کلاژن، الاستین و هیالورونیک‌اسید برای لیفت پوست.' },
    { name: 'عصاره پیاز زعفران', desc: 'به تعویق انداختن پیری پوست و افزایش استحکام ماتریکس خارج سلولی.' },
    { name: 'آلفا آربوتین', desc: 'روشن‌کننده و ضد لک قوی با کاهش تولید رنگدانه ملانین.' },
    { name: 'سدیم هیالورونات', desc: 'آبرسانی عمقی و استحکام‌بخشی به فیبرهای کلاژن و الاستین.' },
    { name: 'باکوچیول', desc: 'جایگزین گیاهی و ملایم رتینول، ضد چروک طبیعی مناسب پوست‌های حساس.' },
    { name: 'میتوکینیل', desc: 'ضد آلودگی محیطی و مهارکننده رادیکال‌های آزاد برای رفع تیرگی.' },
    { name: 'عصاره جنسینگ هیدرولیز شده', desc: 'جلوگیری از شکستن کلاژن و روشن‌کننده طبیعی پوست.' }
  ],
  specs: {
    'حجم': '۳۰ میلی‌لیتر',
    'نحوه مصرف': 'محتویات ویال خاویار را به آرامی روی کرم ریخته و با اپلیکاتور، روزانه دو بار (صبح و شب) ماساژ دهید. (خاویار را یکجا مخلوط نکنید)',
    'فرم محصول': 'کرم',
    'جنسیت': 'عمومی (یونیسکس)',
    'نوع پوست': 'انواع پوست',
    'شماره پروانه بهداشت': '1145/ظ/48',
    'بازه مصرف پس از باز شدن': '۴ ماه',
    'شرایط نگهداری': 'دور از نور مستقیم خورشید و دسترس اطفال. درب محصول پس از هر بار استفاده بسته شود.'
  }
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  const productId = typeof params?.id === 'string' ? parseInt(params.id, 10) : 0;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavoriteState, setIsFavoriteState] = useState(false);
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
        setProduct(data);
      } else {
        setProduct(null);
      }
      setLoading(false);
    };

    fetchProduct();

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
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
    await addToCart(session.user.id, { id: product.id, name: product.name, price: product.price_toman });
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
        <button onClick={() => router.push('/')} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90">
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
      
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          {/* بخش بالا: عکس و اطلاعات اصلی */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* عکس محصول */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  {product.image && product.image.trim() !== '' ? (
                    <img src={product.image.trim()} alt={product.name} className="w-full h-full object-contain p-4" />
                  ) : (
                    <span className="text-9xl">🧴</span>
                  )}
                </div>
                <button onClick={handleToggleFavorite} className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isFavoriteState ? 'text-red-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 24 24" fill={isFavoriteState ? 'currentColor' : 'none'} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* اطلاعات اصلی */}
              <div className="flex flex-col">
                {product.brand && <span className="text-sm text-purple-600 font-semibold mb-2">برند: {product.brand}</span>}
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
                  <h3 className="font-bold text-gray-800 mb-3">مشخصات کلی</h3>
                  {product.category && <div className="flex justify-between text-sm"><span className="text-gray-600">دسته‌بندی:</span><span className="font-semibold">{product.category}</span></div>}
                  {product.gender && <div className="flex justify-between text-sm"><span className="text-gray-600">جنسیت:</span><span className="font-semibold">{product.gender}</span></div>}
                  {product.volume_ml && <div className="flex justify-between text-sm"><span className="text-gray-600">حجم:</span><span className="font-semibold">{product.volume_ml} میلی‌لیتر</span></div>}
                </div>

                <div className="flex gap-3 mt-auto">
                  <button onClick={handleAddToCart} className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg">
                    افزودن به سبد خرید
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ بخش توضیحات تکمیلی شیک و حرفه‌ای (فقط برای محصول ID 72) */}
          {product.id === 72 && (
            <div className="max-w-5xl mx-auto space-y-12 mb-16">
              
              {/* 1. ویژگی‌های کلیدی */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b-2 border-purple-200 pb-2">
                  <span className="text-purple-600">✨</span> ویژگی‌های کلیدی محصول
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product72Details.highlights.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 flex items-start gap-3">
                      <span className="text-purple-500 mt-1 text-xl">💎</span>
                      <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. توضیحات کامل */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-purple-600">📖</span> توضیحات تخصصی
                </h2>
                <div className="text-gray-600 leading-8 text-justify whitespace-pre-line">
                  {product72Details.fullDescription}
                </div>
              </section>

              {/* 3. مزایای اصلی */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b-2 border-purple-200 pb-2">
                  <span className="text-purple-600">🌟</span> مزایای اصلی کرم خاویار تراست
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product72Details.benefits.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-purple-50/50 p-4 rounded-lg">
                      <div className="bg-green-100 text-green-600 rounded-full p-1 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. ترکیبات موثره */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b-2 border-purple-200 pb-2">
                  <span className="text-purple-600">🧪</span> ترکیبات موثره و فناوری‌ها
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product72Details.ingredients.map((ing, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-300">
                      <h4 className="font-bold text-purple-700 mb-2 text-lg">{ing.name}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{ing.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. مشخصات فنی و نحوه مصرف */}
              <section className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl border border-purple-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="text-purple-600">📋</span> جزئیات و مشخصات فنی
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product72Details.specs).map(([key, value]) => (
                    <div key={key} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100">
                      <h4 className="text-sm font-bold text-purple-600 mb-1">{key}</h4>
                      <p className="text-gray-800 text-sm leading-relaxed">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          )}

          {/* محصولات مرتبط */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">محصولات مرتبط</h2>
            <RelatedProducts currentProductId={productId} currentCategory={product.category} />
          </div>
        </div>
      </div>
    </>
  );
}

// کامپوننت جداگانه برای محصولات مرتبط
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
      if (data) setRelatedProducts(data);
    };
    fetchRelated();
  }, [currentCategory, currentProductId]);

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {relatedProducts.map(p => (
        <div key={p.id} onClick={() => router.push(`/product/${p.id}`)} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            {p.image && p.image.trim() !== '' ? (
              <img src={p.image.trim()} alt={p.name} className="w-full h-full object-contain p-2" />
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
