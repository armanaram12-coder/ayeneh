import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase
    .from('articles')
    .select('title, summary')
    .eq('slug', params.slug)
    .single();

  if (!article) return { title: 'مقاله یافت نشد' };

  return {
    title: `${article.title} | مجله آینه`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (error || !article) {
    console.error('Error:', error);
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white" dir="rtl">
        <div className="bg-purple-50 border-b border-purple-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex text-sm text-gray-600">
              <Link href="/" className="hover:text-[#7C3AED]">خانه</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-[#7C3AED]">مجله آینه</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-xs">{article.title}</span>
            </nav>
          </div>
        </div>

        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <header className="mb-8 text-center">
            <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-bold mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
              <span>📅 {new Date(article.created_at).toLocaleDateString('fa-IR')}</span>
              <span>⏱️ ۵ دقیقه مطالعه</span>
            </div>
          </header>

          {article.image_url && (
            <div className="rounded-2xl overflow-hidden shadow-xl mb-10">
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div 
            className="prose prose-lg prose-purple max-w-none text-gray-700 leading-8 text-justify"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />

          <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-3">نیاز به مشاوره تخصصی دارید؟</h3>
            <p className="mb-6 opacity-90">تیم متخصص آینه آماده است تا بهترین روتین پوستی را متناسب با نیاز شما پیشنهاد دهد.</p>
            <a 
              href="https://wa.me/989352225693" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white text-purple-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              💬 دریافت مشاوره رایگان در واتس‌اپ
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
