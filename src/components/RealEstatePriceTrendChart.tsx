import React, { useState } from 'react';

interface PricePoint {
  quarter: string;
  districtAvg: number;
  cityAvg: number;
}

interface RealEstatePriceTrendChartProps {
  data: PricePoint[];
  districtName: string;
  cityName: string;
}

export const RealEstatePriceTrendChart: React.FC<RealEstatePriceTrendChartProps> = ({
  data,
  districtName,
  cityName,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-slate-500">暫無價格走勢資料</div>;
  }

  // 計算數值範圍
  const allValues = data.flatMap((d) => [d.districtAvg, d.cityAvg]);
  const minVal = Math.floor(Math.min(...allValues) * 0.9);
  const maxVal = Math.ceil(Math.max(...allValues) * 1.1);
  const range = maxVal - minVal || 1;

  // SVG 畫布尺寸
  const width = 800;
  const height = 280;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // 座標映射函數
  const getX = (index: number) =>
    paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) =>
    paddingTop + chartHeight - ((val - minVal) / range) * chartHeight;

  // 繪製路徑
  const districtPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.districtAvg)}`)
    .join(' ');

  const cityPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.cityAvg)}`)
    .join(' ');

  // 填滿漸層區域
  const districtArea = `${districtPath} L ${getX(data.length - 1)} ${getY(minVal)} L ${getX(0)} ${getY(minVal)} Z`;

  // Y軸標籤階數
  const yTicks = [
    minVal,
    Math.round(minVal + range * 0.33),
    Math.round(minVal + range * 0.66),
    maxVal,
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* 頂部說明與圖例 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-base font-bold text-white tracking-wide">
              內政部實價登錄 近 3 年季平均成交單價走勢
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            單位：萬元 / 坪（排除親友特殊交易、車位單價分離拆算）
          </p>
        </div>

        {/* 圖例 */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-emerald-400 rounded-full inline-block"></span>
            <span className="text-emerald-300 font-semibold">{districtName} 平均</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 bg-indigo-400 border-b border-dashed border-indigo-400 inline-block"></span>
            <span className="text-indigo-300">{cityName} 全市均價</span>
          </div>
        </div>
      </div>

      {/* SVG 折線圖 */}
      <div className="mt-4 relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
        >
          <defs>
            <linearGradient id="districtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 橫向背景格線與 Y 軸數值 */}
          {yTicks.map((tickVal, i) => {
            const y = getY(tickVal);
            return (
              <g key={`ytick-${i}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 12}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="11"
                  fontFamily="sans-serif"
                >
                  {tickVal} 萬
                </text>
              </g>
            );
          })}

          {/* 漸層區域 */}
          <path d={districtArea} fill="url(#districtGradient)" />

          {/* 全市均價虛線 */}
          <path
            d={cityPath}
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            strokeDasharray="5 5"
            opacity="0.8"
          />

          {/* 行政區單價實線 */}
          <path
            d={districtPath}
            fill="none"
            stroke="#34d399"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* 節點圓點與懸浮輔助線 */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cyDist = getY(d.districtAvg);
            const isHovered = hoverIndex === i;

            return (
              <g
                key={`point-${i}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* 垂直導引線 */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingTop}
                    x2={cx}
                    y2={height - paddingBottom}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* 擴大可觸發懸浮面積 */}
                <rect
                  x={cx - chartWidth / (data.length * 2)}
                  y={paddingTop}
                  width={chartWidth / data.length}
                  height={chartHeight}
                  fill="transparent"
                />

                {/* 全市均價小圓點 */}
                <circle
                  cx={cx}
                  cy={getY(d.cityAvg)}
                  r={isHovered ? 4 : 2.5}
                  fill="#818cf8"
                />

                {/* 行政區重點圓點 */}
                <circle
                  cx={cx}
                  cy={cyDist}
                  r={isHovered ? 7 : 4}
                  fill="#10b981"
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}

          {/* X 軸季度標籤 */}
          {data.map((d, i) => {
            // 每隔 2 個季度顯示標籤以防重疊，最後一季必顯示
            const showLabel = i % 2 === 0 || i === data.length - 1;
            if (!showLabel) return null;
            return (
              <text
                key={`xtick-${i}`}
                x={getX(i)}
                y={height - paddingBottom + 22}
                textAnchor="middle"
                fill={hoverIndex === i ? '#34d399' : '#64748b'}
                fontSize="11"
                fontWeight={hoverIndex === i ? '600' : '400'}
                fontFamily="sans-serif"
              >
                {d.quarter}
              </text>
            );
          })}
        </svg>

        {/* 懸浮數值卡片 */}
        {hoverIndex !== null && data[hoverIndex] && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-emerald-500/40 rounded-xl px-4 py-2 shadow-2xl backdrop-blur-md flex items-center gap-4 pointer-events-none text-xs"
          >
            <div className="text-slate-300 font-bold border-r border-slate-700 pr-3">
              {data[hoverIndex].quarter}
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">{districtName}</div>
              <div className="text-emerald-400 font-extrabold text-sm">
                {data[hoverIndex].districtAvg} <span className="text-[10px] font-normal">萬/坪</span>
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">{cityName}全市均價</div>
              <div className="text-indigo-300 font-bold text-sm">
                {data[hoverIndex].cityAvg} <span className="text-[10px] font-normal">萬/坪</span>
              </div>
            </div>
            <div className="pl-2 border-l border-slate-700">
              <span className="text-[10px] text-slate-400">溢價率</span>
              <div className="text-amber-400 font-bold text-xs">
                +{(((data[hoverIndex].districtAvg - data[hoverIndex].cityAvg) / data[hoverIndex].cityAvg) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
