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

export const phases = [
  {
    id: 1,
    number: "01",
    title: "把決策寫成模型",
    short: "FORMULATE",
    weeks: "第 1–3 週",
    color: "#f05a3c",
    description: "從管理情境辨認決策變數、目標與限制，建立可解、可檢查的線性規劃模型。",
    outcome: "完成一份生產組合模型與圖解驗證。",
  },
  {
    id: 2,
    number: "02",
    title: "理解最佳化引擎",
    short: "SOLVE",
    weeks: "第 4–6 週",
    color: "#1757a6",
    description: "用幾何、表格與矩陣三種視角掌握單體法，能判讀樞紐、退化與終止狀態。",
    outcome: "手算一輪單體法，並以求解器重現。",
  },
  {
    id: 3,
    number: "03",
    title: "解讀價格與風險",
    short: "INTERPRET",
    weeks: "第 7–10 週",
    color: "#6e4ab1",
    description: "從對偶、影子價格與敏感度區間，回答「多一單位資源值多少」以及解能否承受變動。",
    outcome: "完成最佳解管理摘要與情境壓力測試。",
  },
  {
    id: 4,
    number: "04",
    title: "讓結構替你加速",
    short: "SPECIALIZE",
    weeks: "第 11–13 週",
    color: "#147c73",
    description: "辨認運輸、指派與網路模型的特殊結構，選擇更快且更容易解釋的方法。",
    outcome: "交付物流配置與網路容量方案。",
  },
  {
    id: 5,
    number: "05",
    title: "排程與策略決策",
    short: "DECIDE",
    weeks: "第 14–15 週",
    color: "#c48613",
    description: "以 PERT/CPM 管理專案時間，再以賽局矩陣分析競爭者回應與混合策略。",
    outcome: "完成一份可稽核的最佳化決策提案。",
  },
];

const checkedAt = "2026-08-02";
const nycuViews = "NYCU OCW 原課程；頁面未顯示觀看數";

export const units: CourseUnit[] = [
  {
    id: 1,
    phase: 1,
    order: "01",
    topic: "OR 與模型化",
    title: "先問對決策：從情境到線性規劃",
    level: "入門",
    estimatedTime: "90 分鐘",
    prerequisites: ["基本代數", "一個想改善的營運情境"],
    objectives: ["把管理問題拆成決策變數、目標函數與限制式。", "用單位與語意檢查模型是否忠實描述情境。"],
    theory: ["作業研究不是尋找神奇公式，而是把可選行動、有限資源與偏好寫成可比較的模型。", "線性規劃由連續決策變數、線性目標與線性限制組成；每一項都應能連回真實語意。", "模型永遠是簡化。遺漏限制、錯用單位或把結果當成事實，通常比演算法算錯更危險。"],
    exercises: ["把一個兩產品生產問題寫出變數、目標與三條限制，並標註單位。", "交換兩項資源上限，預測最佳組合如何改變，再用圖解檢查。", "選一個校園或工作情境，交付一頁模型卡：決策、目標、限制、資料來源與未納入因素。"],
    outcome: "能把模糊的營運問題轉成一個可被求解與質疑的線性模型。",
    project: "作品里程碑 01｜問題與模型卡",
    skills: ["問題定義", "LP 建模", "單位檢查"],
    rhythm: "先讀觀念 15 分 → 看中文課堂 → 寫一版模型 → 用英文教材補強術語",
    media: {
      zh: { videoId: "ptrOxKIzvno", title: "作業研究（一）第一週：導論、模型與圖解法", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "直接來自指定參考課程，從 OR/MS 目的進入線性規劃與圖解，最能保留原課的管理視角；觀看數未在課程頁顯示，因此以官方課程脈絡而非人氣作為選擇依據。" },
      en: { videoId: "a2QgdDk4Xjw", title: "Introduction to Linear Programming Formulations", channel: "NPTEL / IIT Madras", duration: "51:48", approximateViews: "約 114 萬次觀看", checkedAt, selectionReason: "以完整產品組合案例示範如何建模，且在官方 NPTEL 系列中具有強烈長期觀看訊號；適合補足英文符號與 formulation 語言。" },
    },
  },
  {
    id: 2, phase: 1, order: "02", topic: "假設與可行性", title: "線性不是理所當然：檢查模型假設",
    level: "入門", estimatedTime: "85 分鐘", prerequisites: ["單元 01"],
    objectives: ["逐項判斷比例性、可加性、可分割性與確定性是否合理。", "診斷不可行、無界與多重最佳解代表的管理意義。"],
    theory: ["比例性假設每單位投入與產出固定；可加性假設活動互不產生額外交互作用。", "可行域是所有同時滿足限制的決策集合，最佳化只能在這個集合內比較。", "不可行可能代表承諾互相衝突；無界常是遺漏限制；多重最佳解則提供決策彈性。"],
    exercises: ["為單元 01 的模型逐項填寫四個線性假設檢查表。", "各畫一個不可行、無界與多重最佳解的二變數例子並解釋。", "找一個數量折扣或規模經濟案例，指出線性模型會在哪裡失真並提出分段近似。"],
    outcome: "能在求解前辨認模型是否適用，並把異常解轉成可追查的問題。", project: "模型稽核表｜假設、邊界與失敗模式", skills: ["模型假設", "可行域", "失敗診斷"], rhythm: "看例題 → 畫三種可行域 → 回頭稽核自己的模型",
    media: {
      zh: { videoId: "yXwbFYWN738", title: "第二週：線性規劃模型、假設與例題", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "指定原課的第二週專注模型假設與延伸案例，能把第一週的形式轉成建模判斷；以課程連續性作為主要證據。" },
      en: { videoId: "pzbSURDWluA", title: "Linear Programming Formulations (Continued)", channel: "NPTEL / IIT Madras", duration: "52:08", approximateViews: "約 23 萬次觀看", checkedAt, selectionReason: "延續官方 NPTEL 建模系列，透過多個限制型態練習 formulation；觀看訊號穩定，適合作為假設檢查的第二視角。" },
    },
  },
  {
    id: 3, phase: 1, order: "03", topic: "圖解與幾何", title: "看見可行域：用圖形驗證最佳解",
    level: "入門", estimatedTime: "90 分鐘", prerequisites: ["單元 01–02", "座標與直線"],
    objectives: ["畫出二變數可行域並用等值線找到候選最佳頂點。", "以幾何直觀解釋為何線性規劃的最佳解會出現在極點。"],
    theory: ["每條線性限制對應一個半平面，交集形成凸多面體可行域。", "線性目標的等值線平移到最後接觸可行域的位置，即得到最佳值。", "圖解法不能直接處理高維問題，但它是理解單體法、影子價格與敏感度的核心心智模型。"],
    exercises: ["手繪二變數模型，列出所有頂點並代入目標函數。", "改變目標斜率，找出多重最佳解出現的臨界範圍。", "用試算表或 Python 畫出模型，附上手算與工具結果的誤差檢查。"],
    outcome: "能用幾何圖驗證模型與解，並預測係數變動對最佳點的影響。", project: "圖解驗證頁｜可行域、等值線與頂點表", skills: ["圖解法", "凸集合", "結果驗證"], rhythm: "手畫 20 分 → 看示範 → 用工具重畫 → 口頭解釋 3 分鐘",
    media: {
      zh: { videoId: "RTe7_OO17ww", title: "第三週：線性代數與單體法", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "原課從幾何銜接線性代數與單體法，正好完成從圖形直觀到一般演算法的橋接。" },
      en: { videoId: "XEA1pOtyrfo", title: "Linear Programming Solutions — Graphical Methods", channel: "NPTEL / IIT Madras", duration: "52:11", approximateViews: "約 30 萬次觀看", checkedAt, selectionReason: "完整推導圖解解法並涵蓋特殊解型，官方系列觀看訊號強；適合跟著畫出每一步。" },
    },
  },
  {
    id: 4, phase: 2, order: "04", topic: "標準形與基底", title: "把模型準備好：標準形、鬆弛變數與基底",
    level: "中階", estimatedTime: "100 分鐘", prerequisites: ["單元 03", "基本矩陣運算"],
    objectives: ["把不同方向的限制轉成標準形並辨認初始基底。", "說明基底可行解與幾何頂點之間的對應。"],
    theory: ["鬆弛變數把不等式變成等式，也量化未使用資源。", "一個基底選出足以解聯立方程的欄；基底可行解則再要求所有變數非負。", "Big-M 與兩階段法用人工變數尋找起始點，但錯誤的尺度會造成數值與解讀問題。"],
    exercises: ["將三種方向的限制改寫成標準形，標出鬆弛、剩餘與人工變數。", "比較 Big-M 與兩階段法在同一小題的 Phase I 目標。", "從一個 2×4 矩陣列出所有可能基底，判斷哪些是可行基底。"],
    outcome: "能把一般 LP 轉成單體法可使用的形式，並解釋基底的意義。", project: "標準形轉換與基底檢查表", skills: ["標準形", "人工變數", "基底"], rhythm: "轉換規則 15 分 → 手算 35 分 → 看課堂 → 自我測驗",
    media: {
      zh: { videoId: "8DdxfxmEqpI", title: "第四週：其他形式、後最佳化與單體法理論", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "原課將非標準形式、後最佳化與單體法理論放在同一週，能直接看見轉換不是機械步驟，而是後續解讀的基礎。" },
      en: { videoId: "qxls3cYg8to", title: "Linear Programming Solutions — Simplex Algorithm", channel: "NPTEL / IIT Madras", duration: "51:30", approximateViews: "約 59 萬次觀看", checkedAt, selectionReason: "逐步建立 tableau 與基底更新，且是系列中高觀看單元；適合第一次完整走過演算法。" },
    },
  },
  {
    id: 5, phase: 2, order: "05", topic: "單體表運算", title: "每一步都有理由：樞紐選擇與終止判讀",
    level: "中階", estimatedTime: "110 分鐘", prerequisites: ["單元 04"],
    objectives: ["依 reduced cost 與比值檢定選出進入、離開變數。", "判讀最佳、退化、無界與循環風險。"],
    theory: ["進入變數代表最有潛力改善目標的非基底方向，離開變數由可行性界線決定。", "樞紐列運算只是把同一組方程換一個基底表示；核心是沿相鄰極點前進。", "退化會讓目標不改善，Bland 規則等策略可避免循環；無界則表示改善方向沒有資源阻擋。"],
    exercises: ["完成一題最大化問題的兩次樞紐並圈出每次決策依據。", "修改右端值製造退化，記錄目標值與基底是否改變。", "寫一張終止狀態診斷卡，包含最佳、無界、不可行與多重最佳解的 tableau 訊號。"],
    outcome: "能手算小型單體表，並解釋每一次樞紐與終止狀態。", project: "單體法計算紀錄與診斷卡", skills: ["單體表", "比值檢定", "異常解"], rhythm: "先遮答案手算 → 對照影片 → 以另一題做 20 分鐘限時演練",
    media: {
      zh: { videoId: "WMqHCKNgom8", title: "第五週：單體法理論", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "原課第五週聚焦單體法的理論與運作，適合在已會轉換後深入每一步的選擇理由。" },
      en: { videoId: "wdGiekwXM2w", title: "Simplex Algorithm — Minimization Problems", channel: "NPTEL / IIT Madras", duration: "52:11", approximateViews: "約 40 萬次觀看", checkedAt, selectionReason: "用最小化問題擴大單體法的適用型態，社群訊號強；與中文理論課形成計算互補。" },
    },
  },
  {
    id: 6, phase: 2, order: "06", topic: "修正單體法", title: "不必搬整張表：用矩陣追蹤基底",
    level: "中階", estimatedTime: "100 分鐘", prerequisites: ["單元 05", "矩陣反矩陣"],
    objectives: ["用基底反矩陣計算基本解、reduced cost 與方向向量。", "比較傳統 tableau 與修正單體法的儲存與計算差異。"],
    theory: ["修正單體法只維護基底資訊，以 B⁻¹b、cBᵀB⁻¹ 與 reduced cost 重建需要的量。", "稀疏大型模型中，多數係數為零；避免更新完整 tableau 能大幅節省記憶體。", "實務求解器會處理數值精度、縮放與基底重因式分解；手算重點是掌握資訊流。"],
    exercises: ["對一個 2×4 模型計算 B⁻¹b 與所有 reduced cost。", "用 tableau 與修正單體法各做一次迭代，比較需要更新的數字數量。", "建立一張演算法流程圖，標示求解器在哪些步驟需要數值穩定策略。"],
    outcome: "能用矩陣形式重建單體法關鍵量，並說明大型求解器為何採用它。", project: "修正單體法工作紙與計算量比較", skills: ["修正單體法", "基底反矩陣", "稀疏計算"], rhythm: "複習矩陣 → 跟算一次 → 不看影片重做 → 寫 150 字比較",
    media: {
      zh: { videoId: "Oz2PTxr8n88", title: "第七週：修正單體法", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "這是指定課程中專門處理 revised simplex 的單元，能延續王老師前幾週的符號與基底脈絡。" },
      en: { videoId: "cCBFC8LmNDE", title: "Simplex Algorithm — Initialization and Iteration", channel: "NPTEL / IIT Madras", duration: "52:24", approximateViews: "約 14 萬次觀看", checkedAt, selectionReason: "以 initialization 與 iteration 拆解演算法資料流，能補足修正單體法前的程序基礎；觀看訊號在完整課程中穩定。" },
    },
  },
  {
    id: 7, phase: 3, order: "07", topic: "對偶直觀", title: "資源有價格：從原問題寫出對偶",
    level: "中階", estimatedTime: "95 分鐘", prerequisites: ["單元 04–06"],
    objectives: ["依原問題的變數與限制型態正確建立對偶。", "用資源定價解釋對偶變數與弱對偶。"],
    theory: ["原問題配置活動，對偶問題替有限資源定價；兩者從不同方向界定同一個最佳值。", "弱對偶保證任何對偶可行值都是原問題的界；強對偶則在適當條件下讓兩個最佳值相等。", "對偶方向與符號取決於限制與變數型態，背模板不如逐項追蹤經濟語意。"],
    exercises: ["為三種混合限制的原問題寫出對偶，逐列對照。", "用任意一組原、對偶可行解驗證弱對偶不等式。", "把對偶變數解釋成資源報價，寫出哪一項值得增購與條件。"],
    outcome: "能正確建立對偶，並以管理語言說明資源價值。", project: "原—對偶對照表與資源報價備忘錄", skills: ["對偶建模", "弱對偶", "資源定價"], rhythm: "先用語意配對 → 寫符號 → 看推導 → 以一頁 memo 解釋",
    media: {
      zh: { videoId: "6U7P8TxFsEA", title: "第八週：基本洞見與對偶理論", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "原課以 Fundamental Insight 進入 Duality，保留了從基底到資源價格的推導鏈，而不只是寫對偶規則。" },
      en: { videoId: "gmDwUCvOJQ8", title: "Introduction to Duality", channel: "NPTEL / IIT Madras", duration: "51:03", approximateViews: "約 19 萬次觀看", checkedAt, selectionReason: "完整展示 primal 與 dual 的建構方式，官方系列中有良好觀看訊號；適合用英文術語重新檢查符號規則。" },
    },
  },
  {
    id: 8, phase: 3, order: "08", topic: "對偶定理", title: "兩邊同時驗證：強對偶與互補鬆弛",
    level: "中階", estimatedTime: "100 分鐘", prerequisites: ["單元 07"],
    objectives: ["用強對偶與互補鬆弛驗證候選最佳解。", "由一側最佳解推回另一側變數與緊束限制。"],
    theory: ["強對偶讓原問題與對偶問題在最優時共享同一個目標值。", "互補鬆弛指出：有剩餘的限制，其對偶價格必為零；有正活動量的變數，其對偶限制必緊束。", "對偶間隙是最佳性證明，也是許多現代演算法的停止準則。"],
    exercises: ["給定原問題解，利用互補鬆弛推導對偶候選解。", "建立一組不滿足互補鬆弛的可行解，指出它為何不是最佳。", "為自己的模型輸出 primal、dual、slack 與 dual gap 四欄驗證表。"],
    outcome: "能不用重跑全部計算，利用對偶關係檢查最佳性。", project: "最佳性證明頁｜dual gap 與互補鬆弛", skills: ["強對偶", "互補鬆弛", "最佳性證明"], rhythm: "定理圖解 → 推一題 → 交換答案互相驗證",
    media: {
      zh: { videoId: "YWw6bE40wmw", title: "第九週：對偶理論", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "原課連續第二週推進對偶理論，提供足夠篇幅處理定理與解之間的關係。" },
      en: { videoId: "ziHfSkOhAmg", title: "Primal Dual Relationships, Duality Theorems", channel: "NPTEL / IIT Madras", duration: "51:37", approximateViews: "約 13 萬次觀看", checkedAt, selectionReason: "直接涵蓋 primal-dual relationships 與定理，內容與本單元一一對應，且為官方完整課程的一部分。" },
    },
  },
  {
    id: 9, phase: 3, order: "09", topic: "敏感度分析", title: "最佳解會撐多久：影子價格與允許範圍",
    level: "中階", estimatedTime: "105 分鐘", prerequisites: ["單元 07–08"],
    objectives: ["由最佳單體表讀取影子價格、reduced cost 與允許增減範圍。", "區分基底不變的局部結論與需要重新求解的情境。"],
    theory: ["影子價格是在基底不變範圍內，右端資源增加一單位對最佳目標的邊際影響。", "reduced cost 說明一個目前為零的活動，要改善多少成本或利潤才可能進入基底。", "敏感度報告是局部資訊；同時大幅改動、多係數變動與離散決策都可能讓簡單推論失效。"],
    exercises: ["從給定最終 tableau 標出影子價格與 reduced cost。", "選兩個右端值做範圍內與範圍外變動，比較線性估計與重求解。", "把求解器敏感度報告翻成三條管理建議，附上適用條件。"],
    outcome: "能解讀敏感度報告，並清楚說明哪些結論只在局部成立。", project: "管理者敏感度摘要｜價格、範圍、例外", skills: ["影子價格", "reduced cost", "允許範圍"], rhythm: "讀表 20 分 → 手算一個變動 → 求解器驗證 → 寫建議",
    media: {
      zh: { videoId: "YDqpm52Ti3E", title: "第十週：敏感度分析", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "指定原課的敏感度核心課，沿用前面對偶與基底記號，能自然推導影子價格與範圍。" },
      en: { videoId: "wxpMKReH8lc", title: "Simplex Algorithm in Matrix Form — Sensitivity Analysis", channel: "NPTEL / IIT Madras", duration: "1:01:36", approximateViews: "約 12 萬次觀看", checkedAt, selectionReason: "把矩陣單體法與敏感度放在同一講，能解釋報告數字如何從基底產生，而非只教按求解器。" },
    },
  },
  {
    id: 10, phase: 3, order: "10", topic: "情境與壓力測試", title: "不要只報一個答案：把敏感度變成決策",
    level: "中階", estimatedTime: "100 分鐘", prerequisites: ["單元 09"],
    objectives: ["設計一組有目的的資料情境並比較基底與 KPI 變化。", "用圖表呈現臨界值、風險與建議行動。"],
    theory: ["後最佳化分析關心資料改變後能否沿用既有基底，以及何時必須重新最佳化。", "情境不是任意調參；每個情境應連到一個商業假設、風險或可採取的行動。", "單點最優常脆弱。好的決策建議會同時呈現目標值、服務水準、資源使用與臨界點。"],
    exercises: ["為一個模型建立基準、需求高、成本高三個情境。", "畫出一項關鍵係數變動時的目標值折線，標記基底改變點。", "交付一頁壓力測試報告：建議、觸發條件、備案與不可量化風險。"],
    outcome: "能把敏感度數字組織成決策情境與可執行備案。", project: "壓力測試儀表頁與決策備忘錄", skills: ["情境分析", "臨界值", "決策溝通"], rhythm: "先定義問題 → 批次求解 → 畫臨界圖 → 寫 200 字建議",
    media: {
      zh: { videoId: "V27PlTwpxL0", title: "第十一週：敏感度分析應用", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "原課把 Applying Sensitivity Analysis 獨立成一週，正好從讀表跨到決策應用。" },
      en: { videoId: "sNjyHyTLc44", title: "Simplex Algorithm — Termination", channel: "NPTEL / IIT Madras", duration: "51:37", approximateViews: "約 10 萬次觀看", checkedAt, selectionReason: "以終止與特殊狀態補強壓力測試時的結果判讀；雖非情境工具教學，但能防止把異常狀態誤當普通最優解。" },
    },
  },
  {
    id: 11, phase: 4, order: "11", topic: "對偶單體與參數化", title: "限制改變後：對偶單體法與參數規劃",
    level: "進階", estimatedTime: "105 分鐘", prerequisites: ["單元 06–10"],
    objectives: ["判斷何時原始不可行但對偶可行，並選用對偶單體法。", "追蹤一個參數連續變化時的基底區段。"],
    theory: ["新增限制或改變右端值時，原基底可能失去可行性但仍保持對偶可行，對偶單體法可快速修復。", "參數規劃把係數寫成參數的線性函數，找出每個基底有效的區間與轉折。", "暖啟動是實務最佳化的重要技巧：沿用好基底通常比每次從零開始更快。"],
    exercises: ["對一張最終 tableau 修改右端值，執行一次對偶單體樞紐。", "讓一項資源上限由 0 到 100 變動，列出基底切換區間。", "設計一個每週重跑模型的暖啟動流程，說明要保存哪些資訊與何時放棄舊基底。"],
    outcome: "能針對模型變更選擇對偶單體法，並描述參數變化的分段結構。", project: "參數路徑圖與暖啟動策略", skills: ["對偶單體法", "參數規劃", "暖啟動"], rhythm: "先判斷可行性 → 手做一個 pivot → 畫參數區間 → 寫運算策略",
    media: {
      zh: { videoId: "H6T1SYDigYw", title: "第十二週：對偶單體、參數規劃與運輸問題", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "指定原課唯一直接涵蓋 dual simplex 與 parametric programming 的課堂，也自然銜接下一階段的運輸結構。" },
      en: { videoId: "_-Mlp3w1Brc", title: "Sensitivity Analysis and Transportation Problem Introduction", channel: "NPTEL / IIT Madras", duration: "1:01:46", approximateViews: "約 14 萬次觀看", checkedAt, selectionReason: "從敏感度過渡到運輸模型，與本單元的課程位置一致；官方系列具穩定觀看與完整推導。" },
    },
  },
  {
    id: 12, phase: 4, order: "12", topic: "運輸與指派", title: "配送與配對：利用特殊結構更快求解",
    level: "中階", estimatedTime: "110 分鐘", prerequisites: ["單元 01–06"],
    objectives: ["建立平衡或不平衡的運輸模型，並產生可行初始解。", "把一對一配對問題轉成指派模型並套用匈牙利法。"],
    theory: ["運輸模型用供給、需求與單位運費形成二分網路；dummy 節點可平衡總量但必須有真實語意。", "西北角、最小成本與 Vogel 法產生不同品質的初始解，再以改善檢定走向最優。", "指派問題是供給與需求都為一的特殊運輸模型，匈牙利法利用矩陣結構有效求解。"],
    exercises: ["用西北角與最小成本法各求一個初始配送方案並比較成本。", "加入一個 dummy 需求點處理供給過剩，說明其成本設定。", "以 5×5 成本矩陣完成匈牙利法，交付配對表與總成本驗證。"],
    outcome: "能辨認運輸與指派結構，建立模型並產生可解釋的配置方案。", project: "物流配置工作簿｜運輸表、指派表、成本比較", skills: ["運輸模型", "匈牙利法", "物流配置"], rhythm: "建表 → 算初始解 → 看改善法 → 用求解器交叉驗證",
    media: {
      zh: { videoId: "yK7HH2QoazI", title: "第十四週：運輸問題與指派問題", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "指定原課把 transportation 與 assignment 放在同一週，最適合建立兩者的結構關係。" },
      en: { videoId: "BUGIhEecipE", title: "Assignment Problem — Hungarian Algorithm", channel: "NPTEL / IIT Madras", duration: "1:00:16", approximateViews: "約 43 萬次觀看", checkedAt, selectionReason: "完整演示匈牙利法，且在官方 NPTEL 系列具有強觀看訊號；與中文課的運輸脈絡形成方法補充。" },
    },
  },
  {
    id: 13, phase: 4, order: "13", topic: "網路最佳化", title: "把路與容量畫出來：最短路、生成樹與最大流",
    level: "中階", estimatedTime: "110 分鐘", prerequisites: ["單元 12", "基本圖論符號"],
    objectives: ["依決策目標選擇最短路、最小生成樹或最大流模型。", "手算小型網路並用 flow conservation 驗證結果。"],
    theory: ["最短路最小化一條起終點路徑的總權重；最小生成樹連接所有節點而不形成環。", "最大流在容量限制下把最多流量送到終點，最大流等於最小割揭示瓶頸。", "三種問題都畫成網路，但目標、守恆條件與決策變數不同；誤選模型會得到看似合理的錯答案。"],
    exercises: ["在同一張 8 節點圖上分別算最短路與最小生成樹並比較邊集合。", "用 Ford–Fulkerson 找最大流，再以一個割集合證明最優。", "把校園接駁或資料網路畫成圖，定義節點、邊、權重、容量與要解的模型。"],
    outcome: "能辨認常見網路模型並用路徑、樹或割集證明結果。", project: "網路決策圖｜模型選擇、計算與瓶頸解釋", skills: ["最短路", "最小生成樹", "最大流"], rhythm: "先畫圖 → 手跑兩種演算法 → 用程式驗證 → 解釋瓶頸",
    media: {
      zh: { videoId: "bZFMMPJIzms", title: "第十五週：網路最佳化模型", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "指定原課在同一課堂比較 shortest path、minimum spanning tree 與 maximum flow，能建立模型選擇地圖。" },
      en: { videoId: "bZkzH5x0SKU", title: "Dijkstra’s Shortest Path Algorithm Explained", channel: "FelixTechTips", duration: "8:24", approximateViews: "約 109 萬次觀看", checkedAt, selectionReason: "用一個清晰圖例在短時間走完整個 Dijkstra 過程，具有強觀看訊號；作為英文補充，降低長課堂後的認知負擔。" },
    },
  },
  {
    id: 14, phase: 5, order: "14", topic: "PERT / CPM", title: "找出真正會拖延的工作：關鍵路徑與工期風險",
    level: "中階", estimatedTime: "100 分鐘", prerequisites: ["單元 13"],
    objectives: ["用前推、後推計算最早最晚時間、浮時與關鍵路徑。", "比較 CPM 的確定工期與 PERT 的三點估計及完工機率。"],
    theory: ["CPM 以活動相依關係建立網路，總浮時為零的活動形成關鍵路徑並決定專案工期。", "PERT 用樂觀、最可能與悲觀時間估計期望與變異，將工期不確定性顯式化。", "關鍵路徑會隨工期、資源或趕工決策改變；只盯著原始紅線會錯過新瓶頸。"],
    exercises: ["對 10 項活動做前推與後推，列出 ES、EF、LS、LF 與 float。", "加入三點估計，計算 90% 信心水準下的完工日期。", "選一個真實小專案，提出一個趕工方案並比較增加成本、縮短天數與新關鍵路徑。"],
    outcome: "能以網路圖找出專案瓶頸，並用不確定工期支持承諾日期。", project: "專案控制板｜網路圖、關鍵路徑與趕工方案", skills: ["CPM", "PERT", "專案風險"], rhythm: "畫 AON 圖 → 前後推 → 加入三點估計 → 做一次趕工情境",
    media: {
      zh: { videoId: "ipK_5LxjlSw", title: "第十六週：PERT / CPM 與賽局導論", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "指定原課直接從網路模型延伸到 PERT/CPM，保留了課綱的原始銜接。" },
      en: { videoId: "-TDh-5n90vk", title: "Project Scheduling — PERT/CPM: Finding Critical Path", channel: "Joshua Emmanuel", duration: "6:57", approximateViews: "約 210 萬次觀看", checkedAt, selectionReason: "短片完整示範前推、後推、浮時與關鍵路徑，觀看訊號極強；很適合在長篇中文課後快速重做一次。" },
    },
  },
  {
    id: 15, phase: 5, order: "15", topic: "賽局與整合專題", title: "當別人也在最佳化：零和賽局與混合策略",
    level: "進階", estimatedTime: "120 分鐘", prerequisites: ["單元 07–08", "單元 14"],
    objectives: ["以優勢策略、鞍點與 minimax 判讀二人零和賽局。", "把沒有純策略均衡的 2×2 賽局轉成線性規劃並求混合策略。"],
    theory: ["最佳化假設環境固定；賽局理論則把對手的策略反應納入決策。", "零和賽局中，列玩家最大化最低報酬，欄玩家最小化最高損失；鞍點存在時可用純策略。", "混合策略用機率讓對手在可利用的行動間無差異，與線性規劃對偶有直接關係。"],
    exercises: ["對三個 payoff matrix 消去被支配策略並找鞍點。", "求一個 2×2 無鞍點賽局的雙方混合機率與賽局值。", "完成整合專題：選一個營運決策，建模、求解、敏感度、驗證並提出含限制的建議。"],
    outcome: "能分析競爭性決策，並交付一份從模型到建議都可追溯的作業研究提案。", project: "結業專題｜最佳化模型、驗證、敏感度與決策簡報", skills: ["零和賽局", "混合策略", "整合建模"], rhythm: "先手算 payoff → 用 LP 驗證 → 完成專題 → 以 5 分鐘簡報接受質疑",
    media: {
      zh: { videoId: "K93epwBp_ZE", title: "第十七週：賽局理論", channel: "NYCU OCW｜王晉元老師", duration: "完整課堂", approximateViews: nycuViews, checkedAt, selectionReason: "指定原課以完整一週收束 Game Theory，能直接把 minimax 與前面學過的線性規劃對偶連起來。" },
      en: { videoId: "h0bdo06qNVw", title: "Game Theory", channel: "NPTEL / IIT Madras", duration: "58:00", approximateViews: "約 33 萬次觀看", checkedAt, selectionReason: "官方 NPTEL 長講涵蓋 payoff、純策略與混合策略，觀看訊號強；足以支撐結業前的完整複習與推導。" },
    },
  },
];

export const capstoneChecklist = [
  "決策問題、利害關係人與成功指標",
  "變數、目標、限制、假設與資料字典",
  "至少一個可重現的求解模型與結果驗證",
  "對偶或敏感度解讀與兩個壓力情境",
  "建議方案、觸發條件、風險與備案",
  "5 分鐘決策簡報與一頁技術附錄",
];
