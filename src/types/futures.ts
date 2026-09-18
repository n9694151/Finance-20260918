// TAIFEX 臺灣期貨交易所資料型別定義 (Futures & Options Types)
import { InfoCategory, VerifiedItem } from './index';

export interface FuturesContractQuote {
  symbol: string; // TX, MTX, TE, TF
  name: string; // 臺股期貨, 小型臺指期貨, 電子期貨, 金融期貨
  deliveryMonth: string; // 202610
  price: number; // 最新成交價
  change: number; // 漲跌點數
  changePercent: number; // 漲跌幅 %
  open: number;
  high: number;
  low: number;
  settlementPrice: number; // 參考結算價
  volume: number; // 成交口數
  openInterest: number; // 未平倉口數 (OI)
  session: 'DAY' | 'NIGHT'; // 日盤 / 夜盤
  updateTime: string; // 資料時間
  dataSource: string; // 官方來源
}

export interface FuturesBasisData {
  spotIndexName: string; // 加權指數
  spotPrice: number; // 現貨點數
  spotChange: number;
  futuresContract: string; // 台指期近月
  futuresPrice: number; // 期貨點數
  basis: number; // 基差 (期貨 - 現貨)
  basisType: 'PREMIUM' | 'DISCOUNT'; // 正價差 / 逆價差
  historicalBasis5d: { date: string; basis: number; spot: number; futures: number }[];
  comment: string;
  updateTime: string;
}

export interface OptionsStrikeItem {
  strikePrice: number; // 履約價
  callVolume: number; // 買權成交量
  callOI: number; // 買權未平倉
  putVolume: number; // 賣權成交量
  putOI: number; // 賣權未平倉
}

export interface OptionsMarketSummary {
  contractMonth: string; // 202610
  totalCallOI: number; // 全市場買權總未平倉
  totalPutOI: number; // 全市場賣權總未平倉
  putCallRatio: number; // 買賣權未平倉比率 (Put/Call Ratio %)
  pcrTrend: { date: string; pcr: number }[]; // 近 5 日 PCR 走勢
  maxCallOIStrike: number; // 買權最大未平倉 (上方壓力區)
  maxPutOIStrike: number; // 賣權最大未平倉 (下方支撐區)
  strikes: OptionsStrikeItem[];
  updateTime: string;
}

export interface InstitutionalPositionItem {
  institution: 'FOREIGN' | 'INVESTMENT_TRUST' | 'DEALER';
  name: string; // 外資及陸資, 投信, 自營商
  longOI: number; // 多方未平倉 (口)
  shortOI: number; // 空方未平倉 (口)
  netOI: number; // 淨未平倉多空口數 (多 - 空)
  netChange: number; // 單日增減口數
  amountLong: number; // 多方契約金額 (億元)
  amountShort: number; // 空方契約金額 (億元)
  amountNet: number; // 淨契約金額 (億元)
}

export interface FuturesResearchReport {
  id: string;
  title: string;
  generatedAt: string;
  marketEnvironment: string;
  quote: FuturesContractQuote;
  basis: FuturesBasisData;
  options: OptionsMarketSummary;
  institutions: InstitutionalPositionItem[];
  institutionalAnalysis: VerifiedItem[];
  technicalSignals: VerifiedItem[];
  optionsStructureAnalysis: VerifiedItem[];
  macroContextAnalysis: VerifiedItem[];
  devilsAdvocateRisks: VerifiedItem[]; // 反方風控
  keyObservationCheckpoints: string[];
  statutoryDisclaimer: string;
}
