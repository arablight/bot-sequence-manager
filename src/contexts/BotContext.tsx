
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface BotContextType {
  isRunning: boolean;
  startBot: () => void;
  stopBot: () => void;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);

  const startBot = () => {
    setIsRunning(true);
    toast.success('تم تشغيل البوت بنجاح');
  };

  const stopBot = () => {
    setIsRunning(false);
    toast.success('تم إيقاف البوت بنجاح');
  };

  return (
    <BotContext.Provider value={{ isRunning, startBot, stopBot }}>
      {children}
    </BotContext.Provider>
  );
};

export const useBot = (): BotContextType => {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('يجب استخدام useBot داخل BotProvider');
  }
  return context;
};
