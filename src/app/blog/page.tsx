import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'مجله آینه | مقالات آموزشی مراقبت از پوست و مو',
  description: 'جدیدترین مقالات آموزشی، راهنمای خرید محصولات تراست و نکات تخصصی مراقبت از پوست و مو در فروشگاه اینترنتی آینه.',
};

export default async function BlogPage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, summary, category, image_url, created_at')
    .order('created_at', { ascending: false });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">مجله تخصصی آینه</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">دانش زیبایی خود را با مطالعه مقالات تخصصی ما افزایش دهید و بهترین روتین مراقبتی را برای خود بسازید.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles?.map((article) => (
              <Link 
                key={article.slug} 
                href={`/blog/${article.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100"
              >
                <div className="h-48 overflow-hidden relative">
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
                    <span>مطالعه کامل مقاله</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
