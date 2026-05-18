import ReactMarkdown from "react-markdown";
import aiAvatarDark from "../../assets/onus-ai-dark.png";
import aiAvatarLight from "../../assets/onus-ai-light.png";

interface ChatMessageProps {
  type: "user" | "ai";
  content: React.ReactNode;
  timestamp: string;
  tags?: Array<{ label: string; status: string }>;
  isDark?: boolean;
}

export function ChatMessage({ type, content, timestamp, tags, isDark }: ChatMessageProps) {
  if (type === "user") {
    return (
      <div className="flex flex-col items-end w-full">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl rounded-tr-sm px-4 lg:px-5 py-2.5 lg:py-3 max-w-[90%] lg:max-w-2xl text-sm lg:text-base shadow-md shadow-indigo-500/20 border border-white/10">
          {content}
        </div>
        <div className="text-[10px] lg:text-xs text-slate-400 dark:text-slate-500 font-mono uppercase mt-1.5 tracking-wider font-medium">{timestamp}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex gap-2 lg:gap-3 w-full">
        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full flex-shrink-0 mt-1 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-inner bg-white dark:bg-slate-800">
          <img
            src={isDark ? aiAvatarDark : aiAvatarLight}
            alt="HybridMind AI"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="bg-white/90 dark:bg-[#131B2F]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm px-4 lg:px-5 py-3 lg:py-4 max-w-[95%] lg:max-w-2xl text-sm lg:text-base shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_0_8px_rgba(79,70,229,0.04)] dark:shadow-none relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-blue-500 opacity-80"></div>
            <div className="leading-relaxed pl-1 prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-li:my-0.5 prose-ul:my-1 prose-strong:text-slate-800 dark:prose-strong:text-slate-100">
              {typeof content === "string" ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                content
              )}
            </div>
            {tags && tags.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="text-[10px] lg:text-xs bg-indigo-50/80 dark:bg-[#090E17]/50 border border-indigo-100 dark:border-indigo-900/30 rounded-md px-2.5 py-1 text-indigo-700 dark:text-indigo-300 font-semibold tracking-wide ml-1"
                  >
                    {tag.label}: <span className="opacity-75">{tag.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-[10px] lg:text-xs text-slate-400 dark:text-slate-500 font-mono uppercase mt-1.5 tracking-wider font-medium">{timestamp}</div>
        </div>
      </div>
    </div>
  );
}
