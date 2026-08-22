'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import HeroSlider from '@/components/HeroSlider';
import FlashSale from '@/components/FlashSale';
import Header from '@/components/Header';
import productsData from '@/data/products.json';

// Helper function to convert English digits to Persian
function toPersianDigits(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

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
}

// Extract all products from JSON
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
        });
      }
    }
  }
  return allProducts;
}

// Get unique categories
function getCategories() {
  return productsData.categories.map(cat => ({ id: cat.id, name: cat.name }));
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const formatPrice = (price: number) => price.toLocaleString('fa-IR');
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
        <span className="text-4xl">🧴</span>
      </div>
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-10 text-sm">{product.name}</h3>
      <p className="text-[#7C3AED] font-bold text-lg mb-3">{formatPrice(product.price_toman)} تومان</p>
      <button
        onClick={() => alert('به سبد اضافه شد')}
        className="w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 text-sm"
      >
        افزودن به سبد
      </button>
    </div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'bestseller'>('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    setAllProducts(getAllProducts());
    setCategories(getCategories());
  }, []);

  // Filter products based on tab
  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'new':
        return allProducts.slice(0, 8);
      case 'bestseller':
        return allProducts.slice(0, 8);
      default:
        return allProducts.slice(0, 12);
    }
  };

  const filteredProducts = getFilteredProducts();
  const bestSellers = allProducts.slice(0, 8);
  const newArrivals = allProducts.slice(0, 4);

  // Blog articles placeholder
  const blogArticles = [
    { id: 1, title: 'راهنمای انتخاب عطر مناسب', image: '📝', excerpt: 'چگونه عطری مناسب با سلیقه و شخصیت خود انتخاب کنیم...' },
    { id: 2, title: 'روتین مراقبت پوست روزانه', image: '✨', excerpt: 'مراحل کامل مراقبت از پوست برای داشتن پوستی شاداب...' },
    { id: 3, title: 'تفاوت سرم و کرم مرطوب کننده', image: '💧', excerpt: 'بررسی تفاوت‌های کلیدی بین سرم‌ها و کرم‌های پوست...' },
  ];

  // Testimonials
  const testimonials = [
    { id: 1, name: 'مریم احمدی', text: 'محصولات تراست واقعاً عالی هستند. کیفیت فوق‌العاده!', rating: 5 },
    { id: 2, name: 'علی رضایی', text: 'عطر Eliot بهترین خرید من بود. رایحه‌ای بی‌نظیر!', rating: 5 },
    { id: 3, name: 'سارا محمدی', text: 'سرم هیالورونیک اسید معجزه کرد. پوستم خیلی آبرسانی شده.', rating: 5 },
  ];

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {!showSplash && (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100" dir="rtl">
          <Header />
          <HeroSlider />
          <FlashSale />

          {/* Quick Categories Section */}
          <section className="py-8 overflow-hidden">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">دسته‌بندی محصولات</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => console.log('Category clicked:', cat.name)}
                    className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#E879F9] flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    {cat.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Product Grid with Tabs */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">محصولات</h2>
              
              {/* Tabs */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === 'all' 
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  همه محصولات
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === 'new' 
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  جدیدترین
                </button>
                <button
                  onClick={() => setActiveTab('bestseller')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === 'bestseller' 
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  پرفروش‌ترین
                </button>
              </div>

              {/* Product Grid - 2 cols mobile, 4 cols desktop */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* Best Sellers Horizontal Slider */}
          <section className="py-8 overflow-hidden">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">پرفروش‌ترین محصولات</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {bestSellers.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-48 md:w-56">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* New Arrivals Grid */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">جدیدترین محصولات</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* Beauty Blog Section */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">مجله زیبایی</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-40 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                      <span className="text-6xl">{article.image}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                      <button className="text-[#7C3AED] font-semibold text-sm hover:underline">
                        ادامه مطلب ←
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Slider */}
          <section className="py-8 bg-white/50">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">نظرات مشتریان</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">{testimonial.text}</p>
                    <p className="font-semibold text-[#7C3AED]">— {testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
