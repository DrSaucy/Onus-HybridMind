import { useState, useEffect, useRef } from "react";
import { Activity, RefreshCw, Download } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";
import { StatusPill } from "./components/StatusPill";
import { ChatMessage } from "./components/ChatMessage";
import { AuditCard } from "./components/AuditCard";
import { jsPDF } from "jspdf";

import logoLight from "../assets/onus-light.png";
import logoDark from "../assets/onus-dark.png";

type Message = {
  type: "user" | "ai";
  content: React.ReactNode;
  timestamp: string;
};

type AuditLog = {
  timestamp: string;
  agent: string;
  message: string;
  badge?: { text: string; color: "yellow" | "red" };
  variant?: "normal" | "critical";
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "ai",
      content: "Hello! I am HybridMind AI. I can query our SQL database for procurement data and cross-reference it with PDF contracts via ChromaDB. What would you like me to audit?",
      timestamp: "HYBRIDMIND AI",
    }
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auditEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-scroll audit logs
  useEffect(() => {
    auditEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [auditLogs]);

  // WebSocket Connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/audit");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "audit") {
          setAuditLogs((prev) => [
            ...prev,
            { 
              timestamp: new Date().toLocaleTimeString(), 
              agent: data.agent || "System",
              message: data.message,
              badge: data.badge,
              variant: data.variant || "normal"
            }
          ]);
        }
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };
    return () => ws.close();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText;
    setInputText("");
    setMessages((prev) => [
      ...prev,
      { type: "user", content: userMessage, timestamp: "USER" },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { type: "ai", content: data.response, timestamp: "HYBRIDMIND AI" },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { type: "ai", content: "Error communicating with backend. Ensure FastAPI is running on port 8000.", timestamp: "SYSTEM ERROR" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(225, 29, 72);
    doc.text("HYBRIDMIND AUDIT REPORT", 20, 30);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text("Audit Logs:", 20, 50);

    let y = 60;
    auditLogs.forEach((log) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(`[${log.timestamp}] ${log.message.substring(0, 80)}`, 20, y);
      y += 10;
    });

    doc.save("HybridMind_Audit_Report.pdf");
  };

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="flex flex-col h-screen bg-[#F8FAFC] dark:bg-[#090E17] text-slate-800 dark:text-slate-200 overflow-hidden transition-colors selection:bg-indigo-500/30">
        {/* Header */}
        <header className="min-h-16 py-3 lg:py-0 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-wrap lg:flex-nowrap items-center justify-between px-4 lg:px-6 bg-white/80 dark:bg-[#090E17]/80 backdrop-blur-md gap-y-2 z-20">
          <div className="flex items-center gap-3 lg:gap-4">
            <img
              src={isDark ? logoDark : logoLight}
              alt="Onus HybridMind Logo"
              className="h-7 lg:h-9 w-auto object-contain shrink-0"
            />
            <div className="w-px h-5 lg:h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
            <span className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm hidden sm:inline font-medium tracking-wide">Procurement Auditor</span>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <StatusPill agent="Executor" status="ONLINE" />
              <StatusPill agent="Verifier" status="ONLINE" />
              <StatusPill agent="Chronicler" status="ONLINE" />
            </div>
          </div>
        </header>

        {/* Main Split Layout */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden relative">
          {/* Left Pane - Chat Workspace */}
          <div className="w-full lg:w-[60%] min-h-[70vh] lg:min-h-0 bg-[#F4F7FA] dark:bg-transparent relative flex flex-col shrink-0 lg:shrink shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-[140px] lg:pb-[140px]">
              <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                {messages.map((m, i) => (
                  <ChatMessage
                    key={i}
                    type={m.type}
                    content={m.content}
                    timestamp={m.timestamp}
                  />
                ))}
                {isLoading && (
                  <ChatMessage
                    type="ai"
                    content={<span className="animate-pulse">Thinking and consulting tools...</span>}
                    timestamp="HYBRIDMIND AI"
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 w-full pt-16 pb-6 px-4 lg:px-12 z-10">
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#F4F7FA] via-[#F4F7FA]/90 to-transparent pointer-events-none"
                style={{ opacity: isDark ? 0 : 1, transition: "opacity 700ms ease-in-out" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#090E17] via-[#090E17]/90 to-transparent pointer-events-none"
                style={{ opacity: isDark ? 1 : 0, transition: "opacity 700ms ease-in-out" }}
              ></div>

              <div className="relative w-full max-w-4xl mx-auto rounded-full p-[1.5px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(79,70,229,0.05)]">
                <div className="absolute inset-0 bg-slate-200/60 dark:bg-slate-700/50"></div>
                {isLoading && <div className="absolute left-1/2 top-1/2 w-[2000px] h-[2000px] -ml-[1000px] -mt-[1000px] animate-spin-beam bg-[conic-gradient(from_0deg,transparent_0_340deg,theme(colors.blue.600)_360deg)] dark:bg-[conic-gradient(from_0deg,transparent_0_340deg,theme(colors.indigo.500)_360deg)]"></div>}

                <div className="relative bg-white/95 dark:bg-[#0B121E]/95 backdrop-blur-2xl rounded-full w-full h-full flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                    placeholder="Ask HybridMind to audit, verify, or report..."
                    className="bg-transparent text-slate-800 dark:text-slate-200 rounded-full w-full py-4 lg:py-4.5 pl-6 lg:pl-8 pr-[120px] lg:pr-36 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm lg:text-base z-10 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 dark:from-indigo-500 dark:to-blue-500 text-white rounded-full px-5 lg:px-8 flex items-center text-xs lg:text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] z-20 disabled:opacity-50"
                  >
                    Run &gt;
                  </button>
                </div>
              </div>
              <div className="text-center text-[9px] lg:text-[10px] text-slate-400 dark:text-slate-600 font-mono uppercase tracking-widest mt-4">
                SECURED ENTERPRISE AUDIT TUNNEL • 256-BIT ENCRYPTION
              </div>
            </div>
          </div>

          {/* Right Pane - Live Audit Trail */}
          <div className="w-full lg:w-[40%] min-h-[60vh] lg:min-h-0 bg-white dark:bg-[#0B121E]/80 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-800/60 flex flex-col shrink-0 lg:shrink relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-slate-200/60 dark:border-slate-800/60 flex justify-between items-center bg-transparent sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-md">
                  <Activity className="w-4 h-4 lg:w-4.5 lg:h-4.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-slate-800 dark:text-slate-200 font-bold tracking-widest text-xs lg:text-sm uppercase">LIVE AUDIT TRAIL</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleDownloadReport} className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 transition-colors">
                  <Download className="w-4 h-4" /> Export
                </button>
                <RefreshCw onClick={() => setAuditLogs([])} className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="flex flex-col gap-4">
                {auditLogs.map((log, i) => (
                  <AuditCard
                    key={i}
                    agent={log.agent === "executor" ? "Executor Agent" : log.agent === "verifier" ? "Verifier Agent" : log.agent === "chronicler" ? "Chronicler Agent" : log.agent}
                    timestamp={log.timestamp}
                    content={<span className="text-slate-600 dark:text-slate-300">{log.message}</span>}
                    badge={log.badge}
                    variant={log.variant}
                  />
                ))}

                {auditLogs.length === 0 && (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/20">
                    <div className="text-center py-6">
                      <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        AWAITING NEXT SEQUENCE...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={auditEndRef} />
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-transparent p-5 border-t border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md z-10 relative">
              <div className="flex justify-between items-end mb-2">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Agent Status
                </div>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{isLoading ? "Processing" : "Idle"}</div>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div className={`bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ${isLoading ? 'w-full animate-pulse' : 'w-0'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}