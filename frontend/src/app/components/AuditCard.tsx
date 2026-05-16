import { Search, AlertTriangle, Activity } from "lucide-react";

interface AuditCardProps {
  agent: "executor" | "verifier" | "chronicler";
  timestamp: string;
  content: React.ReactNode;
  badge?: {
    text: string;
    color: "yellow" | "red";
  };
  variant?: "normal" | "critical";
}

export function AuditCard({ agent, timestamp, content, badge, variant = "normal" }: AuditCardProps) {
  const getIconBox = () => {
    if (agent === "executor") return <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2.5 rounded-xl"><Search className="w-5 h-5" /></div>;
    if (agent === "verifier") return <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 p-2.5 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>;
    return <div className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 p-2.5 rounded-xl"><Activity className="w-5 h-5" /></div>;
  };

  const getTitle = () => {
    if (agent === "executor") return "Executor Agent";
    if (agent === "verifier") return "Verifier Agent";
    return "Chronicler Agent";
  };

  const cardClasses =
    variant === "critical"
      ? "rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-red-300 dark:hover:border-red-800/80 hover:shadow-[0_8px_25px_rgba(239,68,68,0.15)] hover:-translate-y-0.5 transition-all duration-300 cursor-default"
      : "rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 cursor-default";

  const titleClasses = "font-bold text-slate-800 dark:text-slate-100 text-sm";

  return (
    <div className={cardClasses}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-0.5">
            {getIconBox()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                 <span className={titleClasses}>{getTitle()}</span>
              </div>
              <div className="shrink-0 ml-4">
                 {badge ? (
                   <span className="text-[10px] font-bold px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded uppercase tracking-wider">
                     {badge.text}
                   </span>
                 ) : (
                   <span className={`text-xs ${agent === 'chronicler' ? 'text-red-500 dark:text-red-400 font-bold tracking-wider' : 'text-slate-400 dark:text-slate-500 font-mono font-medium'}`}>{timestamp}</span>
                 )}
              </div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
