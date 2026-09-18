// 金融研究資料型別定義 (Financial Research Types)

export type InfoCategory = 'FACT' | 'SOURCE' | 'ANALYSIS' | 'INFERENCE' | 'RISK' | 'UNKNOWN';

export interface VerifiedItem {
  id: string;
  category: InfoCategory;
  text: string;
  source?: string;
  sourceUrl?: string;
  timestamp?: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number; // 成交量 (張)
  turnover: number; // 成交額 (億)
  marketCap: number; // 市值 (兆/億)
  peRatio: number; // 本益比
  pbRatio: number; // 股價淨值比
  yieldRatio: number; // 殖利率 %
  updateTime: string;
}

export interface FinancialFundamentals {
  revenueRecent12mYoY: number[]; // 近12月營收年增率
  revenueLatestMonth: string;
  revenueYoY: number; // 最新月營收 YoY
  epsRecent8q: { quarter: string; eps: number }[]; // 近8季 EPS
  grossMargin: number; // 最新毛利率 %
  grossMarginTrend: number[]; // 近8季毛利率
  operatingMargin: number; // 營業利益率 %
  netMargin: number; // 淨利率 %
  roe: number; // ROE %
  freeCashFlow: number; // 自由現金流 (億)
  debtRatio: number; // 負債比率 %
  inventoryTurnoverDays: number; // 存貨週轉天數
  capex: number; // 資本支出 (億)
}

export interface InstitutionalTrade {
  date: string;
  foreignNet: number; // 外資買賣超 (張)
  investmentTrustNet: number; // 投信買賣超 (張)
  dealerNet: number; // 自營商買賣超 (張)
  marginBalance: number; // 融資餘額 (張)
  shortBalance: number; // 融券餘額 (張)
  borrowingBalance: number; // 借券賣出餘額 (張)
}

export interface TechnicalIndicators {
  ma5: number;
  ma20: number;
  ma60: number;
  ma120: number;
  ma240: number;
  biasMa20: number; // 20日均線乖離率 %
  rsi14: number;
  macdDivergence: 'GOLDEN_CROSS' | 'DEATH_CROSS' | 'NEUTRAL';
  high52w: number;
  low52w: number;
  volatility: number;
}

export interface YouTubeOpinion {
  id: string;
  channel: string;
  title: string;
  date: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral' | 'Mixed';
  url: string;
  keyPoints: string[];
  quotedData: string;
  isExplicitRecommendation: boolean; // 是否為明確看多/空建議
}

export interface ResearchReport {
  id: string;
  targetSymbol: string;
  targetName: string;
  generatedAt: string;
  marketPrice: StockQuote;
  fundamentals: FinancialFundamentals;
  technicals: TechnicalIndicators;
  institutions: InstitutionalTrade;
  valuationContext: {
    historicalPeBand: [number, number]; // 歷史 PE 區間
    historicalPbBand: [number, number];
    industryAveragePe: number;
    valuationPercentile: number; // 目前處於歷史何分位數
    comment: string;
  };
  industryContext: {
    theme: string;
    supplyDemandStatus: string;
    competitiveMoat: string;
    keyCatalysts: string[];
  };
  youtubeOpinions: YouTubeOpinion[];
  supportingArguments: VerifiedItem[]; // 支持論點
  devilsAdvocateArguments: VerifiedItem[]; // 反方質疑論點 (Devil's Advocate)
  majorRisks: VerifiedItem[]; // 主要風險
  keyTrackingMetrics: string[]; // 關鍵追蹤指標
  dataSources: { name: string; url: string; lastUpdated: string }[];
}

export interface MarketIndexItem {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
  category: 'TW' | 'US' | 'COMMODITY' | 'FUTURES' | 'FX';
}

export interface ResearchHistoryItem {
  id: string;
  symbol: string;
  name: string;
  timestamp: string;
  priceAtResearch: number;
  summary: string;
}

export type ActiveTab = 
  | 'home'
  | 'stock-research'
  | 'futures'
  | 'real-estate'
  | 'macro'
  | 'youtube'
  | 'news'
  | 'watchlist'
  | 'history'
  | 'settings';
