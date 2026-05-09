import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import { X, ArrowRight } from 'lucide-react';

const localISONow = () => {
  const tz = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(Date.now() - tz)).toISOString().slice(0, 16);
};

const TransferForm = ({ isOpen, onClose, onSuccess }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState(localISONow());
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    axiosInstance.get('/accounts').then(r => {
      setAccounts(r.data);
      if (r.data.length >= 2) { setFrom(r.data[0]._id); setTo(r.data[1]._id); }
    }).catch(console.error);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    try {
      await axiosInstance.post('/accounts/transfer', { fromAccountId: from, toAccountId: to, amount: Number(amount), description, datetime: new Date(datetime).toISOString() });
      onSuccess(); onClose();
    } catch (e) { setError(e.response?.data?.message || 'Transfer failed'); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" /> Transfer Funds
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          {error && <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">From</label>
                <select className="input" required value={from} onChange={e => setFrom(e.target.value)}>{accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}</select>
              </div>
              <div>
                <label className="label">To</label>
                <select className="input" required value={to} onChange={e => setTo(e.target.value)}>{accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}</select>
              </div>
            </div>
            <div><label className="label">Amount (₹)</label><input type="number" min="0.01" step="0.01" className="input" required value={amount} onChange={e => setAmount(e.target.value)} /></div>
            <div><label className="label">Date & Time</label><input type="datetime-local" className="input" required value={datetime} onChange={e => setDatetime(e.target.value)} /></div>
            <div><label className="label">Description <span className="normal-case font-normal text-zinc-400">(optional)</span></label><input type="text" className="input" value={description} onChange={e => setDescription(e.target.value)} /></div>
            <button type="submit" className="w-full btn-primary justify-center py-2">Transfer</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;
