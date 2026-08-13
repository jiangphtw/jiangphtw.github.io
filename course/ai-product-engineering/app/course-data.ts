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
  media: { zh: MediaResource; en: MediaResource };
};

const checkedAt = "2026-08-03";

export const phases = [
  { id: 1, code: "FRAME", title: "先定義，再生成", description: "把想法變成可驗收的產品切片，建立不綁單一工具的 AI 協作方法。", outcome: "產品地圖、風險清單與可執行規格" },
  { id: 2, code: "BUILD", title: "建立可維護的全端骨架", description: "補齊介面、版本控制、API 邊界與部署節奏。", outcome: "可存取、可回滾的全端產品骨架" },
  { id: 3, code: "INTELLIGENCE", title: "把 AI 做成可測的功能", description: "從模型串接進到結構化輸出、成本、評測與防護。", outcome: "有測試集、成本預算與安全邊界的 AI 功能" },
  { id: 4, code: "SYSTEM", title: "讓產品記得、連得上、自己跑", description: "處理資料、身份、檔案、RAG、排程與通知的可靠性。", outcome: "具權限、來源與失敗復原能力的系統" },
  { id: 5, code: "SHIP", title: "用證據上線", description: "以測試、可觀測性、安全檢核與真實使用者驗收完成結業產品。", outcome: "可公開展示、可監控、可回滾的 AI 產品" },
];

export const units: CourseUnit[] = [
  {
    id: 1, phase: 1, order: "01", topic: "產品拆解", title: "先找最小證據，不先做最大夢想", level: "零基礎", estimatedTime: "90 分鐘", prerequisites: ["一個想改善的工作或生活情境"],
    objectives: ["畫出使用者、觸發、資料、AI、介面與回饋組成的產品地圖。", "以價值、風險與可驗收性選出一週內能完成的薄切片。"],
    theory: ["AI 產品不是聊天框，而是一條從使用者意圖、資料、模型到可觀察結果的決策鏈。", "薄切片要端到端走通一個真實任務；它比堆功能更早揭露技術與需求風險。", "先列出最可能讓產品失敗的假設，再決定要寫什麼；生成速度不能取代選擇問題。"],
    exercises: ["拆一個常用 AI 工具，畫出六塊產品地圖並標出資料流。", "為自己的題目寫三個薄切片，比較使用者價值、風險與一週可行性。", "完成一頁產品挑戰卡，包含不做清單與三項成功證據。"],
    outcome: "能在寫程式前辨識產品邊界與最高風險假設。", project: "作品集 01｜AI 產品地圖＋薄切片決策", skills: ["產品拆解", "薄切片", "風險假設"], rhythm: "看 20 分鐘 → 拆案例 20 分鐘 → 畫地圖 30 分鐘 → 決策 15 分鐘",
    media: {
      zh: { videoId: "xo7dE80ktu4", title: "Claude Code 零基礎入門（上）", channel: "柚智夫妻 X 雷蒙三十", duration: "35:08", approximateViews: "約 64 萬次觀看", checkedAt, selectionReason: "從非工程師視角展示如何把任務交給程式代理，能建立動手信心；在同題材中文候選中觀看與互動表現突出。本課會補上影片較少處理的產品風險與驗收框架。" },
      en: { videoId: "gv0WHhKelSE", title: "Claude Code best practices | Code w/ Claude", channel: "Anthropic", duration: "25:53", approximateViews: "約 53 萬次觀看", checkedAt, selectionReason: "由工具團隊示範探索、規劃、修改與驗證的完整節奏，來源直接且觀看與互動表現突出；本課把方法抽象成可跨工具使用的產品流程。" },
    },
  },
  {
    id: 2, phase: 1, order: "02", topic: "規格驅動", title: "讓 AI 有邊界：規格、上下文與驗收契約", level: "零基礎", estimatedTime: "100 分鐘", prerequisites: ["完成單元 01 的薄切片"],
    objectives: ["把模糊需求改寫成包含情境、範圍、限制與驗收條件的規格。", "建立可由 Claude Code、Codex、Gemini CLI 共用的專案上下文與決策紀錄。"],
    theory: ["好提示不是修辭，而是資訊架構：目標、現況、限制、輸出格式與驗收方法缺一不可。", "把長期規則放進版本控制，把單次任務留在對話；兩者混在一起會讓上下文膨脹並失真。", "先讓 AI 提計畫、再批准小步修改、最後以工具驗收，可降低一次生成大量錯誤的風險。"],
    exercises: ["把一句『幫我做網站』改寫成五段規格與三個可勾選驗收條件。", "建立 AGENTS.md／CLAUDE.md 共用規則與一則 ADR 決策紀錄。", "用兩種 AI 工具執行同一小任務，比較差異並修訂上下文。"],
    outcome: "能讓 AI 在清楚邊界內工作，並保留可交接的決策證據。", project: "作品集 02｜產品規格＋AI 協作契約", skills: ["需求規格", "上下文工程", "ADR", "驗收條件"], rhythm: "看 20 分鐘 → 改寫規格 25 分鐘 → 建立文件 30 分鐘 → 雙工具比較 20 分鐘",
    media: {
      zh: { videoId: "GRhg_ZZswmQ", title: "Claude Code 與 Codex 雙棲記憶系統、對話管理、AI 分工誤區", channel: "柚智夫妻 X 雷蒙三十", duration: "14:41", approximateViews: "約 2.2 萬次觀看", checkedAt, selectionReason: "直接處理跨工具記憶、Plan Mode 與上下文斷層，與本單元可移轉能力高度吻合；影片較新，觀看量仍在累積。" },
      en: { videoId: "kZ-zzHVUrO4", title: "How I use Claude Code for real engineering", channel: "Matt Pocock", duration: "10:12", approximateViews: "約 28 萬次觀看", checkedAt, selectionReason: "用真實工程任務呈現探索、委派與人工判斷的分工，短而高密度；突出的觀看與互動表現讓它適合拿來反查自己的工作流程。" },
    },
  },
  {
    id: 3, phase: 2, order: "03", topic: "介面與可存取性", title: "不只長得像網站：做出能用的介面", level: "入門", estimatedTime: "120 分鐘", prerequisites: ["能啟動 Node.js 專案", "完成產品規格"],
    objectives: ["以語意 HTML、元件狀態與響應式佈局完成主要任務流程。", "以鍵盤、焦點、對比、錯誤訊息與行動裝置檢核介面。"],
    theory: ["React 元件是狀態與行為的邊界，不只是把畫面切成小檔案。", "無障礙不是上線前的加分項；語意、名稱、焦點與錯誤回饋同時改善測試性與可用性。", "AI 很會生成看似完整的 UI，卻容易遺漏空狀態、載入、失敗、長文字與小螢幕。"],
    exercises: ["用 HTML 與 CSS 重做主要流程，不用 JavaScript 也能讀懂內容順序。", "加入載入、空白、錯誤、成功四種狀態並用鍵盤走完流程。", "在 360px、768px、1440px 與大字模式留下驗收截圖。"],
    outcome: "能把 AI 產生的畫面修成可操作、可測且跨裝置的介面。", project: "作品集 03｜可存取響應式介面", skills: ["React", "語意 HTML", "響應式", "WCAG"], rhythm: "看 35 分鐘 → 建骨架 30 分鐘 → 補狀態 30 分鐘 → 可存取驗收 20 分鐘",
    media: {
      zh: { videoId: "Kj4kQzP75Fk", title: "Next.js 快速入門：從零到上線正式環境", channel: "布魯斯前端", duration: "2:47:54", approximateViews: "約 3.8 萬次觀看", checkedAt, selectionReason: "涵蓋 React、Next.js、資料與部署的完整跟做路徑，在中文候選中兼具新鮮度與完整性；本單元指定選看片段並補上可存取驗收。" },
      en: { videoId: "I1V9YWqRIeI", title: "Next.js 16 Full Course | Production-Ready Full Stack App", channel: "JavaScript Mastery", duration: "4:10:18", approximateViews: "約 71 萬次觀看", checkedAt, selectionReason: "以完整產品示範現代 Next.js 架構與部署，觀看與互動表現突出；片長較長，適合依介面、狀態與部署章節選看。" },
    },
  },
  {
    id: 4, phase: 2, order: "04", topic: "版本與交付", title: "每一步都能回來：Git、PR 與預覽部署", level: "入門", estimatedTime: "90 分鐘", prerequisites: ["一個可執行的網站專案"],
    objectives: ["以小提交、分支與 Pull Request 保存可閱讀的變更脈絡。", "建立 build、lint、test 與預覽部署檢查，能在失敗時回滾。"],
    theory: ["Git 的價值不只備份，而是讓每次決策有邊界、可比較、可審查與可復原。", "AI 產生的變更要以 diff 為單位驗收；混合多個目的的巨型提交會放大風險。", "部署不是最後一個按鈕，而是一條可重複、可阻擋錯誤、可還原的交付管線。"],
    exercises: ["把一個大改動拆成三個有目的、可單獨回滾的提交。", "建立 PR，要求 AI 先摘要 diff、再找風險，最後由你批准。", "故意讓測試失敗，確認管線會阻擋部署並完成一次回滾演練。"],
    outcome: "能保留安全的開發節奏，不因 AI 改得快而失去控制。", project: "作品集 04｜可審查 PR＋部署管線", skills: ["Git", "Pull Request", "CI", "回滾"], rhythm: "看 20 分鐘 → 重整提交 20 分鐘 → PR 審查 25 分鐘 → 回滾演練 20 分鐘",
    media: {
      zh: { videoId: "FKXRiAiQFiY", title: "Git 和 GitHub 零基礎快速上手", channel: "PAPAYA 電腦教室", duration: "15:51", approximateViews: "約 27 萬次觀看", checkedAt, selectionReason: "以短篇建立版本控制心智模型與實際操作，中文候選中觀看與互動表現突出；本課再進一步加入 PR、CI 與回滾。" },
      en: { videoId: "RGOj5yH7evk", title: "Git and GitHub for Beginners - Crash Course", channel: "freeCodeCamp.org", duration: "1:08:30", approximateViews: "逾百萬次觀看", checkedAt, selectionReason: "從 repository、branch、merge 到遠端協作有完整跟做路徑，長期觀看與互動表現突出；可作為中文短篇後的系統補充。" },
    },
  },
  {
    id: 5, phase: 2, order: "05", topic: "API 邊界", title: "把秘密留在伺服器：驗證、錯誤與 API 契約", level: "入門", estimatedTime: "110 分鐘", prerequisites: ["完成單元 03 的介面", "理解環境變數"],
    objectives: ["建立伺服器端 API，驗證輸入、分類錯誤並保護金鑰。", "定義前後端共享的資料契約、逾時與重試行為。"],
    theory: ["前端送來的資料一律不可信；認證、授權、驗證與速率限制必須在可信邊界執行。", "穩定 API 要同時定義成功資料與失敗語意，不能只靠任意字串讓介面猜。", "重試只適合可重複且暫時性失敗的操作；沒有逾時與冪等性，重試會把小錯放大。"],
    exercises: ["把瀏覽器中的 API 金鑰移到伺服器端並驗證輸入 schema。", "設計成功、使用者錯誤、服務錯誤三種回應並讓介面正確顯示。", "模擬逾時與重複送出，加入取消、退避與冪等鍵。"],
    outcome: "能建立不洩漏秘密、失敗時可理解且可復原的 API。", project: "作品集 05｜安全 API 契約＋錯誤矩陣", skills: ["Route Handler", "輸入驗證", "錯誤處理", "冪等性"], rhythm: "看 25 分鐘 → 建 API 30 分鐘 → 錯誤矩陣 25 分鐘 → 失敗注入 25 分鐘",
    media: {
      zh: { videoId: "sK-3La7YPaw", title: "Next.js API Routes：Route Handlers 與隱藏 API Keys", channel: "Wei Wei 前端教學", duration: "23:59", approximateViews: "約 4,700 次觀看", checkedAt, selectionReason: "題目直接命中伺服器邊界與金鑰保護，完整度優於同題材碎片；觀看量較有限，因此以實作測試補強。" },
      en: { videoId: "Otq0LY90Qso", title: "Authentication Flow in Next.js (Complete Tutorial)", channel: "Cosden Solutions", duration: "30:37", approximateViews: "約 10 萬次觀看", checkedAt, selectionReason: "用完整流程呈現可信邊界、cookie 與伺服器驗證，觀看與互動表現穩定；雖以認證為例，邊界思維可直接移轉到所有 API。" },
    },
  },
  {
    id: 6, phase: 3, order: "06", topic: "LLM 功能", title: "從能回答到能依賴：結構化輸出、串流與成本", level: "進階入門", estimatedTime: "120 分鐘", prerequisites: ["安全 API 契約", "一組模型供應商測試金鑰"],
    objectives: ["以 schema 約束模型輸出，完成串流、取消、逾時與降級路徑。", "估算每次任務的 token、延遲與成本，設計快取與模型路由。"],
    theory: ["模型輸出是非確定性外部資料；即使使用結構化輸出，仍要驗證語意與處理拒答。", "串流改善感知速度但增加狀態與中斷處理；快不等於任務完成，介面要區分生成中與已驗收。", "模型選擇是品質、延遲、成本與資料政策的組合決策，不能只比較排行榜。"],
    exercises: ["把自由文字回應改成 schema，對缺欄、拒答與無效值寫處理。", "加入串流、取消與逾時，記錄首 token 與完成延遲。", "用三種任務跑小型基準，比較模型品質、延遲與每百次成本。"],
    outcome: "能把模型呼叫轉化為介面可以依賴、營運成本可以預估的產品能力。", project: "作品集 06｜模型適配層＋成本儀表", skills: ["結構化輸出", "Streaming", "Token 成本", "模型路由"], rhythm: "看 20 分鐘 → schema 30 分鐘 → 串流 30 分鐘 → 成本基準 30 分鐘",
    media: {
      zh: { videoId: "_hG0pcBnPQw", title: "AI Agent 是什麼？LLM、Workflow、Agent 到底差在哪？", channel: "Kelly Tsai", duration: "15:06", approximateViews: "約 30 萬次觀看", checkedAt, selectionReason: "用清楚脈絡區分模型、工作流程與代理，能避免把所有功能都錯設計成 Agent；中文候選中觀看與互動表現突出，API 細節由本課實作補上。" },
      en: { videoId: "vD0E3EUb8-8", title: "Context Engineering vs. Prompt Engineering", channel: "IBM Technology", duration: "7:52", approximateViews: "約 23 萬次觀看", checkedAt, selectionReason: "以短篇說明上下文如何影響可靠輸出與系統選擇，來源具技術權威且觀看與互動表現突出；本課再落到 schema、串流與成本。" },
    },
  },
  {
    id: 7, phase: 3, order: "07", topic: "評測與防護", title: "不靠感覺說變好：Eval、紅隊與人類覆核", level: "進階", estimatedTime: "120 分鐘", prerequisites: ["一個可呼叫的 LLM 功能"],
    objectives: ["建立含正常、邊界與對抗案例的黃金測試集與評分規則。", "測試提示注入、資料外洩與有害輸出，設計工具權限與人類覆核。"],
    theory: ["LLM 評測要先定義任務成功，再選規則、人工或模型裁判；單一平均分會掩蓋致命失敗。", "提示注入是資料與指令邊界混淆問題，沒有一句萬能 system prompt 能完全解決。", "防護要分層：最小權限、來源隔離、輸出驗證、敏感動作確認、日誌與失敗復原。"],
    exercises: ["蒐集 20 筆正常、10 筆邊界、10 筆對抗案例並標註預期。", "建立至少一項規則評分與一項人工 rubric，比較兩版 prompt。", "執行提示注入紅隊，記錄攻擊路徑並加入權限或確認邊界。"],
    outcome: "能用可重複證據決定模型變更是否真的更好、更安全。", project: "作品集 07｜LLM Eval 報告＋威脅模型", skills: ["Evals", "Prompt Injection", "紅隊", "Human-in-the-loop"], rhythm: "看 25 分鐘 → 建資料集 35 分鐘 → 跑評測 30 分鐘 → 紅隊 25 分鐘",
    media: {
      zh: { videoId: "YJHjBc43x0w", title: "AI 寫程式真的安全？你必須建立的資安意識", channel: "所以想知道", duration: "14:18", approximateViews: "約 1,400 次觀看", checkedAt, selectionReason: "少數直接面向 Vibe Coding 初學者的中文安全內容，語言負擔低；觀看與互動表現有限，因此搭配 IBM 的攻擊機制解說與本課紅隊實作。" },
      en: { videoId: "jrHRe9lSqqA", title: "What Is a Prompt Injection Attack?", channel: "IBM Technology", duration: "10:57", approximateViews: "約 28 萬次觀看", checkedAt, selectionReason: "用具體攻擊鏈解釋提示注入，不停留在抽象警告，來源可靠，且觀看與互動表現俱佳；正好支撐本單元威脅模型。" },
    },
  },
  {
    id: 8, phase: 4, order: "08", topic: "資料與身份", title: "系統記得什麼、誰能看：資料模型、登入與檔案", level: "進階入門", estimatedTime: "130 分鐘", prerequisites: ["安全 API 契約", "能使用雲端資料庫"],
    objectives: ["設計含關聯、唯一性、生命週期與遷移策略的資料模型。", "實作認證與伺服器端授權，限制每位使用者的資料與檔案存取。"],
    theory: ["登入只證明身分，授權才決定能做什麼；在 UI 隱藏按鈕不等於權限控制。", "資料模型要表達不變條件與刪除政策，不能把所有欄位塞進無結構文件再交給 AI 猜。", "檔案上傳同時涉及大小、類型、惡意內容、儲存權限、保留期限與可追溯性。"],
    exercises: ["畫 ERD 並寫出三個唯一性或關聯不變條件。", "建立兩位使用者，證明伺服器會拒絕跨帳號讀寫。", "加入檔案大小、MIME、權限與刪除政策，完成一份濫用測試。"],
    outcome: "能讓產品安全記住資料，並清楚證明誰可存取什麼。", project: "作品集 08｜ERD＋授權測試＋資料生命週期", skills: ["資料模型", "Migration", "Authentication", "Authorization", "Upload"], rhythm: "看 25 分鐘 → 畫 ERD 25 分鐘 → 實作授權 40 分鐘 → 檔案濫用測試 30 分鐘",
    media: {
      zh: { videoId: "sTiXb94ts2I", title: "Next.js API Routes 中文入門", channel: "小馬技術", duration: "10:21", approximateViews: "約 460 次觀看", checkedAt, selectionReason: "中文供給有限，這支用短例子建立資料操作的伺服器入口，適合作為低門檻起點；權限與資料生命週期由本課完整補齊。" },
      en: { videoId: "DJvM2lSPn6w", title: "Next.js App Router Authentication", channel: "leerob", duration: "11:31", approximateViews: "約 35 萬次觀看", checkedAt, selectionReason: "以 session、cookie、JWT 清楚拆解認證流程，作者長期參與 Next.js 生態且觀看與互動表現突出；本課再加入授權與檔案邊界。" },
    },
  },
  {
    id: 9, phase: 4, order: "09", topic: "外部資料與 RAG", title: "讓 AI 有來源：API、爬取、檔案與檢索", level: "進階", estimatedTime: "130 分鐘", prerequisites: ["資料與檔案模型", "可呼叫的 LLM 功能"],
    objectives: ["依資料授權、更新頻率與結構選擇 API、檔案匯入、爬取或 RAG。", "建立可引用來源、可拒答並能量測檢索品質的問答流程。"],
    theory: ["RAG 不是把文件丟進向量資料庫；切分、權限、檢索、重排、引用與拒答共同決定品質。", "外部資料會變、會失敗也可能含惡意指令；來源內容必須視為不可信資料。", "能回答不代表有根據，應同時評估檢索命中、答案忠實度與引用可追溯性。"],
    exercises: ["針對同一需求比較官方 API、爬取與檔案匯入的授權、成本與維護風險。", "建立 10 份小文件的檢索，對每個回答顯示來源片段與連結。", "用 20 題測試集量測命中與忠實度，加入無答案時的拒答。"],
    outcome: "能讓 AI 使用外部知識，同時保留來源、權限與品質證據。", project: "作品集 09｜可引用 RAG＋資料來源登錄表", skills: ["API", "RAG", "檢索評測", "來源治理"], rhythm: "看 20 分鐘 → 資料決策 25 分鐘 → 建檢索 45 分鐘 → 評測與拒答 30 分鐘",
    media: {
      zh: { videoId: "77990wI3LZk", title: "透過 RAG 建立私有 AI 知識庫", channel: "鵬哥的 AI", duration: "8:11", approximateViews: "約 13 萬次觀看", checkedAt, selectionReason: "以短實作建立 RAG 心智模型，中文候選中觀看與互動表現突出；本課特別補上引用、權限、拒答與評測。" },
      en: { videoId: "sGvXO7CVwc0", title: "Advanced RAG techniques for developers", channel: "Google Cloud Tech", duration: "8:17", approximateViews: "約 8.9 萬次觀看", checkedAt, selectionReason: "以開發者角度說明進階檢索與品質改進，來源權威且觀看與互動表現穩定；適合在基本實作後診斷檢索問題。" },
    },
  },
  {
    id: 10, phase: 4, order: "10", topic: "自動化可靠性", title: "讓系統自己跑，也知道失敗怎麼辦", level: "進階", estimatedTime: "120 分鐘", prerequisites: ["可部署的 API", "一項需要延後或定時執行的任務"],
    objectives: ["以 webhook、排程或佇列執行長任務，驗證簽章並避免重複處理。", "設計重試、死信、通知與人工補償，能追蹤每次工作狀態。"],
    theory: ["同步請求適合短工作；長任務應離開使用者請求生命週期，否則逾時會造成未知結果。", "外部事件至少一次送達很常見，所以 handler 必須冪等並保存處理狀態。", "可靠自動化不只成功路徑，還要能看見卡住、重試耗盡與部分完成，並有補償方法。"],
    exercises: ["把一個長任務改成背景工作，介面可查詢 queued、running、done、failed。", "驗證 webhook 簽章並重送同一事件三次，證明只產生一次結果。", "注入第三方失敗，觀察退避重試、死信與人工重跑流程。"],
    outcome: "能建立不怕逾時、重送與第三方故障的自動化工作流程。", project: "作品集 10｜可靠工作流程＋失敗復原手冊", skills: ["Webhook", "Queue", "Cron", "冪等", "重試"], rhythm: "看 25 分鐘 → 背景工作 35 分鐘 → 重送測試 25 分鐘 → 復原演練 25 分鐘",
    media: {
      zh: { videoId: "CgPEN3sewwA", title: "n8n Webhook 應用：訂單通知自動化", channel: "柚智夫妻 X 雷蒙三十", duration: "36:09", approximateViews: "約 3.9 萬次觀看", checkedAt, selectionReason: "用具體訂單事件展示 webhook 與通知串接，中文候選中案例完整且訊號較強；本課再加入簽章、冪等與死信。" },
      en: { videoId: "6nIX41-9rhA", title: "Next.js Background Jobs / Cron Jobs / Queue", channel: "ByteGrad", duration: "22:27", approximateViews: "約 1.3 萬次觀看", checkedAt, selectionReason: "直接比較背景工作、排程與佇列在 Next.js 的角色，實作契合度高；觀看量中等，但能補足中文資源的程式端可靠性。" },
    },
  },
  {
    id: 11, phase: 5, order: "11", topic: "品質與營運", title: "Demo 不算完成：測試、除錯、可觀測性與安全", level: "進階", estimatedTime: "140 分鐘", prerequisites: ["前 10 單元形成的產品垂直切片"],
    objectives: ["建立單元、整合與端到端測試，涵蓋主要流程與權限邊界。", "定義結構化日誌、關鍵指標、追蹤與告警，完成安全與效能預算。"],
    theory: ["測試層級要對準風險：純邏輯用單元測試、邊界用整合測試、少數關鍵旅程用 E2E。", "可觀測性要能回答誰受影響、哪裡失敗與從何時開始，而不是蒐集一堆沒有決策用途的 log。", "AI 產生程式碼常混入過寬權限、過時套件與未處理輸入；安全檢查與依賴審查要進入 CI。"],
    exercises: ["建立一條單元、一條 API 整合與一條 Playwright E2E 測試。", "為一次請求串起 request id、模型延遲、token、錯誤類型與使用者結果。", "執行依賴、安全標頭、敏感資料、效能與無障礙檢查，修正三項最高風險。"],
    outcome: "能用測試與營運訊號證明產品可用，並在出錯時快速定位。", project: "作品集 11｜測試金字塔＋可觀測性面板＋上線檢核", skills: ["Playwright", "Integration Test", "Observability", "DevSecOps", "Performance"], rhythm: "看 30 分鐘 → 三層測試 45 分鐘 → 加觀測 30 分鐘 → 安全效能檢核 25 分鐘",
    media: {
      zh: { videoId: "KX-B5bP_kos", title: "Playwright 零基礎自動化測試教學", channel: "自動化探索", duration: "14:16", approximateViews: "約 8,300 次觀看", checkedAt, selectionReason: "近期中文完整入門，能快速寫出第一個腳本；觀看與互動表現在中文 Playwright 候選中突出，本課再補上測試分層與營運觀測。" },
      en: { videoId: "3NW0Mz943_E", title: "React Testing with Playwright (Complete Tutorial)", channel: "Cosden Solutions", duration: "32:45", approximateViews: "約 7.1 萬次觀看", checkedAt, selectionReason: "以 React 應用完整示範 locator、流程與斷言，實作完整且觀看與互動表現穩定；適合直接套到結業產品。" },
    },
  },
  {
    id: 12, phase: 5, order: "12", topic: "結業產品", title: "用真實證據上線：從試用、指標到事故演練", level: "綜合實戰", estimatedTime: "180 分鐘＋專案", prerequisites: ["完成 11 份里程碑", "邀請 3 位目標使用者"],
    objectives: ["完成可公開使用的 AI 產品，以任務成功、品質、成本與留存訊號驗收。", "完成隱私、風險、回滾、事故處理與下一版決策文件。"],
    theory: ["上線不是功能完成，而是把價值假設交給真實使用者；先定義決策門檻，避免只看稱讚。", "AI 產品至少同時看任務成功、人工接管、延遲、成本、安全事件與使用者回訪。", "產品必須能停：功能旗標、成本上限、資料刪除、回滾與事故通報是負責任上線的一部分。"],
    exercises: ["邀請三位目標使用者完成核心任務，記錄行為、阻礙、成功與人工接管。", "建立上線 scorecard，包含任務成功、p95 延遲、每任務成本、錯誤與安全事件。", "演練模型服務故障、成本暴增或資料誤曝，執行停用、回滾、通知與事後檢討。"],
    outcome: "能交付一個有使用證據、營運邊界與復原能力的 AI 產品。", project: "結業作品｜公開 AI 產品＋案例研究＋營運手冊", skills: ["產品驗收", "Analytics", "Feature Flag", "Incident Response", "Portfolio"], rhythm: "看 25 分鐘 → 使用者試用 60 分鐘 → 指標與文件 45 分鐘 → 事故演練 40 分鐘",
    media: {
      zh: { videoId: "2pM-7fBXc_M", title: "Claude Code 保姆級教學：從設定到 Vibe Coding 實作", channel: "PAPAYA 電腦教室", duration: "27:03", approximateViews: "約 47 萬次觀看", checkedAt, selectionReason: "由安裝走到完整實作，適合作為結業前的工具總複習，中文候選中觀看與互動表現突出；本課的上線門檻刻意比影片 Demo 更嚴格。" },
      en: { videoId: "F5KJVuii0Yw", title: "Web App Vulnerabilities - DevSecOps Course for Beginners", channel: "freeCodeCamp.org", duration: "1:28:49", approximateViews: "約 21 萬次觀看", checkedAt, selectionReason: "以完整課程補上公開上線前的常見 Web 風險與 DevSecOps 思維，觀看與互動表現突出；可依威脅、掃描與修補章節選看。" },
    },
  },
];

export const capstoneChecklist = [
  "產品地圖、薄切片與不做清單",
  "版本控制中的規格、AI 協作規則與決策紀錄",
  "可存取的響應式介面與安全 API",
  "模型適配層、成本預算、Eval 與威脅模型",
  "資料授權、來源引用與可靠背景工作",
  "三層測試、可觀測性、回滾與事故演練",
  "三位真實使用者證據與公開案例研究",
];

export const comparison = [
  { gap: "單一工具操作", upgrade: "規格、決策紀錄與跨工具協作契約" },
  { gap: "做出功能", upgrade: "以 Eval、測試與真實任務證明功能有效" },
  { gap: "金鑰不放前端", upgrade: "輸入驗證、授權、最小權限、提示注入與資料生命週期" },
  { gap: "一鍵部署", upgrade: "CI、預覽、監控、成本上限、功能旗標與回滾" },
  { gap: "作品數量", upgrade: "一個有使用證據與營運手冊的完整產品" },
];
