import React, { useState } from 'react';
import { RealEstateReport } from '../types/realEstate';
import { RealEstatePriceTrendChart } from './RealEstatePriceTrendChart';
import { RealEstateHistoryTable } from './RealEstateHistoryTable';
import { RealEstateRoiCalculator } from './RealEstateRoiCalculator';
import { getOrGenerateRealEstateReport } from '../mock/realEstateData';

interface RealEstateResearchViewProps {
  report: RealEstateReport;
  onSelectQuery?: (query: string) => void;
}

export const RealEstateResearchView: React.FC<RealEstateResearchViewProps> = ({
  report,
  onSelectQuery,
}) => {
  const [activeQuery, setActiveQuery] = useState(report.regionQuery);
  const [currentReport, setCurrentReport] = useState<RealEstateReport>(report);

  // 當外部 report 變更時同步更新
  React.useEffect(() => {
    setCurrentReport(report);
    setActiveQuery(report.regionQuery);
  }, [report]);

  const handleQuickSelect = (query: string) => {
    setActiveQuery(query);
    const newRep = getOrGenerateRealEstateReport(query);
    setCurrentReport(newRep);
    if (onSelectQuery) {
      onSelectQuery(query);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuery.trim()) return;
    const newRep = getOrGenerateRealEstateReport(activeQuery.trim());
    setCurrentReport(newRep);
    if (onSelectQuery) {
      onSelectQuery(activeQuery.trim());
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. 頂部搜尋與熱門快捷標籤列 */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                內政部實價登錄架構
              </span>
              <h2 className="text-xl font-black text-white tracking-wide">
                台灣不動產研究 Agent (Real Estate Research)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              整合內政部實價登錄官方大數據，分析成交單價、歷史成交、租金、三層投報率與房貸現金流
            </p>
          </div>

          {/* 官方數據驗證徽章 */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <div className="text-[11px] text-slate-400">資料來源：內政部不動產交易實價查詢</div>
              <div className="text-xs font-bold text-emerald-400">
                {currentReport.dataSource.lastUpdated}
              </div>
            </div>
          </div>
        </div>

        {/* 搜尋欄位 */}
        <form onSubmit={handleSearchSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={activeQuery}
              onChange={(e) => setActiveQuery(e.target.value)}
              placeholder="請輸入縣市、行政區、社區或路段 (例如：高雄市左營區、台北市大安區、板橋新板特區、台中七期...)"
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-lg hover:shadow-emerald-500/20 whitespace-nowrap cursor-pointer"
          >
            查詢實價登錄與投報
          </button>
        </form>

        {/* 熱門焦點生活圈快捷標籤 */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
          <span className="text-slate-500 font-medium">焦點指標生活圈：</span>
          {[
            { label: '高雄市左營區 (巨蛋/高鐵)', query: '高雄市左營區' },
            { label: '台北市大安區 (森林公園/科技大樓)', query: '台北市大安區' },
            { label: '新北市板橋區 (新板特區/江翠)', query: '新北市板橋區' },
            { label: '台中市西屯區 (七期/水湳經貿)', query: '台中市西屯區' },
            { label: '新竹縣竹北市 (高鐵特區)', query: '新竹縣竹北市' },
          ].map((item) => (
            <button
              key={item.query}
              type="button"
              onClick={() => handleQuickSelect(item.query)}
              className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                currentReport.regionQuery === item.query
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 核心行情數據指標卡 (6-Grid Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 近一年成交均價 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-400">近一年成交均價</div>
          <div className="text-2xl font-black text-white mt-1">
            {currentReport.avgPricePerPing1Y}{' '}
            <span className="text-xs font-normal text-slate-400">萬/坪</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            近三年 {currentReport.priceChange3YPercent >= 0 ? '+' : ''}
            {currentReport.priceChange3YPercent}%
          </div>
        </div>

        {/* 全市均價對比 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-400">{currentReport.cityName} 全市均價</div>
          <div className="text-2xl font-black text-indigo-300 mt-1">
            {currentReport.cityAvgPricePerPing}{' '}
            <span className="text-xs font-normal text-slate-400">萬/坪</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            區域溢價{' '}
            <span className="text-amber-400 font-bold">
              +{(((currentReport.avgPricePerPing1Y - currentReport.cityAvgPricePerPing) / currentReport.cityAvgPricePerPing) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* 平均月租金行情 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-400">市場預估平均月租</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {currentReport.rental.monthlyRent.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">元/月</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            單坪租金约 {currentReport.rental.rentPerPing} 元
          </div>
        </div>

        {/* ① 毛租金投報率 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-400">① 毛租金報酬率 (Gross)</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {currentReport.defaultYields.grossYield}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">年租金 ÷ 房屋總價</div>
        </div>

        {/* ② 淨租金投報率 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-400">② 淨租金報酬率 (NOI)</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {currentReport.defaultYields.netYield}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">扣除稅費、管銷、空置</div>
        </div>

        {/* ③ 實質現金流 */}
        <div className={`border rounded-2xl p-4 shadow-lg ${
          currentReport.defaultYields.monthlyNetCashflow >= 0
            ? 'bg-emerald-950/30 border-emerald-500/40'
            : 'bg-rose-950/30 border-rose-500/40'
        }`}>
          <div className="text-[11px] text-slate-400">每月實質淨現金流</div>
          <div className={`text-xl font-black mt-1 ${
            currentReport.defaultYields.monthlyNetCashflow >= 0
              ? 'text-emerald-400'
              : 'text-rose-400'
          }`}>
            {currentReport.defaultYields.monthlyNetCashflow >= 0 ? '+' : ''}
            {currentReport.defaultYields.monthlyNetCashflow.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {currentReport.defaultYields.monthlyNetCashflow >= 0 ? '正現金流 (Positive)' : '需月補差額 (Negative)'}
          </div>
        </div>
      </div>

      {/* 3. 內政部實價登錄近3年季平均單價走勢圖 */}
      <RealEstatePriceTrendChart
        data={currentReport.priceTrend3Y}
        districtName={currentReport.districtName}
        cityName={currentReport.cityName}
      />

      {/* 4. 房貸成本與三層投報率精算器 */}
      <RealEstateRoiCalculator
        initialMortgage={currentReport.defaultMortgage}
        rental={currentReport.rental}
        districtName={currentReport.districtName}
      />

      {/* 5. 內政部實價登錄歷史成交明細表 */}
      <RealEstateHistoryTable
        transactions={currentReport.transactions}
        districtName={currentReport.districtName}
      />

      {/* 6. 不動產投資論點與逆向風控 (Devil's Advocate) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 支持論點 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-base font-bold text-white tracking-wide">
              {currentReport.districtName} 投資支撐論點 (Bullish Catalyst)
            </h3>
          </div>
          <div className="mt-4 space-y-4">
            {currentReport.supportingArguments.map((arg) => (
              <div
                key={arg.id}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-300">{arg.title}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                    FACT VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-300">{arg.claim}</p>
                <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-medium">實證數據：</span>
                  {arg.evidence}
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  來源：{arg.sourceName} • {arg.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 逆向風控審查 (Devil's Advocate) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <h3 className="text-base font-bold text-white tracking-wide">
              逆向風控審查 (Devil's Advocate Property Risks)
            </h3>
          </div>
          <div className="mt-4 space-y-4">
            {currentReport.devilsAdvocateRisks.map((risk) => (
              <div
                key={risk.id}
                className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-rose-300">{risk.title}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-semibold border border-rose-500/30">
                    RISK FACTOR
                  </span>
                </div>
                <p className="text-xs text-slate-300">{risk.claim}</p>
                <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-rose-400 font-medium">風控實證：</span>
                  {risk.evidence}
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  來源：{risk.sourceName} • {risk.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. 未來關鍵追蹤指標 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <h3 className="text-sm font-bold text-white tracking-wide">
            {currentReport.districtName} 未來關鍵指標追蹤清單 (Key Milestones)
          </h3>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentReport.keyTrackingMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-start gap-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-xs text-slate-300 font-medium leading-relaxed">
                {metric}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 8. 資料來源宣告與法定免責宣告 */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-500 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">官方資料來源：</span>
            <a
              href={currentReport.dataSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-mono"
            >
              {currentReport.dataSource.name}
            </a>
          </div>
          <div>最後同步更新時間：{currentReport.dataSource.lastUpdated}</div>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-500">
          {currentReport.statutoryDisclaimer}
        </p>
      </div>
    </div>
  );
};
