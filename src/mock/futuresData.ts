import {
  FuturesContractQuote,
  FuturesBasisData,
  OptionsMarketSummary,
  InstitutionalPositionItem,
  FuturesResearchReport,
} from '../types/futures';

// 1. TAIFEX 主要期貨契約最新行情 (臺灣期貨交易所官方盤後公佈)
export const MOCK_FUTURES_CONTRACTS: Record<string, FuturesContractQuote> = {
  TXF: {
    symbol: 'TXF',
    name: '臺股期貨 (大台)',
    deliveryMonth: '202610 (近月)',
    price: 22880,
    change: 210,
    changePercent: 0.93,
    open: 22720,
    high: 22915,
    low: 22690,
    settlementPrice: 22880,
    volume: 142500,
    openInterest: 78200,
    session: 'DAY',
    updateTime: '2026-09-18 13:45:00 (日盤收盤)',
    dataSource: '臺灣期貨交易所 (TAIFEX 官方行情)',
  },
  MTX: {
    symbol: 'MTX',
    name: '小型臺指期貨 (小台)',
    deliveryMonth: '202610 (近月)',
    price: 22882,
    change: 212,
    changePercent: 0.93,
    open: 22718,
    high: 22918,
    low: 22688,
    settlementPrice: 22882,
    volume: 215800,
    openInterest: 42100,
    session: 'DAY',
    updateTime: '2026-09-18 13:45:00 (日盤收盤)',
    dataSource: '臺灣期貨交易所 (TAIFEX 官方行情)',
  },
  TE: {
    symbol: 'TE',
    name: '電子期貨',
    deliveryMonth: '202610',
    price: 1245.5,
    change: 14.2,
    changePercent: 1.15,
    open: 1234.0,
    high: 1248.0,
    low: 1232.5,
    settlementPrice: 1245.5,
    volume: 8400,
    openInterest: 5200,
    session: 'DAY',
    updateTime: '2026-09-18 13:45:00',
    dataSource: '臺灣期貨交易所 (TAIFEX 官方行情)',
  },
  TF: {
    symbol: 'TF',
    name: '金融期貨',
    deliveryMonth: '202610',
    price: 2050.8,
    change: -2.4,
    changePercent: -0.12,
    open: 2055.0,
    high: 2058.0,
    low: 2046.0,
    settlementPrice: 2050.8,
    volume: 4800,
    openInterest: 3900,
    session: 'DAY',
    updateTime: '2026-09-18 13:45:00',
    dataSource: '臺灣期貨交易所 (TAIFEX 官方行情)',
  },
};

// 2. 期現貨價差 (Basis) 統計
export const MOCK_FUTURES_BASIS: FuturesBasisData = {
  spotIndexName: 'TWSE 加權指數現貨',
  spotPrice: 22850.32,
  spotChange: 185.24,
  futuresContract: '台指期 202610 近月',
  futuresPrice: 22880.0,
  basis: 29.68,
  basisType: 'PREMIUM',
  historicalBasis5d: [
    { date: '09/12', basis: -18.5, spot: 22420.15, futures: 22401.65 },
    { date: '09/13', basis: -9.2, spot: 22510.4, futures: 22501.2 },
    { date: '09/16', basis: 8.5, spot: 22630.8, futures: 22639.3 },
    { date: '09/17', basis: 16.4, spot: 22665.08, futures: 22681.48 },
    { date: '09/18', basis: 29.68, spot: 22850.32, futures: 22880.0 },
  ],
  comment: '目前呈現正價差 +29.68 點，近 5 日基差由逆轉正且持續走揚，反映市場短線預期與買盤推升意願積極。',
  updateTime: '2026-09-18 13:45 (收盤基差計算)',
};

// 3. 臺指選擇權 (TXO) 履約價分布與 Put/Call Ratio
export const MOCK_OPTIONS_SUMMARY: OptionsMarketSummary = {
  contractMonth: '202610 (近月契約)',
  totalCallOI: 142600,
  totalPutOI: 160300,
  putCallRatio: 112.41,
  pcrTrend: [
    { date: '09/12', pcr: 104.2 },
    { date: '09/13', pcr: 106.8 },
    { date: '09/16', pcr: 108.5 },
    { date: '09/17', pcr: 110.1 },
    { date: '09/18', pcr: 112.41 },
  ],
  maxCallOIStrike: 23200,
  maxPutOIStrike: 22400,
  strikes: [
    { strikePrice: 22200, callVolume: 820, callOI: 5400, putVolume: 12500, putOI: 24800 },
    { strikePrice: 22400, callVolume: 1450, callOI: 7800, putVolume: 18400, putOI: 31200 }, // 最大 Put 支撐
    { strikePrice: 22600, callVolume: 4200, callOI: 12400, putVolume: 15200, putOI: 28500 },
    { strikePrice: 22800, callVolume: 16800, callOI: 21500, putVolume: 14100, putOI: 22100 }, // 平價交會區
    { strikePrice: 23000, callVolume: 22400, callOI: 26800, putVolume: 8200, putOI: 15400 },
    { strikePrice: 23200, callVolume: 24800, callOI: 28450, putVolume: 4100, putOI: 8900 }, // 最大 Call 壓力
    { strikePrice: 23400, callVolume: 15600, callOI: 21200, putVolume: 1900, putOI: 4200 },
    { strikePrice: 23600, callVolume: 8900, callOI: 14100, putVolume: 850, putOI: 2100 },
  ],
  updateTime: '2026-09-18 14:00 (TAIFEX盤後結算統計)',
};

// 4. 三大法人期貨契約未平倉多空矩陣
export const MOCK_FUTURES_INSTITUTIONS: InstitutionalPositionItem[] = [
  {
    institution: 'FOREIGN',
    name: '外資及陸資',
    longOI: 52400,
    shortOI: 70850,
    netOI: -18450,
    netChange: 1850, // 空單減回補
    amountLong: 2398.2,
    amountShort: 3242.8,
    amountNet: -844.6,
  },
  {
    institution: 'INVESTMENT_TRUST',
    name: '投信',
    longOI: 8450,
    shortOI: 2250,
    netOI: 6200,
    netChange: 320,
    amountLong: 386.7,
    amountShort: 103.0,
    amountNet: 283.7,
  },
  {
    institution: 'DEALER',
    name: '自營商',
    longOI: 14200,
    shortOI: 10400,
    netOI: 3800,
    netChange: 950,
    amountLong: 649.9,
    amountShort: 476.0,
    amountNet: 173.9,
  },
];

// 5. 完整期貨研究 Agent 總控報告 (符合 8 大標準與法規事實隔離)
export const MOCK_FUTURES_REPORT: FuturesResearchReport = {
  id: 'rep-taifex-20260918',
  title: 'TAIFEX 臺灣期貨研究中心 ‧ 台指期結構與選擇權籌碼深度研報',
  generatedAt: '2026-09-18 14:15:00 (台北標準時間)',
  marketEnvironment: '美股費半大漲，台指期日盤開高走高收在 22,880 點，正價差擴大至 +29.68 點。',
  quote: MOCK_FUTURES_CONTRACTS.TXF,
  basis: MOCK_FUTURES_BASIS,
  options: MOCK_OPTIONS_SUMMARY,
  institutions: MOCK_FUTURES_INSTITUTIONS,
  institutionalAnalysis: [
    {
      id: 'inst-1',
      category: 'FACT',
      text: 'TAIFEX 官方統計三大法人合計期貨淨部位為 -8,450 口。其中外資多方 52,400 口、空方 70,850 口，淨未平倉為 -18,450 口，單日空單回補 1,850 口。',
      source: '臺灣期貨交易所 (三大法人期貨未平倉表)',
      sourceUrl: 'https://www.taifex.com.tw',
    },
    {
      id: 'inst-2',
      category: 'ANALYSIS',
      text: '【避險抵銷說明】：依 TAIFEX 官方指引，外資期貨淨未平倉涵蓋現貨股票籃子之避險（Delta Hedge）與跨市場價差對沖套利，絕不可將「外資淨空單」單純等同於看空台股。',
      source: 'TAIFEX 官方交易制度指引',
    },
    {
      id: 'inst-3',
      category: 'FACT',
      text: '自營商期貨淨多單 +3,800 口，且在選擇權市場呈現中性偏多 Delta 造市佈局。',
      source: 'TAIFEX 官方選擇權籌碼統計',
    },
  ],
  technicalSignals: [
    {
      id: 'tech-1',
      category: 'FACT',
      text: '台指期收盤價 22,880 站上 5 日均線 (22,650) 與 20 日均線 (22,480)，均線架構呈多頭發散。',
      source: '量化均線指標',
    },
    {
      id: 'tech-2',
      category: 'ANALYSIS',
      text: '期現貨正價差擴大至 +29.68 點，近 5 日基差呈現連續擴張收斂態勢，代表買盤追價信心相對穩健。',
      source: '期現貨基差模組',
    },
  ],
  optionsStructureAnalysis: [
    {
      id: 'opt-1',
      category: 'FACT',
      text: '臺指選擇權全市場 Put/Call Ratio 為 112.41%，已連續 5 個交易日維持在 100% 以上並逐日升高。',
      source: 'TAIFEX 選擇權市場統計',
    },
    {
      id: 'opt-2',
      category: 'FACT',
      text: '最大未平倉買權 (Call OI) 聚集在 23,200 履約價 (28,450 口)，構成上方主要反壓；最大賣權 (Put OI) 聚集在 22,400 履約價 (31,200 口)，構成實質下檔下檔防守支撐。',
      source: 'TAIFEX 履約價未平倉統計',
    },
    {
      id: 'opt-3',
      category: 'INFERENCE',
      text: '莊家防守區間鎖定在 22,400 ~ 23,200 點之間，波幅預期在結算日前以區間向上震盪為主要特徵。',
      source: '選擇權造市波動率模型',
    },
  ],
  macroContextAnalysis: [
    {
      id: 'macro-1',
      category: 'FACT',
      text: '美股四大指數昨夜收紅，那斯達克期貨於亞洲時段續漲 +0.35%，美國十年期公債殖利率降至 3.82%。',
      source: '全球總經 Agent',
    },
    {
      id: 'macro-2',
      category: 'ANALYSIS',
      text: '台幣對美元匯率走升至 31.85，資金呈現淨匯入態勢，舒緩期貨外資追空意願。',
      source: '外匯風控模組',
    },
  ],
  devilsAdvocateRisks: [
    {
      id: 'dev-f1',
      category: 'RISK',
      text: '【夜盤高波動風險】：台指期夜盤極易受美股開盤及 FOMC 官員談話影響，日內正價差可能在夜盤急遽收斂甚至逆轉為逆價差。',
      source: "Devil's Advocate 逆向風控模型",
    },
    {
      id: 'dev-f2',
      category: 'RISK',
      text: '【外資淨空單偏高壓制】：雖然外資空單包含現貨避險，但絕對口數仍高達 -18,450 口，一旦美股拉回，外資容易順勢壓低期貨進行避險獲利。',
      source: "Devil's Advocate 逆向風控模型",
    },
    {
      id: 'dev-f3',
      category: 'RISK',
      text: '【槓桿與結算日風險】：台指期具 20 倍以上高槓桿特性，結算日前夕選擇權時間價值 (Theta) 加速衰退，嚴禁以全額保證金滿載操作。',
      source: "Devil's Advocate 逆向風控模型",
    },
  ],
  keyObservationCheckpoints: [
    '今日 15:00 開盤之 TAIFEX 台指期夜盤 (Night Session) 與美股期貨聯動幅度',
    '明日三大法人是否持續回補外資淨空單口數（能否回補至 -15,000 口以內）',
    '臺指選擇權 23,000 點整數關卡 Call 未平倉是否大幅增加成為新壓力',
    '期現貨價差是否由正價差 +30 點急縮，需警戒短線獲利了結平倉潮',
  ],
  statutoryDisclaimer:
    '本期貨研究報告與衍生性商品分析僅供學術探討與研究參考，絕不構成任何期貨或選擇權之交易建議或獲利保證。期貨與選擇權具高槓桿風險，可能產生超過本金之損失，投資人應審慎衡量風險承擔能力並自負盈虧。',
};
