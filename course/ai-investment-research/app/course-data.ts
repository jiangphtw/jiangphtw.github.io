export type MediaResource = {
  videoId: string;
  title: string;
  channel: string;
  duration: string;
  approximateViews: string;
  checkedAt: string;
  selectionReason: string;
};

export type CourseUnit = {
  id: number;
  phase: number;
  order: string;
  topic: string;
  title: string;
  level: string;
  estimatedTime: string;
  prerequisites: string[];
  objectives: [string, string];
  theory: [string, string, string];
  exercises: [string, string, string];
  outcome: string;
  project: string;
  skills: string[];
  rhythm: string;
  readings: [{ label: string; url: string }, { label: string; url: string }];
  media: { zh: MediaResource; en: MediaResource };
};

const checkedAt = "2026-08-06";

export const phases = [
  { id: 1, code: "FRAME", title: "先管決策，再找工具", description: "把目標、風險、資料時間點與人類責任寫成研究契約。", outcome: "投資政策聲明與研究問題卡" },
  { id: 2, code: "EVIDENCE", title: "建立可追溯證據鏈", description: "從原始揭露走到財報、估值與情境，不讓 AI 代替來源。", outcome: "附引用的公司研究備忘錄" },
  { id: 3, code: "TEST", title: "讓策略接受反證", description: "處理回測偏誤、交易成本、曝險、壓力情境與退出規則。", outcome: "樣本外測試與風險儀表板" },
  { id: 4, code: "OPERATE", title: "把助理做成可靠系統", description: "用工作流、權限、監控與人工覆核，讓自動化可停、可查、可復原。", outcome: "可稽核 AI 研究助理與營運手冊" },
];

export const units: CourseUnit[] = [
  {
    id: 1, phase: 1, order: "01", topic: "決策與風險", title: "先寫投資政策：AI 不能替你決定的事", level: "零基礎", estimatedTime: "100 分鐘", prerequisites: ["不需要程式基礎", "準備一個純教學用的虛擬投資情境"],
    objectives: ["寫出包含目標、期限、最大可承受損失與禁區的投資政策聲明。", "把一個模糊選股問題改寫成有資料截止日、比較基準與否證條件的研究問題。"],
    theory: ["AI 是研究工具，不是受託人；資金目的、承受度與最終決定必須由人負責。", "先定決策規則再看答案，可以降低事後合理化、確認偏誤與被敘事帶走的風險。", "任何『保證獲利』『零風險』或無法交代來源的 AI 投資宣稱，都應視為停止訊號。"],
    exercises: ["用一頁寫出 12 個月目標、流動性需求、最大回撤與不投資清單。", "把『找會漲的股票』改寫成可驗證研究題，標出資料截止日與比較基準。", "用 2000、2008、2020 三種情境檢查規則是否會迫使你在最差時點失控賣出。"],
    outcome: "能先建立責任與風險邊界，再決定 AI 可以協助哪些研究工作。", project: "里程碑 01｜投資政策聲明＋研究問題卡", skills: ["風險承受度", "決策契約", "反詐辨識", "否證條件"], rhythm: "看 25 分鐘 → 寫政策 30 分鐘 → 情境壓測 30 分鐘 → 修訂 15 分鐘",
    readings: [
      { label: "SEC／FINRA：AI 投資詐騙警示", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/artificial-intelligence-fraud" },
      { label: "臺灣證交所投資人知識網", url: "https://investoredu.twse.com.tw/" },
    ],
    media: {
      zh: { videoId: "sxjzCcnbpC4", title: "為何 2000 年網路泡沫創下近 25 年最長熊市？", channel: "Smart智富月刊", duration: "11:34", approximateViews: "約 3.7 萬次觀看", checkedAt, selectionReason: "用真實崩跌提醒學員：新技術成立不代表價格合理。它適合在第一課打破『AI 等於勝率』的錯誤預期。" },
      en: { videoId: "GPOv72Awo68", title: "How it Happened — The 2008 Financial Crisis", channel: "CrashCourse", duration: "11:24", approximateViews: "約 493 萬次觀看", checkedAt, selectionReason: "以高觀看、結構完整的歷史案例呈現風險如何從個別決策傳成系統危機；用來壓測投資政策，而非預測下一次崩盤。" },
    },
  },
  {
    id: 2, phase: 1, order: "02", topic: "資料來源", title: "把每一句分析接回原始證據", level: "基礎", estimatedTime: "110 分鐘", prerequisites: ["完成研究問題卡", "能開啟公開資訊觀測站或 EDGAR"],
    objectives: ["建立含來源、發布日、資料期間、擷取時間與版本的證據表。", "辨認原始揭露、二手報導與 AI 摘要的證據層級，對衝突資料做裁決。"],
    theory: ["研究品質由來源鏈最弱的一環決定；AI 的流暢文字不能提升錯誤資料的可信度。", "公司揭露回答『說了什麼』，市場資料回答『何時反映』，新聞只用來找事件線索。", "資料必須具備 as-of date；使用今天才知道的資訊回看昨天，會製造前視偏誤。"],
    exercises: ["為一家公司收集年度報告、重大訊息、法說資料與價格資料，填入證據表。", "找一則媒體標題，追到原始公告並列出標題省略的三個條件。", "刻意製造兩個數字衝突，記錄你的來源優先序、裁決與仍未解的疑點。"],
    outcome: "能產出任何人都可重查的來源鏈，並知道資料當時是否真的可得。", project: "里程碑 02｜證據登錄表＋來源衝突紀錄", skills: ["MOPS", "EDGAR", "資料血緣", "As-of date"], rhythm: "看 30 分鐘 → 蒐證 35 分鐘 → 衝突診斷 30 分鐘 → 稽核 15 分鐘",
    readings: [
      { label: "公開資訊觀測站", url: "https://mops.twse.com.tw/mops/web/index" },
      { label: "SEC EDGAR 公司申報查詢", url: "https://www.sec.gov/search-filings" },
    ],
    media: {
      zh: { videoId: "aed5O214MXU", title: "上市櫃公司的資訊集散地：公開資訊觀測站", channel: "臺灣證券交易所", duration: "05:39", approximateViews: "約 6,300 次觀看", checkedAt, selectionReason: "由證交所直接示範台股原始揭露入口，權威性高；觀看量不是最高，但來源角色比二手教學更適合證據鏈第一站。" },
      en: { videoId: "kXYvRR7gV2E", title: "How I Research Stocks — Step-by-Step Fundamental Analysis", channel: "The Plain Bagel", duration: "18:27", approximateViews: "約 122 萬次觀看", checkedAt, selectionReason: "用完整研究流程串起公司、產業與風險，社群訊號強；本課再把流程補成可重查的資料血緣紀錄。" },
    },
  },
  {
    id: 3, phase: 2, order: "03", topic: "財報分析", title: "三張報表交叉驗證，不讓 AI 只講故事", level: "基礎", estimatedTime: "120 分鐘", prerequisites: ["證據登錄表", "能讀懂百分比與年增率"],
    objectives: ["沿損益、資產負債與現金流勾稽營收、獲利、資產與現金。", "設計財報摘要 schema，要求 AI 為每個結論附欄位、期間與原始頁碼。"],
    theory: ["損益表描述期間績效，資產負債表描述時點狀態，現金流量表解釋現金如何變動。", "單看 EPS 會漏掉應收、存貨、一次性收益與資本支出；交叉驗證比更多指標重要。", "AI 可以協助比對與草擬，但數值運算、單位、合併範圍與引用必須由規則驗證。"],
    exercises: ["用同一期三張表重建淨利到營業現金流的橋接。", "讓 AI 產出固定 JSON 摘要，加入欄位存在、單位與頁碼檢查。", "比較兩家公司：找出一個獲利成長但現金品質轉弱的案例並寫 300 字判讀。"],
    outcome: "能用勾稽與引用驗證 AI 財報摘要，而不是相信一段看似專業的文字。", project: "里程碑 03｜可引用財報摘要＋獲利品質檢核", skills: ["三大報表", "獲利品質", "Schema", "引用驗證"], rhythm: "看 30 分鐘 → 報表勾稽 35 分鐘 → schema 30 分鐘 → 案例 25 分鐘",
    readings: [
      { label: "IFRS：財務報表準則入口", url: "https://www.ifrs.org/issued-standards/list-of-standards/" },
      { label: "SEC：如何閱讀 10-K", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/how-read-10-k10-q" },
    ],
    media: {
      zh: { videoId: "gdtUDPkg8IY", title: "一個故事看懂財務報表", channel: "Better Leaf 好葉", duration: "12:32", approximateViews: "約 14.9 萬次觀看", checkedAt, selectionReason: "用低門檻故事建立三表關係，適合先形成心智模型；本課用真實申報與勾稽練習補足細節。" },
      en: { videoId: "Fi1wkUczuyk", title: "FINANCIAL STATEMENTS: all the basics in 8 MINS!", channel: "Accounting Stuff", duration: "08:56", approximateViews: "約 135 萬次觀看", checkedAt, selectionReason: "短而完整、社群訊號強，能快速複習三表基本結構；與中文資源互補，將時間留給引用與查核實作。" },
    },
  },
  {
    id: 4, phase: 2, order: "04", topic: "估值與情境", title: "估值不是答案：把假設、範圍與反證攤開", level: "中階", estimatedTime: "125 分鐘", prerequisites: ["完成財報勾稽", "能操作試算表"],
    objectives: ["比較相對估值與 DCF 的適用條件，產出基準、樂觀與悲觀三種情境。", "建立敏感度表，找出最影響結論的假設並設計追蹤指標。"],
    theory: ["估值是條件句：如果成長、利潤、資本成本與終值成立，才得到某個範圍。", "同業倍數速度快但會繼承市場錯價；DCF 可解釋但對遠期假設高度敏感。", "AI 最適合協助列假設與找反例，不應秘密決定折現率或把點估值包裝成精確答案。"],
    exercises: ["用本益比、股價淨值比與自由現金流殖利率做同業比較。", "建立三情境 DCF 與二維敏感度表，標記最脆弱的兩個假設。", "交換同學模型，從來源、單位、終值與循環位置提出五項反證。"],
    outcome: "能交付一個有假設、有範圍、可被反駁的估值模型。", project: "里程碑 04｜三情境估值模型＋反證清單", skills: ["Multiples", "DCF", "敏感度分析", "情境規劃"], rhythm: "看 30 分鐘 → 相對估值 25 分鐘 → DCF 40 分鐘 → 反證 30 分鐘",
    readings: [
      { label: "Damodaran：估值資料與工具", url: "https://pages.stern.nyu.edu/~adamodar/" },
      { label: "Investor.gov：基本面分析詞彙", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/fundamental-analysis" },
    ],
    media: {
      zh: { videoId: "yUUO7dtFInk", title: "股票估值三大指標：本益比／股價淨值比／殖利率", channel: "柴鼠兄弟 ZRBros", duration: "17:07", approximateViews: "約 87.4 萬次觀看", checkedAt, selectionReason: "用三個常見倍數建立相對估值直覺，中文候選中觀看訊號強；本課刻意補上情境與敏感度，避免指標變買賣按鈕。" },
      en: { videoId: "21STUhQ-iP0", title: "Stock Multiples: How to Tell When a Stock is Cheap/Expensive", channel: "The Plain Bagel", duration: "15:43", approximateViews: "約 194 萬次觀看", checkedAt, selectionReason: "完整說明倍數的用途與限制，觀看訊號強；特別適合作為 DCF 之前的市場比較基線。" },
    },
  },
  {
    id: 5, phase: 3, order: "05", topic: "回測與偏誤", title: "漂亮曲線先別信：樣本外、成本與基準", level: "中階", estimatedTime: "135 分鐘", prerequisites: ["一條可明確寫出的訊號規則", "能讀懂報酬、波動與最大回撤"],
    objectives: ["建立時間切分回測，處理前視、倖存者、資料窺探與重複試參數。", "把手續費、滑價、流動性與可交易性納入，並與簡單基準比較。"],
    theory: ["回測是在測規則，不是在證明未來；參數試得越多，越容易把噪音誤認成能力。", "隨機切分會洩漏未來，金融資料應依時間做訓練、驗證與最終樣本外測試。", "報酬必須和風險、換手、成本與基準一起看；單一累積報酬曲線幾乎永遠不夠。"],
    exercises: ["把一條均線或 RSI 規則寫成無歧義規格，標出訊號日與成交日。", "比較含與不含成本、樣本內與樣本外結果，記錄差異原因。", "用三個市場或期間做走勢外推測試，寫出策略何時應停用。"],
    outcome: "能辨認過度擬合的回測，並用樣本外證據決定策略是否值得繼續研究。", project: "里程碑 05｜偏誤檢核表＋樣本外回測報告", skills: ["Walk-forward", "交易成本", "Benchmark", "過度擬合"], rhythm: "看 25 分鐘 → 規格化 25 分鐘 → 回測 45 分鐘 → 壓力測試 40 分鐘",
    readings: [
      { label: "scikit-learn：時間序列切分", url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html" },
      { label: "CFA Institute：回測與模擬", url: "https://rpc.cfainstitute.org/research/foundation/2020/backtesting-simulation" },
    ],
    media: {
      zh: { videoId: "DHOC2-MbQ7w", title: "K 線如何看出支撐壓力？", channel: "春哥美股投資 Spring Invest", duration: "15:29", approximateViews: "約 117 萬次觀看", checkedAt, selectionReason: "先把技術訊號說清楚，才能寫成可回測規則；高觀看訊號不代表策略有效，本課正用它練習從敘述走向反證。" },
      en: { videoId: "hbcCykbX14U", title: "How to Use the Relative Strength Index (RSI)", channel: "Charles Schwab", duration: "10:43", approximateViews: "約 64.7 萬次觀看", checkedAt, selectionReason: "由大型券商教育頻道說明 RSI 用法與限制，社群訊號穩定；本課不照單全收，而是把訊號轉成樣本外可測假設。" },
    },
  },
  {
    id: 6, phase: 3, order: "06", topic: "投資組合風險", title: "先決定能輸多少：部位、相關與壓力測試", level: "中階", estimatedTime: "125 分鐘", prerequisites: ["完成樣本外回測", "有至少三個候選資產或策略"],
    objectives: ["依風險預算與最大損失設定部位，而非依 AI 信心分數下單。", "建立相關、集中、流動性與槓桿壓力測試，寫出再平衡與停損規則。"],
    theory: ["分散不是持有很多名稱，而是避免同一風險因子在壞情境同時放大。", "槓桿會改變損失速度、追繳與被迫平倉路徑；保證金從來不是最大損失。", "AI 可以跑情境和檢查規則，但不能用虛構精確度把未知風險壓成一個分數。"],
    exercises: ["為三個資產建立曝險表，按產業、因子、幣別與流動性重新分組。", "模擬相關性升到 0.9、波動翻倍與單日跳空，計算資金缺口。", "設計每月再平衡、最大部位、最大回撤與人工停機條件。"],
    outcome: "能把單點研究結果放進受控組合，知道何時縮小、退出或完全不交易。", project: "里程碑 06｜風險預算表＋壓力測試儀表板", skills: ["Position sizing", "Correlation", "Stress test", "Kill switch"], rhythm: "看 25 分鐘 → 曝險分組 30 分鐘 → 壓力測試 40 分鐘 → 規則 30 分鐘",
    readings: [
      { label: "Investor.gov：資產配置與分散", url: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation" },
      { label: "FINRA：認識保證金交易風險", url: "https://www.finra.org/investors/investing/investment-products/stocks/day-trading/margin-accounts" },
    ],
    media: {
      zh: { videoId: "QMZwTpagHgs", title: "個股期貨入門指南：基本規則與風險", channel: "富邦證券", duration: "12:48", approximateViews: "約 1.9 萬次觀看", checkedAt, selectionReason: "由受監管券商說明契約、保證金與槓桿風險，可信度優先於熱度；用來練習最壞情境與部位限制。" },
      en: { videoId: "LesjUjxaepc", title: "How Futures Leverage REALLY Works", channel: "TC Trading", duration: "12:03", approximateViews: "約 1,600 次觀看", checkedAt, selectionReason: "直接示範槓桿如何放大損益與資金需求，題目契合度高；社群訊號有限，因此以官方風險文件交叉查核。" },
    },
  },
  {
    id: 7, phase: 4, order: "07", topic: "可靠自動化", title: "從 n8n 流程到可復原研究管線", level: "進階入門", estimatedTime: "140 分鐘", prerequisites: ["完成前六份里程碑", "可使用 n8n 或等價工作流工具"],
    objectives: ["把擷取、驗證、分析、引用與報告拆成可觀測節點，保存每次執行狀態。", "實作逾時、重試、冪等、死信、成本上限與人工覆核，不讓失敗靜默通過。"],
    theory: ["自動化價值在可重複，不在無人值守；高風險結論必須停在人工確認點。", "外部 API 會逾時、限流、改版與重送；每個節點都要有輸入契約與失敗路徑。", "只有帶來源、資料時間、模型版本、成本與審核狀態的報告，才具備稽核價值。"],
    exercises: ["畫出 ingest→validate→analyze→cite→review→publish 狀態機。", "重送同一事件三次並注入 API 失敗，證明不重複產出且可復原。", "加入每日成本上限、舊資料警告與人工核准，輸出一次完整執行紀錄。"],
    outcome: "能建立會失敗也能被看見、停止與復原的研究工作流。", project: "里程碑 07｜可靠研究管線＋失敗復原手冊", skills: ["n8n", "冪等", "重試與死信", "成本護欄"], rhythm: "看 35 分鐘 → 畫狀態機 25 分鐘 → 建流程 45 分鐘 → 故障演練 35 分鐘",
    readings: [
      { label: "n8n：錯誤處理文件", url: "https://docs.n8n.io/flow-logic/error-handling/" },
      { label: "n8n：安全稽核工具", url: "https://docs.n8n.io/hosting/securing/security-audit/" },
    ],
    media: {
      zh: { videoId: "CgPEN3sewwA", title: "n8n Webhook 應用：訂單通知自動化", channel: "柚智夫妻 X 雷蒙三十", duration: "36:09", approximateViews: "約 3.9 萬次觀看", checkedAt, selectionReason: "以具體事件完整展示 webhook 串接，中文候選中案例與社群訊號兼具；本課把訂單案例轉成可稽核研究管線。" },
      en: { videoId: "6nIX41-9rhA", title: "Background Jobs / Cron Jobs / Queue", channel: "ByteGrad", duration: "22:27", approximateViews: "約 1.3 萬次觀看", checkedAt, selectionReason: "清楚比較背景工作、排程與佇列，直接補足 no-code 流程常忽略的執行語意；觀看量中等但工程契合度高。" },
    },
  },
  {
    id: 8, phase: 4, order: "08", topic: "AI 治理與結業", title: "讓研究助理可用、可查、可停", level: "綜合實戰", estimatedTime: "180 分鐘＋專案", prerequisites: ["完成可靠研究管線", "邀請一位同學做紅隊審查"],
    objectives: ["建立正常、邊界與對抗案例評測集，量測引用、數值、拒答與人工接管。", "完成資料權限、提示注入、模型變更、成本異常、回滾與事故通報演練。"],
    theory: ["LLM 產出是待驗證的外部資料；高影響金融結論應能引用、拒答並交給人覆核。", "提示注入會讓外部新聞或文件偽裝成指令，防護必須靠來源隔離、最小權限與動作確認。", "可靠系統必須能停：當資料過期、評測退步、成本暴增或引用缺失時，自動化要降級而不是硬跑。"],
    exercises: ["建立 30 題評測集，涵蓋正確引用、數字核對、無答案拒答與惡意文件。", "執行提示注入與過度自信紅隊，記錄攻擊路徑並縮小工具權限。", "演練資料源中斷、模型退步與成本暴增，完成停機、回滾、通知與事後檢討。"],
    outcome: "交付一個不承諾報酬、保留來源、有人類責任與失效保護的 AI 投資研究助理。", project: "結業作品｜可稽核 AI 研究助理＋模型卡＋營運手冊", skills: ["LLM Eval", "Prompt injection", "Human-in-the-loop", "Incident response"], rhythm: "看 25 分鐘 → 建評測 45 分鐘 → 紅隊 40 分鐘 → 事故演練與文件 60 分鐘",
    readings: [
      { label: "NIST：生成式 AI 風險管理框架", url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence" },
      { label: "OWASP：LLM 提示注入風險", url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/" },
    ],
    media: {
      zh: { videoId: "YJHjBc43x0w", title: "AI 寫程式真的安全？你必須建立的資安意識", channel: "所以想知道", duration: "14:18", approximateViews: "約 1,400 次觀看", checkedAt, selectionReason: "少數直接面向 AI 實作者的中文安全入門，語言負擔低；社群訊號有限，因此搭配 NIST、OWASP 與紅隊實作。" },
      en: { videoId: "jrHRe9lSqqA", title: "What Is a Prompt Injection Attack?", channel: "IBM Technology", duration: "10:57", approximateViews: "約 28 萬次觀看", checkedAt, selectionReason: "用具體攻擊鏈說明提示注入，來源與觀看訊號俱佳；能直接支撐最後一課的威脅模型與工具權限設計。" },
    },
  },
];

export const comparison = [
  { gap: "AI 幫你找答案", upgrade: "每個結論都能回到來源、期間與版本" },
  { gap: "產出漂亮回測", upgrade: "先抓偏誤、成本與樣本外，再談策略" },
  { gap: "把多個工具串起來", upgrade: "加入狀態、冪等、重試、限額與人工覆核" },
  { gap: "AI 提供買賣建議", upgrade: "人類保留責任，系統會引用、拒答與停機" },
];

export const capstoneChecklist = [
  "投資政策聲明、決策權限與不做清單",
  "原始資料登錄、as-of date 與來源衝突紀錄",
  "可引用財報摘要、三情境估值與反證清單",
  "含成本、基準、樣本外與壓力測試的研究證據",
  "可復原工作流、執行紀錄、成本上限與人工核准",
  "LLM 評測集、威脅模型、模型卡、回滾與事故報告",
];
