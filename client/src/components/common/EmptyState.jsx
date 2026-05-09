const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
      {Icon && <Icon className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />}
    </div>
    <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{title}</h3>
    <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs leading-relaxed">{message}</p>
  </div>
);

export default EmptyState;
