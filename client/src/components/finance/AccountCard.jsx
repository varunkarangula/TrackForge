import { CreditCard, Wallet, Landmark, Edit2, Trash2 } from 'lucide-react';

const typeIcon = { cash: Wallet, bank: Landmark };

const AccountCard = ({ account, onEdit, onDelete }) => {
  const Icon = typeIcon[account.type] || CreditCard;
  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${account.color}18`, color: account.color }}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{account.name}</p>
            <p className="text-xs text-zinc-400 capitalize">{account.type}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && <button onClick={() => onEdit(account)} className="p-1.5 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>}
          {onDelete && <button onClick={() => onDelete(account._id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
        </div>
      </div>
      <div>
        <p className="text-xs text-zinc-400 mb-1">Balance</p>
        <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-zinc-900 dark:text-zinc-100' : 'text-red-500'}`}>
          ₹{account.balance.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default AccountCard;
