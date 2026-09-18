import React, { useState } from 'react';
import {
  ResearchReport,
  InfoCategory,
} from '../types';
import { EpsTrendLineChart } from './EpsTrendLineChart';
import {
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  BarChart3,
  Scale,
  Building2,
  Tv,
} from 'lucide-react';

interface ResearchReportViewProps {
  report: ResearchReport;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
}

export const ResearchReportView: React.FC<ResearchReportViewProps> = ({
  report,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'fundamentals' | 'devils' | 'youtube'>('all');
  const quote = report.marketPrice;
  const isUp = quote.change >= 0;

  const renderBadge = (category: InfoCategory) => {
    switch (category) {
      case 'FACT':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            [FACT 事實資料]
          </span>
        );
      case 'SOURCE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            [SOURCE 官方來源]
          </span>
        );
      case 'ANALYSIS':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            [ANALYSIS AI分析]
          </span>
        );
      case 'INFERENCE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            [INFERENCE 推論]
          </span>
        );
      case 'RISK':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            [RISK 風險質疑]
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
      {/* 1. Header Banner & Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                {report.targetName}
              </h2>
              <span className="text-lg font-mono font-bold px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {report.targetSymbol}
              </span>
              <button
                onClick={onToggleWatchlist}
                className={`p-2 rounded-xl border transition-all ${
                  isWatchlisted
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={isWatchlisted ? '已加入自選' : '加入自選清單'}
              >
                {isWatchlisted ? (
                  <BookmarkCheck className="w-5 h-5 text-amber-400" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                產出時間：{report.generatedAt}
              </span>
              <span>‧</span>
              <span className="text-emerald-400 font-medium">TWSE / MOPS 雙重覆核</span>
            </div>
          </div>

          {/* Quick Price Badge */}
          <div className="flex items-baseline gap-4 bg-slate-950/70 px-5 py-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400">目前收盤價</div>
              <div className="text-2xl lg:text-3xl font-mono font-extrabold text-white">
                NT$ {quote.price}
              </div>
            </div>
            <div className={`text-right ${isUp ? 'text-red-400' : 'text-emerald-400'}`}>
              <div className="flex items-center justify-end text-base font-bold font-mono">
                {isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {isUp ? '+' : ''}{quote.change} ({quote.changePercent}%)
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                成交量: {quote.volume.toLocaleString()} 張
              </div>
            </div>
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/50'
            }`}
          >
            完整研究報告 (12大項)
          </button>
          <button
            onClick={() => setActiveTab('fundamentals')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'fundamentals'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/50'
            }`}
          >
            基本面與估值分析
          </button>
          <button
            onClick={() => setActiveTab('devils')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'devils'
                ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-950'
                : 'text-rose-400 hover:text-rose-300 bg-rose-950/30 border border-rose-900/40'
            }`}
          >
            Devil's Advocate 逆向質疑風控
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'youtube'
                ? 'bg-purple-500 text-white font-bold'
                : 'text-purple-300 hover:text-purple-200 bg-purple-950/30'
            }`}
          >
            YouTube 市場觀點審查
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      {(activeTab === 'all' || activeTab === 'fundamentals') && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] text-slate-400">本益比 (PE)</div>
            <div className="text-xl font-mono font-bold text-slate-100 mt-1">
              {quote.peRatio} 倍
            </div>
            <div className="text-[10px] text-cyan-400 mt-0.5">歷史分位: {report.valuationContext.valuationPercentile}%</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] text-slate-400">最新月營收 YoY</div>
            <div className="text-xl font-mono font-bold text-red-400 mt-1">
              +{report.fundamentals.revenueYoY}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{report.fundamentals.revenueLatestMonth}</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] text-slate-400">毛利率 (Gross Margin)</div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
              {report.fundamentals.grossMargin}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">近季持續走升</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] text-slate-400">股東權益報酬率 (ROE)</div>
            <div className="text-xl font-mono font-bold text-cyan-400 mt-1">
              {report.fundamentals.roe}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">高獲利護城河</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] text-slate-400">三大法人外資動向</div>
            <div className="text-xl font-mono font-bold text-red-400 mt-1">
              {report.institutions.foreignNet > 0 ? '+' : ''}{report.institutions.foreignNet.toLocaleString()} 張
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">單日買超</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] text-slate-400">現金殖利率</div>
            <div className="text-xl font-mono font-bold text-slate-100 mt-1">
              {quote.yieldRatio}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">配息政策穩定</div>
          </div>
        </div>
      )}

      {/* 3. Core Analysis: Supporting vs Devil's Advocate (Counter-Analysis) */}
      {(activeTab === 'all' || activeTab === 'devils') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supporting Evidence */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>支持論點與正面催化劑 (Supporting Evidence)</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                  {report.supportingArguments.length} 項依據
                </span>
              </div>

              <div className="space-y-3.5 mt-5">
                {report.supportingArguments.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      {renderBadge(item.category)}
                      {item.source && (
                        <span className="text-[10px] text-slate-400">來源: {item.source}</span>
                      )}
                    </div>
                    <p className="text-slate-200 leading-relaxed font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">產業核心優勢：</span> {report.industryContext.competitiveMoat}
            </div>
          </div>

          {/* Devil's Advocate Counter-Arguments */}
          <div className="bg-gradient-to-b from-rose-950/20 via-slate-900/90 to-slate-900/90 border border-rose-900/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-rose-900/40">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                  <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
                  <span>Devil's Advocate 逆向質疑風控 (反方 Agent)</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                  強制質疑機制
                </span>
              </div>

              <p className="text-xs text-rose-300/80 mt-3 italic">
                「本模組強迫尋找：為什麼這個投資論點可能出錯？估值是否透支？海外折舊是否侵蝕獲利？」
              </p>

              <div className="space-y-3.5 mt-4">
                {report.devilsAdvocateArguments.map((item) => (
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
            </div>

            <div className="mt-4 p-3 rounded-xl bg-rose-950/30 border border-rose-900/30 text-[11px] text-rose-300">
              <span className="font-semibold">估值警戒位置：</span> {report.valuationContext.comment}
            </div>
          </div>
        </div>
      )}

      {/* 4. Fundamentals & 8Q EPS Trends (Line Chart with Peer & Market comparison) */}
      {(activeTab === 'all' || activeTab === 'fundamentals') && (
        <div className="space-y-4">
          <EpsTrendLineChart
            stockName={report.targetName}
            stockSymbol={report.targetSymbol}
            epsData={report.fundamentals.epsRecent8q}
            industryName={
              report.targetSymbol === '2330'
                ? '半導體同業'
                : report.targetSymbol === '3711'
                ? '封裝測試同業'
                : report.targetSymbol === '2317'
                ? '電子代工同業'
                : '同類股同業'
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-400">營業利益率：</span>
              <span className="font-mono font-bold text-slate-200 ml-2">{report.fundamentals.operatingMargin}%</span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-400">自由現金流：</span>
              <span className="font-mono font-bold text-slate-200 ml-2">NT$ {report.fundamentals.freeCashFlow} 億</span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-400">負債比率：</span>
              <span className="font-mono font-bold text-slate-200 ml-2">{report.fundamentals.debtRatio}% (安全健康)</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. YouTube Market Opinions Review */}
      {(activeTab === 'all' || activeTab === 'youtube') && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 font-bold text-slate-100">
              <Tv className="w-5 h-5 text-purple-400" />
              <span>YouTube 財經影片投資觀點審查 (YouTube Opinion Agent)</span>
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              審查原則：「影片提及標的」≠「推薦買入」，僅萃取市場觀點與數據
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {report.youtubeOpinions.map((yt) => {
              const sentimentColor =
                yt.sentiment === 'Bullish'
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : yt.sentiment === 'Bearish'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-700 text-slate-300 border-slate-600';

              return (
                <div
                  key={yt.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/40 transition-all text-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-purple-300">{yt.channel}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${sentimentColor}`}>
                        {yt.sentiment}
                      </span>
                    </div>
                    <h4 className="font-medium text-slate-200 line-clamp-2">{yt.title}</h4>
                    <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                      {yt.keyPoints.map((pt, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-purple-400">•</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{yt.date}</span>
                    <a
                      href={yt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:underline"
                    >
                      <span>檢視原片</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Key Tracking Metrics & Data Sources */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-cyan-400" />
              <span>未來關鍵追蹤指標 (Checkpoints)</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {report.keyTrackingMetrics.map((metric, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                  <span className="text-cyan-400 font-mono font-bold">{idx + 1}.</span>
                  <span className="leading-relaxed">{metric}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <span>本報告引用官方資料來源</span>
            </h3>
            <div className="space-y-2 text-xs">
              {report.dataSources.map((source, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-slate-300">{source.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{source.lastUpdated}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Statutory Risk Disclaimer */}
      <div className="bg-slate-950 border border-amber-900/30 rounded-2xl p-5 text-center text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>法定投資風險免責聲明</span>
        </div>
        <p className="leading-relaxed max-w-4xl mx-auto">
          本系統提供之資料整理、多來源交叉比對、AI 研究報告與反方風險質疑，僅供投資人研究參考與學術輔助，絕不構成任何形式之投資建議、買賣要約、獲利保證或推薦。金融市場與衍生性商品價格波動劇烈且具高度風險，投資人應獨立思考，審慎評估自身財務狀況與風險承受度，並自行承擔一切投資盈虧結果。
        </p>
      </div>
    </div>
  );
};
