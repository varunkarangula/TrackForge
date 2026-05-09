import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import {
  ChevronLeft, ChevronRight, Plus, X, MapPin, Clock, Trash2, Edit2,
  CalendarDays, ListTodo, RefreshCcw, Circle, CheckCircle2
} from 'lucide-react';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const fmt12 = (t) => { // "14:30" → "2:30 PM"
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const toLocalDate = (iso) => {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const PRIORITY = {
  High:   { bar: 'bg-red-500',   badge: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' },
  Medium: { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' },
  Low:    { bar: 'bg-blue-500',  badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' },
};

/* ─── Modal Shell ──────────────────────────────────────────────────────────── */
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5 overflow-y-auto">{children}</div>
    </div>
  </div>
);

/* ─── Task Form ────────────────────────────────────────────────────────────── */
const TaskForm = ({ initial, prefillDate, onSave }) => {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    priority: initial?.priority || 'Medium',
    dueDate: initial?.dueDate
      ? new Date(initial.dueDate).toISOString().split('T')[0]
      : prefillDate?.toISOString().split('T')[0] || '',
    tags: initial?.tags?.join(', ') || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="label">Title</label><input className="input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
      <div><label className="label">Description</label><textarea className="input resize-none" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Priority</label>
          <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <div><label className="label">Deadline</label><input type="date" className="input" required value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
      </div>
      <div><label className="label">Tags <span className="normal-case font-normal text-zinc-400">(comma-separated)</span></label><input className="input" placeholder="work, personal" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
      <button type="submit" className="w-full btn-primary justify-center py-2">Save Task</button>
    </form>
  );
};

/* ─── Event Form ───────────────────────────────────────────────────────────── */
const EventForm = ({ initial, prefillDate, onSave }) => {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    date: initial?.date
      ? new Date(initial.date).toISOString().split('T')[0]
      : prefillDate?.toISOString().split('T')[0] || '',
    startTime: initial?.startTime || '09:00',
    endTime: initial?.endTime || '10:00',
    location: initial?.location || '',
    color: initial?.color || '#F59E0B',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="label">Event Title</label><input className="input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
      <div><label className="label">Description</label><textarea className="input resize-none" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
      <div><label className="label">Date</label><input type="date" className="input" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label">Start Time</label><input type="time" className="input" required value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} /></div>
        <div><label className="label">End Time</label><input type="time" className="input" required value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} /></div>
      </div>
      <div>
        <label className="label">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input className="input pl-9" placeholder="Office, Zoom link, etc." value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        </div>
      </div>
      <div><label className="label">Color</label><input type="color" className="input h-10 p-1 cursor-pointer" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} /></div>
      <button type="submit" className="w-full btn-primary justify-center py-2">Save Event</button>
    </form>
  );
};

/* ─── Subscription Form ────────────────────────────────────────────────────── */
const SubscriptionForm = ({ initial, onSave }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    amount: initial?.amount || '',
    dayOfMonth: initial?.dayOfMonth || new Date().getDate(),
    icon: initial?.icon || '📱',
    color: initial?.color || '#8B5CF6',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, dayOfMonth: Number(form.dayOfMonth), amount: Number(form.amount) || 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <div><label className="label">Icon</label><input className="input text-center text-xl" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></div>
        <div className="col-span-3"><label className="label">Subscription Name</label><input className="input" required placeholder="Netflix, Spotify, Electricity…" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label">Amount (₹)</label><input type="number" min="0" step="0.01" className="input" placeholder="Optional" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
        <div>
          <label className="label">Billing Day</label>
          <input type="number" min="1" max="31" required className="input" value={form.dayOfMonth} onChange={e => setForm({ ...form, dayOfMonth: e.target.value })} />
          <p className="text-[10px] text-zinc-400 mt-1">Day of every month</p>
        </div>
      </div>
      <div><label className="label">Color</label><input type="color" className="input h-10 p-1 cursor-pointer" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} /></div>
      <button type="submit" className="w-full btn-primary justify-center py-2">Save Subscription</button>
    </form>
  );
};

/* ─── Main Page ────────────────────────────────────────────────────────────── */
const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);

  const [modal, setModal] = useState(null); // { type: 'task'|'event'|'subscription'|'editTask'|'editEvent'|'editSub', data?, date? }

  const fetchAll = useCallback(async () => {
    try {
      const [tR, eR, sR] = await Promise.all([
        axiosInstance.get('/tasks'),
        axiosInstance.get('/events'),
        axiosInstance.get('/subscriptions'),
      ]);
      setTasks(tR.data);
      setEvents(eR.data);
      setSubscriptions(sR.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── CRUD ── */
  const saveTask = async (form) => {
    if (modal?.data) await axiosInstance.put(`/tasks/${modal.data._id}`, form);
    else await axiosInstance.post('/tasks', form);
    fetchAll(); setModal(null);
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete task?')) return;
    await axiosInstance.delete(`/tasks/${id}`);
    fetchAll();
  };

  const cycleStatus = async (task) => {
    const cycle = { Pending: 'In Progress', 'In Progress': 'Completed', Completed: 'Pending' };
    await axiosInstance.patch(`/tasks/${task._id}/status`, { status: cycle[task.status] });
    fetchAll();
  };

  const saveEvent = async (form) => {
    if (modal?.data) await axiosInstance.put(`/events/${modal.data._id}`, form);
    else await axiosInstance.post('/events', form);
    fetchAll(); setModal(null);
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete event?')) return;
    await axiosInstance.delete(`/events/${id}`);
    fetchAll();
  };

  const saveSub = async (form) => {
    if (modal?.data) await axiosInstance.put(`/subscriptions/${modal.data._id}`, form);
    else await axiosInstance.post('/subscriptions', form);
    fetchAll(); setModal(null);
  };

  const deleteSub = async (id) => {
    if (!window.confirm('Delete subscription?')) return;
    await axiosInstance.delete(`/subscriptions/${id}`);
    fetchAll();
  };

  /* ── Calendar logic ── */
  const firstDayRaw = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const startOffset = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // shift to Mon=0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const hasDot = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    const hasTasks  = tasks.some(t => t.dueDate && isSameDay(toLocalDate(t.dueDate), d));
    const hasEvents = events.some(e => isSameDay(toLocalDate(e.date), d));
    const hasSubs   = subscriptions.some(s => s.dayOfMonth === day);
    return { hasTasks, hasEvents, hasSubs };
  };

  /* ── Selected day items ── */
  const dayTasks = tasks.filter(t => t.dueDate && isSameDay(toLocalDate(t.dueDate), selectedDate));
  const dayEvents = events.filter(e => isSameDay(toLocalDate(e.date), selectedDate)).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const daySubs = subscriptions.filter(s => s.dayOfMonth === selectedDate.getDate());

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-zinc-200 dark:border-zinc-700 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8" style={{ height: 'calc(100dvh - 56px)' }}>

      {/* ── CALENDAR (60%) ─────────────────────────────────────────────────── */}
      <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-800" style={{ flex: '0 0 60%', minHeight: 0 }}>
        {/* Month navigation */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm md:text-base">
              {MONTHS[viewMonth]} {viewYear}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
                else setViewMonth(m => m - 1);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); setSelectedDate(today); }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              Today
            </button>
            <button
              onClick={() => {
                if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
                else setViewMonth(m => m + 1);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex-1 overflow-hidden flex flex-col px-2 md:px-4 pb-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1 shrink-0">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[10px] md:text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 py-2">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${totalCells / 7}, 1fr)` }}>
            {Array.from({ length: totalCells }).map((_, idx) => {
              const dayNum = idx - startOffset + 1;
              const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
              const cellDate = isCurrentMonth ? new Date(viewYear, viewMonth, dayNum) : null;
              const isToday = cellDate && isSameDay(cellDate, today);
              const isSelected = cellDate && isSameDay(cellDate, selectedDate);
              const dots = isCurrentMonth ? hasDot(dayNum) : null;

              return (
                <div
                  key={idx}
                  onClick={() => cellDate && setSelectedDate(cellDate)}
                  className={`relative flex flex-col items-center pt-1.5 pb-1 mx-0.5 mb-0.5 rounded-lg cursor-pointer transition-all duration-150 group
                    ${!isCurrentMonth ? 'opacity-0 pointer-events-none' : ''}
                    ${isSelected ? 'bg-primary text-white' : isToday ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60'}
                  `}
                >
                  <span className={`text-xs md:text-sm font-medium leading-none
                    ${isSelected ? 'text-white' : isToday ? 'text-primary font-bold' : 'text-zinc-700 dark:text-zinc-300'}
                  `}>
                    {isCurrentMonth ? dayNum : ''}
                  </span>
                  {/* Dots */}
                  {dots && (
                    <div className="flex gap-0.5 mt-1">
                      {dots.hasTasks  && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : 'bg-primary'}`} />}
                      {dots.hasEvents && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : 'bg-amber-400'}`} />}
                      {dots.hasSubs   && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : 'bg-violet-400'}`} />}
                    </div>
                  )}
                  {/* Quick add button on hover */}
                  {isCurrentMonth && !isSelected && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedDate(cellDate); setModal({ type: 'task', date: cellDate }); }}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] hover:bg-primary hover:text-white"
                    >+</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-4 md:px-6 py-2 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
          {[['bg-primary', 'Tasks'], ['bg-amber-400', 'Events'], ['bg-violet-400', 'Subscriptions']].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1.5 text-[10px] text-zinc-400">
              <span className={`w-2 h-2 rounded-full ${c}`} />{l}
            </span>
          ))}
        </div>
      </div>

      {/* ── DETAIL PANEL (40%) ─────────────────────────────────────────────── */}
      <div className="flex flex-col min-h-0" style={{ flex: '0 0 40%' }}>
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-[10px] text-zinc-400">
              {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''} · {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''} · {daySubs.length} subscription{daySubs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setModal({ type: 'task', date: selectedDate })} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all">
              <Plus className="w-3 h-3" /><span className="hidden sm:inline">Task</span>
            </button>
            <button onClick={() => setModal({ type: 'event', date: selectedDate })} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-950/60 transition-all">
              <Plus className="w-3 h-3" /><span className="hidden sm:inline">Event</span>
            </button>
            <button onClick={() => setModal({ type: 'subscription' })} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-xs font-medium hover:bg-violet-200 dark:hover:bg-violet-950/60 transition-all">
              <Plus className="w-3 h-3" /><span className="hidden sm:inline">Sub</span>
            </button>
          </div>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800 h-full">

            {/* Tasks column */}
            <div className="p-4 space-y-2 overflow-y-auto">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <ListTodo className="w-3 h-3" /> Tasks
              </p>
              {dayTasks.length === 0 && <p className="text-xs text-zinc-400 py-4 text-center">No tasks</p>}
              {dayTasks.map(task => {
                const p = PRIORITY[task.priority] || PRIORITY.Medium;
                return (
                  <div key={task._id} className="group relative bg-zinc-50 dark:bg-zinc-800/60 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-sm transition-all">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.bar}`} />
                    <div className="pl-2 flex items-start gap-2">
                      <button onClick={() => cycleStatus(task)} className="mt-0.5 shrink-0 text-zinc-300 dark:text-zinc-600 hover:text-primary transition-colors">
                        {task.status === 'Completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : task.status === 'In Progress' ? <CheckCircle2 className="w-4 h-4 text-amber-400" /> : <Circle className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${task.status === 'Completed' ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>{task.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.badge}`}>{task.priority}</span>
                          <span className="text-[10px] text-zinc-400">{task.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => setModal({ type: 'editTask', data: task })} className="p-1 rounded text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all"><Edit2 className="w-3 h-3" /></button>
                        <button onClick={() => deleteTask(task._id)} className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Events column */}
            <div className="p-4 space-y-2 overflow-y-auto">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Events
              </p>
              {dayEvents.length === 0 && <p className="text-xs text-zinc-400 py-4 text-center">No events</p>}
              {dayEvents.map(event => (
                <div key={event._id} className="group bg-zinc-50 dark:bg-zinc-800/60 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700 hover:shadow-sm transition-all relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l" style={{ backgroundColor: event.color }} />
                  <div className="pl-2">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{event.title}</p>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => setModal({ type: 'editEvent', data: event })} className="p-1 rounded text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all"><Edit2 className="w-3 h-3" /></button>
                        <button onClick={() => deleteEvent(event._id)} className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{fmt12(event.startTime)} – {fmt12(event.endTime)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Subscriptions column */}
            <div className="p-4 space-y-2 overflow-y-auto">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <RefreshCcw className="w-3 h-3" /> Subscriptions due on {selectedDate.getDate()}th
              </p>
              {daySubs.length === 0 && <p className="text-xs text-zinc-400 py-4 text-center">None due</p>}
              {daySubs.map(sub => (
                <div key={sub._id} className="group bg-zinc-50 dark:bg-zinc-800/60 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700 hover:shadow-sm transition-all relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l" style={{ backgroundColor: sub.color }} />
                  <div className="pl-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{sub.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{sub.name}</p>
                        {sub.amount > 0 && <p className="text-[10px] text-zinc-400">₹{sub.amount.toLocaleString('en-IN')}/mo</p>}
                      </div>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => setModal({ type: 'editSub', data: sub })} className="p-1 rounded text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => deleteSub(sub._id)} className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 pt-1">All Subscriptions</p>
                {subscriptions.length === 0 && <p className="text-xs text-zinc-400 py-2 text-center">No subscriptions added</p>}
                {subscriptions.map(sub => (
                  <div key={sub._id} className="group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm shrink-0">{sub.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{sub.name}</p>
                        <p className="text-[10px] text-zinc-400">Every {sub.dayOfMonth}th{sub.amount > 0 ? ` · ₹${sub.amount}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => setModal({ type: 'editSub', data: sub })} className="p-1 rounded text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => deleteSub(sub._id)} className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {modal?.type === 'task' && (
        <Modal title="Add Task" onClose={() => setModal(null)}>
          <TaskForm prefillDate={modal.date} onSave={saveTask} />
        </Modal>
      )}
      {modal?.type === 'editTask' && (
        <Modal title="Edit Task" onClose={() => setModal(null)}>
          <TaskForm initial={modal.data} onSave={saveTask} />
        </Modal>
      )}
      {modal?.type === 'event' && (
        <Modal title="Add Event" onClose={() => setModal(null)}>
          <EventForm prefillDate={modal.date} onSave={saveEvent} />
        </Modal>
      )}
      {modal?.type === 'editEvent' && (
        <Modal title="Edit Event" onClose={() => setModal(null)}>
          <EventForm initial={modal.data} onSave={saveEvent} />
        </Modal>
      )}
      {(modal?.type === 'subscription' || modal?.type === 'editSub') && (
        <Modal title={modal.data ? 'Edit Subscription' : 'Add Subscription'} onClose={() => setModal(null)}>
          <SubscriptionForm initial={modal.data} onSave={saveSub} />
        </Modal>
      )}
    </div>
  );
};

export default TaskPage;
