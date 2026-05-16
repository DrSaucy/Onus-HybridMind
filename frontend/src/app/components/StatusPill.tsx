interface StatusPillProps {
  agent: string;
  status: "ONLINE" | "OFFLINE";
}

export function StatusPill({ agent, status }: StatusPillProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{agent}</span>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{status}</span>
    </div>
  );
}
