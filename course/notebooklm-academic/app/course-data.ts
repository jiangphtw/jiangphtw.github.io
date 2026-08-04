export type Language = "zh" | "en";

export type MediaItem = {
  videoId: string;
  title: string;
  channel: string;
  duration: string;
  approximateViews: string;
  selectionReason: string;
  checkedAt: string;
};

export type Unit = {
  id: number;
  order: string;
  phase: number;
  topic: string;
  title: string;
  subtitle: string;
  objectives: string[];
  theory: string[];
  exercises: string[];
  outcome: string;
  project: string;
  rhythm: string;
  prerequisites: string;
  skills: string[];
  media: Record<Language, MediaItem>;
};

export const phases = [
  { id: 1, number: "01", short: "FRAME", title: "定題與邊界", description: "先決定要回答什麼、不能犧牲什麼；避免把模糊興趣直接丟給 AI。", deliverable: "研究問題卡＋AI 使用契約", color: "#ff6b47" },
  { id: 2, number: "02", short: "SOURCE", title: "建立來源池", description: "把搜尋字串、納入條件與來源品質變成可重做的流程。", deliverable: "檢索紀錄＋來源清單", color: "#2962ff" },
  { id: 3, number: "03", short: "EXTRACT", title: "萃取研究證據", description: "從關鍵詞開始，把主張、方法、結果與限制拆成可比較欄位。", deliverable: "術語表＋證據矩陣", color: "#008c72" },
  { id: 4, number: "04", short: "SYNTHESIZE", title: "綜整文獻地景", description: "辨認共識、分歧、條件與時間脈絡，不把多篇摘要誤當綜述。", deliverable: "綜整表＋概念地圖", color: "#8047e8" },
  { id: 5, number: "05", short: "QUESTION", title: "深問與找缺口", description: "用問題階梯、反例與方法差異，把理解推向研究缺口。", deliverable: "問題樹＋缺口假說", color: "#c14b00" },
  { id: 6, number: "06", short: "VERIFY", title: "查證與引用", description: "逐條回到原文，檢查引文、語境、數字與 AI 推論的邊界。", deliverable: "主張—引用稽核表", color: "#cf315a" },
  { id: 7, number: "07", short: "SHIP", title: "累積與交付", description: "讓 Notebook、Zotero 與自己的輸出可延續，完成一份可複核作品。", deliverable: "研究證據卷宗", color: "#1d738c" },
] as const;

const checkedAt = "2026-08-04";

export const units: Unit[] = [
  {
    id: 1,
    order: "01",
    phase: 1,
    topic: "RESEARCH QUESTION",
    title: "把興趣變成可回答的研究問題",
    subtitle: "用範圍、對象、現象與判準，替整個 Notebook 設定北極星。",
    objectives: ["把寬泛主題改寫成可搜尋、可比較、可查證的問題。", "定義研究範圍、關鍵概念與暫不處理的邊界。"],
    theory: ["問題品質決定後續來源是否可比較；先有判準，再談 AI 速度。", "PICO、SPIDER 或 5W1H 都只是鷹架，應依研究類型選用。", "把『想知道什麼』與『最後要做什麼決策』寫在同一張卡上。"],
    exercises: ["寫下你的主題、預期讀者與最後要做的決策。", "產出 3 個不同範圍的研究問題，標出核心概念與同義詞。", "選定一題，列出納入範圍、排除範圍與成功判準。"],
    outcome: "一個能指引搜尋與綜整的研究問題，而不是只有關鍵字的題目。",
    project: "研究問題卡 v1（題目、對象、範圍、概念、輸出與判準）",
    rhythm: "45–60 分鐘",
    prerequisites: "準備一個你真的需要回答的學術或專業問題",
    skills: ["問題框定", "範圍界定", "檢索前設計"],
    media: {
      zh: { videoId: "zgWerTIynVA", title: "NotebookLM 完整教學：從來源到輸出", channel: "大有牧森 Austin Chou", duration: "約 17 分", approximateViews: "約 84 萬次觀看", selectionReason: "先建立產品全貌，能看見問題、來源、筆記與輸出的關係；偏工具導覽，需搭配本單元的研究問題卡。", checkedAt },
      en: { videoId: "jJntl74QNWo", title: "How To Do A Literature Review (Stress-Free)", channel: "Andy Stapleton", duration: "約 18 分", approximateViews: "約 18 萬次觀看", selectionReason: "從文獻回顧流程反推研究問題與搜尋方向；不是 Gemini Notebook 操作片，正好補足工具教學較少觸及的研究設計。", checkedAt },
    },
  },
  {
    id: 2,
    order: "02",
    phase: 1,
    topic: "RESEARCH CONTRACT",
    title: "先寫 AI 使用契約，再匯入資料",
    subtitle: "在便利之前，先處理著作權、隱私、機密、揭露與學術誠信。",
    objectives: ["辨識不可上傳、需要去識別化與可公開使用的資料。", "寫出適合自己的 AI 使用、查證與揭露規則。"],
    theory: ["能上傳不等於有權上傳；校規、研究倫理與授權條款優先。", "敏感資料採資料最小化：移除識別資訊，必要時完全不送入第三方服務。", "AI 可協助整理與提問，但作者仍對論證、引用與錯誤負責。"],
    exercises: ["把預計使用的資料分成公開、受限、敏感三類。", "替每類資料決定可否上傳、如何去識別與保存多久。", "完成一段可放進作業或論文的 AI 使用揭露聲明。"],
    outcome: "一套能在速度、隱私與學術責任之間做決定的操作規則。",
    project: "AI 研究契約（資料分級、禁止事項、查證責任、揭露方式）",
    rhythm: "50–70 分鐘",
    prerequisites: "完成單元 01，並盤點可能匯入的資料類型",
    skills: ["研究倫理", "資料治理", "AI 揭露"],
    media: {
      zh: { videoId: "7RJmrjZ1FHU", title: "AI 研究寫作全攻略：NotebookLM × Gemini × ChatGPT × Perplexity", channel: "Flag Technology", duration: "短篇導覽", approximateViews: "約 1,500 次觀看", selectionReason: "由學術研究專書團隊概覽研究寫作場景，並明確納入 AI 使用方式與倫理規範；影片偏導覽，細節仍以校規與研究倫理規範為準。", checkedAt },
      en: { videoId: "1GggrzZy5YU", title: "NotebookLM for Researchers: Here’s the Catch", channel: "Andy Stapleton", duration: "約 11 分", approximateViews: "約 14 萬次觀看", selectionReason: "以研究者角度提醒工具限制，適合建立不過度信任的心態；觀點型內容仍需以校規與官方政策為準。", checkedAt },
    },
  },
  {
    id: 3,
    order: "03",
    phase: 2,
    topic: "SEARCH PLAN",
    title: "做一張能重跑的搜尋策略表",
    subtitle: "從種子文獻、同義詞、布林運算到滾雪球，保留每次搜尋的足跡。",
    objectives: ["設計中英文關鍵詞群、排除詞與資料庫搜尋式。", "記錄資料庫、日期、查詢式與結果數，讓搜尋可重現。"],
    theory: ["單一搜尋框容易被排名機制綁架；先建立概念群再組合查詢。", "種子文獻可向後追參考文獻、向前追引用，形成 citation chaining。", "查全率與查準率互有取捨，應用多輪搜尋逐步收斂。"],
    exercises: ["為研究問題建立 3 組概念群，各列 5 個中英文同義詞。", "在一個學術資料庫與一般搜尋引擎各跑一次，保存完整查詢式。", "從一篇種子文獻做前後向追蹤，記錄新增來源與原因。"],
    outcome: "任何人都能重跑、檢查並更新的搜尋紀錄。",
    project: "檢索日誌 v1（資料庫、查詢式、日期、命中數、調整理由）",
    rhythm: "60–90 分鐘",
    prerequisites: "研究問題卡與可公開測試的主題",
    skills: ["布林檢索", "引用追蹤", "可重現搜尋"],
    media: {
      zh: { videoId: "cFt9z8kLGsQ", title: "NotebookLM 整理論文、研究計畫與文獻回顧", channel: "RYAN 老師 AI 研究室", duration: "約 21 分", approximateViews: "約 1.5 萬次觀看", selectionReason: "示範學術材料如何進入 Notebook 工作流，適合作為搜尋後的落地情境；操作步驟不能取代資料庫檢索紀錄。", checkedAt },
      en: { videoId: "mo9gZA3fCGs", title: "NotebookLM for an Efficient Literature Review", channel: "Aynur Science", duration: "約 12 分", approximateViews: "約 3 萬次觀看", selectionReason: "聚焦文獻選取與整理，能把搜尋和後續綜整接起來；需自行補上領域專屬資料庫。", checkedAt },
    },
  },
  {
    id: 4,
    order: "04",
    phase: 2,
    topic: "SOURCE TRIAGE",
    title: "建立來源池，不建立資料垃圾場",
    subtitle: "用納入／排除條件與品質標記，決定哪些來源值得進 Notebook。",
    objectives: ["為來源建立相關性、權威性、時效性與方法透明度標記。", "正確使用 Fast Research、Deep Research 與手動匯入。"],
    theory: ["Notebook 是封閉語料的推理空間，弱來源會讓答案穩定地變弱。", "搜尋摘要只適合初篩，重要主張仍需讀原文與研究方法。", "納入／排除條件應在看到結果前寫，降低事後挑選偏誤。"],
    exercises: ["寫出 4 條納入條件與 4 條排除條件。", "抽查 10 個候選來源，標記類型、權威性、日期、方法與利益衝突。", "只匯入通過條件的來源，替每個來源加上用途與風險註記。"],
    outcome: "一個乾淨、可說明選擇理由的最小可用來源池。",
    project: "來源決策表（至少 12 個候選、8 個納入、附排除理由）",
    rhythm: "70–100 分鐘",
    prerequisites: "完成檢索日誌 v1",
    skills: ["來源評估", "納排標準", "資料匯入"],
    media: {
      zh: { videoId: "zD1XdFpYeBc", title: "Google NotebookLM 最新介紹及應用實例分享", channel: "Teacher Ruth", duration: "約 118 分", approximateViews: "長篇教學", selectionReason: "長篇完整示範來源匯入、整理與多種應用情境，適合依需求選章觀看；片長是主要取捨，新功能仍以官方說明為準。", checkedAt },
      en: { videoId: "AmKZCo5Dtn0", title: "Meet NotebookLM: Research, Reimagined", channel: "Google Workspace", duration: "約 5 分", approximateViews: "約 8.9 萬次觀看", selectionReason: "官方概覽能校準產品定位與來源導向設計；內容精簡、偏產品介紹，需搭配本單元的品質量表。", checkedAt },
    },
  },
  {
    id: 5,
    order: "05",
    phase: 3,
    topic: "CONCEPT GLOSSARY",
    title: "讓術語變成可比較的概念",
    subtitle: "不只列名詞：記錄定義、操作化、同義詞、爭議與來源。",
    objectives: ["區分一般語義、學術定義與研究中的操作化定義。", "建立帶出處、可持續更新的雙語術語表。"],
    theory: ["同一術語跨領域可能指不同現象；先對齊概念才有資格比較研究。", "操作化定義說明研究如何測量抽象概念，是方法判讀的入口。", "把 AI 產生的定義當候選解釋，至少回看兩個原始來源。"],
    exercises: ["請 Notebook 列出 15 個核心術語與對應引用。", "選 5 個術語，逐一回到原文核對定義與語境。", "補上同義詞、反義概念、操作化方式與仍有爭議之處。"],
    outcome: "一份能降低概念混淆、支援後續編碼的術語表。",
    project: "雙語概念辭典（至少 10 詞，每詞附定義、操作化與來源）",
    rhythm: "50–75 分鐘",
    prerequisites: "至少 8 個通過品質初篩的來源",
    skills: ["概念分析", "操作化", "術語管理"],
    media: {
      zh: { videoId: "UF9O9sHg3Lo", title: "NotebookLM 協助整理論文文獻探討", channel: "林大衛", duration: "約 5 分", approximateViews: "約 1,600 次觀看", selectionReason: "以論文整理為場景，短片適合先看再立即實作；深度有限，需用本課欄位補足定義查證。", checkedAt },
      en: { videoId: "EOmgC3-hznM", title: "Learn 80% of NotebookLM in Under 13 Minutes", channel: "Jeff Su", duration: "約 13 分", approximateViews: "約 171 萬次觀看", selectionReason: "高密度展示來源提問與輸出方式，適合觀察如何快速抽取概念；偏通用效率技巧，不等於學術驗證。", checkedAt },
    },
  },
  {
    id: 6,
    order: "06",
    phase: 3,
    topic: "EVIDENCE MATRIX",
    title: "把每篇文獻拆成證據列",
    subtitle: "主張、樣本、方法、結果、限制與引文位置，一列都不能少。",
    objectives: ["建立適合自己研究問題的證據矩陣欄位。", "區分作者主張、研究結果與自己的推論。"],
    theory: ["摘要壓縮的是文章，不一定保留你的比較維度；矩陣必須問題導向。", "證據強度取決於方法與情境，不能只用『支持／不支持』二分。", "每一列都保留頁碼、段落或可回跳引用，才能進入查證階段。"],
    exercises: ["設計包含書目、問題、樣本、方法、結果、限制、引用位置的欄位。", "請 AI 先抽取 3 篇，再逐格回原文核對並用顏色標示修正。", "自行抽取第 4 篇，比較人工與 AI 的漏項與誤差。"],
    outcome: "一張能支援比較、查證與寫作的結構化證據表。",
    project: "證據矩陣 v1（至少 8 篇文獻、每列含可回溯位置）",
    rhythm: "90–120 分鐘",
    prerequisites: "概念辭典與來源決策表",
    skills: ["證據抽取", "方法判讀", "資料表設計"],
    media: {
      zh: { videoId: "EHCzch5hPOg", title: "運用 NotebookLM 資料表製作文獻重點摘要", channel: "林大衛", duration: "約 3 分", approximateViews: "約 500 次觀看", selectionReason: "直接示範資料表式整理，與本單元交付物高度吻合；影片很短，欄位設計深度由課內模板補足。", checkedAt },
      en: { videoId: "W3lwOY1PT5o", title: "Smarter Literature Review with NotebookLM Data Tables", channel: "Chuah Kee Man", duration: "約 8 分", approximateViews: "約 4,800 次觀看", selectionReason: "以文獻回顧與 Data Tables 為核心，能快速對照矩陣做法；觀看數較小，但主題精準且可操作。", checkedAt },
    },
  },
  {
    id: 7,
    order: "07",
    phase: 4,
    topic: "CRITICAL SYNTHESIS",
    title: "從多篇摘要走向真正的綜整",
    subtitle: "沿著共識、分歧、條件與證據強度組織，而不是逐篇報告。",
    objectives: ["依主題或論證關係重組文獻，不依作者逐篇排列。", "辨識共識、分歧、邊界條件與證據不足。"],
    theory: ["綜整回答『整體證據意味什麼』；摘要只回答『這篇說什麼』。", "矛盾結果可能來自樣本、測量、情境或研究設計不同。", "先寫證據地圖，再寫段落；避免流暢文字遮蔽來源缺口。"],
    exercises: ["把矩陣中的結果分成 3–5 個主題群。", "每群寫出共識、反例、條件與目前最強的證據。", "請 AI 生成綜整後，用矩陣逐句標記有證據、過度延伸或缺引文。"],
    outcome: "一份以論點而非作者清單組織的綜整骨架。",
    project: "文獻綜整表（主題 × 共識 × 分歧 × 條件 × 證據強度）",
    rhythm: "80–110 分鐘",
    prerequisites: "證據矩陣 v1",
    skills: ["主題綜整", "矛盾解釋", "證據加權"],
    media: {
      zh: { videoId: "Z9Y7SxehRA0", title: "Google NotebookLM：來源、筆記與 Audio Overview", channel: "PAPAYA 電腦教室", duration: "約 12 分", approximateViews: "約 67 萬次觀看", selectionReason: "清楚展示從來源提問、保存筆記到再轉成來源的流程；偏操作教學，綜整判準仍由課內框架負責。", checkedAt },
      en: { videoId: "PVtquY6ziYQ", title: "Fast & Efficient Literature Review with NotebookLM", channel: "Aynur Science", duration: "約 25 分", approximateViews: "約 1.8 萬次觀看", selectionReason: "涵蓋文獻選取、矛盾、缺口、假說與反覆批判，最接近完整綜整工作流；較長，建議依章節觀看。", checkedAt },
    },
  },
  {
    id: 8,
    order: "08",
    phase: 4,
    topic: "CONCEPT MAP",
    title: "用概念圖與時間線看見結構",
    subtitle: "把視覺輸出當成診斷工具，不把漂亮圖形誤認成證據。",
    objectives: ["選擇適合問題的概念圖、因果圖或時間線。", "用視覺結構找出缺少連結、概念跳躍與歷史轉折。"],
    theory: ["圖的節點與連線都應有定義，否則只是視覺化關鍵字。", "相關、時間先後與因果是不同關係，連線標籤不可省略。", "視覺輸出應能回到證據矩陣與來源，而不是成為新的黑箱。"],
    exercises: ["選一種圖形，先手繪 8 個節點與關係動詞。", "比較 AI 產生版本與手繪版，圈出遺漏、錯誤合併與無證據連線。", "修正成可回溯版本：每個核心連線標註來源代碼。"],
    outcome: "一張能暴露理解缺口、而非只用來展示的研究地圖。",
    project: "可追溯概念圖或時間線（至少 8 節點、12 條有標籤連線）",
    rhythm: "60–90 分鐘",
    prerequisites: "完成文獻綜整表",
    skills: ["知識視覺化", "關係建模", "結構診斷"],
    media: {
      zh: { videoId: "qlu1m3R2zBg", title: "NotebookLM 資料表新功能", channel: "Willy 簡報診療室", duration: "Short", approximateViews: "約 1.8 萬次觀看", selectionReason: "用極短案例展示如何把來源轉成結構化表格，適合作為畫圖前的資料整理示範；短片不談限制，必須搭配本單元的可追溯規則。", checkedAt },
      en: { videoId: "iAlBN5bKDd8", title: "NotebookLM for Academics: Full Setup & Use Cases", channel: "Andy Stapleton", duration: "約 15 分", approximateViews: "約 4.9 萬次觀看", selectionReason: "從來源策略、心智圖、方法到表格完整示範學術用例；工具面廣，觀看時聚焦結構化與視覺輸出段落。", checkedAt },
    },
  },
  {
    id: 9,
    order: "09",
    phase: 5,
    topic: "QUESTION LADDER",
    title: "建立會逼近機制的問題階梯",
    subtitle: "從描述、比較、解釋、批判一路問到轉用與預測。",
    objectives: ["辨識低層次摘要問題與高層次推理問題的差異。", "設計附引用、反例與不確定性要求的提示詞。"],
    theory: ["好問題會指定證據範圍、比較維度、輸出格式與不確定性。", "先問描述再問機制，能降低模型在資訊不足時跳到解釋。", "要求『找不到就說找不到』與反例，能讓缺口變得可見。"],
    exercises: ["把一個『幫我摘要』提示改成描述、比較、機制三層問題。", "加入引用位置、反例、信心水準與未知事項要求。", "用同一問題測試兩次，記錄答案穩定處與漂移處。"],
    outcome: "一組能系統探索研究領域、又不掩飾未知的提示模板。",
    project: "研究問題樹（至少 12 問，覆蓋描述、比較、機制、批判、轉用）",
    rhythm: "55–80 分鐘",
    prerequisites: "概念圖與文獻綜整表",
    skills: ["提示設計", "蘇格拉底提問", "不確定性表達"],
    media: {
      zh: { videoId: "ei8xWNsvSY8", title: "NotebookLM：免費與 Pro、來源與提問", channel: "蘋果爹", duration: "約 16 分", approximateViews: "約 21 萬次觀看", selectionReason: "涵蓋來源互動與提問情境，節奏清楚、適合建立操作熟練度；版本資訊可能變動，不把方案比較當課程重點。", checkedAt },
      en: { videoId: "B7sYOUse-DQ", title: "Master NotebookLM for Researchers — Tutorial 2026", channel: "WiseUp Communications", duration: "約 12 分", approximateViews: "約 4.7 萬次觀看", selectionReason: "近期研究者向教學，示範如何問來源與生成研究輸出；提示詞仍需依本單元的引用與反例規則改寫。", checkedAt },
    },
  },
  {
    id: 10,
    order: "10",
    phase: 5,
    topic: "GAP HYPOTHESIS",
    title: "把『沒人做過』改成可檢驗的缺口",
    subtitle: "缺口可能在族群、情境、理論、方法、資料或相互矛盾的結果裡。",
    objectives: ["區分真正研究缺口、檢索不足與單純新奇。", "用反例與替代解釋壓力測試缺口假說。"],
    theory: ["沒有找到不等於不存在；缺口主張必須附搜尋範圍與證據。", "有價值的缺口要能連到理論或實務影響，而非只有『第一次』。", "優先找衝突結果與邊界條件，通常比要求 AI 發明題目更可靠。"],
    exercises: ["請 Notebook 依族群、情境、方法、理論列出候選缺口與引用。", "為每個候選缺口找至少一個反例或相鄰領域研究。", "用『重要性 × 可行性 × 新增知識』評分，保留一個缺口假說。"],
    outcome: "一個附證據、可被反駁、也值得研究的缺口陳述。",
    project: "缺口假說卡（主張、證據、反例、價值、可行性、再搜尋計畫）",
    rhythm: "75–105 分鐘",
    prerequisites: "研究問題樹與可追溯概念圖",
    skills: ["研究缺口", "反例搜尋", "可行性評估"],
    media: {
      zh: { videoId: "CghPfw4lPrk", title: "NotebookLM＋Gemini 完整教學與研究應用", channel: "學長 Ethan", duration: "約 18 分", approximateViews: "約 9.2 萬次觀看", selectionReason: "涵蓋自訂指令、Deep Research、報告與視覺輸出，可用來組合缺口探索流程；功能密度高，需以研究問題而非功能清單觀看。", checkedAt },
      en: { videoId: "ct1TOVa3mHA", title: "NotebookLM Tutorial & Guide 2026", channel: "Robert Leitinger", duration: "約 32 分", approximateViews: "約 3 萬次觀看", selectionReason: "長篇近期教學適合觀察跨功能研究流程；時間較長，建議只看搜尋、比較與研究輸出章節。", checkedAt },
    },
  },
  {
    id: 11,
    order: "11",
    phase: 6,
    topic: "CITATION CHASE",
    title: "逐條回原文，讓引用站得住腳",
    subtitle: "從 AI 回答跳回來源，核對原句、頁碼、語境與支持強度。",
    objectives: ["執行主張—引用對照，辨識不支持、只部分支持與語境錯置。", "為重要數字與直接引述建立第二層查證。"],
    theory: ["有引用標號不代表引用正確；引用只提供查證入口。", "核對時要問：來源真的說了嗎、說的是同一對象嗎、強度一樣嗎？", "二手來源適合導覽；關鍵主張優先引用原始研究或官方資料。"],
    exercises: ["從 AI 答案抽出 8 個可驗證主張，逐一開啟引用位置。", "標記完整支持、部分支持、不支持、找不到與過時五種狀態。", "替所有數字、直接引述與因果語句找原始來源並修正措辭。"],
    outcome: "一張能證明文字確實受到來源支持的引用稽核表。",
    project: "主張—引用稽核表 v1（至少 8 條主張、附修正紀錄）",
    rhythm: "80–120 分鐘",
    prerequisites: "一段 AI 協助生成的研究綜整草稿",
    skills: ["引用查核", "原文追蹤", "主張校準"],
    media: {
      zh: { videoId: "V2dT8TpwDRA", title: "NotebookLM 的正確打開方式", channel: "大學生 BIG Student", duration: "Short", approximateViews: "約 4.3 萬次觀看", selectionReason: "用短案例提醒從來源出發的正確心態，適合查核前快速校準；內容精簡，完整稽核仍以本單元表格進行。", checkedAt },
      en: { videoId: "flLPOPmYj8s", title: "NotebookLM for Academic Research — Professor Workflow", channel: "Prof David Stuckler", duration: "約 7 分", approximateViews: "約 7,300 次觀看", selectionReason: "教授視角直接示範研究提問與 citation verification，與本單元高度對焦；仍需自行核對每個來源全文。", checkedAt },
    },
  },
  {
    id: 12,
    order: "12",
    phase: 6,
    topic: "CLAIM AUDIT",
    title: "對 AI 草稿做紅隊查核",
    subtitle: "追捕幻覺、過度概括、遺漏反例、時效問題與偷換概念。",
    objectives: ["使用系統化檢核表稽核 AI 輔助草稿。", "依證據強度調整語氣，留下可審閱的修訂紀錄。"],
    theory: ["來源導向能降低幻覺，但無法消除錯誤歸因與不當綜整。", "最危險的錯誤常不是虛構，而是把弱證據寫成強結論。", "保留提示、輸出、人工修正與原因，才能交代人類決策。"],
    exercises: ["用反方審稿人提示找出最可能錯的 10 個地方。", "檢查樣本外推、因果措辭、時間有效性、遺漏研究與概念一致性。", "逐項修正並留下『原句—問題—證據—修訂』變更紀錄。"],
    outcome: "一份經過紅隊檢驗、語氣與證據強度相符的研究草稿。",
    project: "AI 輸出稽核紀錄（至少 10 項檢查與修訂理由）",
    rhythm: "75–105 分鐘",
    prerequisites: "完成引用稽核表 v1",
    skills: ["幻覺稽核", "論證校準", "修訂追蹤"],
    media: {
      zh: { videoId: "0zUL7Tf0lU0", title: "NotebookLM 實測：來源導向 AI 筆記", channel: "電腦玩物 Esor", duration: "Short", approximateViews: "約 45 萬次觀看", selectionReason: "以實測角度快速看到工具優勢與使用方式，適合當紅隊前的共同案例；短片不是風險評估，需完成完整檢核表。", checkedAt },
      en: { videoId: "UG0DP6nVnrc", title: "Google NotebookLM Power User Tutorial", channel: "Santrel Media", duration: "約 13 分", approximateViews: "約 75 萬次觀看", selectionReason: "完整操作情境提供足夠素材練習辨認快速輸出中的假設；偏效率導向，正好用本單元稽核框架反向檢查。", checkedAt },
    },
  },
  {
    id: 13,
    order: "13",
    phase: 7,
    topic: "KNOWLEDGE SYSTEM",
    title: "把 Notebook 接回 Zotero 與長期知識庫",
    subtitle: "讓來源、註記、概念與輸出各有歸位，不被單一工具綁住。",
    objectives: ["設計 Notebook、Zotero 與個人筆記系統的角色分工。", "建立命名、標籤、版本與更新節奏。"],
    theory: ["Notebook 適合來源內對話；書目管理器適合引文與附件；永久筆記承接自己的理解。", "以開放格式與穩定識別碼保留出口，避免知識只存在平台介面。", "每次更新記錄新增、移除與改變判斷的來源，知識庫才可維護。"],
    exercises: ["畫出來源取得、閱讀、抽取、綜整、寫作與封存的資料流。", "在 Zotero 建立群組、標籤與附件命名規則，匯入本課來源。", "從 Notebook 匯出 3 則永久筆記，每則連回文獻與研究問題。"],
    outcome: "一個工具可替換、來源不失聯、下次能繼續的研究系統。",
    project: "研究知識庫 SOP（工具角色、命名、標籤、版本、備份、更新週期）",
    rhythm: "70–100 分鐘",
    prerequisites: "來源決策表、證據矩陣與稽核紀錄",
    skills: ["Zotero", "知識管理", "版本設計"],
    media: {
      zh: { videoId: "5dCe9Sv7UNU", title: "Zotero 三分鐘快速上手", channel: "研究生 2.0・學海擺渡人", duration: "約 3 分", approximateViews: "約 3 萬次觀看", selectionReason: "用最低門檻建立書目管理器基本操作，適合立即把 Notebook 來源接回引用系統；進階同步與引用格式需另查 Zotero 文件。", checkedAt },
      en: { videoId: "pH9DpEaNDSc", title: "Zotero Tutorial (2025)", channel: "Psychonotes", duration: "約 7 分", approximateViews: "約 4.5 萬次觀看", selectionReason: "近期且精簡的 Zotero 流程，可補足中文短片沒有示範的完整操作；介面更新時以官方文件為準。", checkedAt },
    },
  },
  {
    id: 14,
    order: "14",
    phase: 7,
    topic: "CAPSTONE",
    title: "完成一份可複核的研究證據卷宗",
    subtitle: "把研究問題、來源、矩陣、綜整、查核與口頭說明組成可交付作品。",
    objectives: ["把 13 個單元產物整合成一致、可閱讀、可追溯的作品。", "用同儕重現與口頭答辯檢查研究流程是否站得住腳。"],
    theory: ["好的交付物同時服務讀者與審查者：結論清楚，證據路徑也清楚。", "可複核不等於完全客觀，而是讓範圍、選擇、限制與修訂可被看見。", "最後交付時揭露 AI 的角色，將未解問題轉成下一輪研究待辦。"],
    exercises: ["整併研究問題卡、檢索日誌、來源表、矩陣、地圖與稽核紀錄。", "撰寫 1,500–2,000 字研究簡報稿，所有重要主張連到來源。", "請同儕隨機抽 3 條主張重現查證，依回饋修訂並錄製 5 分鐘說明。"],
    outcome: "一份讀者能理解、審查者能追溯、未來自己能續作的研究作品。",
    project: "研究證據卷宗 v1（研究簡報＋證據矩陣＋概念圖＋查核表＋AI 揭露）",
    rhythm: "3–5 小時",
    prerequisites: "完成前 13 單元與至少 12 個合格來源",
    skills: ["研究寫作", "同儕審查", "知識轉譯"],
    media: {
      zh: { videoId: "jkerZaQU_wA", title: "用 NotebookLM 把英文論文變成中文 Podcast", channel: "AI 工具研究室", duration: "Short", approximateViews: "約 2,300 次觀看", selectionReason: "示範把研究內容轉譯成口語輸出的可能性，適合結業說明任務；短片只提供靈感，作品仍須附來源與揭露。", checkedAt },
      en: { videoId: "uSVBfyHBiDU", title: "How to Use Google NotebookLM — Full Tutorial", channel: "Kevin Stratvert", duration: "約 8 分", approximateViews: "約 22 萬次觀看", selectionReason: "近期、完整又精簡地串起來源、對話、筆記、心智圖、音訊與分享，適合作為結業前總複習；研究品質仍由本課流程把關。", checkedAt },
    },
  },
];

export const capstoneChecklist = [
  "研究問題卡與 AI 使用契約",
  "可重跑的檢索日誌與來源決策表",
  "至少 12 篇來源的證據矩陣",
  "可追溯的文獻地圖或時間線",
  "1,500–2,000 字證據導向研究簡報",
  "主張—引用稽核表與 AI 輸出修訂紀錄",
  "5 分鐘口頭轉譯與 AI 使用揭露",
];

export const sourceNotes = [
  {
    label: "官方功能基準",
    title: "Google Gemini Notebook 說明：新增或探索來源",
    body: "用於核對來源類型、Fast Research、Deep Research 與匯入限制；功能會持續更新。",
    href: "https://support.google.com/notebooklm/answer/16215270?hl=zh-Hant",
  },
  {
    label: "引用與查證",
    title: "Google：NotebookLM 的來源引用與事實查核",
    body: "來源導向可降低錯誤，但重要內容仍應回到原始材料查證。",
    href: "https://blog.google/innovation-and-ai/technology/ai/notebooklm-google-ai/",
  },
  {
    label: "名稱更新",
    title: "Google：NotebookLM 更名為 Gemini Notebook",
    body: "課程保留『原 NotebookLM』方便搜尋舊教材；介面名稱以官方最新版本為準。",
    href: "https://blog.google/intl/de-de/produkte/suchen-entdecken/notebooklm-wird-gemini-notebook/",
  },
];
