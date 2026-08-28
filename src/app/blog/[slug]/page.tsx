import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

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
        
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-visible">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${article.image_url || categoryImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-pink-900/70 mix-blend-multiply" />
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-32 h-32 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-32 left-32 w-40 h-40 bg-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-end pb-12 px-4 h-full pt-20">
            <div className="container max-w-5xl mx-auto text-center">
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${categoryColor} text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl mb-4`}>
                <span className="text-xl">✨</span>
                <span>{article.category}</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-white text-sm md:text-base">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                  <span>📅</span>
                  <span>{new Date(article.created_at).toLocaleDateString('fa-IR')}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                  <span>⏱️</span>
                  <span>۵ دقیقه مطالعه</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                  <span>🏪</span>
                  <span>فروشگاه آینه</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* محتوای اصلی مقاله */}
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
            
            {/* مقدمه */}
            <div className="mb-10 pb-8 border-b-2 border-purple-100">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${categoryColor} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                  ✨
                </div>
                <h2 className="text-xl font-bold text-gray-900">نکات کلیدی این مقاله</h2>
              </div>
              <p className="text-base text-gray-800 leading-relaxed text-justify font-medium">
                {article.summary}
              </p>
            </div>

            {/* محتوای اصلی با استایل‌های سفارشی */}
            <div 
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />

            {/* استایل‌های CSS برای محتوای مقاله */}
            <style>{`
              .article-body h2 { 
                color: #1f2937; 
                font-size: 1.5rem; 
                font-weight: bold; 
                margin-top: 2rem; 
                margin-bottom: 1rem; 
                border-bottom: 2px solid #e9d5ff; 
                padding-bottom: 0.5rem; 
              }
              .article-body h3 { 
                color: #7e22ce; 
                font-size: 1.25rem; 
                font-weight: bold; 
                margin-top: 1.5rem; 
                margin-bottom: 0.75rem; 
              }
              .article-body h4 { 
                color: #1f2937; 
                font-size: 1.125rem; 
                font-weight: bold; 
                margin-top: 1rem; 
                margin-bottom: 0.5rem; 
              }
              .article-body p { 
                color: #1f2937; 
                line-height: 1.875rem; 
                margin-bottom: 1rem; 
                text-align: justify; 
                font-size: 1rem; 
              }
              .article-body strong { 
                color: #7e22ce; 
                font-weight: bold; 
              }
              .article-body ul, .article-body ol { 
                color: #1f2937; 
                margin-right: 1.5rem; 
                margin-bottom: 1rem; 
              }
              .article-body li { 
                color: #1f2937; 
                margin-bottom: 0.5rem; 
                line-height: 1.75rem; 
              }
              .article-body a { 
                color: #7e22ce; 
                text-decoration: underline; 
              }
            `}</style>

            {/* باکس نکات مهم */}
            <div className="mt-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <div className="text-3xl">💎</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">نکته طلایی</h3>
                  <p className="text-gray-800 leading-relaxed text-sm font-medium">
                    برای دریافت بهترین نتیجه، حتماً از محصولات اصل تراست استفاده کنید. <strong className="text-purple-700">فروشگاه آینه</strong> به عنوان نماینده رسمی، اصالت تمام محصولات را تضمین می‌کند.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-10 relative overflow-hidden rounded-3xl shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-r ${categoryColor}`} />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            
            <div className="relative z-10 p-10 md:p-14 text-center text-white">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl md:text-4xl font-black mb-4">نیاز به مشاوره تخصصی دارید؟</h3>
              <p className="text-base md:text-lg mb-8 opacity-95 max-w-2xl mx-auto leading-relaxed">
                تیم متخصص آینه آماده است تا بهترین روتین پوستی و موی شما را طراحی کند
              </p>
              <a 
                href="https://wa.me/989352225693" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-purple-700 px-8 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="text-2xl"></span>
                <span>دریافت مشاوره رایگان در واتس‌اپ</span>
              </a>
            </div>
          </div>

          {/* دکمه بازگشت */}
          <div className="text-center mt-10 mb-8">
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
