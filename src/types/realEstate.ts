// 台灣不動產研究 Agent 型別定義 (內政部實價登錄官方架構)
import { VerifiedItem } from './index';

export interface TransactionRecord {
  id: string;
  transactionDate: string; // 交易年月，如 115/07 (2026/07)
  district: string; // 高雄市左營區
  community: string; // 社區名稱，如「京城凱撒大廈」
  address: string; // 門牌路段，如「博愛二路 300~350 號」
  buildingType: string; // 住宅大樓 (11層含以上有電梯)
  floor: string; // 12 / 24 樓
  age: number; // 屋齡 (年)
  totalPings: number; // 建物總坪數 (含車位)
  mainPings: number; // 主建物實坪
  priceTotal: number; // 總價 (萬元)
  pricePerPing: number; // 成交單價 (萬/坪，不含車位計算)
  parkingType: string; // 坡道平面 / 坡道機械
  parkingPrice: number; // 車位總價 (萬元)
  layout: string; // 3房2廳2衛
}

export interface RentalData {
  monthlyRent: number; // 市場預估月租金 (元)
  rentPerPing: number; // 單坪租金 (元/坪)
  occupancyRate: number; // 區域平均出租率 % (例 94%)
  managementFeePerPing: number; // 社區管理費 (元/坪/月)
  propertyTaxYearly: number; // 預估年房屋稅 (元)
  landTaxYearly: number; // 預估年地價稅 (元)
  maintenanceReserveYearly: number; // 預估年度修繕預備金 (元)
}

export interface MortgageCashflowParams {
  propertyTotalPrice: number; // 房屋總價 (萬元)
  downPaymentRatio: number; // 自備款成數 % (例 20%)
  mortgageTermYears: number; // 貸款年限 (20 / 30 / 40 年)
  mortgageInterestRate: number; // 房貸利率 % (例 2.185%)
  gracePeriodYears: number; // 寬限期 (0 ~ 3 年)
  expectedMonthlyRent: number; // 預期月租金 (元)
}

export interface YieldAnalysisResult {
  grossYield: number; // ① 毛租金報酬率 % (年租金 ÷ 房屋總價)
  netYield: number; // ② 淨租金報酬率 % (淨年收益 ÷ 總投入成本)
  leveragedCashOnCashYield: number; // ③ 槓桿後實質投報率 % (年淨現金流 ÷ 自備款)
  loanAmount: number; // 貸款本金 (萬元)
  downPaymentAmount: number; // 自備款金額 (萬元)
  monthlyMortgagePayment: number; // 每月房貸本息攤還金額 (元)
  monthlyManagementFee: number; // 每月管理費 (元)
  monthlyNetCashflow: number; // 每月實質淨現金流 (元 = 租金 - 管理費 - 稅費修繕攤提 - 房貸本息)
  breakEvenYears: number; // 自備款回本年限 (年)
}

export interface RealEstateVerifiedItem {
  id: string;
  title: string;
  claim: string;
  evidence: string;
  sourceName: string;
  sourceUrl?: string;
  timestamp: string;
  verificationStatus: 'VERIFIED' | 'COUNTER_ARGUMENT' | 'UNCONFIRMED';
}

export interface RealEstateReport {
  id: string;
  regionQuery: string; // 輸入查詢：高雄市左營區
  cityName: string; // 高雄市
  districtName: string; // 左營區
  hotCommunity: string; // 指標熱門社區
  generatedAt: string;
  avgPricePerPing1Y: number; // 近一年平均成交單價 (萬/坪)
  avgPricePerPing3Y: number; // 近三年平均成交單價 (萬/坪)
  priceChange3YPercent: number; // 近三年單價累計漲跌幅 %
  cityAvgPricePerPing: number; // 全市平均成交單價 (萬/坪)
  priceTrend3Y: { quarter: string; districtAvg: number; cityAvg: number }[];
  rental: RentalData;
  defaultMortgage: MortgageCashflowParams;
  defaultYields: YieldAnalysisResult;
  transactions: TransactionRecord[];
  supportingArguments: RealEstateVerifiedItem[];
  devilsAdvocateRisks: RealEstateVerifiedItem[]; // 房地產逆向風控
  keyTrackingMetrics: string[];
  dataSource: { name: string; url: string; lastUpdated: string };
  statutoryDisclaimer: string;
}
