import { Edit2, Trash2 } from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { category, limitAmount, spent } = budget;
  const pct = Math.min((spent / limitAmount) * 100, 100);
  const barColor = pct >= 100 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500';
  const textColor = pct >= 100 ? 'text-red-500' : pct >= 75 ? 'text-amber-500' : 'text-emerald-500';

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category.icon}</span>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{category.name}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && <button onClick={() => onEdit(budget)} className="p-1.5 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>}
          {onDelete && <button onClick={() => onDelete(budget._id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
        </div>
      </div>

      <div className="flex justify-between text-xs mb-2">
        <span className="text-zinc-500 dark:text-zinc-400">₹{spent.toLocaleString('en-IN')} spent</span>
        <span className={`font-semibold ${textColor}`}>{Math.round(pct)}%</span>
      </div>

      <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="flex justify-between text-xs mt-2">
        <span className={pct >= 100 ? 'text-red-500 font-medium' : 'text-zinc-400'}>
          {pct >= 100 ? 'Limit exceeded!' : `₹${(limitAmount - spent).toLocaleString('en-IN')} left`}
        </span>
        <span className="text-zinc-400">Limit: ₹{limitAmount.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
};

export default BudgetCard;
