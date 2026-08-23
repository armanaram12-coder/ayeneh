import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { email } = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // تولید رمز موقت ۸ رقمی
  const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();

  // آپدیت رمز کاربر در Supabase
  const { error } = await supabase.auth.admin.updateUserById(
    // اینجا باید user_id رو پیدا کنیم
    '', 
    { password: tempPassword }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // اینجا می‌تونی از سرویس ایمیل استفاده کنی
  // یا فعلاً رمز رو در کنسول لاگ کنی

  return NextResponse.json({ 
    success: true, 
    message: 'رمز موقت ساخته شد. لطفاً ایمیل خود را چک کنید.' 
  });
}
