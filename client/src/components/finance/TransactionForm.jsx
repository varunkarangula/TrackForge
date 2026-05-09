import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import { X } from 'lucide-react';

const localISONow = () => {
  const tz = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(Date.now() - tz)).toISOString().slice(0, 16);
};

const TransactionForm = ({ isOpen, onClose, initialType = 'expense', transaction = null, onSuccess }) => {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState(localISONow());
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => { if (isOpen) fetchDropdownData(); }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategoryId(transaction.category?._id || transaction.category || '');
      setAccountId(transaction.account?._id || transaction.account || '');
      setDescription(transaction.description || '');
      const dt = new Date(transaction.datetime);
      setDatetime(new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    } else {
      setType(initialType); setAmount(''); setDescription(''); setDatetime(localISONow());
    }
  }, [isOpen, transaction]);

  const fetchDropdownData = async () => {
    try {
      const [cR, aR] = await Promise.all([axiosInstance.get('/categories'), axiosInstance.get('/accounts')]);
      setCategories(cR.data);
      setAccounts(aR.data);
      if (!transaction) {
        if (aR.data.length > 0) setAccountId(aR.data[0]._id);
        const first = cR.data.find(c => c.type === initialType || c.type === 'both');
        if (first) setCategoryId(first._id);
      }
    } catch (e) { console.error(e); }
  };

  const switchType = (t) => {
    setType(t);
    const first = categories.find(c => c.type === t || c.type === 'both');
    if (first) setCategoryId(first._id);
  };

  // Auto-correct categoryId when type/categories mismatch (stale closure guard)
  useEffect(() => {
    if (!categories.length) return;
    const filtered = categories.filter(c => c.type === type || c.type === 'both');
    if (filtered.length > 0 && !filtered.some(c => c._id === categoryId)) setCategoryId(filtered[0]._id);
  }, [type, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accounts.length) return;
    setError(null);
    const payload = { type, amount: Number(amount), category: categoryId, account: accountId, description, datetime: new Date(datetime).toISOString() };
    try {
      transaction ? await axiosInstance.put(`/transactions/${transaction._id}`, payload) : await axiosInstance.post('/transactions', payload);
      onSuccess(); onClose();
    } catch (e) { setError(e.response?.data?.message || 'Failed to save'); }
  };

  if (!isOpen) return null;
  const filtered = categories.filter(c => c.type === type || c.type === 'both');
  const noAccounts = accounts.length === 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {transaction ? 'Edit Transaction' : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {noAccounts && (
            <div className="px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
              No accounts found. Go to the <strong>Accounts</strong> tab and create one first.
            </div>
          )}

          {!transaction && (
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
              {['expense', 'income'].map(t => (
                <button key={t} type="button" onClick={() => switchType(t)}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                    type === t ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          )}

          {error && <div className="px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Amount (₹)</label>
              <input type="number" required min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Account</label>
                {noAccounts
                  ? <div className="input bg-zinc-50 dark:bg-zinc-800 text-zinc-400 cursor-default">No accounts</div>
                  : <select required value={accountId} onChange={e => setAccountId(e.target.value)} className="input">{accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}</select>
                }
              </div>
              <div>
                <label className="label">Category</label>
                <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input">
                  {filtered.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Date & Time</label>
              <input type="datetime-local" required value={datetime} onChange={e => setDatetime(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Description <span className="normal-case font-normal text-zinc-400">(optional)</span></label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="input" />
            </div>
            <button type="submit" disabled={noAccounts}
              className={`w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all active:scale-95 ${
                noAccounts ? 'bg-zinc-300 cursor-not-allowed' : type === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
              }`}>
              {transaction ? 'Update' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
