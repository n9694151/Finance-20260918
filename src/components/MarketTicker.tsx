import React from 'react';
import { MarketIndexItem } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketTickerProps {
  indices: MarketIndexItem[];
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ indices }) => {
  return (
    <div className="w-full bg-slate-950/70 border-b border-slate-800/60 overflow-x-auto scrollbar-none py-2 px-4 lg:px-8">
      <div className="flex items-center gap-6 min-w-max text-xs">
        <span className="font-semibold text-slate-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          即時市場指數:
        </span>
        {indices.map((item) => {
          const isPositive = item.change >= 0;
          return (
            <div key={item.code} className="flex items-center gap-2">
              <span className="font-medium text-slate-300">{item.name}</span>
              <span className="font-mono font-semibold text-slate-100">
                {item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`flex items-center font-mono font-medium ${
                  isPositive ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {isPositive ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
