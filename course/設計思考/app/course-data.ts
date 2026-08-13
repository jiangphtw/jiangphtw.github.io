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
  media: {
    zh: MediaResource;
    en: MediaResource;
  };
};

export const phases = [
  {
    id: 1,
    number: "01",
    title: "建立設計者視角",
    short: "心態",
    weeks: "第 1 週",
    color: "#ff5c4d",
    description: "把設計思考當成反覆學習的決策流程，而不是五格線性清單。",
    outcome: "完成一張個人設計挑戰卡。",
  },
  {
    id: 2,
    number: "02",
    title: "走進人的情境",
    short: "研究",
    weeks: "第 2 週",
    color: "#2f8f63",
    description: "用訪談與觀察取得行為證據，分開事實、推論與自己的偏見。",
    outcome: "完成研究計畫與 3 份訪談紀錄。",
  },
  {
    id: 3,
    number: "03",
    title: "從資料提煉洞察",
    short: "綜整",
    weeks: "第 3 週",
    color: "#1746d1",
    description: "把零散研究資料聚類，找出需求、張力、關鍵時刻與機會。",
    outcome: "完成親和圖與使用者旅程。",
  },
  {
    id: 4,
    number: "04",
    title: "框定值得解的問題",
    short: "定義",
    weeks: "第 4 週",
    color: "#f0a11c",
    description: "把洞察寫成可行動的觀點，先發散，再用準則收斂概念。",
    outcome: "完成 POV、HMW 與概念決策表。",
  },
  {
    id: 5,
    number: "05",
    title: "讓想法接受現實",
    short: "原型",
    weeks: "第 5 週",
    color: "#8f55d6",
    description: "用最低成本做出可體驗的假設，透過測試找證據而不是求稱讚。",
    outcome: "完成一輪原型、測試與修正版。",
  },
  {
    id: 6,
    number: "06",
    title: "把解法說清楚",
    short: "交付",
    weeks: "第 6 週",
    color: "#d23c77",
    description: "補齊前台與後台服務，將研究證據、迭代與價值串成提案故事。",
    outcome: "交付可展示的服務設計提案。",
  },
];

const checkedAt = "2026-07-30";

export const units: CourseUnit[] = [
  {
    id: 1,
    phase: 1,
    order: "01",
    topic: "流程與挑戰",
    title: "設計思考不是直線：先畫出你的挑戰",
    level: "入門",
    estimatedTime: "55 分鐘",
    prerequisites: ["準備一個你想改善的生活、校園或工作情境"],
    objectives: [
      "比較同理、定義、發想、原型與測試各自降低的不確定性。",
      "把模糊抱怨改寫成包含對象、情境與期待改變的設計挑戰。",
    ],
    theory: [
      "設計思考是一套以人為中心、透過製作與回饋學習的循環；五階段是導航圖，不是不可回頭的流程。",
      "好的挑戰先描述要改善的經驗，不預先指定功能或解法，才能保留研究與創意空間。",
      "最常見的失敗是過早愛上解法。每次前進都要說清楚：我們目前知道什麼，仍在假設什麼。",
    ],
    exercises: [
      "列出三個日常摩擦點，為每一項標出「誰、何時、在哪裡、卡在哪裡」。",
      "選一題分別寫成解法式題目與經驗式題目，圈出兩者限制創意的差異。",
      "完成一張設計挑戰卡：對象、情境、期望改變、已知證據與未知假設各一欄。",
    ],
    outcome: "能用不預設答案的方式，定義一個可在六週內研究與測試的挑戰。",
    project: "作品集里程碑 01｜設計挑戰卡",
    skills: ["設計流程", "問題探索", "假設管理"],
    rhythm: "看 10 分鐘 → 寫 20 分鐘 → 與一位同學互換檢查 15 分鐘",
    media: {
      zh: {
        videoId: "UzMpXLwEqLc",
        title: "設計思考入門課程｜1-3 五個步驟簡介",
        channel: "Alpha Team Aha!",
        duration: "5:25",
        approximateViews: "約 3.8 萬次觀看",
        checkedAt,
        selectionReason:
          "以繁體中文逐步介紹五個階段，篇幅短、適合建立共同語言；觀看與社群互動表現在同系列中突出。搭配英文動畫，可同時掌握流程與非線性特質。",
      },
      en: {
        videoId: "_r0VX-aU_T8",
        title: "The Design Thinking Process",
        channel: "Sprouts",
        duration: "3:57",
        approximateViews: "約 202 萬次觀看",
        checkedAt,
        selectionReason:
          "動畫清楚呈現五階段與迭代關係，已有長期且突出的觀看與互動表現。它適合做流程總覽，實作細節則由本單元挑戰卡補足。",
      },
    },
  },
  {
    id: 2,
    phase: 1,
    order: "02",
    topic: "創意自信",
    title: "像設計者一樣學習：把失敗變成資料",
    level: "入門",
    estimatedTime: "60 分鐘",
    prerequisites: ["完成單元 01 的設計挑戰卡"],
    objectives: [
      "解釋創意自信、行動偏好與迭代如何影響團隊決策。",
      "設計一個成本低、能在 30 分鐘內取得新證據的微型實驗。",
    ],
    theory: [
      "創意自信不是相信每個點子都好，而是相信自己能透過行動讓點子變好。",
      "行動偏好要求把討論轉成可觀察的行為；小實驗能降低失敗成本，也縮短回饋週期。",
      "心理安全不足時，團隊會隱藏疑問、只支持主管點子。把批評對準假設，而不是提出假設的人。",
    ],
    exercises: [
      "記錄一次你因怕做不好而沒開始的經驗，改寫成可在 15 分鐘完成的第一步。",
      "針對設計挑戰列出三項假設，依「風險 × 未知程度」排序。",
      "為最高風險假設設計一個 30 分鐘微型實驗，寫清楚通過與失敗的證據。",
    ],
    outcome: "能把「我要想出好點子」改成「我要設計下一個學習實驗」。",
    project: "作品集里程碑 02｜假設與實驗清單",
    skills: ["創意自信", "行動偏好", "實驗設計"],
    rhythm: "看 18 分鐘 → 個人反思 12 分鐘 → 設計微型實驗 25 分鐘",
    media: {
      zh: {
        videoId: "TLKjEmpZ4CE",
        title: "大設計思想 Tim Brown（中文）",
        channel: "大小創意",
        duration: "16:48",
        approximateViews: "約 9.8 萬次觀看",
        checkedAt,
        selectionReason:
          "以中文呈現設計從物件走向系統與社會議題的視野，長期觀看與互動表現突出。它擴大設計者角色；英文資源則補上個人如何建立行動信心。",
      },
      en: {
        videoId: "16p9YRF0l-g",
        title: "How to Build Your Creative Confidence",
        channel: "TED",
        duration: "11:47",
        approximateViews: "約 244 萬次觀看",
        checkedAt,
        selectionReason:
          "David Kelley 用案例把創意自信連到漸進式行動，教學敘事完整且觀看與互動表現突出。重點不是技巧清單，而是解除「我沒有創意」的自我限制。",
      },
    },
  },
  {
    id: 3,
    phase: 2,
    order: "03",
    topic: "使用者訪談",
    title: "問過去，不問願望：做出能聽見真實行為的訪談",
    level: "入門",
    estimatedTime: "75 分鐘",
    prerequisites: ["完成設計挑戰卡", "能接觸至少一位目標情境中的參與者"],
    objectives: [
      "撰寫由寬到窄、聚焦實際經驗且不暗示答案的訪談題綱。",
      "完成一場 20 分鐘訪談並區分原話、觀察、解讀與後續追問。",
    ],
    theory: [
      "訪談的目標是還原具體事件與決策脈絡，不是請受訪者替團隊設計未來產品。",
      "先問最近一次經驗，再追問行為、感受、替代方案與取捨；沉默和「可以再多說一點嗎」都很有用。",
      "誘導題、複合題與假設情境會製造禮貌答案。研究者要記錄反例，不只蒐集支持自己觀點的句子。",
    ],
    exercises: [
      "把五個「你會不會／你喜不喜歡」問題改寫成最近一次的行為問題。",
      "和同伴進行 8 分鐘試訪，標記誘導題、跳太快的追問與錯過的情緒線索。",
      "完成一場 20 分鐘訪談，交付逐段筆記與三句保留上下文的受訪者原話。",
    ],
    outcome: "能取得可追溯到真實情境的訪談證據，而不是一份意見投票。",
    project: "作品集里程碑 03｜訪談題綱與研究紀錄",
    skills: ["質性訪談", "追問", "研究倫理"],
    rhythm: "看 20 分鐘 → 改題 15 分鐘 → 試訪 15 分鐘 → 正式訪談另約 20 分鐘",
    media: {
      zh: {
        videoId: "Q4S4jUZ-ua4",
        title: "訪談哪會難？設計師公開多年私藏訪談問題",
        channel: "Unblock",
        duration: "10:57",
        approximateViews: "約 3,100 次觀看",
        checkedAt,
        selectionReason:
          "以華語設計實務情境示範訪談問題，能直接連到題綱修改。觀看量不如概論型影片，但方法密度與本單元練習更契合。",
      },
      en: {
        videoId: "5tVbFfGDQCk",
        title: "How To Conduct User Interviews Like A Pro",
        channel: "CareerFoundry",
        duration: "9:05",
        approximateViews: "約 16.9 萬次觀看",
        checkedAt,
        selectionReason:
          "涵蓋準備、主持與避免偏誤的完整入門流程，觀看與互動表現穩定。適合先看示範，再用中文題綱完成自己的研究。",
      },
    },
  },
  {
    id: 4,
    phase: 2,
    order: "04",
    topic: "情境觀察",
    title: "看見說不出口的需求：觀察行為與環境",
    level: "入門",
    estimatedTime: "70 分鐘",
    prerequisites: ["完成單元 03 的訪談試作"],
    objectives: [
      "設計一份包含人物、行為、物件、環境與互動的觀察框架。",
      "從同一段情境筆記中分開描述、推論與需要再查證的問題。",
    ],
    theory: [
      "人們說的、做的與真正需要的可能不同；觀察讓研究者看見習慣、替代物、繞路與環境限制。",
      "好的田野筆記先寫可見事實，再另欄寫解讀。照片與錄音需取得同意，也要避免蒐集不必要的個資。",
      "極端使用者能放大需求，但不能代表所有人；要把特殊案例當成洞察來源，而非人口統計結論。",
    ],
    exercises: [
      "選一個公共流程觀察 10 分鐘，記錄人物、行為、物件、環境與互動各兩項。",
      "把筆記用兩色標為「看見／聽見」與「我的推論」，找出三個混寫的位置。",
      "根據訪談與觀察差異，寫出兩個下一輪要查證的研究問題。",
    ],
    outcome: "能以倫理且可追溯的方式，補上訪談難以說出的情境證據。",
    project: "作品集里程碑 04｜情境觀察頁",
    skills: ["田野觀察", "證據分層", "研究倫理"],
    rhythm: "看 15 分鐘 → 現場觀察 20 分鐘 → 整理與反思 30 分鐘",
    media: {
      zh: {
        videoId: "Ju3VoF2DFnc",
        title: "設計思考入門課程｜2-3 觀察 Observation",
        channel: "Alpha Team Aha!",
        duration: "8:19",
        approximateViews: "約 7,600 次觀看",
        checkedAt,
        selectionReason:
          "繁體中文內容聚焦設計思考中的觀察方法，與上一單元同屬一致的學習脈絡。觀看與互動表現穩定，適合作為田野練習前的操作提示。",
      },
      en: {
        videoId: "fqNAWyOOVfw",
        title: "The Importance of Empathy in UX Design",
        channel: "Grow with Google",
        duration: "36:48",
        approximateViews: "約 14.7 萬次觀看",
        checkedAt,
        selectionReason:
          "完整說明同理在 UX 研究中的角色與偏誤，來源具教學權威且觀看與互動表現突出。篇幅較長，建議分段觀看並立刻套用觀察框架。",
      },
    },
  },
  {
    id: 5,
    phase: 3,
    order: "05",
    topic: "親和圖與洞察",
    title: "不要只做便利貼牆：把資料變成可辯論的洞察",
    level: "入門",
    estimatedTime: "80 分鐘",
    prerequisites: ["至少兩份訪談或觀察紀錄"],
    objectives: [
      "把研究片段拆成單一意義單位，透過親和分群命名重複模式。",
      "用「證據＋張力＋意義」寫出三則可被反駁的洞察句。",
    ],
    theory: [
      "綜整不是摘要每位受訪者，而是跨資料尋找重複、矛盾、例外與行為背後的理由。",
      "親和圖由下而上分群：先移動資料，再命名群組；若先決定分類，容易只得到既有框架。",
      "洞察必須超越觀察又仍可追溯證據。把猜測寫成事實，是這個階段最危險的捷徑。",
    ],
    exercises: [
      "把研究紀錄切成至少 20 張「一張一件事」的資料卡。",
      "不預設分類完成兩輪親和分群，替每群寫動詞式標題並保留兩張反例卡。",
      "寫三則洞察句，每則附兩筆證據、一個張力與一個仍待查證的假設。",
    ],
    outcome: "能從零散研究資料提出有證據、可討論且能引導設計的洞察。",
    project: "作品集里程碑 05｜親和圖與洞察清單",
    skills: ["研究綜整", "親和圖", "洞察撰寫"],
    rhythm: "看 12 分鐘 → 資料拆卡 20 分鐘 → 分群 30 分鐘 → 洞察撰寫 15 分鐘",
    media: {
      zh: {
        videoId: "Acyx99s3_NQ",
        title: "心智圖到親和圖：以上班摸魚為例",
        channel: "Moocs Wedia",
        duration: "5:24",
        approximateViews: "約 240 次觀看",
        checkedAt,
        selectionReason:
          "中文資源供給較少，這支用具體例子呈現從散點到分群的過程，操作契合度高。觀看量有限，因此搭配英文專業教學與本課證據規則使用。",
      },
      en: {
        videoId: "P86AHRyfdjk",
        title: "Affinity Mapping: Organize Your UX Research and Data",
        channel: "UXtweak",
        duration: "4:50",
        approximateViews: "約 1.4 萬次觀看",
        checkedAt,
        selectionReason:
          "以完整小案例展示資料卡、分群與命名，短而可跟做；在同題材候選中兼具清晰度與可查證的觀看數及互動表現。",
      },
    },
  },
  {
    id: 6,
    phase: 3,
    order: "06",
    topic: "使用者旅程",
    title: "沿著時間找機會：畫出體驗的高低起伏",
    level: "入門",
    estimatedTime: "75 分鐘",
    prerequisites: ["完成單元 05 的洞察清單"],
    objectives: [
      "以單一人物、情境與目標建立有起訖範圍的使用者旅程。",
      "標示行動、接觸點、想法、情緒、痛點與機會，找出兩個關鍵時刻。",
    ],
    theory: [
      "旅程地圖不是流程圖；它把時間序列和人的目標、情緒、接觸點放在同一張圖上。",
      "一張圖只服務一個清楚情境。混合多種角色與目標，會得到誰都不精準的平均旅程。",
      "情緒曲線必須有證據來源。痛點不等於機會，還要判斷重要性、可介入性與對整體旅程的連鎖影響。",
    ],
    exercises: [
      "選一則代表性研究故事，定義旅程的角色、目標、起點與終點。",
      "完成至少六階段的旅程，逐格填入行動、接觸點、想法與情緒證據。",
      "圈出兩個關鍵時刻，為每個時刻寫一則機會假設與需要補查的資料。",
    ],
    outcome: "能把研究洞察放回時間與情境，辨識真正影響體驗的關鍵時刻。",
    project: "作品集里程碑 06｜使用者旅程地圖",
    skills: ["旅程地圖", "接觸點", "機會辨識"],
    rhythm: "看 18 分鐘 → 畫骨架 15 分鐘 → 補證據 25 分鐘 → 檢查 12 分鐘",
    media: {
      zh: {
        videoId: "uDZvGqDcXw0",
        title: "服務設計入門 Ep2：使用者旅程地圖超展開",
        channel: "Unblock",
        duration: "12:38",
        approximateViews: "約 1 萬次觀看",
        checkedAt,
        selectionReason:
          "華語教學把旅程地圖放進服務設計實務，能看到欄位如何轉成分析；在中文候選中觀看與互動表現較突出，也有完整示範。",
      },
      en: {
        videoId: "2W13ext26kQ",
        title: "Customer Journey Mapping 101",
        channel: "NNgroup",
        duration: "2:18",
        approximateViews: "約 28.1 萬次觀看",
        checkedAt,
        selectionReason:
          "NN/g 用短篇精準定義旅程地圖的必要構件，來源具 UX 方法權威且長期觀看穩定。它適合當檢核表，實作深度由中文案例補足。",
      },
    },
  },
  {
    id: 7,
    phase: 4,
    order: "07",
    topic: "POV 與 HMW",
    title: "重新定義問題：從洞察寫出設計觀點",
    level: "入門",
    estimatedTime: "65 分鐘",
    prerequisites: ["至少一則有證據的洞察", "一張使用者旅程地圖"],
    objectives: [
      "用「使用者＋需求＋洞察」撰寫聚焦且不含解法的 POV。",
      "將 POV 轉成範圍適中的 HMW 問句，並用五項準則檢查品質。",
    ],
    theory: [
      "POV 不是重述抱怨，而是選擇一個值得介入的使用者、需求與令人意外的理由。",
      "How Might We 把限制改寫成探索邀請；太窄只剩一個答案，太寬則無法指導發想。",
      "框題就是做取捨。若團隊無法說明為何選這個問題，後續創意數量再多也只是噪音。",
    ],
    exercises: [
      "用同一則洞察寫三個不同焦點的 POV，標出各自放棄了什麼。",
      "把選定 POV 改寫成五個尺度不同的 HMW，從中選出兩題並說明理由。",
      "用「以人為中心、開放、可行動、有證據、不含解法」互評同伴題目。",
    ],
    outcome: "能把研究證據收斂成既聚焦又保留解法空間的問題框架。",
    project: "作品集里程碑 07｜POV／HMW 決策頁",
    skills: ["問題框定", "POV", "How Might We"],
    rhythm: "看 15 分鐘 → 三版 POV 20 分鐘 → HMW 15 分鐘 → 同儕互評 10 分鐘",
    media: {
      zh: {
        videoId: "hBaMU_tZTWM",
        title: "設計思考入門線上課程｜3-4 設計觀點 POV",
        channel: "Alpha Team Aha!",
        duration: "7:15",
        approximateViews: "約 5,900 次觀看",
        checkedAt,
        selectionReason:
          "繁體中文逐步拆解 POV 的組成，正好銜接本課的研究洞察。觀看與互動表現穩定；HMW 的尺度判斷則由練習與英文資源補強。",
      },
      en: {
        videoId: "kT0ZqwdPYRM",
        title: "User Need Statements in Design Thinking",
        channel: "NNgroup",
        duration: "3:07",
        approximateViews: "約 10.3 萬次觀看",
        checkedAt,
        selectionReason:
          "NN/g 清楚示範需求陳述如何避免偷渡功能，兼具權威性與良好的觀看及互動表現。它讓學員能反查自己的 POV 是否仍以人與需求為中心。",
      },
    },
  },
  {
    id: 8,
    phase: 4,
    order: "08",
    topic: "發想與收斂",
    title: "先讓選項變多，再用證據做選擇",
    level: "入門",
    estimatedTime: "80 分鐘",
    prerequisites: ["兩則通過檢核的 HMW 問句"],
    objectives: [
      "主持一輪分開發散與評估的創意活動，產出至少 30 個可區分的點子。",
      "建立包含使用者價值、證據、可行性與學習成本的收斂準則。",
    ],
    theory: [
      "發散階段追求選項與跨越既有解法，收斂階段才比較品質；兩者混在一起會讓早期批評扼殺弱訊號。",
      "個人先寫再共享能降低發言權力差異。把點子組合、反轉與推到極端，通常比等待靈感有效。",
      "投票只是偏好，不是證據。概念選擇要回到使用者需求、研究洞察與下一步可測性。",
    ],
    exercises: [
      "針對一題 HMW 做 8 分鐘 Crazy 8，再用組合與反轉把總數擴充到 30 個。",
      "將點子聚成 4–6 個概念家族，替每族寫一句價值主張與核心假設。",
      "用四項加權準則選出兩個概念，一個主案、一個刻意不同的備案。",
    ],
    outcome: "能建立多元選項，並以清楚準則選出最值得原型化的概念。",
    project: "作品集里程碑 08｜概念牆與決策矩陣",
    skills: ["腦力激盪", "Crazy 8", "概念評估"],
    rhythm: "看 12 分鐘 → 個人發散 15 分鐘 → 組合分群 20 分鐘 → 決策 25 分鐘",
    media: {
      zh: {
        videoId: "bA9QOGNSmQg",
        title: "設計思考入門課程｜4-5 點子的收斂法",
        channel: "Alpha Team Aha!",
        duration: "8:58",
        approximateViews: "約 4,200 次觀看",
        checkedAt,
        selectionReason:
          "直接處理發想後最容易被忽略的收斂步驟，能銜接本課決策矩陣。觀看量中等，但流程契合度高且語言負擔低。",
      },
      en: {
        videoId: "xXsHI_VlhmY",
        title: "IDEO: Brainstorming and Other Ideation Techniques",
        channel: "Stanford Biodesign",
        duration: "2:47",
        approximateViews: "約 13 萬次觀看",
        checkedAt,
        selectionReason:
          "以 IDEO 發想片段快速呈現團隊規則與能量，來源與設計創新教育直接相關且觀看與互動表現突出。它提供發散氛圍，中文資源補上收斂方法。",
      },
    },
  },
  {
    id: 9,
    phase: 5,
    order: "09",
    topic: "快速原型",
    title: "原型是問題，不是縮小版成品",
    level: "入門",
    estimatedTime: "85 分鐘",
    prerequisites: ["一個主概念與一個備案", "各自的核心假設"],
    objectives: [
      "為一項高風險假設選擇合適的原型解析度與互動範圍。",
      "在 45 分鐘內做出能讓使用者採取行動的低擬真原型。",
    ],
    theory: [
      "原型的目的不是展示完成度，而是讓一個重要問題可以被體驗、觀察與回答。",
      "紙張、角色扮演、故事板或假門都可能是原型；媒介要依假設選擇，而不是依團隊最熟的工具。",
      "太精緻會提高沉沒成本，也讓測試者不敢批評。只做足以取得下一個決策證據的細節。",
    ],
    exercises: [
      "列出主概念的三項假設，選出「若錯了，整案就不成立」的一項。",
      "為同一假設畫出紙上、角色扮演與數位三種原型方案，比較成本與可得證據。",
      "設定 45 分鐘上限完成一版原型，附一張「要驗證／刻意不驗證」說明卡。",
    ],
    outcome: "能用最低必要成本，把抽象想法變成可體驗、可觀察的學習工具。",
    project: "作品集里程碑 09｜低擬真原型 v1",
    skills: ["原型策略", "低擬真", "假設驗證"],
    rhythm: "看 18 分鐘 → 選假設 12 分鐘 → 原型衝刺 45 分鐘 → 自我檢核 8 分鐘",
    media: {
      zh: {
        videoId: "Jq3CZSJvNcs",
        title: "設計思考入門課程｜5-2 原型製作的要點",
        channel: "Alpha Team Aha!",
        duration: "8:34",
        approximateViews: "約 4,200 次觀看",
        checkedAt,
        selectionReason:
          "繁體中文內容明確區分原型與成品，適合在製作前校正期待。觀看量中等，但與 45 分鐘原型衝刺的教學目的高度一致。",
      },
      en: {
        videoId: "d5_h1VuwD6g",
        title: "Rapid Prototyping Google Glass",
        channel: "TED-Ed",
        duration: "8:09",
        approximateViews: "約 46.1 萬次觀看",
        checkedAt,
        selectionReason:
          "Tom Chi 用 Google Glass 實例示範快速、針對假設的原型迭代，案例具體且觀看與互動表現突出。重點可跨越工具版本，適合建立原型思維。",
      },
    },
  },
  {
    id: 10,
    phase: 5,
    order: "10",
    topic: "使用者測試",
    title: "測行為，不考使用者：主持一輪有用的測試",
    level: "入門",
    estimatedTime: "90 分鐘",
    prerequisites: ["一版可體驗原型", "清楚的測試假設"],
    objectives: [
      "撰寫不洩漏操作答案的情境任務、開場說明與觀察紀錄表。",
      "完成三位參與者的測試，依證據區分阻礙、疑問、新點子與有效部分。",
    ],
    theory: [
      "可用性測試是在測設計，不是在考使用者。主持人要讓參與者放心說出困惑，也不能急著教。",
      "任務應描述目標與情境，不應寫出按鈕名稱或操作步驟。鼓勵放聲思考，但以實際行為為主要證據。",
      "三位參與者足以暴露早期重大問題，卻不足以代表市場比例；定性發現與量化結論要分開。",
    ],
    exercises: [
      "為原型寫一段中立開場、兩個情境任務與五欄觀察表。",
      "先做一場試測，回看自己是否提示、辯解或問了「你喜歡嗎」。",
      "完成三位參與者測試，依嚴重度整理發現並改出原型 v2。",
    ],
    outcome: "能主持不誘導的早期測試，並用觀察證據決定下一輪修改。",
    project: "作品集里程碑 10｜測試紀錄與原型 v2",
    skills: ["可用性測試", "主持", "迭代決策"],
    rhythm: "看 20 分鐘 → 寫腳本 15 分鐘 → 三場測試 35 分鐘 → 整理迭代 15 分鐘",
    media: {
      zh: {
        videoId: "mHafnhdH4KE",
        title: "如何做用戶測試／可用性測試？",
        channel: "仁樂一家 Ren & Le",
        duration: "7:40",
        approximateViews: "約 940 次觀看",
        checkedAt,
        selectionReason:
          "以中文 UX 實務直接說明使用者測試操作，適合第一次主持前快速複習。觀看與互動表現有限，因此搭配 Google 的長篇示範交叉學習。",
      },
      en: {
        videoId: "nYCJTea1AUQ",
        title: "Usability Testing Tips and Examples",
        channel: "Grow with Google",
        duration: "1:03:37",
        approximateViews: "約 11.2 萬次觀看",
        checkedAt,
        selectionReason:
          "提供從規劃、主持到案例的完整教學，來源具教學權威且觀看與互動表現突出。片長較長，可依本課腳本與主持段落選看。",
      },
    },
  },
  {
    id: 11,
    phase: 6,
    order: "11",
    topic: "服務藍圖",
    title: "補上看不見的系統：從旅程走到服務藍圖",
    level: "進階入門",
    estimatedTime: "80 分鐘",
    prerequisites: ["一張使用者旅程", "一版測試後原型"],
    objectives: [
      "將關鍵旅程拆成使用者行動、前台、後台、支援流程與證據。",
      "找出兩個前後台斷點，提出包含責任、資源與風險的改善方案。",
    ],
    theory: [
      "旅程地圖以使用者經驗為中心；服務藍圖再加入組織如何在前台與後台共同交付經驗。",
      "互動線、可見線與內部互動線幫助團隊定位失敗發生在哪個交接，而不是只修飾接觸點。",
      "理想藍圖若沒有角色、資源與例外處理就只是願望。每項改變都要檢查營運可行性與服務公平性。",
    ],
    exercises: [
      "選旅程中的一個關鍵場景，排出使用者行動與可見接觸點。",
      "補上前台人員、後台流程、支援系統與實體證據，標出三條分隔線。",
      "找出兩個失敗點，為每點寫責任角色、預防機制、復原方式與成功指標。",
    ],
    outcome: "能把好點子接回實際交付系統，辨識前台體驗背後的營運條件。",
    project: "作品集里程碑 11｜服務藍圖",
    skills: ["服務設計", "前後台協作", "失敗點分析"],
    rhythm: "看 18 分鐘 → 畫前台 15 分鐘 → 補後台 25 分鐘 → 風險檢查 17 分鐘",
    media: {
      zh: {
        videoId: "Np5UIJmtgO4",
        title: "服務設計入門 Ep3：Service Blueprint 與 Ecosystem Map",
        channel: "Unblock",
        duration: "11:26",
        approximateViews: "約 6,500 次觀看",
        checkedAt,
        selectionReason:
          "華語資源以實務語言串起服務藍圖與生態系圖，在同題材中文候選中觀看與互動表現突出。適合由使用者旅程進一步看見組織系統。",
      },
      en: {
        videoId: "-glgJ9U_Fsk",
        title: "What is a Service Blueprint?",
        channel: "PlaybookUX",
        duration: "3:52",
        approximateViews: "約 13.8 萬次觀看",
        checkedAt,
        selectionReason:
          "以簡潔圖例說明服務藍圖各層與用途，觀看與互動表現突出且容易跟做。它提供結構骨架，中文資源補上服務設計脈絡。",
      },
    },
  },
  {
    id: 12,
    phase: 6,
    order: "12",
    topic: "提案與作品集",
    title: "用證據說故事：交付一份可展示的設計提案",
    level: "進階入門",
    estimatedTime: "95 分鐘",
    prerequisites: ["完成研究、框題、原型、測試與服務藍圖里程碑"],
    objectives: [
      "用挑戰、證據、洞察、取捨、原型、測試與下一步組成八頁提案。",
      "進行一次 6 分鐘提案與設計批評，依回饋完成最終修訂。",
    ],
    theory: [
      "好提案不是活動流水帳，而是讓觀眾看懂：為何這個問題重要、證據如何改變決策、解法還有哪些限制。",
      "展示被推翻的假設與迭代，能證明學習能力；只展示漂亮終稿，反而隱藏設計推理。",
      "設計批評要對準目標、證據與具體決策。把回饋分成必修、待查與暫不採用，避免照單全收。",
    ],
    exercises: [
      "把 11 份里程碑排成「問題—證據—轉折—解法—學習」故事線，刪除無法支持決策的材料。",
      "完成八頁提案：挑戰、研究、洞察、框題、概念、原型、測試、下一步。",
      "錄製 6 分鐘提案，邀請兩人依目標、證據、清晰度與可行性回饋，再交付修正版。",
    ],
    outcome: "能以可追溯的研究與迭代證據，說明一項服務或產品設計決策。",
    project: "結業作品｜八頁設計提案＋服務藍圖＋原型 v2",
    skills: ["設計敘事", "提案", "設計批評"],
    rhythm: "看 18 分鐘 → 編排故事 25 分鐘 → 製作提案 35 分鐘 → 試講與修訂另約 15 分鐘",
    media: {
      zh: {
        videoId: "D6-eQb7jsSk",
        title: "設計提案讀心術！掌握細節必殺技",
        channel: "dxpresso 週週濃縮",
        duration: "12:43",
        approximateViews: "約 2,300 次觀看",
        checkedAt,
        selectionReason:
          "中文內容聚焦設計提案溝通而非一般簡報技巧，能直接連到結業交付。觀看量中等，但對設計情境的契合度高。",
      },
      en: {
        videoId: "l0hVIH3EnlQ",
        title: "The Secret to Successfully Pitching an Idea",
        channel: "TED",
        duration: "4:47",
        approximateViews: "約 76.3 萬次觀看",
        checkedAt,
        selectionReason:
          "以短篇幅拆解提案如何建立可信度與行動邀請，觀看與互動表現突出。它提供敘事原則，本課八頁結構則確保設計證據不被故事掩蓋。",
      },
    },
  },
];

export const capstoneChecklist = [
  "一張有範圍的設計挑戰卡",
  "至少三份訪談／觀察證據",
  "親和圖、洞察與使用者旅程",
  "POV、HMW 與概念決策矩陣",
  "兩輪原型與三人測試紀錄",
  "服務藍圖與八頁提案",
];
