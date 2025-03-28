
import React, { useState, useEffect } from 'react';
import { Account, AccountColor, accountColors } from '@/types/account';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AccountFormProps {
  account?: Account;
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<Account, 'id' | 'order'> | Account) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ account, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<{
    alias: string;
    email: string;
    password: string;
    color: AccountColor;
  }>({
    alias: account?.alias || '',
    email: account?.email || '',
    password: account?.password || '',
    color: account?.color || 'blue',
  });

  const [errors, setErrors] = useState<{
    alias?: string;
    email?: string;
    password?: string;
  }>({});

  // إعادة تعيين النموذج عند فتحه مع بيانات الحساب أو بدون بيانات
  useEffect(() => {
    if (isOpen) {
      setFormData({
        alias: account?.alias || '',
        email: account?.email || '',
        password: account?.password || '',
        color: account?.color || 'blue',
      });
      setErrors({});
    }
  }, [isOpen, account]);

  const validateForm = () => {
    const newErrors: {
      alias?: string;
      email?: string;
      password?: string;
    } = {};
    
    if (!formData.alias) newErrors.alias = 'الاسم المستعار مطلوب';
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.email.includes('@')) newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (account) {
      // تعديل حساب موجود
      onSave({
        ...account,
        alias: formData.alias,
        email: formData.email,
        password: formData.password,
        color: formData.color,
      });
    } else {
      // إنشاء حساب جديد
      onSave({
        alias: formData.alias,
        email: formData.email,
        password: formData.password,
        color: formData.color,
      });
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // مسح الخطأ عند الكتابة
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleColorSelect = (color: AccountColor) => {
    setFormData(prev => ({ ...prev, color }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>{account ? 'تعديل الحساب' : 'إضافة حساب جديد'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="alias">الاسم المستعار (الاسم الظاهر)</Label>
            <Input 
              id="alias" 
              name="alias" 
              value={formData.alias} 
              onChange={handleChange}
              placeholder="أدخل الاسم المستعار"
              className={errors.alias ? "border-red-500" : ""}
            />
            {errors.alias && <p className="text-red-500 text-sm">{errors.alias}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange}
              placeholder="أدخل البريد الإلكتروني لتسجيل دخول WOLF"
              className={errors.email ? "border-red-500" : ""}
              dir="ltr"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange}
              placeholder="أدخل كلمة المرور لتسجيل دخول WOLF"
              className={errors.password ? "border-red-500" : ""}
              dir="ltr"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>لون البطاقة</Label>
            <div className="grid grid-cols-6 gap-3 mt-2">
              {accountColors.map(color => (
                <button 
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`w-full h-12 rounded-lg bg-account-${color} hover:opacity-90 transition-opacity ${
                    formData.color === color ? 'ring-4 ring-offset-2 ring-black dark:ring-white' : ''
                  }`}
                  aria-label={`لون ${color}`}
                />
              ))}
            </div>
          </div>
          
          <DialogFooter className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">
              {account ? 'حفظ التغييرات' : 'إضافة حساب'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountForm;
