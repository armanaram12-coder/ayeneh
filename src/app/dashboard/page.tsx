'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getCart, getCartCount, addToCart } from '@/lib/cart';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import productsData from '@/data/products.json';

type TabType = 'profile' | 'cart' | 'favorites' | 'reviews' | 'support' | 'security';

function getAllProducts(): any[] {
  const allProducts: any[] = [];
  for (const category of productsData.categories) {
    for (const subcategory of category.subcategories) {
      for (const product of subcategory.products) {
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
  const [saving, setSaving] = useState(false);
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
      setCartItems(cart);

      // Load favorites
      const favIds = await getFavorites(session.user.id);
      setFavoriteIds(favIds);
      const allProds = getAllProducts();
      const favProds = allProds.filter(p => favIds.includes(p.id));
      setFavoriteProducts(favProds);
      
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

  const handleCartCheckout = () => alert('سیستم پرداخت به زودی فعال می‌شود!');
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
    alert('✅ به سبد خرید اضافه شد');
  };

  const handleRemoveFavorite = async (productId: number) => {
    if (!user) return;
    await toggleFavorite(user.id, productId);
    setFavoriteIds(favoriteIds.filter(id => id !== productId));
    setFavoriteProducts(favoriteProducts.filter(p => p.id !== productId));
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-purple-600 text-xl">در حال بارگذاری...</div></div>;
  if (!isLoggedIn) return null;

  const sidebarItems = [
    { id: 'profile' as TabType, label: 'پروفایل', icon: '👤' },
    { id: 'cart' as TabType, label: `سبد خرید (${cartItems.reduce((s, i) => s + i.quantity, 0)})`, icon: '🛒' },
    { id: 'favorites' as TabType, label: `علاقه‌مندی‌ها (${favoriteIds.length})`, icon: '❤️' },
    { id: 'reviews' as TabType, label: 'نظرات', icon: '💬' },
    { id: 'support' as TabType, label: 'پشتیبانی و پیگیری', icon: '📞' },
    { id: 'security' as TabType, label: 'امنیت', icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      <div className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">داشبورد کاربری</h1>
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors">
              <span>🏠</span><span>بازگشت به صفحه اصلی</span>
            </a>
            <button onClick={handleLogout} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg hover:opacity-90">خروج</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 bg-white rounded-xl shadow-lg p-4 h-fit">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-right px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md' : 'text-gray-700 hover:bg-purple-50'}`}>
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
                <label className="cursor-pointer text-sm text-purple-600 hover:text-purple-800 font-medium bg-purple-50 px-4 py-2 rounded-lg">
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
                  <p className="text-xs text-gray-500 mt-1">ایمیل قابل تغییر نیست</p>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">شماره تلفن</label>
                  <input type="tel" value={profile?.phone || ''} disabled className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-900 cursor-not-allowed" />
                  <p className="text-xs text-gray-500 mt-1">شماره تلفن قابل تغییر نیست</p>
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
                      <span className="text-xl font-bold text-purple-600">{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} تومان</span>
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
                  <button 
                    onClick={() => router.push('/')}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg hover:opacity-90"
                  >
                    مشاهده محصولات
                  </button>
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
                          <button 
                            onClick={() => handleAddFavoriteToCart(product)}
                            className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                          >
                            افزودن به سبد
                          </button>
                          <button 
                            onClick={() => handleRemoveFavorite(product.id)}
                            className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && <div className="text-center py-12"><div className="text-6xl mb-4">💬</div><p className="text-gray-600 text-lg">هنوز نظری ثبت نکرده‌اید</p></div>}
          
          {activeTab === 'support' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">پشتیبانی و پیگیری خرید</h2>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg"><p className="text-gray-700 mb-2">📧 ایمیل پشتیبانی:</p><p className="text-purple-600 font-semibold">support@ayeneh.com</p></div>
                <div className="bg-purple-50 p-4 rounded-lg"><p className="text-gray-700 mb-2">📱 شماره تماس:</p><p className="text-purple-600 font-semibold">021-12345678</p></div>
                <div className="mt-6">
                  <label className="block text-gray-700 mb-2 font-medium">پیام شما:</label>
                  <textarea className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900" rows={4} placeholder="پیام خود را بنویسید..." />
                  <button onClick={() => alert('پیام شما ارسال شد!')} className="mt-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg hover:opacity-90">ارسال پیام</button>
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
