
import { Account } from "@/types/account";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const ACCOUNTS_STORAGE_KEY = "sequential-race-bot-accounts";

export const getAccounts = (): Account[] => {
  try {
    const accounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return accounts ? JSON.parse(accounts) : [];
  } catch (error) {
    console.error("Failed to get accounts:", error);
    toast.error("Failed to load accounts");
    return [];
  }
};

export const saveAccount = (account: Omit<Account, "id" | "order">): Account | null => {
  try {
    const accounts = getAccounts();
    
    // Check for duplicate alias
    if (accounts.some(acc => acc.alias === account.alias)) {
      toast.error("An account with this alias already exists");
      return null;
    }
    
    // Check for duplicate email
    if (accounts.some(acc => acc.email === account.email)) {
      toast.error("An account with this email already exists");
      return null;
    }
    
    // Create new account with ID and order
    const newAccount: Account = {
      ...account,
      id: uuidv4(),
      order: accounts.length
    };
    
    // Save to localStorage
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, newAccount]));
    toast.success("Account created successfully");
    return newAccount;
  } catch (error) {
    console.error("Failed to save account:", error);
    toast.error("Failed to save account");
    return null;
  }
};

export const updateAccount = (account: Account): boolean => {
  try {
    const accounts = getAccounts();
    const accountIndex = accounts.findIndex(acc => acc.id === account.id);
    
    if (accountIndex === -1) {
      toast.error("Account not found");
      return false;
    }
    
    // Check for duplicate alias (excluding the current account)
    if (accounts.some(acc => acc.alias === account.alias && acc.id !== account.id)) {
      toast.error("An account with this alias already exists");
      return false;
    }
    
    // Check for duplicate email (excluding the current account)
    if (accounts.some(acc => acc.email === account.email && acc.id !== account.id)) {
      toast.error("An account with this email already exists");
      return false;
    }
    
    // Update the account
    accounts[accountIndex] = account;
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    toast.success("Account updated successfully");
    return true;
  } catch (error) {
    console.error("Failed to update account:", error);
    toast.error("Failed to update account");
    return false;
  }
};

export const deleteAccount = (accountId: string): boolean => {
  try {
    const accounts = getAccounts();
    const filteredAccounts = accounts.filter(acc => acc.id !== accountId);
    
    if (filteredAccounts.length === accounts.length) {
      toast.error("Account not found");
      return false;
    }
    
    // Reorder remaining accounts
    const reorderedAccounts = filteredAccounts.map((acc, index) => ({
      ...acc,
      order: index
    }));
    
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(reorderedAccounts));
    toast.success("Account deleted successfully");
    return true;
  } catch (error) {
    console.error("Failed to delete account:", error);
    toast.error("Failed to delete account");
    return false;
  }
};

export const reorderAccounts = (accounts: Account[]): boolean => {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return true;
  } catch (error) {
    console.error("Failed to reorder accounts:", error);
    toast.error("Failed to reorder accounts");
    return false;
  }
};
