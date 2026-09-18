import React from 'react';
import { FuturesBasisData } from '../types/futures';
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface FuturesBasisCardProps {
  basisData: FuturesBasisData;
}

export const FuturesBasisCard: React.FC<FuturesBasisCardProps> = ({ basisData }) => {
  const isPremium = basisData.basisType === 'PREMIUM';

  // SVG 簡易走勢座標
  const width = 320;
  const height = 90;
  const padX = 25;
  const padY = 15;

  const bases = basisData.historicalBasis5d.map((d) => d.basis);
  const minBasis = Math.min(...bases, -25);
  const maxBasis = Math.max(...bases, 35);

  const getX = (idx: number) => {
    return padX + (idx * (width - padX * 2)) / (basisData.historicalBasis5d.length - 1);
  };

  const getY = (val: number) => {
    const ratio = (val - minBasis) / (maxBasis - minBasis);
    return padY + (height - padY * 2) * (1 - ratio);
  };

  const zeroY = getY(0);

  const pathD = basisData.historicalBasis5d
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.basis)}`)
    .join(' ');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-base">期現貨基差 (Basis) 監控</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {basisData.updateTime}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* 左側：數值與價差指標 */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <div className="text-3xl font-mono font-extrabold text-white">
              {isPremium ? '+' : ''}{basisData.basis.toFixed(2)}
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                isPremium
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isPremium ? '正價差 (Premium)' : '逆價差 (Discount)'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400">{basisData.spotIndexName}</div>
              <div className="font-mono font-bold text-slate-200 mt-0.5">
                {basisData.spotPrice.toLocaleString()} 點
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400">{basisData.futuresContract}</div>
              <div className="font-mono font-bold text-cyan-300 mt-0.5">
                {basisData.futuresPrice.toLocaleString()} 點
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
            {basisData.comment}
          </p>
        </div>

        {/* 右側：近 5 日基差收斂走勢圖 */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
            <span className="font-semibold text-slate-300">近 5 日期現貨基差走勢</span>
            <span className="font-mono text-cyan-400">零軸以上為正價差</span>
          </div>

          <div className="w-full flex justify-center py-1">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] h-auto">
              {/* 零軸參考線 */}
              <line
                x1={padX}
                y1={zeroY}
                x2={width - padX}
                y2={zeroY}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text x={padX - 5} y={zeroY + 3} fill="#64748b" fontSize="9" textAnchor="end">
                0
              </text>

              {/* 基差折線 */}
              <path
                d={pathD}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 節點與數值 */}
              {basisData.historicalBasis5d.map((d, i) => (
                <g key={d.date}>
                  <circle
                    cx={getX(i)}
                    cy={getY(d.basis)}
                    r="4"
                    fill={d.basis >= 0 ? '#f87171' : '#34d399'}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                  <text
                    x={getX(i)}
                    y={getY(d.basis) + (d.basis >= 0 ? -7 : 13)}
                    fill="#e2e8f0"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {d.basis > 0 ? '+' : ''}{d.basis.toFixed(1)}
                  </text>
                  <text
                    x={getX(i)}
                    y={height - 2}
                    fill="#64748b"
                    fontSize="9"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {d.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-800/60">
            基差走高代表期貨多方追價意願高於現貨，常伴隨結算日前轉倉買盤。
          </div>
        </div>
      </div>
    </div>
  );
};
