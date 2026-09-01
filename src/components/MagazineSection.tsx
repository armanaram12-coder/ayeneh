'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function MagazineSection() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('title, slug, summary, category, image_url, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data && !error) {
        setArticles(data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {/* ✅ تغییر نام مجله */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">مجله چهره آپ - راهنمای تخصصی مراقبت از پوست و مو</h2>
            <p className="text-gray-600">جدیدترین مقالات آموزشی، معرفی محصولات تراست و نکات زیبایی</p>
          </div>
          
          {/* حالت لودینگ */}
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse border border-purple-100">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* ✅ تغییر نام مجله */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">مجله چهره آپ - راهنمای تخصصی مراقبت از پوست و مو</h2>
          <p className="text-gray-600">جدیدترین مقالات آموزشی، معرفی محصولات تراست و نکات زیبایی</p>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-purple-100">
            <p className="text-gray-500 text-lg">به زودی مقالات جدید منتشر می‌شوند...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link 
                  key={article.slug} 
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100"
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <span className="absolute top-3 right-3 z-10 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                      {article.category}
                    </span>
                    <img 
                      src={article.image_url || 'https://via.placeholder.com/500x300?text=Magazine'} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                    <div className="flex items-center text-[#7C3AED] font-bold text-sm group-hover:gap-2 transition-all">
                      <span>ادامه مطلب</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-10">
              {/* ✅ تغییر نام دکمه مشاهده همه مقالات */}
              <Link href="/blog" className="inline-block bg-white border-2 border-[#7C3AED] text-[#7C3AED] px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-sm hover:shadow-md">
                مشاهده همه مقالات مجله چهره آپ ←
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function MagazineSection() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('title, slug, summary, category, image_url, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data && !error) {
        setArticles(data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">مجله آینه - راهنمای تخصصی مراقبت از پوست و مو</h2>
            <p className="text-gray-600">جدیدترین مقالات آموزشی، معرفی محصولات تراست و نکات زیبایی</p>
          </div>
          
          {/* حالت لودینگ */}
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse border border-purple-100">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">مجله آینه - راهنمای تخصصی مراقبت از پوست و مو</h2>
          <p className="text-gray-600">جدیدترین مقالات آموزشی، معرفی محصولات تراست و نکات زیبایی</p>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-purple-100">
            <p className="text-gray-500 text-lg">به زودی مقالات جدید منتشر می‌شوند...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link 
                  key={article.slug} 
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100"
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <span className="absolute top-3 right-3 z-10 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                      {article.category}
                    </span>
                    <img 
                      src={article.image_url || 'https://via.placeholder.com/500x300?text=Magazine'} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                    <div className="flex items-center text-[#7C3AED] font-bold text-sm group-hover:gap-2 transition-all">
                      <span>ادامه مطلب</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link href="/blog" className="inline-block bg-white border-2 border-[#7C3AED] text-[#7C3AED] px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-sm hover:shadow-md">
                مشاهده همه مقالات مجله آینه ←
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
