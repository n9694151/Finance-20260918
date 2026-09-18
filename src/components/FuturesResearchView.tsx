import React, { useState } from 'react';
import {
  MOCK_FUTURES_CONTRACTS,
  MOCK_FUTURES_BASIS,
  MOCK_OPTIONS_SUMMARY,
  MOCK_FUTURES_INSTITUTIONS,
  MOCK_FUTURES_REPORT,
} from '../mock/futuresData';
import { OptionsDistributionChart } from './OptionsDistributionChart';
import { FuturesBasisCard } from './FuturesBasisCard';
import { FuturesInstitutionsCard } from './FuturesInstitutionsCard';
import { InfoCategory } from '../types';
import {
  LineChart,
  Layers,
  Scale,
  Users,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  Compass,
  Zap,
  Building2,
} from 'lucide-react';

export const FuturesResearchView: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('TXF');
  const [activeTab, setActiveTab] = useState<'all' | 'options' | 'basis' | 'institutions' | 'devils'>('all');

  const contract = MOCK_FUTURES_CONTRACTS[selectedSymbol] || MOCK_FUTURES_CONTRACTS.TXF;
  const isUp = contract.change >= 0;
  const report = MOCK_FUTURES_REPORT;

  const renderBadge = (category: InfoCategory) => {
    switch (category) {
      case 'FACT':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            [FACT 官方事實]
          </span>
        );
      case 'SOURCE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            [SOURCE TAIFEX]
          </span>
        );
      case 'ANALYSIS':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            [ANALYSIS 衍生性量化]
          </span>
        );
      case 'INFERENCE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            [INFERENCE 結構推論]
          </span>
        );
      case 'RISK':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            [RISK 槓桿風控]
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
            [UNKNOWN 未知]
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. 頂部期貨合約切換與即時報價橫幅 */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <LineChart className="w-7 h-7 text-cyan-400" />
                <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  TAIFEX 期貨研究 Agent
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Phase 2 官方即時連線
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                更新時間：{contract.updateTime}
              </span>
              <span>‧</span>
              <span className="text-cyan-400 font-medium">資料來源：{contract.dataSource}</span>
            </div>
          </div>

          {/* 合約即時報價卡 */}
          <div className="flex items-baseline gap-4 bg-slate-950/80 px-5 py-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400">{contract.name} ({contract.deliveryMonth})</div>
              <div className="text-3xl font-mono font-extrabold text-white mt-0.5">
                {contract.price.toLocaleString()} 點
              </div>
            </div>
            <div className={`text-right ${isUp ? 'text-red-400' : 'text-emerald-400'}`}>
              <div className="flex items-center justify-end text-base font-bold font-mono">
                {isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {isUp ? '+' : ''}{contract.change} ({isUp ? '+' : ''}{contract.changePercent}%)
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                總成交量: {contract.volume.toLocaleString()} 口 ‧ OI: {contract.openInterest.toLocaleString()} 口
              </div>
            </div>
          </div>
        </div>

        {/* 契約切換按鈕 */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-semibold mr-1">主力合約切換：</span>
          {Object.values(MOCK_FUTURES_CONTRACTS).map((item) => (
            <button
              key={item.symbol}
              onClick={() => setSelectedSymbol(item.symbol)}
              className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition-all ${
                selectedSymbol === item.symbol
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {item.name} ({item.symbol})
            </button>
          ))}
        </div>

        {/* 次功能 Tab 篩選 */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/40'
            }`}
          >
            完整期貨研報
          </button>
          <button
            onClick={() => setActiveTab('options')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'options'
                ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/40'
            }`}
          >
            選擇權與 Put/Call Ratio
          </button>
          <button
            onClick={() => setActiveTab('basis')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'basis'
                ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/40'
            }`}
          >
            期現貨基差 (Basis)
          </button>
          <button
            onClick={() => setActiveTab('institutions')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'institutions'
                ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/40'
            }`}
          >
            三大法人未平倉
          </button>
          <button
            onClick={() => setActiveTab('devils')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'devils'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-rose-400 hover:text-rose-300 bg-rose-950/30 border border-rose-900/40'
            }`}
          >
            Devil's Advocate 高槓桿風控
          </button>
        </div>
      </div>

      {/* 2. 核心指標快速看板 */}
      {(activeTab === 'all' || activeTab === 'basis') && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] text-slate-400">期現貨價差 (Basis)</div>
            <div className="text-xl font-mono font-bold text-red-400 mt-1">
              +{report.basis.basis.toFixed(2)} 點
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">正價差 (多方推升)</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] text-slate-400">Put/Call Ratio (PCR)</div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
              {report.options.putCallRatio.toFixed(2)}%
            </div>
            <div className="text-[10px] text-cyan-400 mt-0.5">連 5 日站穩 100%</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] text-slate-400">買權最大 OI (上方反壓)</div>
            <div className="text-xl font-mono font-bold text-rose-300 mt-1">
              {report.options.maxCallOIStrike} 點
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">未平倉 28,450 口</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] text-slate-400">賣權最大 OI (下方支撐)</div>
            <div className="text-xl font-mono font-bold text-emerald-300 mt-1">
              {report.options.maxPutOIStrike} 點
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">未平倉 31,200 口</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl col-span-2 md:col-span-1">
            <div className="text-[11px] text-slate-400">外資期貨淨未平倉</div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
              -18,450 口
            </div>
            <div className="text-[10px] text-amber-400 mt-0.5">空單回補 1,850 口 (避險)</div>
          </div>
        </div>
      )}

      {/* 3. 臺指選擇權履約價分布圖 */}
      {(activeTab === 'all' || activeTab === 'options') && (
        <OptionsDistributionChart optionsData={report.options} />
      )}

      {/* 4. 期現貨價差與基差走勢卡片 */}
      {(activeTab === 'all' || activeTab === 'basis') && (
        <FuturesBasisCard basisData={report.basis} />
      )}

      {/* 5. 三大法人期貨未平倉矩陣 */}
      {(activeTab === 'all' || activeTab === 'institutions') && (
        <FuturesInstitutionsCard
          institutions={report.institutions}
          updateTime={contract.updateTime}
        />
      )}

      {/* 6. 深度研究推論 vs Devil's Advocate 逆向風控 */}
      {(activeTab === 'all' || activeTab === 'devils') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 客觀結構與法人推論 */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <span>客觀籌碼結構與衍生性市場分析</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                TAIFEX 數據比對
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {report.institutionalAnalysis.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/30 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    {renderBadge(item.category)}
                    {item.source && (
                      <span className="text-[10px] text-slate-400">{item.source}</span>
                    )}
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">{item.text}</p>
                </div>
              ))}

              {report.optionsStructureAnalysis.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/30 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    {renderBadge(item.category)}
                    {item.source && (
                      <span className="text-[10px] text-slate-400">{item.source}</span>
                    )}
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Devil's Advocate 期貨高槓桿逆向風控 */}
          <div className="bg-gradient-to-b from-rose-950/20 via-slate-900/90 to-slate-900/90 border border-rose-900/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-900/40">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
                <span>Devil's Advocate 期貨逆向風控 (反方 Agent)</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                高槓桿警戒
              </span>
            </div>

            <p className="text-xs text-rose-300/80 italic">
              「衍生性商品具備超過 20 倍高槓桿，系統強制提示夜盤跳空、結算日收斂與外資大規模避險潛在衝擊。」
            </p>

            <div className="space-y-3 mt-3">
              {report.devilsAdvocateRisks.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-900/30 hover:border-rose-500/40 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    {renderBadge(item.category)}
                    {item.source && (
                      <span className="text-[10px] text-rose-300/60 font-mono">{item.source}</span>
                    )}
                  </div>
                  <p className="text-rose-100/90 leading-relaxed font-medium">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/30 text-xs text-rose-300">
              <div className="font-semibold mb-1">關鍵追蹤：</div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-200/90">
                {report.keyObservationCheckpoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 7. 法定投資風險免責聲明 */}
      <div className="bg-slate-950 border border-amber-900/30 rounded-2xl p-5 text-center text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>TAIFEX 臺灣期貨與衍生性金融商品法定風險聲明</span>
        </div>
        <p className="leading-relaxed max-w-4xl mx-auto">
          {report.statutoryDisclaimer}
        </p>
      </div>
    </div>
  );
};
