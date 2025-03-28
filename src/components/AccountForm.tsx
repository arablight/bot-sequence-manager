
import React, { useState } from 'react';
import { Account, AccountColor, accountColors } from '@/types/account';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

  const validateForm = () => {
    const newErrors: {
      alias?: string;
      email?: string;
      password?: string;
    } = {};
    
    if (!formData.alias) newErrors.alias = 'Alias is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (account) {
      // Editing existing account
      onSave({
        ...account,
        alias: formData.alias,
        email: formData.email,
        password: formData.password,
        color: formData.color,
      });
    } else {
      // Creating new account
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
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{account ? 'Edit Account' : 'Add New Account'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="alias">Alias (Display Name)</Label>
            <Input 
              id="alias" 
              name="alias" 
              value={formData.alias} 
              onChange={handleChange}
              placeholder="Enter display name"
              className={errors.alias ? "border-red-500" : ""}
            />
            {errors.alias && <p className="text-red-500 text-sm">{errors.alias}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange}
              placeholder="Enter email for WOLF login"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange}
              placeholder="Enter password for WOLF login"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Card Color</Label>
            <div className="grid grid-cols-6 gap-2">
              <RadioGroup 
                value={formData.color} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, color: value as AccountColor }))}
                className="grid grid-cols-6 gap-2"
              >
                {accountColors.map(color => (
                  <div key={color} className="flex items-center justify-center">
                    <RadioGroupItem 
                      value={color} 
                      id={`color-${color}`} 
                      className={`h-8 w-8 bg-account-${color} border-2 p-0 data-[state=checked]:border-white data-[state=checked]:border-4`}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {account ? 'Save Changes' : 'Add Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountForm;
