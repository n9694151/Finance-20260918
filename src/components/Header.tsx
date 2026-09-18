import React from 'react';
import { Bot, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onStartQuickSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                AI INVESTMENT RESEARCH
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Phase 1 Live
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              AI 智慧投資研究中心 ‧ 官方數據驗證與反方風控中樞
            </p>
          </div>
        </div>

        {/* Right Info Badges */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>TWSE / MOPS / TAIFEX 官方連線正常</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Devil's Advocate 逆向風控啟用</span>
          </div>
        </div>
      </div>
    </header>
  );
};
