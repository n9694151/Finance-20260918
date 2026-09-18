import React, { useState } from 'react';
import { EpsQuarterData } from '../types';
import {
  TrendingUp,
  Info,
  Check,
  Building2,
  Globe,
  Award,
} from 'lucide-react';

interface EpsTrendLineChartProps {
  stockName: string;
  stockSymbol: string;
  epsData: EpsQuarterData[];
  industryName?: string;
}

export const EpsTrendLineChart: React.FC<EpsTrendLineChartProps> = ({
  stockName,
  stockSymbol,
  epsData,
  industryName = '同類股半導體',
}) => {
  const [showStock, setShowStock] = useState(true);
  const [showIndustry, setShowIndustry] = useState(true);
  const [showMarket, setShowMarket] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(epsData.length - 1);

  // SVG 畫布邊界尺寸
  const svgWidth = 780;
  const svgHeight = 280;
  const padLeft = 55;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 40;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  // 計算數值極值與 Y 軸階梯
  const allValues = epsData.flatMap((d) => [d.eps, d.industryAvgEps, d.marketAvgEps]);
  const rawMax = Math.max(...allValues, 10);
  // 向上取整到合適的 5 的倍數
  const yMax = Math.ceil(rawMax / 5) * 5;
  const yMin = 0;

  const getY = (val: number) => {
    const ratio = (val - yMin) / (yMax - yMin);
    return padTop + chartHeight - ratio * chartHeight;
  };

  const getX = (index: number) => {
    const step = chartWidth / (epsData.length - 1);
    return padLeft + index * step;
  };

  // 生成折線路徑 (SVG Path)
  const buildPath = (key: 'eps' | 'industryAvgEps' | 'marketAvgEps') => {
    return epsData
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`)
      .join(' ');
  };

  // 生成個股下方的陰影填充區域
  const buildAreaPath = () => {
    const linePath = epsData
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.eps)}`)
      .join(' ');
    const closePath = ` L ${getX(epsData.length - 1)} ${padTop + chartHeight} L ${getX(0)} ${padTop + chartHeight} Z`;
    return linePath + closePath;
  };

  // Y 軸刻度線 (5 條等距刻度)
  const yTicksCount = 5;
  const yTicks = Array.from({ length: yTicksCount + 1 }, (_, i) => {
    const val = (yMax / yTicksCount) * i;
    return { val, y: getY(val) };
  });

  // 當前聚焦（懸停或預設最新一季）數據
  const activeData = hoveredIndex !== null && epsData[hoveredIndex] ? epsData[hoveredIndex] : epsData[epsData.length - 1];
  const industryOutperformance = activeData
    ? (((activeData.eps - activeData.industryAvgEps) / activeData.industryAvgEps) * 100).toFixed(1)
    : '0';
  const marketOutperformance = activeData
    ? (((activeData.eps - activeData.marketAvgEps) / activeData.marketAvgEps) * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* 標題與圖例切換區 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-100 text-base">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>近 8 季每股盈餘 (EPS) 獲利品質與大盤同業多維折線圖</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            單位：新台幣元 ‧ 數據來源：MOPS 公開資訊觀測站官方財報 vs TWSE 同業指數與大盤平均
          </p>
        </div>

        {/* 互動圖例開關 */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowStock(!showStock)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              showStock
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-950'
                : 'bg-slate-950/50 text-slate-500 border-slate-800 opacity-60'
            }`}
          >
            <span className="w-3 h-0.5 bg-cyan-400 rounded-full inline-block"></span>
            <span className="font-semibold">{stockName} ({stockSymbol})</span>
            {showStock && <Check className="w-3 h-3 ml-0.5 text-cyan-400" />}
          </button>

          <button
            onClick={() => setShowIndustry(!showIndustry)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              showIndustry
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-950'
                : 'bg-slate-950/50 text-slate-500 border-slate-800 opacity-60'
            }`}
          >
            <span className="w-3 h-0.5 bg-purple-400 border-b border-dashed border-purple-300 inline-block"></span>
            <span className="font-semibold">{industryName}平均</span>
            {showIndustry && <Check className="w-3 h-3 ml-0.5 text-purple-400" />}
          </button>

          <button
            onClick={() => setShowMarket(!showMarket)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              showMarket
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-950'
                : 'bg-slate-950/50 text-slate-500 border-slate-800 opacity-60'
            }`}
          >
            <span className="w-3 h-0.5 bg-amber-400 border-b border-dotted border-amber-300 inline-block"></span>
            <span className="font-semibold">大盤上市櫃平均</span>
            {showMarket && <Check className="w-3 h-3 ml-0.5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* SVG 折線圖主畫布 */}
      <div className="relative w-full overflow-x-auto scrollbar-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          <defs>
            {/* 個股折線光暈濾鏡 */}
            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.45" />
            </filter>
            {/* 個股漸層陰影 */}
            <linearGradient id="cyan-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Y 軸水平網格線與數值標籤 */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={tick.y}
                x2={svgWidth - padRight}
                y2={tick.y}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padLeft - 10}
                y={tick.y + 4}
                fill="#64748b"
                fontSize="11"
                textAnchor="end"
                className="font-mono"
              >
                {tick.val.toFixed(0)}
              </text>
            </g>
          ))}

          {/* X 軸季度垂直刻度與標籤 */}
          {epsData.map((d, idx) => {
            const x = getX(idx);
            const isHovered = hoveredIndex === idx;
            return (
              <g key={d.quarter}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + chartHeight}
                  stroke={isHovered ? '#38bdf8' : '#1e293b'}
                  strokeDasharray={isHovered ? '2 2' : 'none'}
                  strokeWidth={isHovered ? '1.5' : '1'}
                  opacity={isHovered ? 0.7 : 0.4}
                />
                <text
                  x={x}
                  y={padTop + chartHeight + 22}
                  fill={isHovered ? '#38bdf8' : '#94a3b8'}
                  fontSize="12"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="font-mono cursor-pointer"
                  onClick={() => setHoveredIndex(idx)}
                >
                  {d.quarter}
                </text>
              </g>
            );
          })}

          {/* 1. 個股陰影漸層面積 (Area) */}
          {showStock && (
            <path
              d={buildAreaPath()}
              fill="url(#cyan-area)"
              className="transition-all duration-300 pointer-events-none"
            />
          )}

          {/* 2. 大盤平均折線 (Market Avg: Amber dotted) */}
          {showMarket && (
            <path
              d={buildPath('marketAvgEps')}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {/* 3. 同類股平均折線 (Industry Avg: Purple dashed) */}
          {showIndustry && (
            <path
              d={buildPath('industryAvgEps')}
              fill="none"
              stroke="#c084fc"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {/* 4. 個股 EPS 折線 (Stock: Cyan solid with glow) */}
          {showStock && (
            <path
              d={buildPath('eps')}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#cyan-glow)"
              className="transition-all duration-300"
            />
          )}

          {/* 5. 數據節點 (Points) 與懸停感應區 */}
          {epsData.map((d, idx) => {
            const x = getX(idx);
            const isHovered = hoveredIndex === idx;

            return (
              <g key={idx} onMouseEnter={() => setHoveredIndex(idx)} className="cursor-pointer">
                {/* 隱形感應感測條 */}
                <rect
                  x={x - chartWidth / (epsData.length * 2)}
                  y={padTop}
                  width={chartWidth / epsData.length}
                  height={chartHeight + 20}
                  fill="transparent"
                />

                {/* 大盤圓點 */}
                {showMarket && (
                  <circle
                    cx={x}
                    cy={getY(d.marketAvgEps)}
                    r={isHovered ? 4.5 : 3}
                    fill="#fbbf24"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                )}

                {/* 同類股菱形點 */}
                {showIndustry && (
                  <circle
                    cx={x}
                    cy={getY(d.industryAvgEps)}
                    r={isHovered ? 5 : 3.5}
                    fill="#c084fc"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                )}

                {/* 個股圓點 (具雙層光環) */}
                {showStock && (
                  <g>
                    {isHovered && (
                      <circle
                        cx={x}
                        cy={getY(d.eps)}
                        r="9"
                        fill="#06b6d4"
                        opacity="0.3"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={getY(d.eps)}
                      r={isHovered ? 6 : 4.5}
                      fill="#38bdf8"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 互動數值焦點卡與多維對比解讀面板 */}
      {activeData && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                {activeData.quarter} 季度深度對比
              </span>
              <span className="text-xs text-slate-400">
                （點擊或游標滑過折線圖季度即可即時切換）
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <Award className="w-4 h-4" />
              <span>
                {stockName} 超越同類股平均 <span className="font-mono font-bold">+{industryOutperformance}%</span>，超越大盤平均 <span className="font-mono font-bold">+{marketOutperformance}%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {/* 個股 EPS */}
            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>{stockName} ({stockSymbol}) EPS</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-white mt-1">
                  NT$ {activeData.eps.toFixed(2)}
                </div>
              </div>
              <div className="text-[10px] text-cyan-300/80 text-right">
                <div>MOPS 官方公佈</div>
                <div className="text-emerald-400 font-bold">歷史最高水準</div>
              </div>
            </div>

            {/* 同類股平均 EPS */}
            <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800/40 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-purple-300 font-semibold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{industryName}平均 EPS</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-purple-200 mt-1">
                  NT$ {activeData.industryAvgEps.toFixed(2)}
                </div>
              </div>
              <div className="text-[10px] text-purple-300/80 text-right">
                <div>產業同業平均</div>
                <div className="text-cyan-300 font-mono">
                  差額: +{(activeData.eps - activeData.industryAvgEps).toFixed(2)}
                </div>
              </div>
            </div>

            {/* 大盤平均 EPS */}
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>大盤上市櫃全體平均 EPS</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-amber-200 mt-1">
                  NT$ {activeData.marketAvgEps.toFixed(2)}
                </div>
              </div>
              <div className="text-[10px] text-amber-300/80 text-right">
                <div>加權綜合基準</div>
                <div className="text-cyan-300 font-mono">
                  差額: +{(activeData.eps - activeData.marketAvgEps).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
