import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

// ✅ تابع انتخاب تصویر بر اساس دسته‌بندی
const getCategoryImage = (category: string, title: string) => {
  // اولویت با تصویر خود مقاله است
  // اگر نبود، بر اساس دسته‌بندی تصویر پیشنهاد می‌دهیم
  
  const defaultImages: Record<string, string> = {
    'مراقبت پوست': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80',
    'آموزشی': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80',
    'عطر و ادکلن': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80',
    'مراقبت مو': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
    'معرفی برند': 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1200&q=80'
  };
  
  return defaultImages[category] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80';
};

// ✅ تابع انتخاب آیکون بر اساس دسته‌بندی
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'مراقبت پوست': '🧴',
    'آموزشی': '',
    'عطر و ادکلن': '🌸',
    'مراقبت مو': '',
    'معرفی برند': '✨'
  };
  return icons[category] || '📝';
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data: article } = await supabase
    .from('articles')
    .select('title, summary')
    .eq('slug', slug)
    .single();

  if (!article) return { title: 'مقاله یافت نشد' };

  return {
    title: `${article.title} | مجله آینه`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !article) {
    console.error('Error fetching article:', error);
    notFound();
  }

  const categoryIcon = getCategoryIcon(article.category);
  const categoryImage = getCategoryImage(article.category, article.title);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50" dir="rtl">
        {/* Breadcrumb با طراحی زیبا */}
        <div className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex text-sm text-gray-600">
              <Link href="/" className="hover:text-purple-600 transition-colors flex items-center gap-1">
                <span>🏠</span> خانه
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/blog" className="hover:text-purple-600 transition-colors">مجله آینه</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-purple-700 font-medium truncate max-w-xs">{article.title}</span>
            </nav>
          </div>
        </div>

        <article className="container mx-auto px-4 py-8 max-w-5xl">
          {/* تصویر شاخص بزرگ و حرفه‌ای */}
          <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            {article.image_url ? (
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-64 md:h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <img 
                src={categoryImage} 
                alt={article.title}
                className="w-full h-64 md:h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
              />
            )}
            
            {/* بج دسته‌بندی */}
            <div className="absolute top-6 right-6 z-20">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl">
                <span className="text-2xl">{categoryIcon}</span>
                {article.category}
              </span>
            </div>
          </div>

          {/* هدر مقاله با طراحی لوکس */}
          <header className="mb-10 bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl border border-purple-100">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 text-gray-600 text-sm border-t border-purple-100 pt-6">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                  <span>📅</span>
                  <span className="font-medium">{new Date(article.created_at).toLocaleDateString('fa-IR')}</span>
                </span>
                <span className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full">
                  <span>⏱️</span>
                  <span className="font-medium">۵ دقیقه مطالعه</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-purple-700 font-bold">
                <span></span>
                <span>فروشگاه آینه</span>
              </div>
            </div>
          </header>

          {/* محتوای مقاله */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-12 border border-purple-100 mb-10">
            <div 
              className="prose prose-lg prose-purple max-w-none text-gray-700 leading-9 text-justify"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </div>

          {/* باکس دعوت به اقدام */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            
            <div className="relative z-10 p-8 md:p-12 text-center text-white">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">نیاز به مشاوره تخصصی دارید؟</h3>
              <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">
                تیم متخصص آینه آماده است تا بهترین روتین پوستی را متناسب با نیاز شما پیشنهاد دهد.
              </p>
              <a 
                href="https://wa.me/989352225693" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <span>💬</span>
                <span>دریافت مشاوره رایگان در واتس‌اپ</span>
              </a>
            </div>
          </div>

          {/* دکمه بازگشت */}
          <div className="text-center mb-10">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all duration-300 shadow-lg"
            >
              <span>←</span>
              <span>بازگشت به مجله آینه</span>
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
