import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  LineChart,
  Home,
  Globe,
  Tv,
  Newspaper,
  Bookmark,
  History,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  watchlistCount: number;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  watchlistCount,
  historyCount,
}) => {
  const navItems = [
    { id: 'home', label: '首頁總覽', icon: LayoutDashboard },
    { id: 'stock-research', label: '台股研究 Agent', icon: TrendingUp, badge: 'Phase 1' },
    { id: 'futures', label: '期貨研究 Agent', icon: LineChart, badge: 'Phase 2' },
    { id: 'real-estate', label: '房地產研究 Agent', icon: Home, badge: 'Phase 3' },
    { id: 'macro', label: '總體經濟 Agent', icon: Globe },
    { id: 'youtube', label: 'YouTube 觀點 Agent', icon: Tv },
    { id: 'news', label: '新聞研究 Agent', icon: Newspaper },
    { id: 'watchlist', label: '我的自選標的', icon: Bookmark, count: watchlistCount },
    { id: 'history', label: '研究歷史庫', icon: History, count: historyCount },
    { id: 'settings', label: '模型與 API 設定', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800/70 flex flex-col p-4 shrink-0 hidden lg:flex">
      <div className="space-y-1 flex-1">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          AI 智慧研究模組
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    item.badge === 'Phase 1'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Security & Reliability Indicator */}
      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>嚴格事實標註機制</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            系統強制隔離「官方事實資料」與「AI推論／觀點」，杜絕虛構與過度推測。
          </p>
        </div>
      </div>
    </aside>
  );
};
