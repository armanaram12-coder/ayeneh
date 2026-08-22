'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  password?: string;
  confirm_password?: string;
}

export default function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    postal_code: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  // Validation functions
  const validateUsername = (value: string): string | undefined => {
    if (!value.trim()) return 'نام کاربری الزامی است';
    if (value.length < 3) return 'نام کاربری باید حداقل ۳ کاراکتر باشد';
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return 'ایمیل الزامی است';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'فرمت ایمیل معتبر نیست';
    return undefined;
  };

  const validatePhone = (value: string): string | undefined => {
    if (!value.trim()) return 'شماره تلفن الزامی است';
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(value)) return 'شماره تلفن باید فرمت ایرانی داشته باشد (09xxxxxxxxx)';
    return undefined;
  };

  const validateAddress = (value: string): string | undefined => {
    if (!value.trim()) return 'آدرس منزل الزامی است';
    return undefined;
  };

  const validatePostalCode = (value: string): string | undefined => {
    if (!value.trim()) return 'کد پستی الزامی است';
    const postalRegex = /^\d{10}$/;
    if (!postalRegex.test(value)) return 'کد پستی باید دقیقاً ۱۰ رقم باشد';
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) return 'رمز عبور الزامی است';
    if (value.length < 6) return 'رمز عبور باید حداقل ۶ کاراکتر و شامل حروف/اعداد انگلیسی باشد';
    // Check for Persian characters
    const persianRegex = /[\u0600-\u06FF]/;
    if (persianRegex.test(value)) return 'رمز عبور باید حداقل ۶ کاراکتر و شامل حروف/اعداد انگلیسی باشد';
    // Check that it contains at least some English letters or numbers
    const englishRegex = /[A-Za-z0-9]/;
    if (!englishRegex.test(value)) return 'رمز عبور باید حداقل ۶ کاراکتر و شامل حروف/اعداد انگلیسی باشد';
    return undefined;
  };

  const validateConfirmPassword = (value: string): string | undefined => {
    if (!value) return 'تکرار رمز عبور الزامی است';
    if (value !== formData.password) return 'رمز عبور و تکرار آن مطابقت ندارند';
    return undefined;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof typeof formData) => {
    let error: string | undefined;
    
    switch (field) {
      case 'username':
        error = validateUsername(formData.username);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      case 'address':
        error = validateAddress(formData.address);
        break;
      case 'postal_code':
        error = validatePostalCode(formData.postal_code);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'confirm_password':
        error = validateConfirmPassword(formData.confirm_password);
        break;
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const isFormValid = (): boolean => {
    return (
      !validateUsername(formData.username) &&
      !validateEmail(formData.email) &&
      !validatePhone(formData.phone) &&
      !validateAddress(formData.address) &&
      !validatePostalCode(formData.postal_code) &&
      !validatePassword(formData.password) &&
      !validateConfirmPassword(formData.confirm_password)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Validate all fields
    const newErrors: FormErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
      postal_code: validatePostalCode(formData.postal_code),
      password: validatePassword(formData.password),
      confirm_password: validateConfirmPassword(formData.confirm_password),
    };

    setErrors(newErrors);

    // Check if any errors
    if (Object.values(newErrors).some(error => error !== undefined)) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            phone: formData.phone,
            address: formData.address,
            postal_code: formData.postal_code,
          },
        },
      });

      if (error) {
        let errorMessage = error.message || 'خطایی رخ داده است';
        
        // Handle common Supabase errors with user-friendly messages
        if (error.message.includes('User already registered') || error.message.includes('duplicate key')) {
          errorMessage = 'این ایمیل قبلاً ثبت شده است';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'فرمت ایمیل نامعتبر است';
        } else if (error.message.includes('Weak password')) {
          errorMessage = 'رمز عبور باید حداقل ۶ کاراکتر و شامل حروف/اعداد انگلیسی باشد';
        } else if (error.message.includes('phone') || error.message.includes('Phone')) {
          errorMessage = 'شماره تلفن وارد شده معتبر نیست';
        }
        
        setSubmitError(errorMessage);
        return;
      }

      // Success - close modal and notify parent
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        phone: '',
        address: '',
        postal_code: '',
        password: '',
        confirm_password: '',
      });
      setErrors({});
    } catch (err) {
      setSubmitError('خطایی در برقراری ارتباط با سرور رخ داده است');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div 
        className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header with Clock Icon */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800">⏱️ مدت زمان ثبت‌نام فقط ۲ دقیقه</h2>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {submitError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">
              نام کاربری <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              className={`w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] transition-colors`}
              placeholder="حداقل ۳ کاراکتر"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">
              ایمیل <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] transition-colors`}
              placeholder="example@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">
              شماره تلفن <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={() => handleBlur('phone')}
              className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] transition-colors`}
              placeholder="09123456789"
              maxLength={11}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">
              آدرس منزل <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              rows={3}
              className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] transition-colors resize-none`}
              placeholder="آدرس کامل خود را وارد کنید"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* Postal Code */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">
              کد پستی <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => handleInputChange('postal_code', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
              onBlur={() => handleBlur('postal_code')}
              className={`w-full border ${errors.postal_code ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] transition-colors`}
              placeholder="0000000000"
              maxLength={10}
            />
            {errors.postal_code && <p className="text-red-500 text-xs mt-1">{errors.postal_code}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">
              رمز عبور <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] transition-colors`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">
              تکرار رمز عبور <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.confirm_password}
              onChange={(e) => handleInputChange('confirm_password', e.target.value)}
              onBlur={() => handleBlur('confirm_password')}
              className={`w-full border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] transition-colors`}
              placeholder="••••••••"
            />
            {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className={`w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-3 rounded-lg font-semibold transition-all duration-300 ${
              !isFormValid() || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:opacity-90 hover:shadow-lg'
            }`}
          >
            {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>
      </div>
    </div>
  );
}
