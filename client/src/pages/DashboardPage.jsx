import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import {
  Wallet, CheckSquare, Calendar, TrendingUp, Landmark, Banknote,
  Bell, Clock, MapPin, RefreshCcw, AlertTriangle
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const getOrdinal = (n) => {
  if (n > 3 && n < 21) return 'th';
  switch (n % 10) {
    case 1:  return 'st';
    case 2:  return 'nd';
    case 3:  return 'rd';
    default: return 'th';
  }
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const toLocalDate = (iso) => {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const fmt12 = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

const PRIORITY_BADGE = {
  High:   'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Low:    'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
};
const PRIORITY_BAR = { High: 'bg-red-500', Medium: 'bg-amber-500', Low: 'bg-blue-500' };

/* ─── Sub-components ───────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, title, value, subtitle, iconBg }) => (
  <div className="card p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">{value}</p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">{subtitle}</p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

/* ─── Reminder Card ────────────────────────────────────────────────────────── */
const ReminderItem = ({ icon: Icon, iconColor, label, title, subtitle, urgency }) => (
  <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
    urgency === 'high'
      ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
      : urgency === 'medium'
      ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
      : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
  }`}>
    <div className={`shrink-0 p-1.5 rounded-lg ${iconColor}`}>
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">{label}</p>
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{title}</p>
      {subtitle && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

/* ─── Main Page ────────────────────────────────────────────────────────────── */
const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [events, setEvents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const getLast6Months = () => {
    const months = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      months.push({ label: d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }), value: `${year}-${month}` });
    }
    return months;
  };
  const availableMonths = getLast6Months();

  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0].value);
  const [monthSummary, setMonthSummary] = useState(null);

  useEffect(() => {
    const fetchMonthSummary = async () => {
      try {
        const res = await axiosInstance.get('/transactions/summary', { params: { month: selectedMonth } });
        setMonthSummary(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMonthSummary();
  }, [selectedMonth]);

  useEffect(() => {
    const load = async () => {
      try {
        const [sumR, taskR, transR, accR, evtR, subR] = await Promise.all([
          axiosInstance.get('/transactions/summary'),
          axiosInstance.get('/tasks'),
          axiosInstance.get('/transactions'),
          axiosInstance.get('/accounts'),
          axiosInstance.get('/events'),
          axiosInstance.get('/subscriptions'),
        ]);
        setSummary(sumR.data);
        setTasks(taskR.data);
        setTransactions(transR.data.slice(0, 5));
        setAccounts(accR.data);
        setEvents(evtR.data);
        setSubscriptions(subR.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  /* ── Reminder logic ── */
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  // Tasks due today or tomorrow (not completed)
  const taskReminders = tasks
    .filter(t => t.status !== 'Completed' && t.endDate)
    .filter(t => {
      const d = toLocalDate(t.endDate);
      return isSameDay(d, today) || isSameDay(d, tomorrow);
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  // Events happening today or tomorrow
  const eventReminders = events
    .filter(e => {
      const d = toLocalDate(e.date);
      return isSameDay(d, today) || isSameDay(d, tomorrow);
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date) || a.startTime.localeCompare(b.startTime));

  // Subscriptions due today or tomorrow (remind 1 day before)
  const subReminders = subscriptions.filter(s =>
    s.dayOfMonth === today.getDate() ||
    s.dayOfMonth === tomorrow.getDate()
  );

  const totalReminders = taskReminders.length + eventReminders.length + subReminders.length;

  /* ── Stats ── */
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const threeDaysFromNow = new Date(startOfToday.getTime() + 3 * 24 * 60 * 60 * 1000);
  const dueSoon = tasks.filter(t =>
    t.status !== 'Completed' && t.endDate &&
    toLocalDate(t.endDate) >= startOfToday &&
    toLocalDate(t.endDate) <= threeDaysFromNow
  ).length;

  return (
    <div className="space-y-6">
      {/* ── Reminder Banner ── */}
      {totalReminders > 0 && (
        <div className="card p-4 border-l-4 border-l-amber-400">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {totalReminders} Reminder{totalReminders !== 1 ? 's' : ''} — Today & Tomorrow
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {taskReminders.map(t => {
              const isToday = isSameDay(toLocalDate(t.endDate), today);
              return (
                <ReminderItem
                  key={t._id}
                  icon={AlertTriangle}
                  iconColor={isToday ? 'bg-red-100 dark:bg-red-950/40 text-red-500' : 'bg-amber-100 dark:bg-amber-950/40 text-amber-500'}
                  label={`Task · ${isToday ? 'Due TODAY' : 'Due Tomorrow'}`}
                  title={t.title}
                  subtitle={<span className={`text-[10px] px-1.5 py-0.5 rounded-full ${PRIORITY_BADGE[t.priority]}`}>{t.priority} priority</span>}
                  urgency={isToday ? 'high' : 'medium'}
                />
              );
            })}
            {eventReminders.map(e => {
              const isToday = isSameDay(toLocalDate(e.date), today);
              return (
                <ReminderItem
                  key={e._id}
                  icon={Clock}
                  iconColor="bg-amber-100 dark:bg-amber-950/40 text-amber-500"
                  label={`Event · ${isToday ? 'Today' : 'Tomorrow'} ${fmt12(e.startTime)}`}
                  title={e.title}
                  subtitle={e.location ? `📍 ${e.location}` : `${fmt12(e.startTime)} – ${fmt12(e.endTime)}`}
                  urgency={isToday ? 'high' : 'medium'}
                />
              );
            })}
            {subReminders.map(s => {
              const isDueToday = s.dayOfMonth === today.getDate();
              return (
                <ReminderItem
                  key={s._id}
                  icon={RefreshCcw}
                  iconColor="bg-violet-100 dark:bg-violet-950/40 text-violet-500"
                  label={`Subscription · Due ${isDueToday ? 'TODAY' : 'Tomorrow'}`}
                  title={`${s.icon} ${s.name}`}
                  subtitle={s.amount > 0 ? `₹${s.amount.toLocaleString('en-IN')}/month` : 'Recurring monthly'}
                  urgency={isDueToday ? 'high' : 'medium'}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} title="Total Expenses" value={`₹${(summary?.totalExpense || 0).toLocaleString('en-IN')}`} subtitle="This month" iconBg="bg-red-100 dark:bg-red-950/40 text-red-500" />
        <StatCard icon={TrendingUp} title="Total Income" value={`₹${(summary?.totalIncome || 0).toLocaleString('en-IN')}`} subtitle="This month" iconBg="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500" />
        <StatCard icon={CheckSquare} title="Tasks Done" value={`${completedTasks} / ${totalTasks}`} subtitle={totalTasks > 0 ? `Completion rate: ${Math.round((completedTasks / totalTasks) * 100)}%` : 'No tasks yet'} iconBg="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-500" />
        <StatCard icon={Calendar} title="Due Soon" value={dueSoon} subtitle="Within 3 days" iconBg="bg-amber-100 dark:bg-amber-950/40 text-amber-500" />
      </div>

      {/* ── Accounts strip ── */}
      {accounts.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {accounts.map(acc => (
            <div key={acc._id} className="card shrink-0 flex items-center gap-3 px-4 py-3 min-w-[180px] hover:shadow-md transition-all duration-200">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${acc.color}20`, color: acc.color }}>
                {acc.type === 'cash' ? <Banknote className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-400 truncate">{acc.name}</p>
                <p className={`font-semibold text-sm ${acc.balance >= 0 ? 'text-zinc-900 dark:text-zinc-100' : 'text-red-500'}`}>
                  ₹{acc.balance.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Charts col ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Bar chart */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Income vs Expenses — 6 months</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary?.trendData || []} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" className="dark:stroke-zinc-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="income" fill="#22C55E" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { title: 'Expenses by Category', data: summary?.expenseBreakdown, fallback: '#EF4444' },
              { title: 'Income by Category',   data: summary?.incomeBreakdown,  fallback: '#22C55E' },
            ].map(({ title, data, fallback }) => (
              <div key={title} className="card p-5">
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-3">{title}</h3>
                <div className="h-40">
                  {data?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="total" nameKey="name">
                          {data.map((e, i) => <Cell key={i} fill={e.color || fallback} />)}
                        </Pie>
                        <Tooltip formatter={v => `₹${Number(v).toLocaleString('en-IN')}`} contentStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-zinc-400">No data yet</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected month pie charts */}
          <div className="card p-5 mt-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Monthly Breakdown</h3>
              <select 
                className="input py-1.5 text-xs w-full sm:w-auto" 
                value={selectedMonth} 
                onChange={e => setSelectedMonth(e.target.value)}
              >
                {availableMonths.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: 'Expenses', data: monthSummary?.expenseBreakdown, fallback: '#EF4444' },
                { title: 'Income',   data: monthSummary?.incomeBreakdown,  fallback: '#22C55E' },
              ].map(({ title, data, fallback }) => (
                <div key={title} className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800/50">
                  <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 text-center">{title}</h4>
                  <div className="h-40">
                    {data?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="total" nameKey="name">
                            {data.map((e, i) => <Cell key={i} fill={e.color || fallback} />)}
                          </Pie>
                          <Tooltip formatter={v => `₹${Number(v).toLocaleString('en-IN')}`} contentStyle={{ fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-zinc-400">No data</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right col ── */}
        <div className="space-y-5">
          {/* Recent transactions */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Recent Transactions</h3>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map(t => (
                  <div key={t._id} className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ backgroundColor: `${t.category?.color}20` }}>
                        {t.category?.icon || '📦'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{t.description || t.category?.name}</p>
                        <p className="text-xs text-zinc-400">{new Date(t.datetime).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold shrink-0 ml-2 ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-zinc-400">No transactions yet.</p>}
          </div>

          {/* Upcoming events */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Upcoming Events</h3>
            {(() => {
              const upcoming = events
                .filter(e => toLocalDate(e.date) >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3);
              return upcoming.length > 0 ? (
                <div className="space-y-2">
                  {upcoming.map(e => (
                    <div key={e._id} className="relative pl-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l" style={{ backgroundColor: e.color }} />
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{e.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{fmt12(e.startTime)}</span>
                        {e.location && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{e.location}</span>}
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {isSameDay(toLocalDate(e.date), today) ? 'Today' : isSameDay(toLocalDate(e.date), tomorrow) ? 'Tomorrow' : new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-zinc-400">No upcoming events.</p>;
            })()}
          </div>

          {/* Upcoming tasks */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Tasks Due Soon</h3>
            {(() => {
              const upcoming = tasks
                .filter(t =>
                  t.status !== 'Completed' && t.endDate &&
                  toLocalDate(t.endDate) >= startOfToday &&
                  toLocalDate(t.endDate) <= threeDaysFromNow
                )
                .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
                .slice(0, 3);
              return upcoming.length > 0 ? (
                <div className="space-y-2">
                  {upcoming.map(task => (
                    <div key={task._id} className="relative pl-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l ${PRIORITY_BAR[task.priority]}`} />
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{task.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-zinc-400">
                          {isSameDay(toLocalDate(task.endDate), today) ? '🔴 Due Today' : isSameDay(toLocalDate(task.endDate), tomorrow) ? '🟡 Due Tomorrow' : `Due ${new Date(task.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${PRIORITY_BADGE[task.priority]}`}>{task.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-zinc-400">No tasks due soon.</p>;
            })()}
          </div>

          {/* Subscriptions due this month */}
          {subscriptions.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-violet-500" /> Subscriptions
              </h3>
              <div className="space-y-2">
                {subscriptions.slice(0, 4).map(sub => {
                  const isDueSoon = sub.dayOfMonth === today.getDate() || sub.dayOfMonth === tomorrow.getDate();
                  return (
                    <div key={sub._id} className={`flex items-center justify-between py-1.5 px-2 rounded-lg transition-all ${isDueSoon ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900' : ''}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm shrink-0">{sub.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{sub.name}</p>
                          <p className="text-[10px] text-zinc-400">
                            {isDueSoon ? <span className="text-amber-500 font-medium">Due {sub.dayOfMonth === today.getDate() ? 'today' : 'tomorrow'}!</span> : `Due on ${sub.dayOfMonth}${getOrdinal(sub.dayOfMonth)} of Every Month`}
                          </p>
                        </div>
                      </div>
                      {sub.amount > 0 && <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 shrink-0">₹{sub.amount}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
