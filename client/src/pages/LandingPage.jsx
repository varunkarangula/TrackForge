import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  LayoutDashboard, Wallet, CalendarCheck, TrendingUp, ShieldCheck, Zap,
  Sun, Moon, ArrowRight, CheckCircle, BarChart3, ListTodo
} from 'lucide-react';

const Header = () => {
  const { dark, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">TrackForge</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">How it works</a>
          <a href="#about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">About</a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/login" className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Login
          </Link>
          <Link to="/register" className="btn-primary py-1.5 px-3 text-xs">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">TrackForge</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
            A personal productivity tool for managing your finances and daily schedule in one clean workspace.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">Product</p>
          <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li><a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">How it works</a></li>
            <li><Link to="/register" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Get started</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">Account</p>
          <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li><Link to="/login" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Register</Link></li>
            <li><Link to="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 dark:text-zinc-600">
        <span>© {new Date().getFullYear()} TrackForge. All rights reserved.</span>
        <span>Built with MERN Stack</span>
      </div>
    </div>
  </footer>
);

const FeatureCard = ({ icon: Icon, color, title, desc }) => (
  <div className="group card p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ step, title, desc }) => (
  <div className="flex gap-4">
    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
      {step}
    </div>
    <div>
      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const LandingPage = () => (
  <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
    <Header />

    {/* Hero */}
    <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accentGreen/5 dark:from-primary/10 dark:to-accentGreen/10 pointer-events-none" />
      <div className="relative max-w-3xl space-y-6 animate-fade-in">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary text-xs font-medium">
          <Zap className="w-3 h-3" /> Personal Finance & Productivity Tool
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight">
          Track expenses.<br />Manage tasks.<br />
          <span className="text-primary">One workspace.</span>
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Productivity Meets Financial Clarity 
          TrackForge combines a powerful expense tracker and schedule manager into one clean, distraction-free dashboard. 
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/register" className="btn-primary px-6 py-2.5 text-sm">
            Get started for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-2.5 text-sm">
            Login to dashboard
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 pt-2 text-xs text-zinc-400 dark:text-zinc-600">
          {['Expense Tracker', 'Task Manager', 'Unified Interface'].map(t => (
            <span key={t} className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-accentGreen" />{t}
            </span>
          ))}
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative mt-16 w-full max-w-4xl mx-auto">
        <div className="card overflow-hidden shadow-2xl shadow-zinc-200 dark:shadow-zinc-900">
          <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-700">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-zinc-400 mx-auto">TrackForge — Dashboard</span>
          </div>
          <div className="p-5 bg-white dark:bg-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Expenses', value: '₹24,580', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
              { label: 'Total Income', value: '₹75,000', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
              { label: 'Tasks Done', value: '8 / 12', color: 'text-primary', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
              { label: 'Upcoming', value: '3 tasks', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
            ].map(c => (
              <div key={c.label} className={`rounded-lg p-3 ${c.bg}`}>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{c.label}</p>
                <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5 bg-white dark:bg-zinc-900">
            <div className="h-24 flex items-end gap-1.5 pt-2">
              {[40, 65, 45, 80, 55, 70, 90, 50, 75, 60, 85, 45].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
                  <div className="w-full rounded-t bg-primary/20 dark:bg-primary/30" style={{ height: `${h * 0.5}px` }} />
                  <div className="w-full rounded-t bg-emerald-500/30" style={{ height: `${(100 - h) * 0.3}px` }} />
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400 mt-2">Income vs Expenses — last 12 months</p>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="py-20 px-6 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Features</p>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Everything you need in one place</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
            Stop switching between apps. TrackForge gives you full visibility of your finances and schedule from a single dashboard.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard icon={Wallet} color="bg-primary" title="Expense Tracking" desc="Log every rupee with categories, accounts, and notes. Visualize spending with charts and monthly insights." />
          <FeatureCard icon={ListTodo} color="bg-accentAmber" title="Task Management" desc="Kanban-style task board with priorities, due dates, and tags. Move tasks from To Do → In Progress → Done." />
          <FeatureCard icon={BarChart3} color="bg-accentGreen" title="Unified Dashboard" desc="See your financial health and task completion at a glance. Make better decisions with real-time summaries." />
          <FeatureCard icon={ShieldCheck} color="bg-violet-500" title="Secure by Default" desc="JWT authentication, bcrypt password hashing, and user-isolated data — your information stays yours." />
          <FeatureCard icon={TrendingUp} color="bg-rose-500" title="Budget Control" desc="Set monthly limits per category. Track how much you've spent vs. your budget with color-coded progress bars." />
          <FeatureCard icon={CalendarCheck} color="bg-cyan-500" title="Smart Scheduling" desc="Never miss a deadline. Upcoming tasks and due-date alerts surface on your dashboard automatically." />
        </div>
      </div>
    </section>

    {/* How it works */}
    <section id="how-it-works" className="py-20 px-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">How it works</p>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Up and running in minutes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <StepCard step="1" title="Create your account" desc="Sign up with your name and email. Default expense and income categories are set up automatically." />
          <StepCard step="2" title="Add your accounts" desc="Create bank, cash, or wallet accounts with opening balances to start tracking your money." />
          <StepCard step="3" title="Log transactions" desc="Record expenses and income with categories, amounts, and notes. Your account balance updates instantly." />
          <StepCard step="4" title="Plan your schedule" desc="Add tasks with priorities and due dates. Your dashboard shows upcoming deadlines so nothing slips through." />
        </div>
      </div>
    </section>

    {/* CTA */}
    <section id="about" className="py-20 px-6 bg-zinc-900 dark:bg-zinc-100">
      <div className="max-w-2xl mx-auto text-center space-y-5">
        <h2 className="text-3xl font-bold text-white dark:text-zinc-900">Ready to take control?</h2>
        <p className="text-zinc-400 dark:text-zinc-600 text-sm leading-relaxed">
          Join TrackForge today and start managing your finances and tasks from one beautiful, minimal workspace.
        </p>
        <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all">
          Get started for free <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);

export default LandingPage;
