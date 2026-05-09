import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, CalendarCheck, LogOut, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Finances', path: '/finances', icon: Wallet },
  { name: 'Tasks', path: '/tasks', icon: CalendarCheck },
];

const SidebarContent = ({ onClose }) => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="flex flex-col h-full w-60 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <LayoutDashboard className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">TrackForge</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Workspace</p>
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="shrink-0 px-2 py-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group cursor-default">
          <div className="w-7 h-7 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{user?.name}</p>
            <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="shrink-0 p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => (
  <>
    {/* Desktop */}
    <div className="hidden md:flex h-full shrink-0">
      <SidebarContent />
    </div>

    {/* Mobile overlay */}
    {isOpen && (
      <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="absolute left-0 top-0 bottom-0 animate-slide-in">
          <SidebarContent onClose={onClose} />
        </div>
      </div>
    )}
  </>
);

export default Sidebar;
