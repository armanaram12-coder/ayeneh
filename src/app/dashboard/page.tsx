'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getCart, addToCart } from '@/lib/cart';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { getUserOrders, getOrderStatusText, getOrderStatusColor } from '@/lib/orders';
import productsData from '@/data/products.json';

type TabType = 'profile' | 'cart' | 'favorites' | 'orders' | 'reviews' | 'support' | 'security';

function getAllProducts(): any[] {
  const allProducts: any[] = [];
  const data = productsData as any;
  
  for (const category of data.categories || []) {
    for (const subcategory of category.subcategories || []) {
      for (const product of subcategory.products || []) {
        allProducts.push({
          id: product.id,
          name: product.name,
          price_toman: product.price_toman,
          brand: product.brand,
          category: category.name,
        });
      }
    }
  }
  return allProducts;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [sendingSupport, setSendingSupport] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      setIsLoggedIn(true);
      setUser(session.user);
      
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(profileData || {});
      
      const cart = await getCart(session.user.id);
      setCartItems(cart || []);

      const favIds = await getFavorites(session.user.id);
      setFavoriteIds(favIds);
      const allProds = getAllProducts();
      const favProds = allProds.filter((p: any) => favIds.includes(p.id));
      setFavoriteProducts(favProds);

      const orders = await getUserOrders(session.user.id);
      setUserOrders(orders);
      
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        address: profile.address,
        postal_code: profile.postal_code,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    setSaving(false);
    if (error) {
      alert('❌ خطا در به‌روزرسانی: ' + error.message);
    } else {
      alert('✅ تغییرات با موفقیت ثبت شد');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      alert('خطا در آپلود عکس: ' + uploadError.message);
      return;
    }
    
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
    
    const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
    if (updateError) {
      alert('خطا در ذخیره آواتار: ' + updateError.message);
    } else {
      setProfile({ ...profile, avatar_url: publicUrl });
      alert('✅ عکس پروفایل با موفقیت تغییر کرد');
    }
  };

  const handleCartCheckout = () => {
    router.push('/checkout');
  };
  
  const handleClearCart = async () => {
    if (confirm('آیا از خالی کردن سبد خرید مطمئن هستید؟') && user) {
      await supabase.from('cart').delete().eq('user_id', user.id);
      setCartItems([]);
    }
  };

  const handleAddFavoriteToCart = async (product: any) => {
    if (!user) return;
    await addToCart(user.id, {
      id: product.id,
      name: product.name,
      price: product.price_toman
    });
    const updatedCart = await getCart(user.id);
    setCartItems(updatedCart);
    alert('✅ به سبد خرید اضافه شد');
  };

  const handleRemoveFavorite = async (productId: number) => {
    if (!user) return;
    await toggleFavorite(user.id, productId);
    setFavoriteIds(favoriteIds.filter(id => id !== productId));
    setFavoriteProducts(favoriteProducts.filter((p: any) => p.id !== productId));
  };

  // تابع حذف سفارش (با گزارش خطای دقیق)
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('آیا از حذف این سفارش مطمئن هستید؟ این عملیات قابل بازگشت نیست.')) return;
    if (!user) {
      alert('❌ خطا: کاربر شناسایی نشد. لطفاً صفحه را رفرش کنید.');
      return;
    }
    
    console.log('Attempting to delete order:', orderId, 'for user:', user.id);
    
    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
      .eq('user_id', user.id); // شرط اضافی برای امنیت بیشتر

    if (error) {
      console.error('Supabase Delete Error:', error);
      alert('❌ خطا در حذف سفارش:\n' + error.message + '\n\nلطفاً این متن را برای پشتیبانی فنی ارسال کنید.');
      return;
    }
    
    // خواندن مجدد لیست از دیتابیس
    const { data: updatedOrders, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (fetchError) {
      console.error('Fetch Error:', fetchError);
    } else {
      setUserOrders(updatedOrders || []);
      alert('✅ سفارش با موفقیت حذف شد');
    }
  };

  // تابع ارسال پیام پشتیبانی (با ذخیره نام و شماره)
  const handleSendSupportMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supportSubject || !supportMessage) {
      alert('لطفاً موضوع و متن پیام را وارد کنید.');
      return;
    }

    setSendingSupport(true);
    try {
      const { error: dbError } = await supabase.from('support_messages').insert({
        user_id: user.id,
        username: profile?.username || user.email || 'کاربر بدون نام',
        phone: profile?.phone || 'ثبت نشده',
        subject: supportSubject,
        message: supportMessage,
        status: 'unread'
      });

      if (dbError) throw dbError;

      alert('✅ پیام شما با موفقیت در سیستم ثبت شد. به زودی پاسخ خواهیم داد.');
      setSupportSubject('');
      setSupportMessage('');
    } catch (error) {
      console.error(error);
      alert('❌ خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
    } finally {
      setSendingSupport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-600 text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const cartCount = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);

  const sidebarItems = [
    { id: 'profile' as TabType, label: 'پروفایل', icon: '👤' },
    { id: 'cart' as TabType, label: `سبد خرید (${cartCount})`, icon: '🛒' },
    { id: 'favorites' as TabType, label: `علاقه‌مندی‌ها (${favoriteIds.length})`, icon: '❤️' },
    { id: 'orders' as TabType, label: `سفارشات (${userOrders.length})`, icon: '📦' },
    { id: 'reviews' as TabType, label: 'نظرات', icon: '💬' },
    { id: 'support' as TabType, label: 'پشتیبانی', icon: '📞' },
    { id: 'security' as TabType, label: 'امنیت', icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      <div className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">داشبورد کاربری</h1>
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>بازگشت به فروشگاه</span>
            </a>
            <button onClick={handleLogout} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium">خروج</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 bg-white rounded-xl shadow-lg p-4 h-fit">
          {sidebarItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full text-right px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-all ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-purple-50'
              }`}
            >
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">اطلاعات پروفایل</h2>
              <div className="flex flex-col items-center mb-8">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-purple-300" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center mb-4">
                    <span className="text-5xl text-white">👤</span>
                  </div>
                )}
                <label className="cursor-pointer text-sm text-purple-600 hover:text-purple-800 font-medium bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                  تغییر عکس پروفایل
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">نام کاربری</label>
                  <input type="text" value={profile?.username || ''} onChange={(e) => setProfile({...profile, username: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">ایمیل</label>
                  <input type="email" value={user?.email || ''} disabled className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-900 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">شماره تلفن</label>
                  <input type="tel" value={profile?.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">آدرس منزل</label>
                  <textarea value={profile?.address || ''} onChange={(e) => setProfile({...profile, address: e.target.value})} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">کد پستی</label>
                  <input type="text" value={profile?.postal_code || ''} onChange={(e) => setProfile({...profile, postal_code: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500" />
                </div>
                <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                  {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'cart' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">سبد خرید شما</h2>
              {cartItems.length === 0 ? (
                <div className="text-center py-12"><div className="text-6xl mb-4">🛒</div><p className="text-gray-600 text-lg">سبد خرید شما خالی است</p></div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product_id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                      <div><h3 className="font-semibold text-gray-900">{item.product_name}</h3><p className="text-purple-600">{item.price.toLocaleString()} تومان</p></div>
                      <div className="flex items-center gap-3"><span className="text-gray-700">تعداد: {item.quantity}</span></div>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-gray-900">مجموع:</span>
                      <span className="text-xl font-bold text-purple-600">{cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toLocaleString()} تومان</span>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleCartCheckout} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90">ادامه فرآیند خرید</button>
                      <button onClick={handleClearCart} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">خالی کردن سبد</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">علاقه‌مندی‌های شما</h2>
              {favoriteProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">❤️</div>
                  <p className="text-gray-600 text-lg">لیست علاقه‌مندی‌ها خالی است</p>
                  <button onClick={() => router.push('/')} className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg hover:opacity-90">مشاهده محصولات</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteProducts.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">🧴</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-purple-600 font-bold mb-2">{product.price_toman.toLocaleString()} تومان</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleAddFavoriteToCart(product)} className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">افزودن به سبد</button>
                          <button onClick={() => handleRemoveFavorite(product.id)} className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200">حذف</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">سفارشات من</h2>
              {userOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-600 text-lg">هنوز سفارشی ثبت نکرده‌اید</p>
                  <button onClick={() => router.push('/')} className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg hover:opacity-90">مشاهده محصولات</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order: any) => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                        <div>
                          <h3 className="font-bold text-gray-900">سفارش #{order.order_number}</h3>
                          <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">آدرس ارسال:</span>
                          <span className="text-sm text-gray-600 text-left max-w-xs">{order.shipping_address}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-semibold">مجموع:</span>
                          <span className="text-lg font-bold text-purple-600">{order.total_amount.toLocaleString()} تومان</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          حذف سفارش
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-600 text-lg">هنوز نظری ثبت نکرده‌اید</p>
            </div>
          )}
          
          {activeTab === 'support' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">پشتیبانی و پیگیری خرید</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-gray-700 mb-1 font-medium">📧 ایمیل پشتیبانی:</p>
                    <p className="text-purple-700 font-bold text-lg" dir="ltr">ayenehshop@gmail.com</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-gray-700 mb-1 font-medium">📱 شماره تماس:</p>
                    <p className="text-purple-700 font-bold text-lg" dir="ltr">09352225693</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-gray-700">
                    <p className="font-bold mb-2">💡 راهنما:</p>
                    <p>پیام شما مستقیماً در سیستم پشتیبانی ما ذخیره می‌شود و کارشناسان ما در اسرع وقت پاسخگوی شما خواهند بود.</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">ارسال پیام جدید</h3>
                  <form onSubmit={handleSendSupportMessage} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm font-medium">موضوع پیام *</label>
                      <input 
                        type="text" 
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="مثال: پیگیری سفارش شماره ۱۲۳"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm font-medium">متن پیام *</label>
                      <textarea 
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                        rows={5}
                        placeholder="پیام خود را با جزئیات بنویسید..."
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={sendingSupport}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {sendingSupport ? 'در حال ارسال...' : 'ارسال پیام به پشتیبانی'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">تغییر رمز عبور</h2>
              <form className="space-y-4 max-w-md" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const { error } = await supabase.auth.updateUser({ password: formData.get('newPassword') as string });
                if (error) alert('خطا: ' + error.message);
                else alert('✅ رمز عبور با موفقیت تغییر کرد');
              }}>
                <div>
                  <label className="block text-gray-700 mb-2">رمز عبور جدید</label>
                  <input type="password" name="newPassword" required minLength={6} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90">تغییر رمز عبور</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
