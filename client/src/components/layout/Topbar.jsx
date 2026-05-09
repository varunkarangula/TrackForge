import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

const titles = {
  '/dashboard': 'Dashboard',
  '/finances': 'Finances',
  '/tasks': 'Tasks',
};

const Topbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { dark, toggle } = useTheme();
  const title = titles[location.pathname] || 'TrackForge';

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <header className="shrink-0 h-14 flex items-center justify-between px-4 md:px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:block text-xs text-zinc-400 dark:text-zinc-500">{today}</span>
        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />
        <button
          onClick={toggle}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
