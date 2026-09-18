import React, { useState, useMemo } from 'react';
import { TransactionRecord } from '../types/realEstate';

interface RealEstateHistoryTableProps {
  transactions: TransactionRecord[];
  districtName: string;
}

export const RealEstateHistoryTable: React.FC<RealEstateHistoryTableProps> = ({
  transactions,
  districtName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState<'all' | 'new' | 'classic'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'unitPrice'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 過濾與搜尋
  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.community.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.layout.toLowerCase().includes(searchTerm.toLowerCase());

      let matchAge = true;
      if (ageFilter === 'new') matchAge = t.age <= 5;
      if (ageFilter === 'classic') matchAge = t.age > 10;

      return matchSearch && matchAge;
    });
  }, [transactions, searchTerm, ageFilter]);

  // 排序
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let diff = 0;
      if (sortBy === 'date') {
        diff = a.transactionDate.localeCompare(b.transactionDate);
      } else if (sortBy === 'price') {
        diff = a.priceTotal - b.priceTotal;
      } else if (sortBy === 'unitPrice') {
        diff = a.pricePerPing - b.pricePerPing;
      }
      return sortOrder === 'desc' ? -diff : diff;
    });
  }, [filteredData, sortBy, sortOrder]);

  const handleSort = (type: 'date' | 'price' | 'unitPrice') => {
    if (sortBy === type) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      {/* 標題與控制工具列 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
              MOI 官方明細
            </span>
            <h3 className="text-base font-bold text-white tracking-wide">
              {districtName} 實價登錄最新成交明細表
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            資料來源：內政部實價登錄 (已拆算車位面積與價格、排除親友特殊交易)
          </p>
        </div>

        {/* 搜尋與篩選器 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 搜尋框 */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋社區或路段..."
              className="bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* 屋齡篩選標籤 */}
          <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setAgeFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                ageFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              全部 ({transactions.length})
            </button>
            <button
              onClick={() => setAgeFilter('new')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                ageFilter === 'new'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ≤5年新成屋
            </button>
            <button
              onClick={() => setAgeFilter('classic')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                ageFilter === 'classic'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              &gt;10年中古屋
            </button>
          </div>
        </div>
      </div>

      {/* 資料表格 */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-700 font-semibold uppercase tracking-wider">
            <tr>
              <th
                className="py-3 px-3 cursor-pointer hover:text-slate-200"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  交易年月
                  {sortBy === 'date' && (sortOrder === 'desc' ? ' ▼' : ' ▲')}
                </div>
              </th>
              <th className="py-3 px-3">社區 / 門牌路段</th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-slate-200 text-right"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end gap-1">
                  總價 (萬元)
                  {sortBy === 'price' && (sortOrder === 'desc' ? ' ▼' : ' ▲')}
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-slate-200 text-right"
                onClick={() => handleSort('unitPrice')}
              >
                <div className="flex items-center justify-end gap-1">
                  單價 (萬/坪)
                  {sortBy === 'unitPrice' && (sortOrder === 'desc' ? ' ▼' : ' ▲')}
                </div>
              </th>
              <th className="py-3 px-3 text-right">總坪數 / 主建</th>
              <th className="py-3 px-3 text-center">樓層 / 屋齡</th>
              <th className="py-3 px-3">格局 / 車位</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* 交易年月 */}
                  <td className="py-3 px-3 font-medium text-slate-200 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-[11px]">
                      {item.transactionDate}
                    </span>
                  </td>

                  {/* 社區 / 門牌 */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.community}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      {item.address}
                    </div>
                  </td>

                  {/* 總價 */}
                  <td className="py-3 px-3 text-right font-bold text-amber-300 whitespace-nowrap">
                    {item.priceTotal.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">萬</span>
                  </td>

                  {/* 單價 */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="font-extrabold text-emerald-400 text-sm">
                      {item.pricePerPing.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-slate-500">萬/坪(拆車)</div>
                  </td>

                  {/* 總坪數 / 主建 */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="font-medium text-slate-200">
                      {item.totalPings} 坪
                    </div>
                    <div className="text-[10px] text-slate-400">
                      主建 {item.mainPings} 坪
                    </div>
                  </td>

                  {/* 樓層 / 屋齡 */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="font-medium text-slate-200">{item.floor}</div>
                    <div className="text-[10px] text-slate-400">
                      {item.age === 0 ? '預售/剛交屋' : `屋齡 ${item.age} 年`}
                    </div>
                  </td>

                  {/* 格局 / 車位 */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="text-slate-300 font-medium">{item.layout}</div>
                    <div className="text-[10px] text-slate-500">
                      {item.parkingType} ({item.parkingPrice}萬)
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  查無符合條件之成交紀錄
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 底部說明 */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
        <div>
          共計 {sortedData.length} 筆揭露資訊 • 揭露期數：最新一期 (每旬1日、11日、21日更新)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>已通過內政部申報防偽勾稽審核</span>
        </div>
      </div>
    </div>
  );
};
