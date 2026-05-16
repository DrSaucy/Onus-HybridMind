import { useState } from "react";
import { Shield, Activity, RefreshCw, Download } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";
import { StatusPill } from "./components/StatusPill";
import { ChatMessage } from "./components/ChatMessage";
import { AuditCard } from "./components/AuditCard";
import { jsPDF } from "jspdf";

import logoLight from "../assets/onus-light.png";
import logoDark from "../assets/onus-dark.png";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(225, 29, 72);
    doc.text("HYBRIDMIND AUDIT REPORT", 20, 30);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text("Date: " + new Date().toLocaleDateString(), 20, 45);
    doc.text("Agent: Chronicler Agent", 20, 52);
    doc.text("Status: CRITICAL BATCH #44", 20, 59);
    
    doc.line(20, 65, 190, 65);
    
    doc.setFont("helvetica", "bold");
    doc.text("DISCREPANCY DETECTED:", 20, 75);
    
    doc.setFont("helvetica", "normal");
    doc.text("Math validation failed. 15% volume rebate not applied by vendor for bulk tier.", 20, 85);
    doc.text("Expected: $1,020,000", 20, 92);
    doc.text("Found: $1,200,000", 20, 99);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(225, 29, 72);
    doc.text("LEAKAGE AMOUNT: $180,000", 20, 115);
    
    doc.setTextColor(50, 50, 50);
    doc.text("SOURCES:", 20, 130);
    doc.setFont("helvetica", "normal");
    doc.text("1. SQL Database: procurement_db (q1_procurement Row 44)", 20, 140);
    doc.text("2. Contract PDF: apex_contract_2026.pdf (Page 4, Section 4.2)", 20, 147);
    
    doc.save("Leakage_Report_Apex_Chemicals.pdf");
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
                <ChatMessage
                  type="user"
                  content="Run Q1 compliance audit on Apex Chemicals."
                  timestamp="USER • 10:48 AM"
                />
                <ChatMessage
                  type="ai"
                  content={
                    <>
                      Understood. Initiating cross-reference protocol for{" "}
                      <code className="bg-slate-100 dark:bg-[#1A2333] border border-slate-200 dark:border-slate-700/50 px-1.5 py-0.5 rounded text-sm text-indigo-600 dark:text-indigo-400 font-medium">Apex Chemicals</code>
                      . Fetching SQL balance sheets and OCR text from 2026 master contracts...
                    </>
                  }
                  timestamp="HYBRIDMIND AI • 10:48 AM"
                  tags={[
                    { label: "SQL", status: "ACTIVE" },
                    { label: "PDF", status: "ACTIVE" },
                  ]}
                />
              </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 w-full pt-16 pb-6 px-4 lg:px-12 z-10">
              {/* Smooth Gradient Backgrounds for Transition */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-[#F4F7FA] via-[#F4F7FA]/90 to-transparent pointer-events-none"
                style={{ opacity: isDark ? 0 : 1, transition: "opacity 700ms ease-in-out" }}
              ></div>
              <div 
                className="absolute inset-0 bg-gradient-to-t from-[#090E17] via-[#090E17]/90 to-transparent pointer-events-none"
                style={{ opacity: isDark ? 1 : 0, transition: "opacity 700ms ease-in-out" }}
              ></div>
              
              <div className="relative w-full max-w-4xl mx-auto rounded-full p-[1.5px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(79,70,229,0.05)]">
                {/* Static Border Fallback */}
                <div className="absolute inset-0 bg-slate-200/60 dark:bg-slate-700/50"></div>
                
                {/* Rotating Beam */}
                <div className="absolute left-1/2 top-1/2 w-[2000px] h-[2000px] -ml-[1000px] -mt-[1000px] animate-spin-beam bg-[conic-gradient(from_0deg,transparent_0_340deg,theme(colors.blue.600)_360deg)] dark:bg-[conic-gradient(from_0deg,transparent_0_340deg,theme(colors.indigo.500)_360deg)]"></div>
                
                {/* Inner Content */}
                <div className="relative bg-white/95 dark:bg-[#0B121E]/95 backdrop-blur-2xl rounded-full w-full h-full flex items-center">
                  <input
                    type="text"
                    placeholder="Ask HybridMind to audit, verify, or report..."
                    className="bg-transparent text-slate-800 dark:text-slate-200 rounded-full w-full py-4 lg:py-4.5 pl-6 lg:pl-8 pr-[120px] lg:pr-36 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm lg:text-base z-10"
                  />
                  <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 dark:from-indigo-500 dark:to-blue-500 text-white rounded-full px-5 lg:px-8 flex items-center text-xs lg:text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] z-20">
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
                <RefreshCw className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="flex flex-col gap-4">
                {/* Executor Card */}
                <AuditCard
                  agent="executor"
                  timestamp="10:48:12 AM"
                  content={
                    <span className="text-slate-600 dark:text-slate-300">
                      Searched <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors">SQL:procurement_db</span>. Found 12,000 units at $1.2M total. Cross-referenced{" "}
                      <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors">PDF:apex_contract_2026.pdf</span>. Found Section 4.2 Volume Discount criteria.
                    </span>
                  }
                />

                {/* Verifier Card */}
                <AuditCard
                  agent="verifier"
                  timestamp="10:48:15 AM"
                  badge={{ text: "LOW INTEGRITY", color: "yellow" }}
                  content={
                    <div className="text-slate-700 dark:text-slate-300">
                      <div className="font-bold text-slate-900 dark:text-white mb-2">DISCREPANCY DETECTED.</div>
                      <div className="leading-relaxed">
                        Math validation failed. 15% volume rebate not applied by vendor for bulk tier. Expected: <span className="font-semibold text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline cursor-pointer transition-colors">$1,020,000</span>, Found: <span className="font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline cursor-pointer transition-colors">$1,200,000</span>.
                      </div>
                    </div>
                  }
                />

                {/* Chronicler Card */}
                <AuditCard
                  agent="chronicler"
                  timestamp="CRITICAL BATCH #44"
                  variant="critical"
                  content={
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="border border-rose-100 dark:border-rose-900/50 rounded-xl p-4 bg-white dark:bg-slate-900/50 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500 shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                        <span className="font-bold text-rose-600 dark:text-rose-500 text-base">$180,000 LEAKAGE DETECTED.</span>
                      </div>
                      <div className="text-sm text-rose-600/80 dark:text-rose-400/80">
                        Source:{" "}
                        <span className="bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800/50 px-2 py-1 rounded text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-200 dark:hover:border-rose-700/60 cursor-pointer transition-colors">q1_procurement Row 44</span>{" "}
                        +{" "}
                        <span className="bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800/50 px-2 py-1 rounded text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-200 dark:hover:border-rose-700/60 cursor-pointer transition-colors">apex_contract_2026.pdf Page 4</span>.
                      </div>
                      <div className="flex justify-end mt-4">
                        <button 
                          onClick={handleDownloadReport}
                          className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-sm shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
                        >
                          <Download className="w-3.5 h-3.5" />
                          GENERATE LEAKAGE REPORT
                        </button>
                      </div>
                    </div>
                  }
                />

                {/* Empty State */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/20">
                  <div className="text-center py-6">
                    <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      AWAITING NEXT SEQUENCE...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-transparent p-5 border-t border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md z-10 relative">
              <div className="flex justify-between items-end mb-2">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Audit Coverage Verified
                </div>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">94%</div>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: "94%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}