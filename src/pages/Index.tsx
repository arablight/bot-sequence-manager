
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Plus } from 'lucide-react';
import { useBot } from '@/contexts/BotContext';
import { Account } from '@/types/account';
import { getAccounts, saveAccount, updateAccount, deleteAccount, reorderAccounts } from '@/services/accountService';
import AccountForm from '@/components/AccountForm';
import AccountsGrid from '@/components/AccountsGrid';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { isRunning, startBot, stopBot } = useBot();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);

  useEffect(() => {
    // تحميل الحسابات من التخزين
    setAccounts(getAccounts());
  }, []);

  const handleAddAccount = () => {
    setEditingAccount(undefined);
    setIsFormOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (isRunning) {
      toast({
        title: "لا يمكن حذف الحساب",
        description: "يجب إيقاف البوت قبل حذف الحسابات",
        variant: "destructive"
      });
      return;
    }
    
    if (deleteAccount(accountId)) {
      setAccounts(getAccounts());
    }
  };

  const handleSaveAccount = (account: Omit<Account, 'id' | 'order'> | Account) => {
    if ('id' in account) {
      // تحديث حساب موجود
      if (updateAccount(account)) {
        setAccounts(getAccounts());
      }
    } else {
      // إنشاء حساب جديد
      const newAccount = saveAccount(account);
      if (newAccount) {
        setAccounts(getAccounts());
      }
    }
  };

  const handleReorderAccounts = (reorderedAccounts: Account[]) => {
    if (reorderAccounts(reorderedAccounts)) {
      setAccounts(reorderedAccounts);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-white">بوت السباق المتسلسل</h1>
          <div className="flex items-center space-x-2">
            <Button
              onClick={isRunning ? stopBot : startBot}
              className={`w-32 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isRunning ? (
                <>
                  <Square className="mr-2 h-4 w-4" /> إيقاف
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> تشغيل
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <Tabs defaultValue="accounts" className="text-white">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-gray-700">
              <TabsTrigger value="accounts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:text-white">الحسابات</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:text-white">الإعدادات</TabsTrigger>
            </TabsList>
            
            <Button onClick={handleAddAccount} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="ml-2 h-4 w-4" /> إضافة حساب
            </Button>
          </div>
          
          <TabsContent value="accounts" className="mt-6">
            {accounts.length === 0 ? (
              <div className="text-center py-8 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 text-white">لا توجد حسابات مضافة</h2>
                <p className="text-gray-300 mb-4">أضف حساب WOLF الخاص بك للبدء</p>
                <Button onClick={handleAddAccount} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="ml-2 h-4 w-4" /> إضافة حساب
                </Button>
              </div>
            ) : (
              <AccountsGrid
                accounts={accounts}
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
                onReorder={handleReorderAccounts}
              />
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">إعدادات البوت</h2>
              <p className="text-gray-300 mb-4">
                قم بتكوين إعدادات بوت السباق المتسلسل. ستتوفر المزيد من الخيارات في المرحلة التالية.
              </p>
              
              <div className="border border-gray-700 rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-2 text-white">الحالة</h3>
                <p className="flex items-center text-gray-200">
                  <span className={`inline-block w-3 h-3 rounded-full ml-2 ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {isRunning ? 'البوت يعمل' : 'البوت متوقف'}
                </p>
              </div>
              
              <div className="border border-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-white">حالة الاتصال</h3>
                <p className="text-gray-300">
                  سيتم تنفيذ اتصال WOLF في المرحلة التالية.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AccountForm
        account={editingAccount}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAccount}
      />
    </div>
  );
};

export default Index;
