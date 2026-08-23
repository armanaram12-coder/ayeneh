'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import HeroSlider from '@/components/HeroSlider';
import FlashSale from '@/components/FlashSale';
import Header from '@/components/Header';
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
  'عطر': 'عطر و خوشبوکننده',
  'سرم': 'سرم تخصصی',
  'کرم': 'کرم تخصصی',
  'ضد آفتاب': 'ضد آفتاب',
  'شوینده': 'شوینده و پاک کننده',
  'دهان': 'دهان و دندان',
  'آرایشی': 'آرایشی',
  'شامپو': 'شامپو تخصصی',
  'ماسک': 'ماسک تخصصی',
  'کیت': 'کیت تخصصی',
  'روغن': 'روغن تخصصی'
};

function getAllProducts(): Product[] {
  const allProducts: Product[] = [];
  for (const category of productsData.categories) {
    for (const subcategory of category.subcategories) {
      for (const product of subcategory.products) {
        allProducts.push({
          id: product.id,
          name: product.name,
          price_toman: product.price_toman,
          brand: product.brand,
          gender: product.gender,
          type: product.type,
          volume_ml: 'volume_ml' in product ? product.volume_ml : undefined,
          volume_gram: 'volume_gram' in product ? product.volume_gram : undefined,
          stock: product.stock,
          category: category.name
        });
      }
    }
  }
  return allProducts;
}

function ProductCard({ 
  product, 
  onAddToCart, 
  isFavorite, 
  onToggleFavorite 
}: { 
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
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300 relative">
      <button
        onClick={() => onToggleFavorite(product.id)}
        className="absolute top-2 right-2 z-10"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-6 w-6 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <Link href={`/product/${product.id}`}>
        <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl"></span>
          )}
        </div>
      </Link>
      
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-10 text-sm">{product.name}</h3>
      <p className="text-[#7C3AED] font-bold text-lg mb-3">{formatPrice(product.price_toman)} تومان</p>
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
          isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        {isDisabled ? 'در حال پردازش...' : 'افزودن به سبد'}
      </button>
    </div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'bestseller'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const products = getAllProducts();
    setAllProducts(products);
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        const count = await getCartCount(session.user.id);
        setCartCount(count);
        const favs = await getFavorites(session.user.id);
        setFavoriteIds(favs);
      }
    };
    checkUser();
  }, []);

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
      price: product.price_toman,
    });
    
    const newCount = await getCartCount(session.user.id);
    setCartCount(newCount);
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
    if (isNowFavorite) {
      setFavoriteIds([...favoriteIds, productId]);
    } else {
      setFavoriteIds(favoriteIds.filter(id => id !== productId));
    }
  };

  const categories = Object.keys(categoryLabels);
  
  const filteredProducts = allProducts.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (activeTab === 'new') return product.id > allProducts.length - 8;
    if (activeTab === 'bestseller') return product.id <= 8;
    return true;
  });

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      
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

          {/* دسته‌بندی‌ها با عنوان زیر دایره */}
          <section className="py-8 overflow-hidden">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">دسته‌بندی محصولات</h2>
              
              {/* ردیف اول */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-6">
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`flex flex-col items-center gap-2 transition-transform hover:scale-105 ${
                      selectedCategory === cat ? 'scale-110' : ''
                    }`}
                  >
                    <div className={`w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#E879F9] flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow`}>
                      <span className="text-2xl md:text-3xl">
                        {cat === 'عطر' ? '' : cat === 'سرم' ? '💧' : cat === 'کرم' ? '🧴' : cat === 'ضد آفتاب' ? '☀️' : cat === 'شوینده' ? '🧼' : '📦'}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-gray-700 font-medium text-center max-w-[100px]">
                      {categoryLabels[cat]}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* ردیف دوم */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {categories.slice(6, 11).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`flex flex-col items-center gap-2 transition-transform hover:scale-105 ${
                      selectedCategory === cat ? 'scale-110' : ''
                    }`}
                  >
                    <div className={`w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#E879F9] flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow`}>
                      <span className="text-2xl md:text-3xl">
                        {cat === 'آرایشی' ? '💄' : cat === 'شامپو' ? '' : cat === 'ماسک' ? '🎭' : cat === 'کیت' ? '🧰' : ''}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-gray-700 font-medium text-center max-w-[100px]">
                      {categoryLabels[cat]}
                    </span>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-[#7C3AED] hover:underline text-sm"
                  >
                    نمایش همه دسته‌بندی‌ها ✕
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* محصولات با تب‌ها */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">محصولات</h2>
              
              <div className="flex justify-center gap-3 md:gap-4 mb-8 flex-wrap">
                <button
                  onClick={() => { setActiveTab('all'); setSelectedCategory(null); }}
                  className={`px-5 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'all' && !selectedCategory
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-lg shadow-purple-300' 
                      : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] border border-gray-200'
                  }`}
                >
                  همه محصولات
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`px-5 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'new' 
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-lg shadow-purple-300' 
                      : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] border border-gray-200'
                  }`}
                >
                  جدیدترین
                </button>
                <button
                  onClick={() => setActiveTab('bestseller')}
                  className={`px-5 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'bestseller' 
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-lg shadow-purple-300' 
                      : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED] border border-gray-200'
                  }`}
                >
                  پرفروش‌ترین
                </button>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">محصولی در این دسته‌بندی وجود ندارد</p>
                </div>
              ) : (
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
              )}
            </div>
          </section>
        </main>
      )}
    </>
  );
}
