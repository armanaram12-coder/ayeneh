import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import productsData from '@/data/products.json';

export async function GET() {
  // ساخت کلاینت سوپابیس با استفاده از متغیرهای محیطی که قبلاً تنظیم کردید
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const productsToInsert: any[] = [];

  // استخراج محصولات از فایل JSON
  for (const category of (productsData as any).categories || []) {
    for (const subcategory of category.subcategories || []) {
      for (const product of subcategory.products || []) {
        productsToInsert.push({
          name: product.name,
          price_toman: product.price_toman,
          brand: product.brand || 'تراست',
          category: category.name,
          image: '', // اینجا خالی است، بعداً خودتان لینک عکس را در پنل سوپابیس می‌گذارید
          stock: product.stock || 10,
          volume_ml: product.volume_ml || null,
          volume_gram: product.volume_gram || null,
          gender: product.gender || 'یونیسکس',
          type: product.type || '',
        });
      }
    }
  }

  try {
    // وارد کردن یکجا به دیتابیس
    const { data, error } = await supabase.from('products').insert(productsToInsert);
    
    if (error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `✅ تبریک! ${productsToInsert.length} محصول با موفقیت و در چند ثانیه وارد دیتابیس شد!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, success: false }, { status: 500 });
  }
}
