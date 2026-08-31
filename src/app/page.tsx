'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';
import HeroSlider from '@/components/HeroSlider';
import FlashSale from '@/components/FlashSale';
import Header from '@/components/Header';
import FloatingContact from '@/components/FloatingContact';
import AIConsultant from '@/components/AIConsultant';
import MagazineSection from '@/components/MagazineSection';
import CategoriesSection from '@/components/CategoriesSection'; // ✅ اضافه شد
import { supabase } from '@/lib/supabase';
import { addToCart, getCartCount } from '@/lib/cart';
import { toggleFavorite, getFavorites } from '@/lib/favorites';
import Link from 'next/link';

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
  category?: string;
}

function ProductCard({ product, onAddToCart, isFavorite, onToggleFavorite }: { 
  product: Product; 
  onAddToCart: (product: Product) => void; 
  isFavorite: boolean; 
  onToggleFavorite: (productId: number) => void; 
}) {
  const formatPrice = (price: number) => price.toLocaleString('fa-IR');
  const [isDisabled, setIsDisabled] = useState(false);
  
  const handleAddToCart = () => { 
    setIsDisabled(true); 
    onAddToCart(product); 
    setTimeout(() => setIsDisabled(false), 1000); 
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300 relative flex flex-col group">
      <button onClick={() => onToggleFavorite(product.id)} className="absolute top-2 right-2 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <Link href={`/product/${product.id}`} className="block">
        <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden cursor-pointer">
          {product.image && product.image.trim() !== '' ? (
            <img 
              src={product.image.trim()} 
              alt={`خرید ${product.name} برند ${product.brand || 'تراست'}`} 
              className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <span className="text-4xl transition-transform duration-500 group-hover:scale-110"></span>
          )}
        </div>
      </Link>
      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 h-10 text-sm">{product.name}</h3>
      {(product.volume_ml || product.volume_gram) && (
        <p className="text-sm font-bold text-gray-700 mb-2">
          {product.volume_ml ? `${product.volume_ml} میلی‌لیتر` : `${product.volume_gram} گرم`}
        </p>
      )}
      <p className="text-[#7C3AED] font-bold text-lg mb-3 mt-auto">{formatPrice(product.price_toman)} تومان</p>
      <button 
        onClick={handleAddToCart} 
        disabled={isDisabled} 
        className={`w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
          isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        {isDisabled ? 'در حال پردازش...' : 'افزودن به سبد خرید'}
      </button>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'bestseller'>('bestseller');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useEffect(() => {
    const hasSeen = typeof window !== 'undefined' ? sessionStorage.getItem('hasSeenSplash') : null;
    if (hasSeen === 'true') setShowSplash(false);
    
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
      
      if (data && !error) {
        setAllProducts(data);
      }
      setLoading(false);
    };
    
    fetchProducts();
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { 
        setCartCount(await getCartCount(session.user.id)); 
        setFavoriteIds(await getFavorites(session.user.id)); 
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (loading || typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    const categoryFromUrl = params.get('category');
    
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setActiveTab('all');
      
      setTimeout(() => {
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [loading]);

  const handleSplashFinish = () => { 
    if (typeof window !== 'undefined') sessionStorage.setItem('hasSeenSplash', 'true'); 
    setShowSplash(false); 
  };
  
  const handleAddToCart = async (product: Product) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { 
      alert('برای افزودن محصول به سبد خرید، لطفاً ابتدا وارد حساب کاربری خود شوید.'); 
      window.dispatchEvent(new Event('openAuthModal')); 
      return; 
    }
    await addToCart(session.user.id, { 
      id: product.id, 
      name: product.name, 
      price: product.price_toman 
    });
    window.dispatchEvent(new Event('cartUpdated'));
    setCartCount(await getCartCount(session.user.id));
    setShowToast(true); 
    setTimeout(() => setShowToast(false), 2000);
  };
  
  const handleToggleFavorite = async (productId: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { 
      alert('برای افزودن به علاقه‌مندی‌ها، لطفاً ابتدا وارد شوید.'); 
      window.dispatchEvent(new Event('openAuthModal')); 
      return; 
    }
    const isNowFavorite = await toggleFavorite(session.user.id, productId);
    setFavoriteIds(isNowFavorite ? [...favoriteIds, productId] : favoriteIds.filter(id => id !== productId));
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      alert('لطفاً ایمیل خود را وارد کنید');
      return;
    }
    alert(`✅ ایمیل ${newsletterEmail} با موفقیت در خبرنامه ثبت شد!\nبه زودی از جدیدترین محصولات تراست و تخفیف‌ها باخبر خواهید شد.`);
    setNewsletterEmail('');
    setNewsletterSuccess(true);
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const filteredProducts = allProducts.filter(product => {
    if (selectedCategory) return product.category === selectedCategory;
    if (activeTab === 'new') return product.id > allProducts.length - 8;
    if (activeTab === 'bestseller') return product.id <= 8;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-purple-600 text-xl">در حال بارگذاری محصولات...</div>
      </div>
    );
  }

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          ✅ به سبد خرید اضافه شد
        </div>
      )}
      
      {!showSplash && (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100" dir="rtl">
          <Header />
          <HeroSlider />
          <FlashSale />
          
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-[#7C3AED] mb-2">+۱۰۰</div>
                  <div className="text-gray-600 text-sm md:text-base">مشتری راضی</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-[#7C3AED] mb-2">+۱۹۰</div>
                  <div className="text-gray-600 text-sm md:text-base">محصول آرایشی بهداشتی</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-[#7C3AED] mb-2">+۵</div>
                  <div className="text-gray-600 text-sm md:text-base">برند معتبر</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-[#7C3AED] mb-2">۲۴/۷</div>
                  <div className="text-gray-600 text-sm md:text-base">مشاوره تخصصی</div>
                </div>
              </div>
            </div>
          </section>
          
          {/* ✅ بخش محصول ویژه هفته - طراحی لوکس و ایمن */}
          <section className="relative py-16 overflow-hidden" dir="rtl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-purple-100" />
            <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-md animate-pulse" />
                    <div className="relative bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-white px-8 py-2 rounded-full font-extrabold text-lg shadow-lg flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      <span>محصول ویژه هفته</span>
                      <span className="text-2xl">⭐</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent mb-3">
                  {allProducts[41]?.name || 'سرم جوانساز، لیفت و ضدچروک تراست اسمارت'}
                </h2>
                <p className="text-gray-600 text-lg">این هفته با <span className="text-red-500 font-bold">۲۰٪ تخفیف ویژه</span> 🎁</p>
              </div>

              <div className="max-w-5xl mx-auto">
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />
                  
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 p-8 flex items-center justify-center min-h-[350px]">
                      <div className="absolute top-6 right-6 z-20">
                        <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-xl">
                          <div className="text-2xl font-extrabold leading-none">٪۲۰</div>
                          <div className="text-xs mt-1">تخفیف</div>
                        </div>
                      </div>
                      
                      {allProducts[41]?.image && allProducts[41].image.trim() !== '' ? (
                        <img 
                          src={allProducts[41].image.trim()} 
                          alt="محصول ویژه" 
                          className="relative z-10 w-full h-full max-h-72 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <span className="relative z-10 text-8xl">🧴</span>
                      )}
                    </div>

                    <div className="p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">
                          این سرم تخصصی با فرمولاسیون پیشرفته، به جوانسازی، لیفتینگ و کاهش چروک‌های پوست شما کمک می‌کند. حاوی مواد مؤثره قوی برای نتایج قابل مشاهده.
                        </p>
                      </div>

                      <div>
                        <div className="mb-6">
                          <div className="mb-2">
                            <span className="relative inline-block text-gray-400 text-base font-bold">
                              ۱,۸۴۹,۰۰۰ تومان
                              <span className="absolute left-0 right-0 top-1/2 h-[2px] bg-red-500 transform -translate-y-1/2"></span>
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              ۱,۴۷۹,۰۰
                            </span>
                            <span className="text-gray-700 text-lg font-bold">تومان</span>
                          </div>
                          <div className="mt-2 inline-block bg-green-50 border border-green-200 px-3 py-1 rounded-lg">
                            <span className="text-green-700 text-sm font-bold">۳۷۰,۰۰۰ تومان سود شما</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-3.5 rounded-xl font-extrabold text-base hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                            <span>🛒</span>
                            <span>افزودن به سبد خرید</span>
                          </button>
                          <Link href={`/product/${allProducts[41]?.id || 42}`} className="px-6 py-3.5 border-2 border-purple-600 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors text-center flex items-center justify-center">
                            جزئیات
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ✅ کامپوننت دسته‌بندی‌ها - جدا شده */}
          <CategoriesSection 
            selectedCategory={selectedCategory}
            onCategorySelect={(cat) => {
              setSelectedCategory(cat);
              setActiveTab('all');
            }}
          />

          <section id="products-section" className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
                {selectedCategory ? `محصولات دسته‌بندی: ${selectedCategory}` : 'جدیدترین محصولات تراست و برندهای معتبر'}
              </h2>
              <div className="flex justify-center gap-3 md:gap-4 mb-8 flex-wrap">
                <button onClick={() => { setActiveTab('all'); setSelectedCategory(null); router.replace(window.location.pathname, { scroll: false }); }} className={`px-5 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'all' && !selectedCategory 
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-lg shadow-purple-300' 
                    : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] border border-gray-200'
                }`}>همه محصولات</button>
                <button onClick={() => { setActiveTab('new'); setSelectedCategory(null); router.replace(window.location.pathname, { scroll: false }); }} className={`px-5 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'new' && !selectedCategory 
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-lg shadow-purple-300' 
                    : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] border border-gray-200'
                }`}>جدیدترین‌ها</button>
                <button onClick={() => { setActiveTab('bestseller'); setSelectedCategory(null); router.replace(window.location.pathname, { scroll: false }); }} className={`px-5 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'bestseller' && !selectedCategory 
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-lg shadow-purple-300' 
                    : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] border border-gray-200'
                }`}>پرفروش‌ترین‌های تراست</button>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12"><p className="text-gray-600 text-lg">محصولی در این دسته‌بندی وجود ندارد</p></div>
              ) : (
                <div>
                  <p className="text-center text-sm text-gray-600 mb-4">تعداد محصولات نمایش داده شده: {filteredProducts.length}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={handleAddToCart} 
                        isFavorite={favoriteIds.includes(product.id)} 
                        onToggleFavorite={handleToggleFavorite} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">چرا فروشگاه آینه بهترین مرجع خرید محصولات آرایشی بهداشتی و تراست است؟</h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-center mb-12">تفاوت ما در تعهد به اصالت کالا و ارائه مشاوره تخصصی رایگان برای تدوین روتین پوست و مو متناسب با نیاز شماست.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🛡️', title: 'ضمانت ۱۰۰٪ اصالت محصولات تراست', desc: 'تمامی کرم‌ها، سرم‌ها و لوازم آرایشی بهداشتی با ضمانت‌نامه معتبر و کد اصالت عرضه می‌شوند.' },
                  { icon: '👨‍️', title: 'مشاوره رایگان روتین پوست و مو', desc: 'تیم ما (با مدیریت آرمان آرام) قبل از خرید، بهترین ترکیب محصولات Trust را متناسب با نوع پوست شما پیشنهاد می‌دهد.' },
                  { icon: '', title: 'ارسال سریع و ایمن به سراسر ایران', desc: 'سفارشات لوازم آرایشی شما در بسته‌بندی مقاوم و در کوتاه‌ترین زمان ممکن ارسال می‌شود.' },
                  { icon: '💎', title: 'قیمت منصفانه و رقابتی', desc: 'حذف واسطه‌ها به ما این امکان را می‌دهد تا بهترین قیمت را برای محصولات اورجینال آرایشی ارائه دهیم.' }
                ].map((item, index) => (
                  <div key={index} className="bg-purple-50/50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-purple-100">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ✅ کامپوننت مجله آینه */}
          <MagazineSection />

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">برندهای معتبر همکار با فروشگاه آینه</h2>
              <p className="text-gray-600 text-center mb-12">ما فقط با برندهای معتبر و دارای مجوز همکاری می‌کنیم</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                {['Trust', 'Serje', 'LifeGuard', 'Aura', 'Smart', 'Professional'].map((brand, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-6 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
                    <span className="text-xl font-bold text-gray-700">{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">نظرات مشتریان فروشگاه آینه</h2>
              <p className="text-purple-200 text-center mb-12">مشتریان ما بهترین گواه کیفیت محصولات و خدمات ما هستند</p>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: 'سارا م.', text: 'محصولات تراست واقعاً عالی هستند. مشاوره رایگان آینه هم خیلی کمکم کرد تا روتین مناسب پوستم رو پیدا کنم.', rating: 5 },
                  { name: 'محمد ر.', text: 'سرعت ارسال عالی بود و محصولات کاملاً اصل بودند. حتماً دوباره خرید می‌کنم.', rating: 5 },
                  { name: 'نیلوفر ک.', text: 'بهترین فروشگاه برای خرید لوازم آرایشی بهداشتی. قیمت‌ها منصفانه و کیفیت عالی.', rating: 5 }
                ].map((review, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <p className="text-gray-200 mb-4 leading-relaxed">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <span className="font-bold">{review.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-8 bg-gradient-to-br from-green-50 to-teal-50">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <img 
                  src="https://uvwydvasorygloptlrhm.supabase.co/storage/v1/object/public/banners/mobile-app-banner.webp" 
                  alt="اپلیکیشن موبایل آینه - به زودی"
                  className="w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </div>
            </div>
          </section>

          <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">عضویت در خبرنامه آینه</h2>
                <p className="text-purple-100 mb-8">از جدیدترین محصولات تراست، تخفیف‌های ویژه و مقالات آموزشی باخبر شوید</p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                  <div className="flex-1 relative">
                    <input 
                      type="email" 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="ایمیل خود را وارد کنید..." 
                      className="w-full px-6 py-4 rounded-xl text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-purple-200 focus:outline-none focus:border-white focus:ring-4 focus:ring-purple-300 transition-all"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button type="submit" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg">
                    عضویت در خبرنامه
                  </button>
                </form>
                {newsletterSuccess && (
                  <p className="text-green-300 mt-4 text-sm">✅ با موفقیت ثبت شد! به زودی ایمیل‌های ما را دریافت خواهید کرد.</p>
                )}
                <p className="text-xs text-purple-200 mt-4">با عضویت، موافقت خود را با دریافت ایمیل‌های تبلیغاتی اعلام می‌کنید.</p>
              </div>
            </div>
          </section>

          <section className="py-16 bg-gradient-to-br from-purple-900 to-indigo-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <span className="inline-block bg-purple-700/50 text-purple-200 px-4 py-1 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">نمایندگی رسمی فروش برند Trust</span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">راز درخشش پوست شما، در روتین مراقبتی تخصصی تراست است</h2>
                  <p className="text-gray-300 leading-relaxed mb-6 text-justify">
                    محصولات آرایشی و بهداشتی تراست (Trust) با فرمولاسیون پیشرفته، نیازهای مختلف پوستی از جمله آبرسانی، ضدچروک، روشن‌کنندگی و محافظت در برابر آفتاب را پوشش می‌دهند. ما در فروشگاه اینترنتی آینه، نه تنها فروشنده، بلکه مشاور شما برای انتخاب صحیح سرم، کرم و شوینده تراست هستیم تا بیشترین بازدهی را برای روتین پوست و موی خود تجربه کنید.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a href="#products-section" className="bg-white text-purple-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg">مشاهده و خرید محصولات تراست</a>
                    <a href="https://wa.me/989352225693" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-500 transition-colors shadow-lg flex items-center gap-2">
                      <span>💬</span> درخواست مشاوره رایگان پوست و مو
                    </a>
                  </div>
                </div>
                <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                  {[
                    { icon: '', title: 'سرم‌های تخصصی تراست', desc: 'آبرسانی عمیق و جوانسازی با تکنولوژی روز' },
                    { icon: '☀️', title: 'کرم ضد آفتاب Trust', desc: 'محافظت کامل با بافت سبک و فاقد چربی' },
                    { icon: '🧴', title: 'شوینده‌های ملایم', desc: 'پاک‌کنندگی عمیق بدون ایجاد خشکی و حساسیت' },
                    { icon: '', title: 'عطر و بادی اسپلش', desc: 'رایحه‌های ماندگار و منحصر به فرد برای آقایان و بانوان' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center h-full flex flex-col justify-center items-center">
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <h4 className="font-bold mb-2">{item.title}</h4>
                      <p className="text-xs text-gray-300">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <FloatingContact />
          <AIConsultant />
        </main>
      )}
    </>
  );
}
