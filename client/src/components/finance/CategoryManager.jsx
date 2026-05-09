import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import { Plus, X, Lock, Trash2, Edit2 } from 'lucide-react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'expense', icon: '📦', color: '#6366F1' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try { const { data } = await axiosInstance.get('/categories'); setCategories(data); }
    catch (e) { console.error(e); }
  };
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    try {
      editId ? await axiosInstance.put(`/categories/${editId}`, form) : await axiosInstance.post('/categories', form);
      setIsModalOpen(false); fetch();
    } catch (e) { setError(e.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await axiosInstance.delete(`/categories/${id}`).catch(e => alert(e.response?.data?.message || 'Failed'));
    fetch();
  };

  const openEdit = (cat) => { setForm({ name: cat.name, type: cat.type, icon: cat.icon, color: cat.color }); setEditId(cat._id); setIsModalOpen(true); };
  const openAdd = () => { setForm({ name: '', type: 'expense', icon: '📦', color: '#6366F1' }); setEditId(null); setIsModalOpen(true); };

  const expenseCats = categories.filter(c => c.type === 'expense' || c.type === 'both');
  const incomeCats = categories.filter(c => c.type === 'income' || c.type === 'both');

  const List = ({ cats, label }) => (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cats.map(cat => (
          <div key={cat._id} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ backgroundColor: `${cat.color}18`, color: cat.color }}>
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{cat.name}</span>
            </div>
            <div className="flex items-center gap-1">
              {cat.isDefault ? (
                <Lock className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" />
              ) : (
                <>
                  <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(cat._id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Manage Categories</h2>
        <button onClick={openAdd} className="btn-primary text-xs py-1.5"><Plus className="w-3.5 h-3.5" />Add Category</button>
      </div>

      <List cats={expenseCats} label="Expense Categories" />
      <List cats={incomeCats} label="Income Categories" />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{editId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5">
              {error && <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="label">Name</label><input className="input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Type</label>
                    <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option value="expense">Expense</option><option value="income">Income</option><option value="both">Both</option>
                    </select>
                  </div>
                  <div><label className="label">Emoji Icon</label><input className="input" required value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></div>
                </div>
                <div><label className="label">Color</label><input type="color" className="input h-10 p-1 cursor-pointer" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} /></div>
                <button type="submit" className="w-full btn-primary justify-center py-2">Save</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
