'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import HeroSlider from '@/components/HeroSlider';
import FlashSale from '@/components/FlashSale';
import Header from '@/components/Header';
import FloatingContact from '@/components/FloatingContact';
import { supabase } from '@/lib/supabase';
import { addToCart, getCartCount } from '@/lib/cart';
import { toggleFavorite, getFavorites } from '@/lib/favorites';
import productsData from '@/data/products.json';
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

const categoryLabels: Record<string, string> = {
  'عطر': 'عطر و خوشبوکننده', 'سرم': 'سرم تخصصی', 'کرم': 'کرم تخصصی',
  'ضد آفتاب': 'ضد آفتاب', 'شوینده': 'شوینده و پاک کننده', 'دهان': 'دهان و دندان',
  'آرایشی': 'آرایشی', 'شامپو': 'شامپو تخصصی', 'ماسک': 'ماسک تخصصی',
  'کیت': 'کیت تخصصی', 'روغن': 'روغن تخصصی'
};

function getAllProducts(): Product[] {
  const allProducts: Product[] = [];
  const data = productsData as any;
  for (const category of data.categories || []) {
    for (const subcategory of category.subcategories || []) {
      for (const product of subcategory.products || []) {
        allProducts.push({ 
          id: product.id, 
          name: product.name, 
          price_toman: product.price_toman, 
          brand: product.brand, 
          gender: product.gender, 
          type: product.type, 
          volume_ml: product.volume_ml, 
          volume_gram: product.volume_gram, 
          stock: product.stock, 
          category: category.name 
        });
      }
    }
  }
  return allProducts;
}

function ProductCard({ product, onAddToCart, isFavorite, onToggleFavorite }: { product: Product; onAddToCart: (product: Product) => void; isFavorite: boolean; onToggleFavorite: (productId: number) => void }) {
  const formatPrice = (price: number) => price.toLocaleString('fa-IR');
  const [isDisabled, setIsDisabled] = useState(false);
  
  const handleAddToCart = () => {
    setIsDisabled(true);
    onAddToCart(product);
    setTimeout(() => setIsDisabled(false), 1000);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300 relative flex flex-col">
      <button onClick={() => onToggleFavorite(product.id)} className="absolute top-2 right-2 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <Link href={`/product/${product.id}`}>
        <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden cursor-pointer">
          {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : <span className="text-4xl">🧴</span>}
        </div>
      </Link>
      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 h-10 text-sm">{product.name}</h3>
      
      {(product.volume_ml || product.volume_gram) && (
        <p className="text-sm font-bold text-gray-700 mb-2">
          {product.volume_ml ? `${product.volume_ml} میلی‌لیتر` : `${product.volume_gram} گرم`}
        </p>
      )}
      
      <p className="text-[#7C3AED] font-bold text-lg mb-3 mt-auto">{formatPrice(product.price_toman)} تومان</p>
      <button onClick={handleAddToCart} disabled={isDisabled} className={`w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}>
        {isDisabled ? 'در حال پردازش...' : 'افزودن به سبد'}
      </button>
    </div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'bestseller'>('bestseller');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const hasSeen = typeof window !== 'undefined' ? sessionStorage.getItem('hasSeenSplash') : null;
    if (hasSeen === 'true') setShowSplash(false);

    setAllProducts(getAllProducts());
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCartCount(await getCartCount(session.user.id));
        setFavoriteIds(await getFavorites(session.user.id));
      }
    };
    checkUser();
  }, []);

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
    await addToCart(session.user.id, { id: product.id, name: product.name, price: product.price_toman });
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

  const categories = Object.keys(categoryLabels);
  
  // ✅ فیلتر کاملاً اصلاح‌شده
  const filteredProducts = allProducts.filter(product => {
    // اگر دسته‌بندی انتخاب شده
    if (selectedCategory) {
      const productCategory = product.category || '';
      // مقایسه مستقیم و ساده
      return productCategory === selectedCategory;
    }
    
    // اگر دسته‌بندی انتخاب نشده، بر اساس تب فیلتر کن
    if (activeTab === 'new') {
      return product.id > allProducts.length - 8;
    }
    if (activeTab === 'bestseller') {
      return product.id <= 8;
    }
    
    // حالت 'all'
    return true;
  });

  const handleCategoryClick = (cat: string) => {
    if (selectedCategory === cat) {
      // اگر همان دسته انتخاب شده بود، لغو کن
      setSelectedCategory(null);
    } else {
      // دسته جدید را انتخاب کن
      setSelectedCategory(cat);
    }
    // تب را ریست کن
    setActiveTab('all');
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {showToast && <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">✅ به سبد خرید اضافه شد</div>}
      
      {!showSplash && (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100" dir="rtl">
          <Header />
          <HeroSlider />
          <FlashSale />
          
          <section className="py-8 overflow-hidden">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">دسته‌بندی محصولات</h2>
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-6">
                {categories.slice(0, 6).map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => handleCategoryClick(cat)}
                    className={`flex flex-col items-center gap-2 transition-transform hover:scale-105 ${selectedCategory === cat ? 'scale-110' : ''}`}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#E879F9] flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow">
                      <span className="text-2xl md:text-3xl">{cat === 'عطر' ? '🌸' : cat === 'سرم' ? '💧' : cat === 'کرم' ? '🧴' : cat === 'ضد آفتاب' ? '☀️' : cat === 'شوینده' ? '' : '📦'}</span>
                    </div>
                    <span className="text-xs md:text-sm text-gray-700 font-medium text-center max-w-[100px]">{categoryLabels[cat]}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {categories.slice(6, 11).map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => handleCategoryClick(cat)}
                    className={`flex flex-col items-center gap-2 transition-transform hover:scale-105 ${selectedCategory === cat ? 'scale-110' : ''}`}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#E879F9] flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow">
                      <span className="text-2xl md:text-3xl">{cat === 'آرایشی' ? '💄' : cat === 'شامپو' ? '🧴' : cat === 'ماسک' ? '🎭' : cat === 'کیت' ? '🧰' : ''}</span>
                    </div>
                    <span className="text-xs md:text-sm text-gray-700 font-medium text-center max-w-[100px]">{categoryLabels[cat]}</span>
                  </button>
                ))}
              </div>
              
              {selectedCategory && (
                <div className="text-center mt-4">
                  <button 
                    onClick={() => {
                      setSelectedCategory(null);
                      setActiveTab('all');
                    }} 
                    className="text-[#7C3AED] hover:underline text-sm font-semibold"
                  >
                    نمایش همه دسته‌بندی‌ها ✕
                  </button>
                </div>
              )}
            </div>
          </section>

          <section id="products-section" className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">محصولات</h2>
              <div className="flex justify-center gap-3 md:gap-4 mb-8 flex-wrap">
                <button 
                  onClick={() => { setActiveTab('all'); setSelectedCategory(null); }} 
                  className={`px-5 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === 'all' && !selectedCategory ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-lg shadow-purple-300' : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] border border-gray-200'}`}
                >
                  همه محصولات
                </button>
                <button 
                  onClick={() => { setActiveTab('new'); setSelectedCategory(null); }} 
                  className={`px-5 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === 'new' && !selectedCategory ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-lg shadow-purple-300' : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] border border-gray-200'}`}
                >
                  جدیدترین
                </button>
                <button 
                  onClick={() => { setActiveTab('bestseller'); setSelectedCategory(null); }} 
                  className={`px-5 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === 'bestseller' && !selectedCategory ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-lg shadow-purple-300' : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] border border-gray-200'}`}
                >
                  پرفروش‌ترین
                </button>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">محصولی در این دسته‌بندی وجود ندارد</p>
                  <p className="text-sm text-gray-500 mt-2">
                    (دسته انتخابی: {selectedCategory || 'هیچ'})
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-center text-sm text-gray-600 mb-4">
                    تعداد محصولات نمایش داده شده: {filteredProducts.length}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isFavorite={favoriteIds.includes(product.id)} onToggleFavorite={handleToggleFavorite} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">چرا فروشگاه آینه را انتخاب کنید؟</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">تفاوت ما در تعهد به کیفیت و مشاوره دلسوزانه است</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🛡️', title: 'ضمانت ۱۰۰٪ اصالت کالا', desc: 'تمامی محصولات تراست و سایر برندها با ضمانت‌نامه معتبر و کد اصالت عرضه می‌شوند.' },
                  { icon: '👨‍⚕️', title: 'مشاوره تخصصی رایگان', desc: 'تیم ما (با مدیریت آرمان آرام) قبل از خرید، بهترین روتین را متناسب با نوع پوست شما پیشنهاد می‌دهد.' },
                  { icon: '', title: 'ارسال سریع و ایمن', desc: 'سفارشات شما در بسته‌بندی مقاوم و در کوتاه‌ترین زمان ممکن به سراسر ایران ارسال می‌شود.' },
                  { icon: '💎', title: 'قیمت منصفانه و رقابتی', desc: 'حذف واسطه‌ها به ما این امکان را می‌دهد تا بهترین قیمت را برای محصولات اورجینال ارائه دهیم.' }
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

          <section className="py-16 bg-gradient-to-br from-purple-900 to-indigo-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <span className="inline-block bg-purple-700/50 text-purple-200 px-4 py-1 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
                    نمایندگی فروش برند Trust
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                    راز درخشش پوست شما، <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">در روتین مراقبتی تراست است</span>
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-6 text-justify">
                    محصولات تراست (Trust) با فرمولاسیون پیشرفته و مواد اولیه باکیفیت، نیازهای مختلف پوستی از جمله آبرسانی، ضدچروک، روشن‌کنندگی و محافظت در برابر آفتاب را پوشش می‌دهند. ما در فروشگاه آینه، نه تنها فروشنده، بلکه مشاور شما برای انتخاب ترکیب صحیح سرم‌ها، کرم‌ها و شوینده‌های تراست هستیم.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a href="#products-section" className="bg-white text-purple-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg">
                      مشاهده محصولات تراست
                    </a>
                    <a href="https://wa.me/989352225693" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-500 transition-colors shadow-lg flex items-center gap-2">
                      <span>💬</span> درخواست مشاوره رایگان
                    </a>
                  </div>
                </div>
                
                <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                  {[
                    { icon: '💧', title: 'سرم‌های تخصصی', desc: 'آبرسانی عمیق و جوانسازی با تکنولوژی روز' },
                    { icon: '☀️', title: 'محافظت از پوست', desc: 'ضدآفتاب‌های رنگی و بی‌رنگ با بافت سبک' },
                    { icon: '🧴', title: 'پاک‌کننده‌ها', desc: 'شوینده‌های ملایم بدون ایجاد خشکی و حساسیت' },
                    { icon: '', title: 'عطر و خوشبوکننده', desc: 'رایحه‌های ماندگار و منحصر به فرد' }
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
        </main>
      )}
    </>
  );
}
