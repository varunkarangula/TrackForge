import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { Wallet, Plus, Trash2, Edit2, ArrowRight, Landmark, Tag, CalendarRange, X } from 'lucide-react';
import TransactionForm from '../components/finance/TransactionForm.jsx';
import AccountCard from '../components/finance/AccountCard.jsx';
import TransferForm from '../components/finance/TransferForm.jsx';
import BudgetCard from '../components/finance/BudgetCard.jsx';
import CategoryManager from '../components/finance/CategoryManager.jsx';

const FinancesPage = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const tabs = [
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'accounts', label: 'Accounts', icon: Landmark },
    { id: 'budgets', label: 'Budgets', icon: CalendarRange },
    { id: 'categories', label: 'Categories', icon: Tag },
  ];
  return (
    <div className="space-y-5">
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
              activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'accounts' && <AccountsTab />}
        {activeTab === 'budgets' && <BudgetsTab />}
        {activeTab === 'categories' && <CategoryManager />}
      </div>
    </div>
  );
};

/* ─── Modal Shell ──────────────────────────────────────────────────────────── */
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div className="card w-full max-w-md shadow-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

/* ─── Transactions Tab ─────────────────────────────────────────────────────── */
const TransactionsTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [editTransaction, setEditTransaction] = useState(null);

  const fetch = async () => {
    try { const { data } = await axiosInstance.get('/transactions'); setTransactions(data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await axiosInstance.delete(`/transactions/${id}`).catch(console.error);
    fetch();
  };
  const openAdd = (type) => { setModalType(type); setEditTransaction(null); setIsModalOpen(true); };
  const openEdit = (t) => { setEditTransaction(t); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditTransaction(null); };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Recent Transactions</h2>
        <div className="flex gap-2">
          <button onClick={() => openAdd('expense')} className="btn-danger text-xs py-1.5"><Plus className="w-3.5 h-3.5" />Expense</button>
          <button onClick={() => openAdd('income')} className="btn-success text-xs py-1.5"><Plus className="w-3.5 h-3.5" />Income</button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <EmptyState icon={Wallet} title="No transactions yet" message="Add an expense or income to start tracking your finances." />
      ) : (
        <div className="card overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
          {transactions.map(t => (
            <div key={t._id} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: `${t.category?.color}18` }}>
                {t.category?.icon || '📦'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{t.description || t.category?.name}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {new Date(t.datetime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })} · {t.account?.name} · {t.category?.name}
                </p>
              </div>
              <span className={`text-sm font-semibold shrink-0 ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TransactionForm isOpen={isModalOpen} onClose={handleClose} initialType={modalType} transaction={editTransaction} onSuccess={fetch} />
    </div>
  );
};

/* ─── Accounts Tab ─────────────────────────────────────────────────────────── */
const AccountsTab = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'bank', balance: 0, color: '#6366F1' });
  const [error, setError] = useState(null);

  const fetch = async () => {
    try { const { data } = await axiosInstance.get('/accounts'); setAccounts(data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditAccount(null); setForm({ name: '', type: 'bank', balance: 0, color: '#6366F1' }); setError(null); setIsModalOpen(true); };
  const openEdit = (acc) => { setEditAccount(acc); setForm({ name: acc.name, type: acc.type, balance: acc.balance, color: acc.color }); setError(null); setIsModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    try {
      editAccount
        ? await axiosInstance.put(`/accounts/${editAccount._id}`, { name: form.name, type: form.type, color: form.color })
        : await axiosInstance.post('/accounts', form);
      setIsModalOpen(false); fetch();
    } catch (e) { setError(e.response?.data?.message || 'Failed to save account'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this account?')) return;
    await axiosInstance.delete(`/accounts/${id}`).catch(e => alert(e.response?.data?.message || 'Failed'));
    fetch();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Your Accounts</h2>
        <div className="flex gap-2">
          <button onClick={() => setIsTransferOpen(true)} className="btn-secondary text-xs py-1.5"><ArrowRight className="w-3.5 h-3.5" />Transfer</button>
          <button onClick={openAdd} className="btn-primary text-xs py-1.5"><Plus className="w-3.5 h-3.5" />Add Account</button>
        </div>
      </div>

      {accounts.length === 0
        ? <EmptyState icon={Landmark} title="No accounts" message="Add a bank, cash, or wallet account to start tracking funds." />
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{accounts.map(acc => <AccountCard key={acc._id} account={acc} onEdit={openEdit} onDelete={handleDelete} />)}</div>
      }

      {isModalOpen && (
        <Modal title={editAccount ? 'Edit Account' : 'Add Account'} onClose={() => setIsModalOpen(false)}>
          {error && <div className="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Account Name</label><input className="input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Type</label>
                <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="cash">Cash</option><option value="bank">Bank</option><option value="wallet">Wallet</option><option value="other">Other</option>
                </select>
              </div>
              <div><label className="label">Color</label><input type="color" className="input h-10 p-1 cursor-pointer" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} /></div>
            </div>
            {!editAccount && <div><label className="label">Opening Balance (₹)</label><input type="number" step="0.01" className="input" required value={form.balance} onChange={e => setForm({ ...form, balance: e.target.value })} /></div>}
            <button type="submit" className="w-full btn-primary justify-center py-2">{editAccount ? 'Update Account' : 'Create Account'}</button>
          </form>
        </Modal>
      )}
      <TransferForm isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} onSuccess={fetch} />
    </div>
  );
};

/* ─── Budgets Tab ──────────────────────────────────────────────────────────── */
const BudgetsTab = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [form, setForm] = useState({ category: '', limitAmount: '' });
  const [error, setError] = useState(null);
  const month = new Date().getMonth() + 1, year = new Date().getFullYear();

  const fetchBudgets = async () => {
    try { const { data } = await axiosInstance.get(`/budgets?month=${month}&year=${year}`); setBudgets(data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => {
    fetchBudgets();
    axiosInstance.get('/categories').then(r => setCategories(r.data.filter(c => c.type === 'expense' || c.type === 'both'))).catch(console.error);
  }, []);

  const openAdd = () => { setEditBudget(null); setForm({ category: categories[0]?._id || '', limitAmount: '' }); setError(null); setIsModalOpen(true); };
  const openEdit = (b) => { setEditBudget(b); setForm({ category: b.category._id, limitAmount: b.limitAmount.toString() }); setError(null); setIsModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    try {
      editBudget
        ? await axiosInstance.put(`/budgets/${editBudget._id}`, { limitAmount: Number(form.limitAmount) })
        : await axiosInstance.post('/budgets', { ...form, limitAmount: Number(form.limitAmount), month, year });
      setIsModalOpen(false); fetchBudgets();
    } catch (e) { setError(e.response?.data?.message || 'Failed to save budget'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this budget?')) return;
    await axiosInstance.delete(`/budgets/${id}`).catch(console.error);
    fetchBudgets();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Monthly Budgets</h2>
        <button onClick={openAdd} className="btn-primary text-xs py-1.5"><Plus className="w-3.5 h-3.5" />Set Budget</button>
      </div>

      {budgets.length === 0
        ? <EmptyState icon={CalendarRange} title="No budgets set" message="Set spending limits per category to track your monthly budget." />
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{budgets.map(b => <BudgetCard key={b._id} budget={b} onEdit={openEdit} onDelete={handleDelete} />)}</div>
      }

      {isModalOpen && (
        <Modal title={editBudget ? 'Edit Budget' : 'Set Budget'} onClose={() => setIsModalOpen(false)}>
          {error && <div className="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Category</label>
              {editBudget
                ? <div className="input bg-zinc-50 dark:bg-zinc-800 cursor-default">{editBudget.category.icon} {editBudget.category.name}</div>
                : <select className="input" required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="" disabled>Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                  </select>
              }
            </div>
            <div><label className="label">Limit Amount (₹)</label><input type="number" min="1" step="0.01" className="input" required value={form.limitAmount} onChange={e => setForm({ ...form, limitAmount: e.target.value })} /></div>
            <button type="submit" className="w-full btn-primary justify-center py-2">{editBudget ? 'Update Budget' : 'Save Budget'}</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FinancesPage;
