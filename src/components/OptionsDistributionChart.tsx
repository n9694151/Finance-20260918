import React, { useState } from 'react';
import { OptionsMarketSummary } from '../types/futures';
import {
  Layers,
  Shield,
  Target,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface OptionsDistributionChartProps {
  optionsData: OptionsMarketSummary;
}

export const OptionsDistributionChart: React.FC<OptionsDistributionChartProps> = ({
  optionsData,
}) => {
  const [hoveredStrike, setHoveredStrike] = useState<number | null>(null);

  const maxOIValue = Math.max(
    ...optionsData.strikes.flatMap((s) => [s.callOI, s.putOI]),
    35000
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* 標題與即時 Put/Call Ratio 儀表區 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>臺指選擇權 (TXO) 履約價未平倉分布與 Put/Call Ratio</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            資料時間：{optionsData.updateTime} ‧ 來源：臺灣期貨交易所 (TAIFEX) 盤後官方統計
          </p>
        </div>

        {/* PCR 指標面板 */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400">Put/Call Ratio (買賣權未平倉比)</div>
            <div className="text-xl font-mono font-extrabold text-emerald-400 mt-0.5">
              {optionsData.putCallRatio.toFixed(2)}%
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="text-[11px] space-y-0.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PCR &gt; 100% 偏多支撐
            </span>
            <div className="text-[10px] text-slate-400">
              賣權總 OI：{optionsData.totalPutOI.toLocaleString()} 口
            </div>
          </div>
        </div>
      </div>

      {/* 最大支撐與壓力履約價提示條 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-rose-200 font-medium">上方最大壓力區 (Call 最大 OI)</span>
          </div>
          <div className="text-right font-mono">
            <span className="text-base font-bold text-rose-300">{optionsData.maxCallOIStrike} 點</span>
            <span className="text-[10px] text-rose-400/80 ml-2">(28,450 口)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-200 font-medium">下方最強支撐區 (Put 最大 OI)</span>
          </div>
          <div className="text-right font-mono">
            <span className="text-base font-bold text-emerald-300">{optionsData.maxPutOIStrike} 點</span>
            <span className="text-[10px] text-emerald-400/80 ml-2">(31,200 口)</span>
          </div>
        </div>
      </div>

      {/* 履約價 Call vs Put 未平倉量視覺化柱狀分布圖 */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-cyan-500/80 inline-block"></span>
            <span className="font-medium text-cyan-300">買權未平倉 (Call OI / 壓力阻力)</span>
          </div>
          <span className="text-[11px] font-mono">履約價 (Strike)</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500/80 inline-block"></span>
            <span className="font-medium text-rose-300">賣權未平倉 (Put OI / 支撐下檔)</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {optionsData.strikes.map((s) => {
            const callPct = Math.min((s.callOI / maxOIValue) * 100, 100);
            const putPct = Math.min((s.putOI / maxOIValue) * 100, 100);
            const isHovered = hoveredStrike === s.strikePrice;
            const isMaxCall = s.strikePrice === optionsData.maxCallOIStrike;
            const isMaxPut = s.strikePrice === optionsData.maxPutOIStrike;

            return (
              <div
                key={s.strikePrice}
                onMouseEnter={() => setHoveredStrike(s.strikePrice)}
                onMouseLeave={() => setHoveredStrike(null)}
                className={`grid grid-cols-12 items-center gap-2 p-2 rounded-xl transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-slate-800/80 border border-indigo-500/40'
                    : 'bg-slate-950/50 border border-slate-800/60 hover:border-slate-700'
                }`}
              >
                {/* 左側：買權 Call OI 條狀 */}
                <div className="col-span-5 flex items-center justify-end gap-2">
                  <span className="text-xs font-mono font-medium text-cyan-300 shrink-0">
                    {s.callOI.toLocaleString()}
                  </span>
                  <div className="w-full bg-slate-900 h-4 rounded-md overflow-hidden flex justify-end">
                    <div
                      className={`h-full rounded-md transition-all duration-300 ${
                        isMaxCall
                          ? 'bg-gradient-to-l from-cyan-400 to-blue-600 shadow-sm shadow-cyan-500/40'
                          : 'bg-cyan-600/70'
                      }`}
                      style={{ width: `${callPct}%` }}
                    ></div>
                  </div>
                </div>

                {/* 中間：履約價 */}
                <div className="col-span-2 text-center">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg transition-all ${
                      isMaxCall
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : isMaxPut
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isHovered
                        ? 'bg-indigo-500/30 text-indigo-200'
                        : 'text-slate-300'
                    }`}
                  >
                    {s.strikePrice}
                  </span>
                </div>

                {/* 右側：賣權 Put OI 條狀 */}
                <div className="col-span-5 flex items-center justify-start gap-2">
                  <div className="w-full bg-slate-900 h-4 rounded-md overflow-hidden flex justify-start">
                    <div
                      className={`h-full rounded-md transition-all duration-300 ${
                        isMaxPut
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-sm shadow-rose-500/40'
                          : 'bg-rose-600/70'
                      }`}
                      style={{ width: `${putPct}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-medium text-rose-300 shrink-0">
                    {s.putOI.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 近 5 日 Put/Call Ratio 演變趨勢 */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          近 5 日 Put/Call Ratio (PCR%) 變化走勢：
        </span>
        <div className="flex items-center gap-2 overflow-x-auto">
          {optionsData.pcrTrend.map((t, idx) => (
            <div
              key={t.date}
              className={`px-2.5 py-1 rounded-lg border font-mono ${
                idx === optionsData.pcrTrend.length - 1
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800'
              }`}
            >
              <span>{t.date}: </span>
              <span>{t.pcr}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
