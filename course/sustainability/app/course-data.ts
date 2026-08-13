export const course = {
  checkedAt: "2026-08-04",
  phases: [
    {
      id: 1,
      number: "01",
      title: "看懂全局",
      short: "從名詞到證據",
      weeks: "第 1–2 週",
      color: "#13a36f",
      description: "先建立永續、ESG 與 SDGs 的共同語言，再練習把一個大目標拆成可觀察的指標。",
      outcome: "一張 SDGs 議題地圖與資料判讀卡"
    },
    {
      id: 2,
      number: "02",
      title: "比較國家",
      short: "政策不是排名",
      weeks: "第 3 週",
      color: "#0879d1",
      description: "閱讀國家與城市自願檢視報告，分辨目標、政策工具、預算、利害關係人與成效。",
      outcome: "臺灣 × 兩國政策比較矩陣"
    },
    {
      id: 3,
      number: "03",
      title: "拆解企業",
      short: "承諾要能被查核",
      weeks: "第 4–6 週",
      color: "#f0a421",
      description: "從重大性、價值鏈、循環經濟、碳管理與公正轉型，檢查企業如何把永續放進決策。",
      outcome: "企業永續查核簡報與風險清單"
    },
    {
      id: 4,
      number: "04",
      title: "變成職涯證據",
      short: "從關心到能做",
      weeks: "第 7–8 週",
      color: "#de5b43",
      description: "在校園做一個小型永續專案，再把研究、協作與成效轉成履歷、作品集與面試故事。",
      outcome: "永續提案、履歷 bullet 與 90 秒面試稿"
    }
  ],
  units: [
    {
      id: 1,
      phase: 1,
      order: "01",
      topic: "永續發展與 SDGs",
      title: "永續不是只談環保：讀懂 17 項目標的共同語言",
      level: "入門",
      estimatedTime: "70 分鐘",
      prerequisites: ["不需先備知識"],
      objectives: [
        "用經濟、社會、環境與治理四個面向解釋永續發展，並區分 SDGs、ESG、CSR 與淨零。",
        "把一則校園或新聞議題對應到至少三項 SDGs，說明目標之間的互補與衝突。"
      ],
      theory: [
        "SDGs 是 2015 年通過、以 2030 年為期限的全球行動框架，包含 17 項目標、169 項細項目標；它不是企業認證，也不是一份勾選清單。",
        "永續問題彼此相連：改善能源可能帶動健康與就業，也可能造成土地、礦產或分配衝突。分析時要同時看正向效益與外部成本。",
        "ESG 常用於組織管理、風險與揭露；SDGs 描述社會想抵達的結果。真正的應用要從『貼圖示』走向『說清楚影響、對象與證據』。"
      ],
      exercises: [
        "選一則本週新聞，寫出它涉及的 3 項 SDGs、1 個受益群體與 1 個可能被忽略的群體。",
        "為『校園外送便利』畫出經濟、社會、環境三欄利弊表，每欄至少提出兩項證據需求。",
        "錄製 60 秒說明：為什麼 SDGs 不是 17 個互不相干的專案？附上你的系統關係圖。"
      ],
      outcome: "能用生活案例正確解釋永續與 SDGs，不把 ESG、減碳或公益活動混為一談。",
      project: "作品集 01｜一頁式 SDGs 議題地圖",
      skills: ["SDGs literacy", "系統觀", "議題界定"],
      rhythm: "先讀 15 分鐘 → 看影片 20 分鐘 → 畫圖 20 分鐘 → 口頭解釋 15 分鐘",
      source: { label: "聯合國 2030 Agenda", url: "https://sdgs.un.org/2030agenda" },
      media: {
        zh: { videoId: "2Q5idId2TgU", title: "2060年，台灣就會沒有冬天？永續發展目標 SDGs 是什麼？", channel: "志祺七七", duration: "11:14", approximateViews: "約 26 萬次觀看", selectionReason: "以臺灣生活情境串起氣候與 SDGs，敘事清楚、觀看與互動表現突出，適合第一次接觸的學生；課文則補足定義與目標間權衡。" },
        en: { videoId: "M-iJM02m_Hg", title: "UN Sustainable Development Goals — Overview", channel: "UNICEF Georgia", duration: "2:12", approximateViews: "約 84 萬次觀看", selectionReason: "由聯合國體系頻道用短篇動畫建立全貌，觀看門檻低且訊息集中；與中文長版搭配，可快速複習 17 項目標。" }
      }
    },
    {
      id: 2,
      phase: 1,
      order: "02",
      topic: "系統思考",
      title: "看見連鎖反應：辨認槓桿點、反彈效應與公平代價",
      level: "入門",
      estimatedTime: "80 分鐘",
      prerequisites: ["完成單元 01 的議題地圖"],
      objectives: [
        "為一項永續政策畫出至少六個節點的因果回饋圖，標示正向與負向關係。",
        "比較兩個方案的短期效果、長期副作用與分配結果，提出可監測的風險指標。"
      ],
      theory: [
        "系統思考關心存量、流量、回饋與延遲；問題常不是缺少好意，而是只處理症狀、忽略結構。",
        "槓桿點是小改變能產生較大系統效果的位置，例如資訊透明、獎勵規則或基礎設施，而不一定是最大筆預算。",
        "永續方案要問『誰獲益、誰付費、何時發生』。效率提高也可能因使用量增加而抵銷節省，形成反彈效應。"
      ],
      exercises: [
        "替一次性餐具政策列出 3 個直接效果與 3 個間接效果，畫成因果箭頭。",
        "把政策改成收費、押金或預設不提供三種版本，預測各自對學生、店家與清潔人員的影響。",
        "選一個槓桿點，提出一項 30 天小實驗與兩個護欄指標，避免把成本轉嫁給弱勢群體。"
      ],
      outcome: "能把單點解方放回整體系統，預先辨認副作用與公平問題。",
      project: "作品集 02｜永續議題因果回饋圖",
      skills: ["Systems thinking", "Trade-off analysis", "公平檢核"],
      rhythm: "讀觀念 15 分鐘 → 看影片 20 分鐘 → 畫因果圖 30 分鐘 → 同儕挑戰 15 分鐘",
      source: { label: "Stockholm Resilience Centre：Planetary Boundaries", url: "https://www.stockholmresilience.org/research/planetary-boundaries.html" },
      media: {
        zh: { videoId: "4LUvRdsCA0A", title: "系統思考｜教育問題是系統性的問題，釐清全貌才能靠近解方", channel: "為台灣而教 Teach For Taiwan", duration: "3:16", approximateViews: "約 2,600 次觀看", selectionReason: "用臺灣教育現場示範系統問題如何超越單一責任歸因，篇幅短而具轉移性；本課再把方法帶到環境與社會議題。" },
        en: { videoId: "Vl6VhCAeEfQ", title: "The Tipping Points of Climate Change — and Where We Stand", channel: "TED", duration: "18:36", approximateViews: "約 157 萬次觀看", selectionReason: "Johan Rockström 以科學證據呈現臨界點與相互連動，觀看與互動表現突出；適合練習從線性因果轉向系統風險。" }
      }
    },
    {
      id: 3,
      phase: 1,
      order: "03",
      topic: "目標、指標與資料",
      title: "從漂亮口號到可追蹤進度：讀懂 target、indicator 與基準線",
      level: "入門＋",
      estimatedTime: "90 分鐘",
      prerequisites: ["能解釋至少三項 SDGs"],
      objectives: [
        "區分 goal、target、indicator、baseline 與 target value，為一個議題建立最小衡量表。",
        "檢查一張 SDGs 圖表的分母、時間範圍、資料缺口與相關／因果界線。"
      ],
      theory: [
        "目標描述方向，細項目標描述要改變的狀態，指標才是觀察進度的尺；沒有基準線與期限，就難以判斷『改善』。",
        "好指標要與決策相連。除了成果指標，也可配置領先指標與護欄指標，避免只追容易上升的數字。",
        "資料缺口本身就是公平問題：未被分類或收集的人群，常在平均值中消失。閱讀報告要追問資料來源、更新頻率與可比較性。"
      ],
      exercises: [
        "從 SDG 11 選一個細項目標，抄下官方指標，改寫成大學生能理解的一句話。",
        "檢查一張校園能源圖表，列出分母、基準年、季節性與至少兩個可能誤讀。",
        "為『更永續的通勤』設計 1 個成果、2 個領先與 1 個公平護欄指標，附資料取得方式。"
      ],
      outcome: "能判斷一個永續承諾是否可衡量，也能指出資料仍不能回答的問題。",
      project: "作品集 03｜SDGs 指標與資料品質卡",
      skills: ["Metric design", "Data literacy", "資料查核"],
      rhythm: "查官方目標 20 分鐘 → 看影片 15 分鐘 → 拆圖表 25 分鐘 → 設計指標 30 分鐘",
      source: { label: "UN SDG Indicators Database", url: "https://unstats.un.org/sdgs/dataportal" },
      media: {
        zh: { videoId: "GRLsMWh3FvI", title: "臺灣永續並肩努力 Taiwan Together（5分鐘版）", channel: "環境部舊頻道", duration: "5:28", approximateViews: "約 8,700 次觀看", selectionReason: "官方影片提供臺灣目標與行動的快速入口；本課刻意要求學生回到指標與資料，練習把成果敘事轉為可查核問題。" },
        en: { videoId: "COsL0IfvXsw", title: "SDG indicators: The last missing piece of the 2030 Agenda", channel: "United Nations", duration: "6:03", approximateViews: "約 7.5 萬次觀看", selectionReason: "聯合國官方內容直接說明指標為何是 2030 Agenda 的關鍵拼圖，主題精準且具有穩定參考價值。" }
      }
    },
    {
      id: 4,
      phase: 2,
      order: "04",
      topic: "國家路徑比較",
      title: "同一組 SDGs，不同做法：比較德國、日本與新加坡",
      level: "中階",
      estimatedTime: "100 分鐘",
      prerequisites: ["完成單元 03 指標卡"],
      objectives: [
        "用治理架構、政策工具、資源投入、參與機制與進度揭露五欄比較三國做法。",
        "辨認國情、能源、人口與產業結構差異，避免把國際排名直接當成可複製解方。"
      ],
      theory: [
        "國家透過 VNR 自願檢視進度，但報告不是終點；要看目標如何進入預算、法規、跨部會協調與地方執行。",
        "德國以轉型領域整合政策，日本以全政府架構與多方參與推動，新加坡用 Green Plan 的明確部門目標協調城市型國家的限制。",
        "跨國比較要先校正條件：人口密度、能源資源、所得、制度與資料口徑不同。可學的是治理機制，不是照抄單一數字。"
      ],
      exercises: [
        "從德國、日本、新加坡官方資料各找一項 2030 目標，標示責任部門、政策工具與指標。",
        "選兩國，用五欄矩陣比較；再寫出一個『表面領先但不可直接比較』的例子。",
        "以臺灣情境評估其中一項機制：可移植條件、需調整之處與可能反對者各寫兩點。"
      ],
      outcome: "能用制度與證據比較國家永續路徑，而不是只看口號或總排名。",
      project: "作品集 04｜三國永續政策比較矩陣",
      skills: ["Policy analysis", "Benchmarking", "Context transfer"],
      rhythm: "看影片 15 分鐘 → 查三國官方頁 35 分鐘 → 填矩陣 35 分鐘 → 反思 15 分鐘",
      source: { label: "UN Voluntary National Reviews", url: "https://hlpf.un.org/vnrs" },
      media: {
        zh: { videoId: "Ht3v3zPK-BY", title: "SDGs 暖世代永續價值白書", channel: "The News Lens 關鍵評論網", duration: "3:57", approximateViews: "約 5,300 次觀看", selectionReason: "以中文快速帶出世代與在地永續價值，適合作為跨國比較前的觀點暖身；主要證據仍由學生查閱三國官方策略。" },
        en: { videoId: "uIpLlRw0wCk", title: "What we do: The German Sustainable Development Strategy", channel: "GermanyDiplo", duration: "5:21", approximateViews: "約 300 次觀看", selectionReason: "由德國官方外交頻道直接介紹國家永續策略，觀看數不高但來源權威、與本單元治理比較高度契合。" }
      }
    },
    {
      id: 5,
      phase: 2,
      order: "05",
      topic: "臺灣與地方治理",
      title: "把全球目標在地化：讀臺灣 SDGs、VNR 與城市 VLR",
      level: "中階",
      estimatedTime: "90 分鐘",
      prerequisites: ["能閱讀政策比較矩陣"],
      objectives: [
        "說明臺灣 18 項永續發展目標與聯合國 17 項 SDGs 的關係，找到對應指標與主管機關。",
        "從一份 VNR 或 VLR 提取問題、行動、指標、成果與資料限制，提出一個追問。"
      ],
      theory: [
        "臺灣將全球框架在地化為 18 項核心目標，並以國家、部會與地方層級的自願檢視呈現進度。",
        "在地化不是換圖示，而是把全球問題轉成地方權責、資料與居民經驗；城市常是交通、住宅、廢棄物與調適的實作場。",
        "自願檢視屬自我報告，應與預算、開放資料、審計、民間觀察及受影響者聲音交叉閱讀。"
      ],
      exercises: [
        "在臺灣 SDGs 官網找出與你科系最相關的目標、兩個指標與主管機關。",
        "任選一份城市 VLR，做一張『承諾—行動—證據—缺口』四格摘要。",
        "寫一封 250 字政策追問：指出報告的一項資料缺口，說明誰需要這筆資料以及如何補足。"
      ],
      outcome: "能從官方報告找到可用資料，也能辨認報告沒有說出的執行與公平問題。",
      project: "作品集 05｜臺灣 VNR／VLR 查核頁",
      skills: ["VNR/VLR reading", "Localization", "Public data"],
      rhythm: "官網導覽 20 分鐘 → 看影片 10 分鐘 → 報告查核 40 分鐘 → 寫追問 20 分鐘",
      source: { label: "行政院國家永續發展委員會", url: "https://ncsd.ndc.gov.tw/" },
      media: {
        zh: { videoId: "SXpwg3xq_ps", title: "實踐 SDGs！全台第一《地方自願檢視報告書 VLR》", channel: "侯友宜 houyuih", duration: "1:48", approximateViews: "約 700 次觀看", selectionReason: "以地方政府案例快速辨認 VLR 的定位；本課同時要求查核完整報告，避免只接受宣傳影片的成果敘事。" },
        en: { videoId: "plDpUMeiXrI", title: "Taiwan Opts To Forge Ahead With Sustainable Development Goals", channel: "TaiwanPlus News", duration: "1:52", approximateViews: "約 200 次觀看", selectionReason: "以英語新聞視角概述臺灣永續目標，便於練習向國際受眾說明臺灣制度；再以官方 VNR 補上完整證據。" }
      }
    },
    {
      id: 6,
      phase: 3,
      order: "06",
      topic: "企業策略與重大性",
      title: "企業為什麼做：從利害關係人到重大議題與治理責任",
      level: "中階",
      estimatedTime: "100 分鐘",
      prerequisites: ["能區分 SDGs 與 ESG"],
      objectives: [
        "為一家公司畫出價值鏈與利害關係人地圖，辨認至少五項實際或潛在影響。",
        "依影響重大性排序議題，區分業務風險、對外影響與行銷偏好。"
      ],
      theory: [
        "重大議題不是高階主管最關心的新聞，而是組織對經濟、環境與人（含人權）的顯著影響，以及這些議題如何被治理。",
        "企業永續從董事會監督、政策、責任歸屬、資源、誘因到揭露形成閉環；只有承諾、沒有責任與資料，無法形成策略。",
        "價值鏈視角會把原料、供應商、物流、使用與報廢納入，避免只看辦公室用電等容易處理但影響較小的項目。"
      ],
      exercises: [
        "選一家公司，畫出上游、營運、產品使用與生命終期，為每段標一項 E、S 或 G 影響。",
        "訪談一名同學扮演顧客、員工或供應商，修正你的重大議題排序並留下變更理由。",
        "閱讀該公司永續報告，找出治理責任、基準年、目標年與績效；寫下兩個仍無法回答的問題。"
      ],
      outcome: "能從企業價值鏈與影響出發判斷重大議題，不以報告篇幅或品牌聲量代替分析。",
      project: "作品集 06｜企業重大性與利害關係人地圖",
      skills: ["Materiality", "Stakeholder mapping", "Governance"],
      rhythm: "看影片 25 分鐘 → 畫價值鏈 20 分鐘 → 讀報告 35 分鐘 → 排序與反思 20 分鐘",
      source: { label: "GRI 3：Material Topics 2021", url: "https://www.globalreporting.org/publications/documents/english/gri-3-material-topics-2021/" },
      media: {
        zh: { videoId: "g8XMNVtWhtQ", title: "永續報告書編纂流程與重大性議題分析", channel: "CSRone 永續智庫", duration: "19:53", approximateViews: "約 3,300 次觀看", selectionReason: "直接涵蓋報告流程與重大議題分析，符合本課實作；觀看規模適中但主題完整、可與 GRI 原始標準交叉閱讀。" },
        en: { videoId: "6LkrhalWIMc", title: "Sustainability reporting with the GRI Standards", channel: "Global Reporting Initiative", duration: "2:41", approximateViews: "約 15 萬次觀看", selectionReason: "由標準制定組織官方說明 GRI 架構，來源權威且觀看與互動表現突出；作為中文長版後的概念校準。" }
      }
    },
    {
      id: 7,
      phase: 3,
      order: "07",
      topic: "價值鏈與循環經濟",
      title: "從 take–make–waste 到循環：重設產品、流程與商業模式",
      level: "中階",
      estimatedTime: "95 分鐘",
      prerequisites: ["完成企業價值鏈圖"],
      objectives: [
        "用消除廢棄、循環產品與材料、再生自然三原則評估一項產品。",
        "提出一個能延長使用、提高利用率或回收材料的商業模式，並定義反效果指標。"
      ],
      theory: [
        "循環經濟不是把垃圾分類做得更好，而是在設計階段避免廢棄與污染，讓產品與材料維持價值，並支持自然再生。",
        "常見策略包含耐用、維修、重複使用、共享、翻新、再製與材料循環；優先順序取決於能否保留更多產品價值。",
        "循環也有代價：逆物流、清洗、額外包材與低使用率可能抵銷效益，因此要用全生命週期與實際回收率檢驗。"
      ],
      exercises: [
        "拆解一件日用品的材料、組裝、維修與回收障礙，拍照標註至少五個設計決策。",
        "比較維修、租賃、押金回收三種模式，選一種並寫出顧客誘因與營運成本。",
        "做一頁循環方案：價值主張、流程、合作夥伴、主要指標，以及一項可能增加環境負擔的反效果。"
      ],
      outcome: "能把循環概念轉成產品與商業模式選擇，並說明它是否真的減少總體影響。",
      project: "作品集 07｜產品循環重設畫布",
      skills: ["Circular design", "Value chain", "Business model"],
      rhythm: "看影片 20 分鐘 → 拆產品 25 分鐘 → 比模式 25 分鐘 → 畫方案 25 分鐘",
      source: { label: "Ellen MacArthur Foundation：Circular Economy", url: "https://www.ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview" },
      media: {
        zh: { videoId: "SaHyJc-H0vo", title: "循環經濟從源頭開始", channel: "TEDxTaipei", duration: "10:16", approximateViews: "約 3,800 次觀看", selectionReason: "以臺灣產業視角強調源頭設計，而非停在回收；案例具情境感，適合作為產品拆解練習的引子。" },
        en: { videoId: "zCRKvDyyHmI", title: "Explaining the Circular Economy and How Society Can Re-think Progress", channel: "Ellen MacArthur Foundation", duration: "3:49", approximateViews: "約 197 萬次觀看", selectionReason: "由循環經濟主要知識機構製作，動畫清楚且觀看與互動表現極為突出，適合建立三項核心原則。" }
      }
    },
    {
      id: 8,
      phase: 3,
      order: "08",
      topic: "氣候、碳管理與漂綠",
      title: "淨零不是一個數字：盤查範疇、減量路徑與可信宣稱",
      level: "中階＋",
      estimatedTime: "110 分鐘",
      prerequisites: ["能閱讀企業永續報告"],
      objectives: [
        "把一家公司主要排放來源分類為 Scope 1、2、3，找出最具決策意義的減量槓桿。",
        "用基準線、邊界、減量、抵換、期限與第三方查證六項檢核一個淨零宣稱。"
      ],
      theory: [
        "溫室氣體盤查先界定組織與營運邊界。Scope 1 是直接排放、Scope 2 是購買能源、Scope 3 是其他價值鏈排放，後者常最大也最難管理。",
        "可信路徑優先實質減量：效率、電氣化、再生能源、材料與供應鏈改變；抵換與移除需另列品質、永久性與重複計算風險。",
        "漂綠警訊包括只談強度不談總量、挑選有利年份、模糊『碳中和』邊界、用遠期承諾掩蓋近期排放，或把單一產品成果推廣到全公司。"
      ],
      exercises: [
        "以咖啡店或筆電公司為例，列出 Scope 1、2、3 各兩個可能來源。",
        "找一則淨零廣告，完成六項宣稱檢核；把無法確認的欄位標為『未知』而非自行推測。",
        "改寫該宣稱：補上邊界、基準年、2030 里程碑、減量方法與剩餘排放處理，限制在 120 字。"
      ],
      outcome: "能閱讀排放邊界並辨識宣稱漏洞，提出比『種樹抵換』更具體的減量優先順序。",
      project: "作品集 08｜企業淨零宣稱查核單",
      skills: ["GHG scopes", "Climate transition", "Greenwashing check"],
      rhythm: "讀範疇 20 分鐘 → 看影片 25 分鐘 → 查宣稱 35 分鐘 → 改寫 30 分鐘",
      source: { label: "GHG Protocol Corporate Standard", url: "https://ghgprotocol.org/corporate-standard" },
      media: {
        zh: { videoId: "0elBJFoWpzo", title: "真假 ESG 揭祕：你是真綠還是漂綠", channel: "鏡新聞調查報告", duration: "1:12:48", approximateViews: "約 1.9 萬次觀看", selectionReason: "以臺灣企業、訂單與綠領人才串連漂綠風險，調查篇幅完整；建議依本課標記選看片段並搭配六項檢核。" },
        en: { videoId: "59KckhowbGY", title: "The Greenwashing Trap: How Carbon Credits Are Faking Climate Action", channel: "graphniti", duration: "3:05", approximateViews: "約 20 次觀看", selectionReason: "觀看與互動表現有限，但短片聚焦碳權與漂綠的爭點，適合作為反方材料；判斷仍須回到 GHG Protocol 與公司原始揭露。" }
      }
    },
    {
      id: 9,
      phase: 3,
      order: "09",
      topic: "社會永續與公正轉型",
      title: "別把人留在轉型後面：人權、DEI、勞動與公正轉型",
      level: "中階",
      estimatedTime: "95 分鐘",
      prerequisites: ["理解利害關係人與價值鏈"],
      objectives: [
        "辨認轉型方案對不同勞工、社區與消費者的分配影響，設計參與與補救機制。",
        "區分多元、平等、包容與歸屬，為一項企業措施設定成果而非活動量指標。"
      ],
      theory: [
        "社會永續關心人權、健康安全、薪資、能力轉換、可近性與參與權；不是只有志工時數或捐款。",
        "公正轉型要求氣候與產業轉型同時處理就業、技能、區域與能源負擔，讓受影響者參與決策並取得支持。",
        "DEI 若只量參加活動人數，很難判斷權力與結果是否改變；應看招募、留任、升遷、薪酬、心理安全與可近性。"
      ],
      exercises: [
        "畫出燃煤機組退場的利害關係人地圖，為每群體寫出一項損失、一項機會與一項需要的支持。",
        "把『舉辦三場多元講座』改成一個成果指標與一個護欄指標，說明資料如何分群。",
        "為校園節能方案設計 30 分鐘參與工作坊，確保身障者、夜間部學生與外包人員能表達影響。"
      ],
      outcome: "能把人權、公平與參與寫進永續方案，不把社會面當成環境策略的附錄。",
      project: "作品集 09｜公正轉型利害關係人與支持方案",
      skills: ["Just transition", "Human rights", "DEI metrics"],
      rhythm: "看影片 25 分鐘 → 畫群體影響 25 分鐘 → 改指標 20 分鐘 → 設計參與 25 分鐘",
      source: { label: "ILO Guidelines for a Just Transition", url: "https://www.ilo.org/global/topics/green-jobs/publications/WCMS_432859/lang--en/index.htm" },
      media: {
        zh: { videoId: "egnSKtr7zws", title: "在氣候危機中正行——為公正轉型行動", channel: "TEDxMingdao HS Youth", duration: "16:05", approximateViews: "約 100 次觀看", selectionReason: "以青年與臺灣語境切入公正轉型，觀看數有限但概念貼合；可與 ILO 指引互證，避免將個人觀點當成完整政策。" },
        en: { videoId: "AyxD0GfG5Is", title: "Why the Just Transition is Important for South Africa and Business", channel: "TEDx Talks", duration: "7:20", approximateViews: "約 2,500 次觀看", selectionReason: "南非能源與就業案例具體呈現轉型分配問題，能補足高所得國家案例之外的觀點。" }
      }
    },
    {
      id: 10,
      phase: 4,
      order: "10",
      topic: "校園永續專案",
      title: "把校園當實驗室：從問題定義到 30 天可驗證行動",
      level: "實作",
      estimatedTime: "120 分鐘＋專案",
      prerequisites: ["完成至少一份企業或政策查核作品"],
      objectives: [
        "以觀察、訪談與基準資料定義一個校園永續問題，寫出受益者、範圍與成功條件。",
        "設計一個 30 天最小可行實驗，包含行動、責任、時程、成果指標與公平護欄。"
      ],
      theory: [
        "好題目不是『讓校園更永續』，而是具體的人在具體情境遇到可觀察問題，例如特定時段的空間能源浪費或剩食資訊落差。",
        "先做小規模基準測量，再測一個關鍵假設。最小可行實驗的目的不是證明你正確，而是用低成本降低最大的不確定性。",
        "成果要同時記錄數量與經驗：節省多少、誰採用、為何沒採用、成本轉給誰，以及下一輪要改什麼。"
      ],
      exercises: [
        "在校園走查 30 分鐘，記錄 10 個具時間、地點與人物的觀察，不先寫解法。",
        "訪談三種角色並整理共同點／差異；用『對誰、何時、什麼障礙、造成什麼結果』重寫問題。",
        "填完 30 天實驗畫布：假設、行動、合作人、基準、成功門檻、護欄、風險與停止條件。"
      ],
      outcome: "能把宏大目標縮成可執行、可衡量又不忽略公平的校園實驗。",
      project: "作品集 10｜30 天校園永續實驗畫布",
      skills: ["Project design", "Field research", "Experiment metrics"],
      rhythm: "走查 30 分鐘 → 看影片 10 分鐘 → 訪談 40 分鐘 → 實驗設計 40 分鐘",
      source: { label: "UN SDG Action Campaign", url: "https://sdgactioncampaign.org/" },
      media: {
        zh: { videoId: "8dHpKL3UDIo", title: "中山大學『永續辦公室』揭牌！科學治理迎戰氣候與轉型", channel: "NSYSU 國立中山大學", duration: "0:56", approximateViews: "約 100 次觀看", selectionReason: "提供臺灣大學以組織與科學治理推動永續的具體入口；篇幅很短，主要學習來自學生自己的走查與實驗。" },
        en: { videoId: "atAGQ7kqL-g", title: "How To Make Your School More Sustainable", channel: "Foundation for Young Australians", duration: "2:38", approximateViews: "約 7.3 萬次觀看", selectionReason: "以學生可採取的校園行動為主，觀看與互動表現良好、節奏明快；適合在實作前快速建立可行感。" }
      }
    },
    {
      id: 11,
      phase: 4,
      order: "11",
      topic: "綠領職涯與能力盤點",
      title: "永續不是一種職稱：找到產業場景、角色與可轉移技能",
      level: "職涯",
      estimatedTime: "100 分鐘",
      prerequisites: ["至少完成兩件課程作品"],
      objectives: [
        "把永續工作拆成策略、資料、營運、工程、溝通、政策與金融等角色，連結自己的科系能力。",
        "讀三份職缺，建立需求技能矩陣，辨認已有證據、可在 90 天補足的缺口與不必要證照。"
      ],
      theory: [
        "綠領工作分布在既有職能中：工程師做能效、採購做供應鏈、財務做氣候風險、產品經理做循環設計，不只『ESG 專員』。",
        "雇主需要的是能把框架轉成工作的人：資料整理、議題研究、跨部門協作、專案管理、量化成效與誠實處理不確定性。",
        "證照可建立共同語言，但不能取代作品證據。先由目標職缺反推必要知識，再選課程、工具與專案。"
      ],
      exercises: [
        "蒐集三份不同產業永續相關職缺，將任務、工具、領域知識與協作對象貼進矩陣。",
        "把自己的課程、社團、打工與專題經驗對應矩陣，標成『有證據／只有接觸／尚未具備』。",
        "設計 90 天補強計畫：一個知識缺口、一個工具缺口、一位受訪者與一件可公開作品。"
      ],
      outcome: "能選擇符合本科優勢的永續切入點，並以職缺證據規劃學習，而非盲目蒐集證照。",
      project: "作品集 11｜綠領職缺技能矩陣與 90 天計畫",
      skills: ["Job analysis", "Skill mapping", "Career planning"],
      rhythm: "看影片 20 分鐘 → 找職缺 30 分鐘 → 盤點證據 25 分鐘 → 排 90 天 25 分鐘",
      source: { label: "環境部淨零綠領人才培育", url: "https://www.moenv.gov.tw/" },
      media: {
        zh: { videoId: "D179-I5wWl4", title: "人才需求激增，綠領工作機會全解析！", channel: "環境部", duration: "16:13", approximateViews: "約 600 次觀看", selectionReason: "由臺灣環境部門直接談綠領需求與職涯，觀看規模有限但在地制度與工作語境貼合。" },
        en: { videoId: "EDA_oLZKITo", title: "Green Jobs — Building for the Future", channel: "Lightcast", duration: "3:59", approximateViews: "約 1 萬次觀看", selectionReason: "以勞動市場技能資料說明綠色轉型如何改變各類職務，能支持『永續不是單一職稱』的核心觀念。" }
      }
    },
    {
      id: 12,
      phase: 4,
      order: "12",
      topic: "履歷、作品集與面試",
      title: "把關心寫成證據：用 STAR＋Impact 說出你的永續能力",
      level: "職涯實戰",
      estimatedTime: "120 分鐘",
      prerequisites: ["完成校園永續實驗或同等專案"],
      objectives: [
        "把一段永續經驗改寫成含情境、任務、行動、結果與反思的履歷 bullet 與作品集案例。",
        "以 90 秒回答一題永續面試題，清楚說明取捨、資料限制、個人貢獻與下一步。"
      ],
      theory: [
        "永續履歷不靠堆名詞。好的 bullet 說明你面對的問題、採取的分析或協作、產生的可驗證結果，以及規模與限制。",
        "作品集要保留推理鏈：原始問題、利害關係人、基準、方案比較、決策、成果與反思。誠實說未達成什麼，比虛構影響更有可信度。",
        "面試用 STAR＋Impact：Situation、Task、Action、Result 後補上 Impact 與 Learning，並準備證據連結與追問。"
      ],
      exercises: [
        "把『參與校園減塑活動』改寫成兩版履歷 bullet：一版偏資料分析、一版偏專案協作。",
        "將本課一件作品整理成六頁案例：問題、研究、洞察、方案、結果、反思；每頁只留一個訊息。",
        "錄製 90 秒回答『你如何判斷一項永續方案有效？』，依清楚度、證據、取捨與個人貢獻自評。"
      ],
      outcome: "完成可直接投遞的永續履歷段落、作品集案例與面試故事，並能回答成果邊界。",
      project: "結業作品｜永續求職證據包：提案＋作品集＋履歷＋90 秒面試稿",
      skills: ["STAR+Impact", "Portfolio storytelling", "Interviewing"],
      rhythm: "看影片 25 分鐘 → 改履歷 25 分鐘 → 排作品集 40 分鐘 → 錄影回看 30 分鐘",
      source: { label: "ILO Green Jobs", url: "https://www.ilo.org/global/topics/green-jobs/lang--en/index.htm" },
      media: {
        zh: { videoId: "UcR-T3M2FuI", title: "綠夥伴職涯分享｜淨零碳規劃師／永續管理師的實戰天地", channel: "蓋稏綠私塾 × 淨零領航者", duration: "1:05:12", approximateViews: "約 100 次觀看", selectionReason: "第一人稱職涯經驗能呈現工作內容與轉換過程；觀看數有限，建議搭配三份真實職缺而非單一成功故事。" },
        en: { videoId: "9S1mTMMMiB8", title: "9 Sustainability Interview Questions and Answers", channel: "Tyanna Bui", duration: "14:02", approximateViews: "約 2.6 萬次觀看", selectionReason: "聚焦 entry-level 永續職缺常見問題，實作導向且觀看與互動表現良好；本課用 STAR＋Impact 進一步要求證據與反思。" }
      }
    }
  ],
  cases: [
    { type: "國家", name: "臺灣", code: "TW", focus: "全球目標在地化", action: "以 18 項臺灣永續發展目標、國家／部會／地方自願檢視與年度評估連結治理。", watchFor: "自願報告需與預算、開放資料和民間觀察交叉查核。", url: "https://ncsd.ndc.gov.tw/Fore/SDGList" },
    { type: "國家", name: "新加坡", code: "SG", focus: "城市型國家的具體目標", action: "Green Plan 2030 以自然城市、永續生活、能源、綠色經濟與韌性五大支柱設定部門目標。", watchFor: "土地與能源條件特殊，政策數字不能直接移植到其他國家。", url: "https://www.greenplan.gov.sg/targets/" },
    { type: "國家", name: "德國", code: "DE", focus: "跨部會轉型領域", action: "2025 永續策略以社會正義、能源與氣候、循環、建築交通、農食與無毒環境六個領域整合政策。", watchFor: "策略完整不等於進度充分；仍要逐項查看指標與執行差距。", url: "https://www.bundesregierung.de/breg-en/federal-government/german-sustainability-strategy-2025-2403776" },
    { type: "國家", name: "日本", code: "JP", focus: "全政府與多方參與", action: "由首相領導 SDGs 推進本部，透過指導原則、圓桌會議與 2025 VNR 統整五個優先領域。", watchFor: "高齡化、性別與能源結構等國情會影響目標間取捨。", url: "https://www.mofa.go.jp/policy/oda/sdgs/vnr/vnr2025en.html" },
    { type: "企業", name: "台積電", code: "TSMC", focus: "製造與供應鏈", action: "把再生能源、水資源、零廢製造與供應鏈減碳納入長期營運與採購管理。", watchFor: "先進製程成長使總用電與 Scope 3 管理仍是重要檢核點。", url: "https://esg.tsmc.com/en-US/ESG-data-hub/latest-sustainability-information?tab=overview" },
    { type: "企業", name: "Microsoft", code: "MSFT", focus: "目標、採購與技術", action: "設定 2030 碳負排、水正效益與零廢棄承諾，透過能源採購、碳移除、資料中心與供應鏈方案推進。", watchFor: "AI 與雲端成長會推升能源、水與 Scope 3 壓力，需同時看絕對排放。", url: "https://www.microsoft.com/en-us/corporate-responsibility/sustainability/report" },
    { type: "企業", name: "IKEA", code: "IKEA", focus: "產品與循環設計", action: "從材料、設計、生產、零售到回收服務推動價值鏈減碳與循環商業模式。", watchFor: "要檢查總體消費量、材料來源與回收服務的實際採用率。", url: "https://www.ikea.com/global/en/our-business/reports/" },
    { type: "企業", name: "Ørsted", code: "ORST", focus: "核心業務轉型", action: "從化石燃料密集企業轉向再生能源，並將 2040 淨零延伸到供應鏈與專案生命週期。", watchFor: "轉型需同時處理成本、供應鏈、生物多樣性與地方參與。", url: "https://orsted.com/en/investors/financial-reports" }
  ],
  capstoneChecklist: [
    "一頁式問題與 SDGs 關係圖",
    "至少三種利害關係人或一次真實訪談",
    "基準資料、成果指標與公平護欄",
    "國家或企業案例的可移植洞察",
    "30 天行動、責任、風險與停止條件",
    "結果、限制、失敗與下一輪修改",
    "兩則履歷 bullet 與六頁作品集",
    "90 秒 STAR＋Impact 面試回答"
  ],
  officialSources: [
    { label: "UN 2030 Agenda", url: "https://sdgs.un.org/2030agenda", note: "17 項目標與 169 項細項目標原始文本" },
    { label: "UN SDG Report 2025", url: "https://unstats.un.org/sdgs/report/2025/", note: "全球進度與資料方法" },
    { label: "UN SDG Data Portal", url: "https://unstats.un.org/sdgs/dataportal", note: "官方指標與國際資料" },
    { label: "臺灣永續發展目標", url: "https://ncsd.ndc.gov.tw/Fore/SDGList", note: "18 項核心目標與在地指標" },
    { label: "GRI Standards", url: "https://www.globalreporting.org/standards/", note: "組織影響與重大議題揭露" },
    { label: "GHG Protocol", url: "https://ghgprotocol.org/corporate-standard", note: "企業溫室氣體盤查框架" }
  ]
} as const;
