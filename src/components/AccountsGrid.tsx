
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Account } from '@/types/account';
import AccountCard from './AccountCard';

interface SortableItemProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ account, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: account.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="p-2">
        <AccountCard account={account} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};

interface AccountsGridProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onReorder: (accounts: Account[]) => void;
}

const AccountsGrid: React.FC<AccountsGridProps> = ({ 
  accounts, 
  onEdit, 
  onDelete, 
  onReorder 
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = accounts.findIndex(item => item.id === active.id);
      const newIndex = accounts.findIndex(item => item.id === over?.id);
      
      const reordered = arrayMove(accounts, oldIndex, newIndex)
        .map((item, index) => ({ ...item, order: index }));
      
      onReorder(reordered);
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={accounts.map(account => account.id)} 
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {accounts.map(account => (
            <SortableItem
              key={account.id}
              account={account}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default AccountsGrid;
