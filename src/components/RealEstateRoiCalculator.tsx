import React, { useState, useMemo } from 'react';
import { RentalData, MortgageCashflowParams } from '../types/realEstate';
import { calculateYields } from '../mock/realEstateData';

interface RealEstateRoiCalculatorProps {
  initialMortgage: MortgageCashflowParams;
  rental: RentalData;
  districtName: string;
}

export const RealEstateRoiCalculator: React.FC<RealEstateRoiCalculatorProps> = ({
  initialMortgage,
  rental,
  districtName,
}) => {
  // 狀態控制輸入數值
  const [totalPrice, setTotalPrice] = useState<number>(initialMortgage.propertyTotalPrice);
  const [downPaymentRatio, setDownPaymentRatio] = useState<number>(initialMortgage.downPaymentRatio);
  const [termYears, setTermYears] = useState<number>(initialMortgage.mortgageTermYears);
  const [interestRate, setInterestRate] = useState<number>(initialMortgage.mortgageInterestRate);
  const [gracePeriod, setGracePeriod] = useState<number>(initialMortgage.gracePeriodYears);
  const [monthlyRent, setMonthlyRent] = useState<number>(initialMortgage.expectedMonthlyRent);

  // 動態即時精算結果
  const yields = useMemo(() => {
    return calculateYields(
      totalPrice,
      downPaymentRatio,
      termYears,
      interestRate,
      gracePeriod,
      monthlyRent,
      rental
    );
  }, [totalPrice, downPaymentRatio, termYears, interestRate, gracePeriod, monthlyRent, rental]);

  // 寬限期利息 (若有寬限期)
  const interestOnlyPayment = useMemo(() => {
    const loanAmountNtd = (totalPrice * (1 - downPaymentRatio / 100)) * 10000;
    const monthlyRate = (interestRate / 100) / 12;
    return Math.round(loanAmountNtd * monthlyRate);
  }, [totalPrice, downPaymentRatio, interestRate]);

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      {/* 標題與說明 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h3 className="text-base font-bold text-white tracking-wide">
              {districtName} 租金投報率、房貸成本與實質現金流試算器
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            提供三大層級投報率（毛投報、淨投報、槓桿後投報）與央行信用管制情境模擬
          </p>
        </div>
        <div className="text-xs bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-slate-300 flex items-center gap-2">
          <span>央行第7波管制參考：</span>
          <span className="text-amber-400 font-semibold">自然人第二戶上限 5 成無寬限</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* 左側：參數調整表單 (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>購屋與貸款條件設定</span>
            <span className="text-[11px] text-slate-500 lowercase">即時動態精算</span>
          </h4>

          {/* 房屋總價 */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>預估房屋總價</span>
              <span className="text-emerald-400 font-bold">{totalPrice.toLocaleString()} 萬元</span>
            </div>
            <input
              type="range"
              min="500"
              max="8000"
              step="50"
              value={totalPrice}
              onChange={(e) => setTotalPrice(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>500 萬</span>
              <span>4,000 萬</span>
              <span>8,000 萬</span>
            </div>
          </div>

          {/* 自備款成數 */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>自備款成數 (Down Payment)</span>
              <span className="text-cyan-400 font-bold">{downPaymentRatio}% ({yields.downPaymentAmount.toLocaleString()} 萬)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[15, 20, 30, 50].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setDownPaymentRatio(ratio)}
                  className={`py-1 rounded text-xs font-semibold transition-all ${
                    downPaymentRatio === ratio
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {ratio}%
                </button>
              ))}
            </div>
          </div>

          {/* 貸款年限 */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>貸款年限</span>
              <span className="text-indigo-300 font-bold">{termYears} 年</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[20, 30, 40].map((years) => (
                <button
                  key={years}
                  type="button"
                  onClick={() => setTermYears(years)}
                  className={`py-1 rounded text-xs font-semibold transition-all ${
                    termYears === years
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {years} 年期
                </button>
              ))}
            </div>
          </div>

          {/* 房貸利率 */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>房貸年利率 %</span>
              <span className="text-amber-400 font-bold">{interestRate.toFixed(3)}%</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="3.5"
              step="0.025"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>新青安 1.775%</span>
              <span>一般首購 2.185%</span>
              <span>二戶以上 2.8%+</span>
            </div>
          </div>

          {/* 寬限期 */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>寬限期 (Grace Period)</span>
              <span className="text-slate-300 font-bold">{gracePeriod === 0 ? '無寬限 (本息攤還)' : `${gracePeriod} 年`}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGracePeriod(g)}
                  className={`py-1 rounded text-xs font-semibold transition-all ${
                    gracePeriod === g
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {g === 0 ? '無寬限' : `${g}年`}
                </button>
              ))}
            </div>
          </div>

          {/* 預估月租金 */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>預估每月租金收入</span>
              <span className="text-emerald-400 font-bold">{monthlyRent.toLocaleString()} 元/月</span>
            </div>
            <input
              type="range"
              min="15000"
              max="100000"
              step="1000"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1.5 萬</span>
              <span>5.0 萬</span>
              <span>10.0 萬</span>
            </div>
          </div>
        </div>

        {/* 右側：精算儀表板與三大層級投報率 (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* 三層租金報酬率指標牌 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* ① 毛租金投報率 */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>① 毛租金報酬率</span>
                <span className="text-[10px] text-slate-500">Gross</span>
              </div>
              <div className="text-2xl font-black text-white mt-2">
                {yields.grossYield}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                年租金 ÷ 總價 ({((monthlyRent * 12) / 10000).toFixed(1)}萬 ÷ {totalPrice}萬)
              </div>
            </div>

            {/* ② 淨租金投報率 */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>② 淨租金報酬率</span>
                <span className="text-[10px] text-slate-500">Net (NOI)</span>
              </div>
              <div className="text-2xl font-black text-cyan-400 mt-2">
                {yields.netYield}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                扣除稅費、管銷、{100 - rental.occupancyRate}% 空置損耗
              </div>
            </div>

            {/* ③ 槓桿後現金流報酬率 */}
            <div className={`border p-4 rounded-xl relative overflow-hidden ${
              yields.leveragedCashOnCashYield >= 0
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-rose-950/30 border-rose-500/40'
            }`}>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>③ 實質現金流報酬</span>
                <span className="text-[10px] text-slate-500">Cash-on-Cash</span>
              </div>
              <div className={`text-2xl font-black mt-2 ${
                yields.leveragedCashOnCashYield >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {yields.leveragedCashOnCashYield}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                年淨現金流 ÷ 自備款 ({yields.downPaymentAmount}萬)
              </div>
            </div>
          </div>

          {/* 每月收支與現金流瀑布分析 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              每月現金流明細 (Monthly Cash Flow Waterfall)
            </h4>

            <div className="space-y-2 text-xs">
              {/* 租金進帳 */}
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  (+) 預期每月租金收入
                </span>
                <span className="text-emerald-400 font-bold">+{monthlyRent.toLocaleString()} 元</span>
              </div>

              {/* 房貸本息支出 */}
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  (-) 房貸每月本息支出 (貸款 {yields.loanAmount.toLocaleString()} 萬)
                </span>
                <span className="text-rose-400 font-bold">
                  -{yields.monthlyMortgagePayment.toLocaleString()} 元
                </span>
              </div>

              {/* 寬限期備註 */}
              {gracePeriod > 0 && (
                <div className="text-[11px] text-indigo-300 bg-indigo-950/40 px-2 py-1 rounded">
                  💡 寬限期 {gracePeriod} 年內每月僅需付利息：约 {interestOnlyPayment.toLocaleString()} 元，但期滿後月付金將跳升至 {yields.monthlyMortgagePayment.toLocaleString()} 元 (寬限期懸崖)
                </div>
              )}

              {/* 社區管理費 */}
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  (-) 預估大樓管理費 (約35坪)
                </span>
                <span className="text-slate-400">-{yields.monthlyManagementFee.toLocaleString()} 元</span>
              </div>

              {/* 房屋稅/地價稅/維護基金攤提 */}
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  (-) 稅費及修繕空置每月提撥
                </span>
                <span className="text-slate-400">
                  -{Math.round((rental.propertyTaxYearly + rental.landTaxYearly + rental.maintenanceReserveYearly) / 12).toLocaleString()} 元
                </span>
              </div>

              {/* 最終淨現金流結算 */}
              <div className={`flex items-center justify-between pt-3 pb-1 text-sm font-black rounded-lg px-3 ${
                yields.monthlyNetCashflow >= 0
                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-900/30 text-rose-400 border border-rose-500/40'
              }`}>
                <div className="flex items-center gap-2">
                  <span>每月實質淨現金流：</span>
                  <span className="text-xs font-normal">
                    {yields.monthlyNetCashflow >= 0 ? '(正現金流 Positive Carry)' : '(負現金流 Negative Carry)'}
                  </span>
                </div>
                <div className="text-base">
                  {yields.monthlyNetCashflow >= 0 ? '+' : ''}
                  {yields.monthlyNetCashflow.toLocaleString()} 元 / 月
                </div>
              </div>
            </div>

            {/* 警語或亮點提醒 */}
            <div className="mt-4 p-3 bg-slate-900 rounded-lg text-xs text-slate-400 border border-slate-800">
              {yields.monthlyNetCashflow < 0 ? (
                <div className="flex items-start gap-2 text-rose-300">
                  <span className="text-base">⚠️</span>
                  <div>
                    <span className="font-bold">負現金流警示：</span>
                    目前月租金不足以覆蓋房貸本息與維護成本，每月需自掏腰包貼補{' '}
                    <span className="font-extrabold text-rose-400">
                      {Math.abs(yields.monthlyNetCashflow).toLocaleString()}
                    </span>{' '}
                    元。該投資案完全取決於未來資本增值 (Capital Appreciation)，抗空頭防禦力較弱。
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-emerald-300">
                  <span className="text-base">✅</span>
                  <div>
                    <span className="font-bold">正向現金流案型：</span>
                    租金足以全額吸收房貸本息與各項維護費用，每月產生實質淨現金流入。自備款預估回本年限約{' '}
                    <span className="font-bold text-emerald-400">{yields.breakEvenYears} 年</span>。
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
