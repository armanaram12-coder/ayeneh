'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
}

interface CategoriesSectionProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export default function CategoriesSection({ 
  selectedCategory, 
  onCategorySelect 
}: CategoriesSectionProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('daste_categories')
        .select('*')
        .order('id', { ascending: true });
      
      if (data && !error) {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      onCategorySelect(null);
      router.replace(window.location.pathname, { scroll: false });
    } else {
      onCategorySelect(categoryName);
      router.replace(`/?category=${encodeURIComponent(categoryName)}`, { scroll: false });
      
      setTimeout(() => {
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  if (loading) {
    return (
      <section className="py-8 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">در حال بارگذاری دسته‌بندی‌ها...</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-8 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
          دسته‌بندی محصولات آرایشی و بهداشتی
        </h2>
        
        {/* ردیف اول - ۶ دسته اول */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-6">
          {categories.slice(0, 6).map((category) => (
            <button 
              key={category.id} 
              onClick={() => handleCategoryClick(category.name)} 
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                selectedCategory === category.name ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden transition-all duration-300 ${
                selectedCategory === category.name 
                  ? 'shadow-2xl ring-4 ring-purple-300 ring-offset-2 animate-pulse' 
                  : 'shadow-md hover:shadow-lg'
              }`}>
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-xs md:text-sm font-medium text-center max-w-[100px] transition-all duration-300 ${
                selectedCategory === category.name ? 'text-[#7C3AED] font-bold' : 'text-gray-700'
              }`}>{category.name}</span>
            </button>
          ))}
        </div>
        
        {/* ردیف دوم - ۵ دسته بعدی */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {categories.slice(6, 11).map((category) => (
            <button 
              key={category.id} 
              onClick={() => handleCategoryClick(category.name)} 
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                selectedCategory === category.name ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden transition-all duration-300 ${
                selectedCategory === category.name 
                  ? 'shadow-2xl ring-4 ring-purple-300 ring-offset-2 animate-pulse' 
                  : 'shadow-md hover:shadow-lg'
              }`}>
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-xs md:text-sm font-medium text-center max-w-[100px] transition-all duration-300 ${
                selectedCategory === category.name ? 'text-[#7C3AED] font-bold' : 'text-gray-700'
              }`}>{category.name}</span>
            </button>
          ))}
        </div>
        
        {selectedCategory && (
          <div className="text-center mt-4">
            <button 
              onClick={() => { 
                onCategorySelect(null);
                router.replace(window.location.pathname, { scroll: false }); 
              }} 
              className="text-[#7C3AED] hover:underline text-sm font-semibold"
            >
              نمایش همه دسته‌بندی‌های آرایشی بهداشتی ✕
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
