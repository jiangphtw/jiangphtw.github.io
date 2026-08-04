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

const checkedAt = "2026-08-04";

export const phases = [
  {
    id: 1,
    code: "POSITION",
    title: "先站穩方法與倫理",
    description: "分辨口述歷史、新聞採訪與生命故事，先確認研究目的、關係、同意與可撤回機制。",
    outcome: "一頁研究說明與可持續確認的同意方案",
  },
  {
    id: 2,
    code: "LISTEN",
    title: "把訪談做成共同生成",
    description: "完成背景研究、訪綱、設備測試與一次尊重敘事者節奏的正式訪談。",
    outcome: "訪綱、場勘表、錄音與訪談日誌",
  },
  {
    id: 3,
    code: "PROCESS",
    title: "讓 AI 可用、但不可代替判斷",
    description: "建立逐字稿規範、AI 轉錄查核、敏感資料處理與能回到原音的索引。",
    outcome: "可追溯逐字稿、錯誤表與主題索引",
  },
  {
    id: 4,
    code: "RETURN",
    title: "保存、詮釋，再交還",
    description: "把音檔、文件與詮釋成果整理成可保存、可授權、能回饋敘事者的專案包。",
    outcome: "完整口述史專案包與一則公共敘事作品",
  },
];

export const units: CourseUnit[] = [
  {
    id: 1,
    phase: 1,
    order: "01",
    topic: "方法定位",
    title: "口述歷史不是把聊天錄下來",
    level: "入門",
    estimatedTime: "70 分鐘",
    prerequisites: ["準備一個你真心想追問的家庭、社區或工作記憶主題"],
    objectives: [
      "比較口述歷史、新聞採訪與一般生命故事的目的、關係與成果差異",
      "寫出包含研究問題、敘事者範圍與預期公共價值的一頁專案說明",
    ],
    theory: [
      "口述歷史是訪談者與敘事者在當下共同生成、錄製並保存的歷史來源；聲音、停頓、關係與事後詮釋都屬於史料情境。",
      "從一個可追問的歷史問題出發，界定時間、地方、群體與變遷，再說明為何現有書面材料不足以回答它。",
      "記憶不是監視器。遺忘、重組與後見之明不是單純的錯誤，而是需要和其他來源互證、解釋的材料。",
    ],
    exercises: [
      "用三欄表比較口述歷史、新聞採訪、Podcast 訪談，各寫出目的、關係與成果。",
      "把「訪問一位長輩」改寫成含時間、地方與變遷的研究問題，並列出兩種可互證資料。",
      "完成 300 字專案說明：研究問題、敘事者範圍、公共價值與你和主題的關係。",
    ],
    outcome: "你能說明為何要做這次訪談，也能承認記憶、關係與史料的限制。",
    project: "口述史專案一頁式說明",
    skills: ["方法辨識", "研究提問", "反身性"],
    rhythm: "先讀 15 分鐘 → 看中文或英文影音 → 用自己的主題完成三層練習",
    media: {
      zh: {
        videoId: "bNLAcg-4Y6s",
        title: "社區口述歷史的實務與經驗：何謂口述歷史？",
        channel: "記疫",
        duration: "26:21",
        approximateViews: "約 186 次觀看",
        checkedAt,
        selectionReason: "選用它是因為以臺灣社區實作說明口述歷史的定義與工作關係，能把抽象方法放進在地情境；觀看訊號不高，但主題貼合度與實務完整性較強。",
      },
      en: {
        videoId: "Xk3gb9xCTFo",
        title: "The Oral History Centre: What is Oral History?",
        channel: "Oral History Centre",
        duration: "3:44",
        approximateViews: "約 5.8 萬次觀看",
        checkedAt,
        selectionReason: "短片用多位實作者的語言界定口述歷史，適合建立第一個方法框架；高觀看訊號也顯示它長期被初學者使用，中文資源則補足臺灣脈絡。",
      },
    },
  },
  {
    id: 2,
    phase: 1,
    order: "02",
    topic: "研究設計",
    title: "從好奇心到可完成的訪談計畫",
    level: "入門",
    estimatedTime: "85 分鐘",
    prerequisites: ["完成單元 01 的一頁專案說明"],
    objectives: [
      "依研究問題選擇敘事者、背景材料、訪談次數與成果形式",
      "製作包含招募、訪前、訪談、處理、回看與保存的專案流程圖",
    ],
    theory: [
      "口述史專案先設計可交付成果，再倒推需要哪些人、哪些既有史料、多少次訪談與多少處理工時。",
      "敘事者不是資料容器；選樣需要說明誰的聲音被納入、誰被排除，以及研究者如何接近這個群體。",
      "一小時訪談常帶來數倍的整理工時。規模過大會犧牲逐字稿品質、回看與保存，是初學專案最常見的失敗模式。",
    ],
    exercises: [
      "把一個大主題切成一位敘事者、1–2 次訪談、六週內可完成的最小專案。",
      "畫出從第一次聯絡到交付成果的流程，標示每一步的負責人、文件與退出條件。",
      "寫一份專案章程，包含研究問題、選樣理由、時程、風險、保存目的地與停止條件。",
    ],
    outcome: "你有一個規模合理、能解釋選樣與資源限制的訪談計畫。",
    project: "六週口述史專案章程與流程圖",
    skills: ["專案範圍", "選樣", "背景研究"],
    rhythm: "閱讀框架 20 分鐘 → 選看影音段落 → 用流程圖壓縮專案範圍",
    media: {
      zh: {
        videoId: "9Q6xd3gCMP8",
        title: "口述歷史訪談動畫教材",
        channel: "香港教育大學文學及文化學系",
        duration: "4:06",
        approximateViews: "約 2,401 次觀看",
        checkedAt,
        selectionReason: "動畫把訪前準備與訪談流程濃縮成可快速重看的一套步驟，社群訊號在中文候選中較強；本課文字會補上選樣與專案治理。",
      },
      en: {
        videoId: "VBA7nzmTDX4",
        title: "Introduction to Oral History: Project Planning and Interviewing Basics",
        channel: "Stanford Historical Society",
        duration: "1:53:44",
        approximateViews: "約 4,309 次觀看",
        checkedAt,
        selectionReason: "Stanford 的長篇工作坊同時涵蓋規劃與訪談，可按需求分段觀看，適合用來檢查自己的專案章程；中文動畫則負責快速建立全貌。",
      },
    },
  },
  {
    id: 3,
    phase: 1,
    order: "03",
    topic: "倫理與同意",
    title: "同意不是簽完一張紙",
    level: "核心",
    estimatedTime: "90 分鐘",
    prerequisites: ["已有專案目的、敘事者範圍與預期成果"],
    objectives: [
      "設計包含錄製、轉錄、AI 處理、保存、公開與撤回選項的分層同意流程",
      "針對創傷、第三人資訊與權力不對等案例做出可記錄的倫理決策",
    ],
    theory: [
      "知情同意是從邀請、訪前、錄音前、訪後到公開前持續確認的過程，不是一張永久授權。",
      "把同意拆成可選項目：是否錄音或錄影、是否使用雲端或 AI、姓名公開程度、可用範圍、限制年限與撤回方式。",
      "法律允許不等於倫理充分。敏感記憶、第三人指控與弱勢處境需要最小揭露、延後公開或停止訪談等保護。",
    ],
    exercises: [
      "標註一份同意書中過度概括、無法撤回與未說明 AI 處理的條款。",
      "為『受訪者談到未同意公開的家人』情境，寫出繼續、暫停與刪除片段的判斷紀錄。",
      "製作兩頁同意包：一頁白話說明、一頁分層選項，並安排訪後再次確認。",
    ],
    outcome: "你能讓敘事者真正選擇資料如何被錄製、處理、保存與公開。",
    project: "可持續確認的知情同意包",
    skills: ["知情同意", "隱私", "倫理判斷"],
    rhythm: "先讀案例 → 看倫理影音 → 找一位同學扮演敘事者測試同意說明",
    media: {
      zh: {
        videoId: "GwH4eO01smY",
        title: "口述歷史的方法、倫理與實務：演講紀實",
        channel: "藝術史學系暨藝術史評與古物研究碩博士班",
        duration: "依平台顯示",
        approximateViews: "約 10 次觀看",
        checkedAt,
        selectionReason: "這支近期課程紀實直接以方法、倫理與實務為題，觀看數雖低但對本單元的主題貼合度高；英文短片提供更聚焦的倫理複習。",
      },
      en: {
        videoId: "YBBDmcASLIQ",
        title: "Intro to Oral History — Oral Histories and Ethics",
        channel: "Kutsche Office of Local History",
        duration: "6:14",
        approximateViews: "約 487 次觀看",
        checkedAt,
        selectionReason: "地方史機構以短片聚焦口述史倫理，適合在撰寫同意包前快速檢查；它與中文長篇課程形成深淺互補。",
      },
    },
  },
  {
    id: 4,
    phase: 2,
    order: "04",
    topic: "訪綱與追問",
    title: "問出經驗，而不是你想聽的答案",
    level: "實作",
    estimatedTime: "100 分鐘",
    prerequisites: ["完成同意包", "蒐集至少三份背景材料"],
    objectives: [
      "把研究問題轉成時間線、主題群與開放式問題組成的半結構訪綱",
      "在模擬訪談中使用沉默、回聲、具體化與時間定位四種追問",
    ],
    theory: [
      "訪綱是地圖，不是問卷。先讓敘事者建立自己的路徑，再用主題群確認必要範圍。",
      "好問題多從『那時候發生什麼』『你怎麼做』『可以描述那個地方嗎』開始，並用敘事者剛說過的詞追問。",
      "連續問、帶答案、評價或搶著補完會把訪談變成訪談者的故事；沉默常比下一個問題更能帶出細節。",
    ],
    exercises: [
      "把十個是非題改成開放式問題，並刪除問題中的價值判斷。",
      "進行 12 分鐘模擬訪談，只能使用四種追問；事後標記三次有效與一次失敗的追問。",
      "完成一份含開場、生命時間線、主題群、敏感轉場與收尾問題的兩頁訪綱。",
    ],
    outcome: "你能以少量好問題讓敘事者主導敘事，同時維持研究焦點。",
    project: "兩頁半結構訪綱與模擬訪談回饋",
    skills: ["開放式問題", "追問", "主動傾聽"],
    rhythm: "改題 20 分鐘 → 影音 15 分鐘 → 兩人輪流模擬與回饋 45 分鐘",
    media: {
      zh: {
        videoId: "1lfmId_LQhE",
        title: "身／聲歷其境：訪談技巧要點",
        channel: "記疫",
        duration: "15:29",
        approximateViews: "約 69 次觀看",
        checkedAt,
        selectionReason: "內容直接處理口述史訪談技巧，能銜接訪綱與模擬練習；雖屬小眾資源，專業貼合度高於一般訪談技巧影片。",
      },
      en: {
        videoId: "mVv_QAFhm1A",
        title: "Conducting an Oral History Interview",
        channel: "YRDSB Museum & Archives",
        duration: "8:10",
        approximateViews: "約 6 萬次觀看",
        checkedAt,
        selectionReason: "以清楚示範說明訪談流程，觀看訊號在同主題候選中很強，適合拿來對照自己的問法與現場節奏。",
      },
    },
  },
  {
    id: 5,
    phase: 2,
    order: "05",
    topic: "田野與錄製",
    title: "把一次訪談安全地帶回來",
    level: "實作",
    estimatedTime: "120 分鐘＋訪談",
    prerequisites: ["訪綱通過模擬", "取得錄音前同意"],
    objectives: [
      "完成設備、空間、備援、檔名與訪談角色的訪前檢查",
      "執行一次 30–60 分鐘訪談並在 24 小時內完成田野日誌與資料備份",
    ],
    theory: [
      "清楚的人聲比昂貴器材重要：選安靜空間、麥克風靠近敘事者、全程監聽，並準備第二套錄音。",
      "正式開始先錄口頭同意與基本識別資訊；訪談中記下時間碼、專名、情緒轉折與需要訪後確認之處。",
      "設備會改變關係。鏡頭可能增加壓力，遠距平台可能上傳資料；選擇方式時要把舒適、安全與保存品質一起評估。",
    ],
    exercises: [
      "錄製兩分鐘測試音，檢查距離、底噪、爆音與備援檔，留下可聽的測試結果。",
      "為同一位敘事者比較手機、錄音機與遠距平台，寫出品質、隱私與失敗復原取捨。",
      "完成正式訪談、校驗檔名與雜湊值，建立工作檔與保存檔，並寫 500 字田野日誌。",
    ],
    outcome: "你有一份清楚可聽、同意完整、具備備援與情境紀錄的原始訪談。",
    project: "正式音檔、技術紀錄與田野日誌",
    skills: ["錄音", "田野紀錄", "資料安全"],
    rhythm: "前一天場勘與試錄 → 當天訪談 → 24 小時內備份與寫田野日誌",
    media: {
      zh: {
        videoId: "1EH0dLKXmg8",
        title: "社區口述歷史的實務與經驗：社區訪談走透透",
        channel: "記疫",
        duration: "24:13",
        approximateViews: "約 121 次觀看",
        checkedAt,
        selectionReason: "影片把訪談放回社區現場，能看見關係、移動與實務限制；英文檔案館工作坊則補強錄製與管理流程。",
      },
      en: {
        videoId: "0bJ7zVTo0nE",
        title: "Community Archives: Setting up, Recording and Managing Oral History Interviews",
        channel: "Norfolk Record Office",
        duration: "49:27",
        approximateViews: "約 787 次觀看",
        checkedAt,
        selectionReason: "檔案館以完整工作坊連接設置、錄製與管理，適合在正式訪談前分段檢查；其實務範圍比單純器材評測更符合本課。",
      },
    },
  },
  {
    id: 6,
    phase: 3,
    order: "06",
    topic: "逐字稿",
    title: "逐字稿是通往原音的索引",
    level: "實作",
    estimatedTime: "110 分鐘",
    prerequisites: ["有一份可工作的訪談音檔副本"],
    objectives: [
      "依一致規範轉錄說話者、時間碼、停頓、聽不清與非語言聲音",
      "完成一輪邊聽邊校正並保留從逐字稿回到原音的路徑",
    ],
    theory: [
      "逐字稿是對聲音事件的轉譯，不是原音的替代品；標點、刪贅字與『修順』都可能改變敘事者的節奏與立場。",
      "先定轉錄層級與標記規則，再用固定短段落、說話者標籤和週期性時間碼，讓校正與引用可重現。",
      "專名、方言、重疊說話和情緒聲音最容易失真。無法確定時標記不確定，不要用流暢文字掩蓋未知。",
    ],
    exercises: [
      "手動轉錄三分鐘音檔，標記說話者、時間碼、停頓、笑聲與聽不清片段。",
      "比較逐字、輕度編修、可讀稿三種版本，圈出每個編修如何改變語氣或意義。",
      "依自訂規範完成十分鐘校正版，讓同伴從任一句在 15 秒內找到原音。",
    ],
    outcome: "你能產出一致、可查核且不假裝等同原音的逐字稿。",
    project: "轉錄規範與十分鐘人工校正版",
    skills: ["轉錄", "時間碼", "版本控制"],
    rhythm: "先手打三分鐘 → 訂規範 → 完成十分鐘 → 與同伴交叉校聽",
    media: {
      zh: {
        videoId: "7174DX32rGo",
        title: "社區口述歷史的實務與經驗：逐字稿整理技巧",
        channel: "記疫",
        duration: "14:17",
        approximateViews: "約 187 次觀看",
        checkedAt,
        selectionReason: "中文資源直接示範口述史逐字稿整理，能與前一支社區訪談形成連續流程；英文長篇課程提供另一套可比較的規範。",
      },
      en: {
        videoId: "_aKXmOLQINw",
        title: "Learn to Transcribe Oral History the SPOHP Way",
        channel: "Samuel Proctor Oral History Program",
        duration: "45:57",
        approximateViews: "約 1,528 次觀看",
        checkedAt,
        selectionReason: "由大學口述史計畫完整示範轉錄流程，具有可跟做性與穩定社群訊號，適合用來比較並明文化自己的轉錄規範。",
      },
    },
  },
  {
    id: 7,
    phase: 3,
    order: "07",
    topic: "AI 協作",
    title: "讓 AI 加速，但留下可驗證的痕跡",
    level: "核心",
    estimatedTime: "100 分鐘",
    prerequisites: ["完成單元 06 的人工轉錄規範", "確認敘事者是否同意 AI 或雲端處理"],
    objectives: [
      "在明確資料邊界下使用語音辨識產生初稿並量測錯誤",
      "建立保留原音、原始輸出、人工修訂與提示紀錄的 AI 稽核軌跡",
    ],
    theory: [
      "AI 只能產生待驗證初稿；姓名、臺語與族語、口音、重疊說話和敏感詞往往有系統性錯誤。",
      "先問資料能否離開本機與是否允許第三方處理，再選工具。沒有明確同意時，優先離線處理或完全不用 AI。",
      "摘要會壓平矛盾，生成式補寫會創造史料。所有摘錄與主題都必須附時間碼，事實主張要回到原音並與外部來源互證。",
    ],
    exercises: [
      "用已同意處理的三分鐘音檔產生 AI 初稿，計算專名、漏字與說話者錯誤三類錯誤率。",
      "比較兩種提示或工具輸出，找出被消音、被推斷與過度修順的段落並解釋風險。",
      "完成十分鐘 AI 輔助校正版，提交原始輸出、修訂紀錄、錯誤表、時間碼與資料處理說明。",
    ],
    outcome: "你能證明哪些文字來自原音、哪些由機器提出、哪些由人判斷與修正。",
    project: "AI 轉錄稽核包與錯誤分析表",
    skills: ["語音辨識", "AI 稽核", "資料治理"],
    rhythm: "先確認同意 → 小樣本測試 → 計算錯誤 → 才決定是否擴大使用",
    media: {
      zh: {
        videoId: "hDLBolTG4OA",
        title: "Faster-Whisper、Google Colab 與 ChatGPT 的錄音轉文字應用",
        channel: "威利財經角",
        duration: "14:10",
        approximateViews: "約 2,081 次觀看",
        checkedAt,
        selectionReason: "它示範可實作的 Whisper 轉錄流程，社群訊號也較明顯；本課特別補上影片未必充分處理的同意、錯誤量測與保存原始輸出。",
      },
      en: {
        videoId: "Wzs7IoE8rps",
        title: "Transcribe Interviews with Whisper AI to NVivo 14 for Qualitative Research",
        channel: "PostdocLife",
        duration: "依平台顯示",
        approximateViews: "約 440 次觀看",
        checkedAt,
        selectionReason: "影片把 Whisper 初稿帶進質化研究工作流，與本課的轉錄—分析銜接最直接；觀看後必須依本單元的稽核規則逐段回聽。",
      },
    },
  },
  {
    id: 8,
    phase: 4,
    order: "08",
    topic: "保存與公共敘事",
    title: "不是做完作品，而是把聲音負責任地交還",
    level: "整合",
    estimatedTime: "140 分鐘",
    prerequisites: ["音檔、同意文件與校正版已分開保存", "敏感內容已完成第二次確認"],
    objectives: [
      "建立主檔、使用檔、逐字稿、摘要、權利與技術資訊完整的保存包",
      "製作一則附時間碼、脈絡、限制與敘事者回看紀錄的公共敘事作品",
    ],
    theory: [
      "保存包至少要讓未來使用者知道這是誰、何時何地、如何錄、可怎麼用、限制到何時，以及如何找到原始音檔。",
      "分析可從時間線、主題索引與關鍵片段開始，但不能把一人的記憶推成整個群體的唯一版本；矛盾與沉默也應保留。",
      "公開前要回到同意範圍並邀請敘事者回看。回看不是讓內容變得好聽，而是處理安全、專名、限制與關係責任。",
    ],
    exercises: [
      "依 3-2-1 原則列出三份副本、兩種媒介與一份異地保存，並設計一致檔名與資料夾結構。",
      "為五個關鍵片段建立時間碼、主題詞、人物地名、敏感等級與一段不超譯的摘要。",
      "完成 3–5 分鐘聲音故事或 800 字數位展件，附來源、限制、同意狀態、回看紀錄與保存清單。",
    ],
    outcome: "你交付的不只是一則好看的故事，而是一份可查核、可保存、尊重敘事者權利的歷史來源。",
    project: "完整口述史專案包與公共敘事作品",
    skills: ["數位保存", "主題索引", "公共史"],
    rhythm: "先整理保存包 → 再做敘事 → 請敘事者回看 → 最後才公開",
    media: {
      zh: {
        videoId: "iLTJpZC-Teg",
        title: "口述歷史影像紀錄計畫：官方預告片",
        channel: "國家電影及視聽文化中心",
        duration: "0:57",
        approximateViews: "約 555 次觀看",
        checkedAt,
        selectionReason: "這支極短成果片可作為『如何從長訪談選擇公共片段』的反向分析案例；本課要求學習者同時提交來源與限制，避免只留下宣傳敘事。",
      },
      en: {
        videoId: "1EjsyuX5vBk",
        title: "Oral History | Animating the Archives",
        channel: "Tate",
        duration: "依平台顯示",
        approximateViews: "約 3,790 次觀看",
        checkedAt,
        selectionReason: "Tate 展示檔案聲音如何轉成公共敘事，具清楚的策展案例與穩定觀看訊號；它適合啟發形式，但不能取代本課的來源、同意與回看要求。",
      },
    },
  },
];

export const aiGuardrails = [
  ["可交給 AI", "在獲得同意且資料邊界清楚後：產生逐字稿初稿、找候選時間碼、整理待查專名。"],
  ["必須由人做", "逐段回聽、判斷敏感內容、解釋矛盾、核對事實、決定公開範圍與回應敘事者。"],
  ["不要交給 AI", "代替敘事者補寫記憶、把推測寫成事實、未經同意上傳私密音檔、移除不符合預設故事的沉默與矛盾。"],
];

export const capstoneChecklist = [
  "一頁專案說明、研究問題與反身性定位",
  "背景資料清單、敘事者選樣理由與專案流程",
  "知情同意包、口頭同意紀錄與公開範圍",
  "半結構訪綱、場勘與設備測試表",
  "原始音檔、工作副本、技術紀錄與田野日誌",
  "轉錄規範、校正版、AI 原始輸出與錯誤分析",
  "時間碼索引、摘要、權利資訊與保存清單",
  "3–5 分鐘聲音故事或 800 字展件，以及敘事者回看紀錄",
];
