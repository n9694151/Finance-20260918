import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MarketTicker } from './components/MarketTicker';
import { ResearchAgentProgress, AgentStep } from './components/ResearchAgentProgress';
import { ResearchReportView } from './components/ResearchReportView';
import { FuturesResearchView } from './components/FuturesResearchView';
import { RealEstateResearchView } from './components/RealEstateResearchView';
import {
  MARKET_INDICES,
  MOCK_REPORTS,
  QUICK_SEARCH_PROMPTS,
  getOrGenerateResearchReport,
} from './mock/financeData';
import {
  PRESET_REAL_ESTATE_REPORTS,
  getOrGenerateRealEstateReport,
} from './mock/realEstateData';
import {
  ActiveTab,
  ResearchReport,
  ResearchHistoryItem,
} from './types';
import { RealEstateReport } from './types/realEstate';
import {
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  ShieldAlert,
  History,
  Bookmark,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  BarChart2,
  LineChart,
  Home,
  Globe,
} from 'lucide-react';

const MULTI_AGENT_STEPS: AgentStep[] = [
  { id: '1', name: '總體經濟與國際情勢辨識', agent: 'Macro Agent', source: 'Fed / 10Y美債 / VIX', status: 'pending' },
  { id: '2', name: 'TWSE 即時價格與籌碼掃描', agent: 'Stock Agent', source: '臺灣證券交易所 (TWSE)', status: 'pending' },
  { id: '3', name: 'MOPS 12月營收與8季財報獲利分析', agent: 'Financial Agent', source: '公開資訊觀測站 (MOPS)', status: 'pending' },
  { id: '4', name: '技術面均線、RSI 與乖離率演算', agent: 'Technical Agent', source: '量化指標計算模組', status: 'pending' },
  { id: '5', name: 'YouTube 財經社群多空觀點情緒萃取', agent: 'YouTube Agent', source: '影音逐字稿分析庫', status: 'pending' },
  { id: '6', name: "Devil's Advocate 逆向質疑與極端風控", agent: 'Risk Agent', source: '反方風控推論模型', status: 'pending' },
  { id: '7', name: '投資研究總控 Orchestrator 產出報告', agent: 'Orchestrator', source: 'AI 智慧總控中樞', status: 'pending' },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentReport, setCurrentReport] = useState<ResearchReport | null>(MOCK_REPORTS['2330']);
  const [realEstateReport, setRealEstateReport] = useState<RealEstateReport>(
    PRESET_REAL_ESTATE_REPORTS['高雄市左營區']
  );
  const [watchlist, setWatchlist] = useState<string[]>(['2330']);
  const [history, setHistory] = useState<ResearchHistoryItem[]>([
    {
      id: 'h-1',
      symbol: '2330',
      name: '台積電',
      timestamp: '2026-09-18 14:30',
      priceAtResearch: 1040,
      summary: '營收YoY +38.9%，先進製程滿載，Devil\'s Advocate 提示PE位於72百分位需留意海外折舊。',
    },
    {
      id: 'h-2',
      symbol: '2454',
      name: '聯發科',
      timestamp: '2026-09-18 14:15',
      priceAtResearch: 1320,
      summary: '旗艦天璣晶片動能強勁，殖利率4.25%具下檔防禦。',
    },
    {
      id: 'h-3',
      symbol: 'RE-KHH-ZY',
      name: '高雄市左營區 實價登錄',
      timestamp: '2026-09-18 13:50',
      priceAtResearch: 38.5,
      summary: '內政部實價均價 38.5 萬/坪，近三年+23.4%，毛投報 2.63%，淨投報 2.05%，每月實質淨現金流 -14,860 元。',
    },
  ]);

  // 處理搜尋與 Agent 協同研究觸發
  const handleStartResearch = (queryText: string) => {
    const trimmed = queryText.trim() || '2330';
    const isFuturesQuery =
      trimmed.includes('台指期') ||
      trimmed.includes('期貨') ||
      trimmed.includes('選擇權') ||
      trimmed.toUpperCase().includes('TXF') ||
      trimmed.toUpperCase().includes('MTX');

    const isRealEstateQuery =
      activeTab === 'real-estate' ||
      trimmed.includes('左營') ||
      trimmed.includes('大安') ||
      trimmed.includes('板橋') ||
      trimmed.includes('西屯') ||
      trimmed.includes('竹北') ||
      trimmed.includes('實價登錄') ||
      trimmed.includes('房地產') ||
      trimmed.includes('不動產') ||
      trimmed.includes('租金') ||
      trimmed.includes('社區') ||
      trimmed.includes('房價') ||
      trimmed.includes('投報') ||
      trimmed.includes('房貸') ||
      trimmed.includes('重劃區') ||
      trimmed.endsWith('區') ||
      trimmed.includes('巨蛋') ||
      trimmed.includes('七期') ||
      trimmed.includes('新板') ||
      ['台北市', '新北市', '台中市', '高雄市', '台南市', '桃園市', '新竹縣', '新竹市'].some((c) => trimmed.includes(c));

    setIsResearching(true);
    setCurrentStepIndex(0);
    setActiveTab(isRealEstateQuery ? 'real-estate' : isFuturesQuery ? 'futures' : 'stock-research');

    // 模擬多 Agent 協同逐步執行
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < MULTI_AGENT_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsResearching(false);

        if (isRealEstateQuery) {
          const reRep = getOrGenerateRealEstateReport(trimmed);
          setRealEstateReport(reRep);
          setActiveTab('real-estate');
          setHistory((prev) => [
            {
              id: `h-${Date.now()}`,
              symbol: reRep.id,
              name: `${reRep.regionQuery} 實價登錄`,
              timestamp: new Date().toLocaleDateString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
              priceAtResearch: reRep.avgPricePerPing1Y,
              summary: `內政部實價均價 ${reRep.avgPricePerPing1Y} 萬/坪，毛租金投報 ${reRep.defaultYields.grossYield}%，淨投報 ${reRep.defaultYields.netYield}%，每月淨現金流 ${reRep.defaultYields.monthlyNetCashflow.toLocaleString()} 元。`,
            },
            ...prev.slice(0, 9),
          ]);
        } else if (isFuturesQuery) {
          setActiveTab('futures');
          setHistory((prev) => [
            {
              id: `h-${Date.now()}`,
              symbol: 'TXF',
              name: '台指期近月 (TAIFEX)',
              timestamp: new Date().toLocaleDateString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
              priceAtResearch: 22880,
              summary: 'TAIFEX 日盤收 22,880 (+210 點)，正價差 +29.68 點，選擇權 PCR 112.41% 偏多防守，外資淨未平倉 -18,450 口。',
            },
            ...prev.slice(0, 9),
          ]);
        } else {
          // 精準匹配日月光、聯發科、鴻海、台積電或自適應生成其他標的研報
          const report = getOrGenerateResearchReport(trimmed);
          setCurrentReport(report);
          setActiveTab('stock-research');

          // 加入研究歷史
          setHistory((prev) => [
            {
              id: `h-${Date.now()}`,
              symbol: report.targetSymbol,
              name: report.targetName,
              timestamp: new Date().toLocaleDateString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
              priceAtResearch: report.marketPrice.price,
              summary: `最新PE ${report.marketPrice.peRatio}倍，毛利率 ${report.fundamentals.grossMargin}%，完成 12 項研究驗證與反方風控。`,
            },
            ...prev.slice(0, 9),
          ]);
        }
      }
    }, 450);
  };

  const toggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter((s) => s !== symbol));
    } else {
      setWatchlist([...watchlist, symbol]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 頂部全域 Header */}
      <Header />

      {/* 市場行情橫向跑馬列 */}
      <MarketTicker indices={MARKET_INDICES} />

      {/* 主要內容區域 (Sidebar + Main View) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          watchlistCount={watchlist.length}
          historyCount={history.length}
        />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* 搜尋列與快速關鍵字（首頁與股票研究均顯示） */}
          <div className="mb-8">
            <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
              <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <span>你想研究什麼投資標的？</span>
              </h1>
              <p className="text-xs text-slate-400 mb-4">
                支援輸入股票代號（如 2330、2454）、期貨（台指期）、房地產區域（高雄左營）、或投資主題（AI伺服器、FED降息）
              </p>

              {/* 搜尋框 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStartResearch(searchQuery);
                }}
                className="flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="relative flex-1 w-full">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="輸入股票代碼如 2330、2454 或主題，點擊開始研究..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isResearching}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <span>開始研究</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 快速選取 Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                <span className="font-medium text-slate-400">熱門研究範例：</span>
                {QUICK_SEARCH_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => {
                      setSearchQuery(prompt.query);
                      handleStartResearch(prompt.query);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/60 text-[11px] transition-all"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 若正在執行多 Agent 流程 */}
          {isResearching && (
            <ResearchAgentProgress
              steps={MULTI_AGENT_STEPS}
              currentStepIndex={currentStepIndex}
              targetSymbol={searchQuery || '2330'}
            />
          )}

          {/* 首頁 Tab 顯示市場儀表板與功能模組介紹 */}
          {activeTab === 'home' && !isResearching && (
            <div className="space-y-8">
              {/* 今日市場重點儀表板 */}
              <div>
                <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-cyan-400" />
                  <span>今日核心金融市場指標儀表板</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MARKET_INDICES.slice(0, 4).map((idx) => {
                    const isPositive = idx.change >= 0;
                    return (
                      <div
                        key={idx.code}
                        className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl hover:border-cyan-500/30 transition-all"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{idx.name}</span>
                          <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">
                            {idx.code}
                          </span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-white mt-2">
                          {idx.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div
                          className={`flex items-center text-xs font-mono font-bold mt-1 ${
                            isPositive ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {isPositive ? '+' : ''}{idx.change} ({isPositive ? '+' : ''}{idx.changePercent}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 多 Agent 系統架構簡介 */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <span>AI 智慧研究中心 8 大 Agent 核心架構</span>
                  </h3>
                  <span className="text-xs text-cyan-400 font-mono">Phase 1 台股、Phase 2 期貨 & Phase 3 實價登錄全數上線</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
                    <div className="font-bold text-emerald-400 mb-1">Agent 2: 台股研究 Agent (Active)</div>
                    <p className="text-slate-400">TWSE 報價、MOPS 財報與法人籌碼官方資料整合。</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-cyan-500/30 bg-cyan-950/10">
                    <div className="font-bold text-cyan-400 mb-1">Agent 3: 期貨研究 Agent (Active)</div>
                    <p className="text-slate-400">TAIFEX 台指期、選擇權 PCR、基差與三大法人避險對沖分析。</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-teal-500/30 bg-teal-950/10">
                    <div className="font-bold text-teal-400 mb-1">Agent 4: 不動產研究 Agent (Active)</div>
                    <p className="text-slate-400">內政部實價登錄單價、3層租金投報率與房貸現金流精算。</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-rose-500/30 bg-rose-950/10">
                    <div className="font-bold text-rose-400 mb-1">Agent 7: Devil's Advocate (Active)</div>
                    <p className="text-slate-400">逆向質疑投資盲點、信用管制與租金負現金流利差風險。</p>
                  </div>
                </div>
              </div>

              {/* 預設展示最新台積電研究成果 */}
              {currentReport && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-200 text-sm">
                      最新精選投資研究報告：{currentReport.targetName}
                    </h3>
                    <button
                      onClick={() => setActiveTab('stock-research')}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>切換至完整報告視圖</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ResearchReportView
                    report={currentReport}
                    isWatchlisted={watchlist.includes(currentReport.targetSymbol)}
                    onToggleWatchlist={() => toggleWatchlist(currentReport.targetSymbol)}
                  />
                </div>
              )}
            </div>
          )}

          {/* 股票研究 Tab */}
          {activeTab === 'stock-research' && currentReport && !isResearching && (
            <ResearchReportView
              report={currentReport}
              isWatchlisted={watchlist.includes(currentReport.targetSymbol)}
              onToggleWatchlist={() => toggleWatchlist(currentReport.targetSymbol)}
            />
          )}

          {/* 期貨研究 Tab (TAIFEX 期貨研究 Agent) */}
          {activeTab === 'futures' && !isResearching && (
            <FuturesResearchView />
          )}

          {/* 台灣不動產研究 Tab (內政部實價登錄 Agent) */}
          {activeTab === 'real-estate' && !isResearching && (
            <RealEstateResearchView
              report={realEstateReport}
              onSelectQuery={(q) => setRealEstateReport(getOrGenerateRealEstateReport(q))}
            />
          )}

          {/* 總體經濟 Tab */}
          {activeTab === 'macro' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">總體經濟研究 Agent</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                涵蓋 FOMC 利率決議、CPI/PCE 通膨指標、美國非農與失業率、美元指數、十年期美債殖利率，為各子 Agent 提供市場大環境總背景。
              </p>
            </div>
          )}

          {/* 自選清單 Tab */}
          {activeTab === 'watchlist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-amber-400" />
                  <span>我的自選研究清單 ({watchlist.length})</span>
                </h2>
              </div>

              {watchlist.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
                  尚未加入任何自選標的，可在研究報告右上角點擊書籤收藏！
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {watchlist.map((symbol) => {
                    const rep = MOCK_REPORTS[symbol] || MOCK_REPORTS['2330'];
                    return (
                      <div
                        key={symbol}
                        className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-cyan-500/30 transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-white">{rep.targetName}</span>
                            <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950">
                              {symbol}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            最新收盤：<span className="text-white font-mono font-bold">NT$ {rep.marketPrice.price}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setCurrentReport(rep);
                              setActiveTab('stock-research');
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-medium transition-all"
                          >
                            檢視研究報告
                          </button>
                          <button
                            onClick={() => toggleWatchlist(symbol)}
                            className="text-xs text-slate-400 hover:text-rose-400 p-1"
                            title="移出自選"
                          >
                            移除
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 研究歷史 Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  <span>投資觀點與研究歷史紀錄庫</span>
                </h2>
                <span className="text-xs text-slate-400">保留歷史研究推論與後續驗證比對</span>
              </div>

              <div className="space-y-3">
                {history.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => {
                      if (h.symbol.startsWith('RE-')) {
                        const rep = getOrGenerateRealEstateReport(h.name.replace(' 實價登錄', ''));
                        setRealEstateReport(rep);
                        setActiveTab('real-estate');
                      } else if (h.symbol === 'TXF') {
                        setActiveTab('futures');
                      } else {
                        const rep = getOrGenerateResearchReport(h.symbol);
                        setCurrentReport(rep);
                        setActiveTab('stock-research');
                      }
                    }}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cyan-500/30 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-slate-200">
                        <span className="font-mono text-cyan-400 group-hover:text-cyan-300">{h.symbol}</span>
                        <span className="group-hover:text-white">{h.name}</span>
                        <span className="text-slate-400 font-normal">
                          ‧ 研究當時價: {h.symbol.startsWith('RE-') ? `${h.priceAtResearch} 萬/坪` : `NT$ ${h.priceAtResearch}`}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1">{h.summary}</p>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono shrink-0">
                      {h.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 系統設定 Tab */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 max-w-xl mx-auto space-y-4 text-xs">
              <h2 className="text-base font-bold text-white">模型架構與安全性設定</h2>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="font-semibold text-slate-200">API Key 安全規範</div>
                <p className="text-slate-400 leading-relaxed">
                  本系統遵循官方架構安全準則：使用者無需自行填入或外洩 API Key，所有 AI 推理密鑰均由伺服器端 Secrets 或代理層保護，瀏覽器端絕無明文洩漏風險。
                </p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="font-semibold text-slate-200">資料來源優先級設定</div>
                <div className="text-slate-400 space-y-1 font-mono">
                  <div>Level 1: TWSE 交易所 / TAIFEX 官方 (權重 100%)</div>
                  <div>Level 2: MOPS 公開資訊觀測站 (權重 100%)</div>
                  <div>Level 3: 主流財經媒體法說會實錄 (權重 80%)</div>
                  <div>Level 4: YouTube 與社群觀點 (權重 30%，僅視為情緒)</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
