
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
import { ModeToggle } from '@/components/ModeToggle';

const Index = () => {
  const { isRunning, startBot, stopBot } = useBot();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);

  useEffect(() => {
    // Load accounts from storage
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
        title: "Cannot delete account",
        description: "Stop the bot before deleting accounts",
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
      // Update existing account
      if (updateAccount(account)) {
        setAccounts(getAccounts());
      }
    } else {
      // Create new account
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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">Sequential Race Bot</h1>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <Button
              onClick={isRunning ? stopBot : startBot}
              className={`w-32 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isRunning ? (
                <>
                  <Square className="mr-2 h-4 w-4" /> Stop
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <Tabs defaultValue="accounts">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <Button onClick={handleAddAccount}>
              <Plus className="mr-2 h-4 w-4" /> Add Account
            </Button>
          </div>
          
          <TabsContent value="accounts" className="mt-6">
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-2">No Accounts Added</h2>
                <p className="text-muted-foreground mb-4">Add your first WOLF account to get started</p>
                <Button onClick={handleAddAccount}>
                  <Plus className="mr-2 h-4 w-4" /> Add Account
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
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Bot Settings</h2>
              <p className="text-muted-foreground mb-4">
                Configure settings for the Sequential Race Bot. More options will be available in the next phase.
              </p>
              
              <div className="border rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-2">Status</h3>
                <p className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {isRunning ? 'Bot is running' : 'Bot is stopped'}
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Connection Status</h3>
                <p className="text-muted-foreground">
                  WOLF connection will be implemented in the next phase.
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
