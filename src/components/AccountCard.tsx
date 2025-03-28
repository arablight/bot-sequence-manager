
import React from 'react';
import { Account } from '@/types/account';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useBot } from '@/contexts/BotContext';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
  const { isRunning } = useBot();
  
  // الألوان الحقيقية مطابقة للتصنيف في tailwind
  const bgColorClass = `bg-account-${account.color}`;
  
  return (
    <Card className={`w-64 h-64 ${bgColorClass} relative group overflow-hidden transition-all duration-200 hover:shadow-lg`}>
      <CardContent className="p-6 h-full flex flex-col justify-between">
        <div className="absolute top-2 right-2 flex space-x-1 opacity-100 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={() => onEdit(account)}
          >
            <Edit className="h-4 w-4 text-gray-800" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={() => onDelete(account.id)}
            disabled={isRunning}
            title={isRunning ? "لا يمكن حذف الحساب أثناء تشغيل البوت" : "حذف الحساب"}
          >
            <Trash2 className="h-4 w-4 text-gray-800" />
          </Button>
        </div>
        
        <div className="mt-auto w-full text-center">
          <h3 className="text-xl font-bold text-white drop-shadow-md">
            {account.alias}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
