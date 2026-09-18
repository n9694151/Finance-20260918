import React from 'react';
import { InstitutionalPositionItem } from '../types/futures';
import {
  Users,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface FuturesInstitutionsCardProps {
  institutions: InstitutionalPositionItem[];
  updateTime: string;
}

export const FuturesInstitutionsCard: React.FC<FuturesInstitutionsCardProps> = ({
  institutions,
  updateTime,
}) => {
  const totalNet = institutions.reduce((acc, cur) => acc + cur.netOI, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">三大法人期貨未平倉多空淨額矩陣</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            資料時間：{updateTime} ‧ 來源：臺灣期貨交易所 (TAIFEX) 每日三大法人期貨交易統計表
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-slate-400">三大法人合計淨額：</span>
          <span
            className={`font-mono font-bold ${
              totalNet >= 0 ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {totalNet > 0 ? '+' : ''}{totalNet.toLocaleString()} 口
          </span>
        </div>
      </div>

      {/* 法人多空部位表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-medium">
              <th className="pb-3 pl-2">法人機構類別</th>
              <th className="pb-3 text-right">多方未平倉 (口)</th>
              <th className="pb-3 text-right">空方未平倉 (口)</th>
              <th className="pb-3 text-right">多空淨未平倉 (口)</th>
              <th className="pb-3 text-right">單日增減 (口)</th>
              <th className="pb-3 pr-2 text-right">淨契約金額 (億元)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {institutions.map((inst) => {
              const isNetLong = inst.netOI >= 0;
              const isChangePositive = inst.netChange >= 0;

              return (
                <tr key={inst.institution} className="hover:bg-slate-800/40 transition-all">
                  <td className="py-3 pl-2 font-sans font-semibold text-slate-200 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        inst.institution === 'FOREIGN'
                          ? 'bg-cyan-400'
                          : inst.institution === 'INVESTMENT_TRUST'
                          ? 'bg-purple-400'
                          : 'bg-amber-400'
                      }`}
                    ></span>
                    <span>{inst.name}</span>
                  </td>
                  <td className="py-3 text-right text-slate-300">
                    {inst.longOI.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-slate-300">
                    {inst.shortOI.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        isNetLong
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {inst.netOI > 0 ? '+' : ''}{inst.netOI.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold">
                    <span
                      className={`flex items-center justify-end ${
                        isChangePositive ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {isChangePositive ? (
                        <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                      )}
                      {inst.netChange > 0 ? '+' : ''}{inst.netChange.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right text-slate-300">
                    {inst.amountNet > 0 ? '+' : ''}{inst.amountNet.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* TAIFEX 官方規範與避險對沖特別警語 */}
      <div className="p-4 rounded-xl bg-slate-950 border border-amber-900/30 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>TAIFEX 官方機構特性與避險對沖準則</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          臺灣期貨交易所 (TAIFEX) 明確提醒：三大法人為數以千計不同法人機構之集合，期貨淨額乃各家現貨避險（如一籃子權值股 Delta 對沖）、價差套利及造市部位相互抵銷後之總量結果。
          <strong className="text-slate-200"> 嚴禁將「外資淨未平倉空單」直接等同於外資看空市場</strong>，避免落入盲目解讀之投資陷阱。
        </p>
      </div>
    </div>
  );
};
