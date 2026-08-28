import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

// ✅ تصاویر باکیفیت و مرتبط
const getCategoryImage = (category: string) => {
  const images: Record<string, string> = {
    'مراقبت پوست': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80',
    'آموزشی': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80',
    'عطر و ادکلن': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80',
    'مراقبت مو': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
    'معرفی برند': 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1200&q=80'
  };
  return images[category] || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80';
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'مراقبت پوست': 'from-pink-500 to-rose-500',
    'آموزشی': 'from-blue-500 to-cyan-500',
    'عطر و ادکلن': 'from-purple-500 to-violet-500',
    'مراقبت مو': 'from-amber-500 to-orange-500',
    'معرفی برند': 'from-emerald-500 to-teal-500'
  };
  return colors[category] || 'from-purple-500 to-pink-500';
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: article } = await supabase.from('articles').select('title, summary').eq('slug', slug).single();
  if (!article) return { title: 'مقاله یافت نشد' };
  return { title: `${article.title} | مجله آینه`, description: article.summary };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: article, error } = await supabase.from('articles').select('*').eq('slug', slug).eq('is_active', true).single();

  if (error || !article) notFound();

  const categoryColor = getCategoryColor(article.category);
  const categoryImage = getCategoryImage(article.category);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50" dir="rtl">
        
        {/* Hero Section با تصویر بزرگ و افکت‌های جذاب */}
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {/* تصویر با افکت parallax */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url(${article.image_url || categoryImage})` }}
          />
          
          {/* گرادیان overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-pink-900/60 mix-blend-multiply" />
          
          {/* ذرات نورانی متحرک */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-32 h-32 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-32 left-32 w-40 h-40 bg-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-rose-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* محتوا روی تصویر */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-4">
            <div className="container max-w-5xl mx-auto text-center">
              {/* بج دسته‌بندی با افکت */}
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${categoryColor} text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">✨</span>
                {article.category}
              </div>
              
              {/* عنوان با افکت سایه */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                {article.title}
              </h1>
              
              {/* اطلاعات مقاله */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm md:text-base">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full">
                  <span>📅</span>
                  <span>{new Date(article.created_at).toLocaleDateString('fa-IR')}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full">
                  <span>⏱️</span>
                  <span>۵ دقیقه مطالعه</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full">
                  <span>🏪</span>
                  <span>فروشگاه آینه</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* محتوای اصلی مقاله */}
        <article className="container mx-auto px-4 py-12 max-w-4xl -mt-20 relative z-10">
          
          {/* کارت محتوای شیشه‌ای */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-16 border border-white/50">
            
            {/* مقدمه با استایل خاص */}
            <div className="mb-12 pb-8 border-b-2 border-purple-100">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${categoryColor} rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg`}>
                  
                </div>
                <h2 className="text-2xl font-bold text-gray-800">نکات کلیدی این مقاله</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed text-justify">
                {article.summary}
              </p>
            </div>

            {/* محتوای اصلی با استایل تایپوگرافی زیبا */}
            <div 
              className="prose prose-lg prose-purple max-w-none
                prose-headings:text-gray-800 prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:border-b prose-h2:border-purple-200 prose-h2:pb-3
                prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-purple-700
                prose-p:text-gray-700 prose-p:leading-loose prose-p:mb-4 prose-p:text-justify
                prose-strong:text-purple-700 prose-strong:font-bold
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:text-gray-700 prose-li:mb-2 prose-li:mr-6
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-r-4 prose-blockquote:border-purple-400 prose-blockquote:bg-purple-50 prose-blockquote:p-4 prose-blockquote:rounded-l-lg
                prose-img:rounded-2xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />

            {/* باکس نکات مهم */}
            <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💎</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">نکته طلایی</h3>
                  <p className="text-gray-700 leading-relaxed">
                    برای دریافت بهترین نتیجه، حتماً از محصولات اصل تراست استفاده کنید. <strong>فروشگاه آینه</strong> به عنوان نماینده رسمی، اصالت تمام محصولات را تضمین می‌کند.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Box با طراحی خلاقانه */}
          <div className="mt-12 relative overflow-hidden rounded-3xl shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-r ${categoryColor} animate-gradient`} />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            
            {/* اشکال هندسی متحرک */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10 p-12 md:p-16 text-center text-white">
              <div className="text-7xl mb-6 animate-bounce">💬</div>
              <h3 className="text-3xl md:text-5xl font-black mb-6">نیاز به مشاوره تخصصی دارید؟</h3>
              <p className="text-lg md:text-xl mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">
                تیم متخصص آینه آماده است تا بهترین روتین پوستی و موی شما را طراحی کند
              </p>
              <a 
                href="https://wa.me/989352225693" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-white text-purple-700 px-10 py-5 rounded-2xl font-black text-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 shadow-2xl"
              >
                <span className="text-3xl">💬</span>
                <span>دریافت مشاوره رایگان در واتس‌اپ</span>
              </a>
            </div>
          </div>

          {/* دکمه بازگشت با افکت */}
          <div className="text-center mt-12 mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-3 bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span className="text-2xl">←</span>
              <span>بازگشت به مجله آینه</span>
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
