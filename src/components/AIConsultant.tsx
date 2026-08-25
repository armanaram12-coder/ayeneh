'use client';

import { useState } from 'react';

export default function AIConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: "سلام! 👋 من مشاور هوشمند فروشگاه آینه هستم. چطور می‌توانم در انتخاب محصولات تراست (Trust) یا تدوین روتین پوست و مو به شما کمک کنم؟ (مثلاً بپرسید: بهترین ضد آفتاب برای پوست چرب چیست؟)", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');

    // ✅ منطق ساده هوش مصنوعی بر اساس کلمات کلیدی
    setTimeout(() => {
      let botResponse = "متوجه شدم! برای دریافت مشاوره تخصصی و دقیق‌تر درباره این محصول، لطفاً همین الان در واتس‌اپ به ما پیام دهید تا همکارانمان (با مدیریت آرمان آرام) شما را راهنمایی کنند.";
      const lowerMsg = userMsg.toLowerCase();

      if (lowerMsg.includes('ضد آفتاب') || lowerMsg.includes('افتاب')) {
        botResponse = "برای پوست چرب، «کرم ضد آفتاب کنترل کننده چربی تراست» و برای پوست خشک، «ضد آفتاب آبرسان تراست» پیشنهاد می‌شود. هر دو فاقد چربی و سبک هستند. آیا مایلید لینک خرید را برایتان بفرستم؟";
      } else if (lowerMsg.includes('سرم') || lowerMsg.includes('آبرسان')) {
        botResponse = "سرم‌های تخصصی تراست (مثل سرم هیالورونیک اسید یا ویتامین C) برای آبرسانی عمیق و شفافیت پوست عالی هستند. آیا نوع پوست خود (چرب، خشک یا مختلط) را می‌دانید؟";
      } else if (lowerMsg.includes('جوش') || lowerMsg.includes('آکنه')) {
        botResponse = "برای کنترل جوش و آکنه، شامپو شستشوی کنترل کننده آکنه تراست به همراه سرم لایه‌بردار AHA بسیار مؤثر است. توصیه می‌کنم حتماً با مشاوران ما در واتس‌اپ صحبت کنید تا روتین کامل را برایتان بچینند.";
      } else if (lowerMsg.includes('روتین') || lowerMsg.includes('پوست')) {
        botResponse = "یک روتین پایه شامل ۳ مرحله است: ۱. شوینده مناسب ۲. آبرسان/مرطوب‌کننده ۳. ضد آفتاب (در روز). برند تراست تمام این مراحل را با کیفیت بالا پوشش می‌دهد.";
      } else if (lowerMsg.includes('تراست') || lowerMsg.includes('trust')) {
        botResponse = "فروشگاه آینه نمایندگی رسمی فروش محصولات تراست (Trust) است و تمامی کالاها با ضمانت اصالت و تاریخ انقضای معتبر عرضه می‌شوند. چه محصولی از تراست مد نظر شماست؟";
      }

      setMessages(prev => [...prev, { text: botResponse + "\n\n💬 برای ادامه مشاوره و دریافت لینک خرید، روی دکمه سبز رنگ پایین کلیک کنید.", isBot: true }]);
    }, 800);
  };

  return (
    <>
      {/* دکمه شناور ربات */}
      <div className="fixed bottom-24 left-6 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
          title="مشاور هوشمند آینه"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* پنجره چت */}
      {isOpen && (
        <div className="fixed bottom-40 left-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm">مشاور هوشمند آینه 🪞</h3>
              <p className="text-xs text-purple-100">پاسخگوی سوالات شما درباره محصولات تراست</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">✕</button>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.isBot ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' : 'bg-purple-600 text-white rounded-tr-none'}`}>
                  {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="سوال خود را بنویسید..." 
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
            <button onClick={handleSend} className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
          
          <a href="https://wa.me/989352225693" target="_blank" rel="noopener noreferrer" className="m-3 bg-green-500 text-white text-center py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
            <span>💬</span> انتقال به مشاوره واتس‌اپ
          </a>
        </div>
      )}
    </>
  );
}
