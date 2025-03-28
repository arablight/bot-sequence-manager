
import { Account } from "@/types/account";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const ACCOUNTS_STORAGE_KEY = "sequential-race-bot-accounts";

export const getAccounts = (): Account[] => {
  try {
    const accounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return accounts ? JSON.parse(accounts) : [];
  } catch (error) {
    console.error("فشل في الحصول على الحسابات:", error);
    toast.error("فشل في تحميل الحسابات");
    return [];
  }
};

export const saveAccount = (account: Omit<Account, "id" | "order">): Account | null => {
  try {
    const accounts = getAccounts();
    
    // التحقق من وجود اسم مستعار مكرر
    if (accounts.some(acc => acc.alias === account.alias)) {
      toast.error("يوجد حساب بهذا الاسم المستعار بالفعل");
      return null;
    }
    
    // التحقق من وجود بريد إلكتروني مكرر
    if (accounts.some(acc => acc.email === account.email)) {
      toast.error("يوجد حساب بهذا البريد الإلكتروني بالفعل");
      return null;
    }
    
    // إنشاء حساب جديد مع هوية وترتيب
    const newAccount: Account = {
      ...account,
      id: uuidv4(),
      order: accounts.length
    };
    
    // الحفظ في التخزين المحلي
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, newAccount]));
    toast.success("تم إنشاء الحساب بنجاح");
    return newAccount;
  } catch (error) {
    console.error("فشل في حفظ الحساب:", error);
    toast.error("فشل في حفظ الحساب");
    return null;
  }
};

export const updateAccount = (account: Account): boolean => {
  try {
    const accounts = getAccounts();
    const accountIndex = accounts.findIndex(acc => acc.id === account.id);
    
    if (accountIndex === -1) {
      toast.error("الحساب غير موجود");
      return false;
    }
    
    // التحقق من وجود اسم مستعار مكرر (باستثناء الحساب الحالي)
    if (accounts.some(acc => acc.alias === account.alias && acc.id !== account.id)) {
      toast.error("يوجد حساب بهذا الاسم المستعار بالفعل");
      return false;
    }
    
    // التحقق من وجود بريد إلكتروني مكرر (باستثناء الحساب الحالي)
    if (accounts.some(acc => acc.email === account.email && acc.id !== account.id)) {
      toast.error("يوجد حساب بهذا البريد الإلكتروني بالفعل");
      return false;
    }
    
    // تحديث الحساب
    accounts[accountIndex] = account;
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    toast.success("تم تحديث الحساب بنجاح");
    return true;
  } catch (error) {
    console.error("فشل في تحديث الحساب:", error);
    toast.error("فشل في تحديث الحساب");
    return false;
  }
};

export const deleteAccount = (accountId: string): boolean => {
  try {
    const accounts = getAccounts();
    const filteredAccounts = accounts.filter(acc => acc.id !== accountId);
    
    if (filteredAccounts.length === accounts.length) {
      toast.error("الحساب غير موجود");
      return false;
    }
    
    // إعادة ترتيب الحسابات المتبقية
    const reorderedAccounts = filteredAccounts.map((acc, index) => ({
      ...acc,
      order: index
    }));
    
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(reorderedAccounts));
    toast.success("تم حذف الحساب بنجاح");
    return true;
  } catch (error) {
    console.error("فشل في حذف الحساب:", error);
    toast.error("فشل في حذف الحساب");
    return false;
  }
};

export const reorderAccounts = (accounts: Account[]): boolean => {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return true;
  } catch (error) {
    console.error("فشل في إعادة ترتيب الحسابات:", error);
    toast.error("فشل في إعادة ترتيب الحسابات");
    return false;
  }
};
