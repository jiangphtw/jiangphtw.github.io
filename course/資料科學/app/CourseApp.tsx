"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Lesson = {
  id: number;
  phase: number;
  week: string;
  topic: string;
  title: string;
  channel: string;
  videoId: string;
  duration: string;
  level: "入門" | "中階" | "進階";
  views: string;
  signal: string;
  skills: string[];
  reason: string;
  outcome: string;
  project?: string;
};

type LessonDetail = {
  zhVideoId: string;
  zhTitle: string;
  zhChannel: string;
  zhDuration: string;
  zhViews: string;
  zhReason: string;
  objectives: string[];
  theory: string[];
  exercises: string[];
};

const phases = [
  { id: 1, label: "打穩地基", weeks: "W1–4", accent: "#ff8a65" },
  { id: 2, label: "駕馭資料", weeks: "W5–8", accent: "#f4c767" },
  { id: 3, label: "洞察與管線", weeks: "W9–12", accent: "#6fd6b8" },
  { id: 4, label: "機器學習", weeks: "W13–16", accent: "#7c6cf2" },
  { id: 5, label: "深度與生成式 AI", weeks: "W17–20", accent: "#9f8cff" },
  { id: 6, label: "產品化與作品集", weeks: "W21–24", accent: "#ff7196" },
];

const lessons: Lesson[] = [
  {
    id: 1,
    phase: 1,
    week: "第 1 週",
    topic: "版本控制",
    title: "Git and GitHub for Beginners — Crash Course",
    channel: "freeCodeCamp.org",
    videoId: "RGOj5yH7evk",
    duration: "1 小時 08 分",
    level: "入門",
    views: "400 萬+",
    signal: "教學社群長年推薦",
    skills: ["Git", "GitHub", "協作"],
    reason:
      "資料專案不是只交一份 Notebook。這支片用一個多小時走完 commit、branch、merge 與遠端協作，是進入所有實作前最短、最穩的共同語言。",
    outcome: "能建立可追蹤、可協作、可回復的資料科學專案。",
    project: "作品 01｜建立你的第一個 Data Science Portfolio Repo",
  },
  {
    id: 2,
    phase: 1,
    week: "第 1–2 週",
    topic: "Python",
    title: "Learn Python — Full Course for Beginners",
    channel: "freeCodeCamp.org",
    videoId: "rfscVS0vtbw",
    duration: "4 小時 27 分",
    level: "入門",
    views: "4,880 萬+",
    signal: "全站級長青熱門",
    skills: ["Python", "函式", "資料結構"],
    reason:
      "近五千萬觀看的 Python 長青入門課，節奏清楚、範例密集，從語法一路到函式與物件；很適合零基礎建立後續資料處理所需的肌肉記憶。",
    outcome: "能獨立寫出可讀、可拆分的 Python 小程式。",
    project: "作品 02｜桌遊預約與會員管理 CLI",
  },
  {
    id: 3,
    phase: 1,
    week: "第 3–4 週",
    topic: "統計與機率",
    title: "Statistics — A Full University Course on Data Science Basics",
    channel: "freeCodeCamp.org",
    videoId: "xxpc-HPKN28",
    duration: "8 小時 15 分",
    level: "入門",
    views: "370 萬+",
    signal: "大學完整課・高正評",
    skills: ["機率", "推論統計", "假設檢定"],
    reason:
      "原課綱只把統計當先修，本版將它拉回主線。這門完整大學課涵蓋抽樣、分布、信賴區間與假設檢定，能避免只會呼叫模型、不會解釋不確定性。",
    outcome: "能判斷資料是否足以支持一個商業結論。",
    project: "作品 03｜A/B Test 成效分析與決策備忘錄",
  },
  {
    id: 4,
    phase: 2,
    week: "第 5 週",
    topic: "SQL 與資料庫",
    title: "SQL Tutorial — Full Database Course for Beginners",
    channel: "freeCodeCamp.org",
    videoId: "HXV3zeQKqGY",
    duration: "4 小時 20 分",
    level: "入門",
    views: "1,880 萬+",
    signal: "高觀看・高討論",
    skills: ["SQL", "MySQL", "JOIN"],
    reason:
      "長期累積近兩千萬觀看，從表格、鍵值、CRUD 到 JOIN 與巢狀查詢一次走完；既適合第一次學 SQL，也能作為面試前快速複習。",
    outcome: "能設計關聯式資料表並寫出分析查詢。",
    project: "作品 04｜電商訂單資料庫與營運查詢",
  },
  {
    id: 5,
    phase: 2,
    week: "第 6 週",
    topic: "數值運算",
    title: "Python NumPy Tutorial for Beginners",
    channel: "freeCodeCamp.org",
    videoId: "QUT1VHiLmmI",
    duration: "58 分",
    level: "入門",
    views: "700 萬+",
    signal: "短時數・高完成率",
    skills: ["NumPy", "Array", "向量化"],
    reason:
      "用不到一小時建立 ndarray、索引、形狀與向量化概念。它是從 Python list 過渡到 Pandas、scikit-learn 與深度學習 tensor 的最佳橋梁。",
    outcome: "能用向量化思維取代低效率迴圈。",
  },
  {
    id: 6,
    phase: 2,
    week: "第 6–7 週",
    topic: "資料清理與 EDA",
    title: "Data Analysis with Python — Full Course for Beginners",
    channel: "freeCodeCamp.org",
    videoId: "r-uOLxNrNk8",
    duration: "4 小時 32 分",
    level: "入門",
    views: "500 萬+",
    signal: "資料分析經典長課",
    skills: ["Pandas", "EDA", "Matplotlib"],
    reason:
      "把 NumPy、Pandas、資料清理與視覺化串成完整分析流程，而非零散 API 示範；學完能真正面對缺值、格式不一與離群值。",
    outcome: "能完成從原始 CSV 到可溝通洞察的 EDA 報告。",
    project: "作品 05｜紅酒品質探索分析與預測前處理",
  },
  {
    id: 7,
    phase: 2,
    week: "第 8 週",
    topic: "網路資料擷取",
    title: "Web Scraping with Python — Beautiful Soup Crash Course",
    channel: "freeCodeCamp.org",
    videoId: "XVv6mJpFOb0",
    duration: "1 小時 40 分",
    level: "入門",
    views: "140 萬+",
    signal: "實作導向・留言活躍",
    skills: ["BeautifulSoup", "HTML", "資料擷取"],
    reason:
      "從 HTML 結構到實際抓取職缺資料，案例完整且不拖沓。課程另補上 robots.txt、服務條款、限速與優先使用官方 API 的資料倫理。",
    outcome: "能建立合規、可維護的資料蒐集腳本。",
    project: "作品 06｜公開職缺技能需求追蹤器",
  },
  {
    id: 8,
    phase: 3,
    week: "第 9–10 週",
    topic: "BI 與資料故事",
    title: "Power BI Full Course Tutorial",
    channel: "Learnit Training",
    videoId: "e6QD8lP-m6E",
    duration: "8 小時 20 分",
    level: "入門",
    views: "240 萬+",
    signal: "完整度與實務口碑兼具",
    skills: ["Power BI", "DAX", "Dashboard"],
    reason:
      "少數同時涵蓋 Power Query、資料模型、DAX、儀表板、效能與無障礙的免費長課；比只教圖表按鈕更接近企業 BI 工作。",
    outcome: "能把分析結果轉成管理者可操作的互動儀表板。",
    project: "作品 07｜顧客消費與留存決策儀表板",
  },
  {
    id: 9,
    phase: 3,
    week: "第 11–12 週",
    topic: "資料工程",
    title: "Data Engineering Course for Beginners",
    channel: "freeCodeCamp.org",
    videoId: "PHsC_t0j1dU",
    duration: "3 小時 04 分",
    level: "中階",
    views: "100 萬+",
    signal: "新世代資料管線熱門課",
    skills: ["ETL", "Airflow", "dbt"],
    reason:
      "補上原課綱最明顯的斷層：資料如何可靠地抵達模型。課程以 Docker、SQL、dbt、Airflow、Airbyte 串出端到端管線。",
    outcome: "能解釋並實作擷取、轉換、排程與資料品質檢查。",
    project: "作品 08｜每日更新的公開資料 ETL Pipeline",
  },
  {
    id: 10,
    phase: 4,
    week: "第 13 週",
    topic: "機器學習觀念",
    title: "Machine Learning for Everybody — Full Course",
    channel: "freeCodeCamp.org",
    videoId: "i_LwzRVP7bg",
    duration: "3 小時 54 分",
    level: "入門",
    views: "1,000 萬+",
    signal: "超高觀看・5★課評",
    skills: ["監督式學習", "分群", "PCA"],
    reason:
      "從資料切分到分類、回歸、分群與 PCA 都用 Colab 實作，數學門檻友善；高觀看與課程平台滿分評價使它成為最穩的 ML 第一站。",
    outcome: "能選擇任務類型、建立基準模型並解讀評估結果。",
  },
  {
    id: 11,
    phase: 4,
    week: "第 14–16 週",
    topic: "scikit-learn 實戰",
    title: "Scikit-Learn Course — Machine Learning in Python",
    channel: "freeCodeCamp.org",
    videoId: "pqNCD_5r0IU",
    duration: "2 小時 42 分",
    level: "中階",
    views: "200 萬+",
    signal: "演算法實作高密度",
    skills: ["scikit-learn", "模型評估", "調參"],
    reason:
      "在建立 ML 心智模型後，用 KNN、SVM、迴歸、K-Means 與神經網路密集實作；特別適合把概念轉成可重複的訓練流程。",
    outcome: "能以 Pipeline、交叉驗證與合理指標比較模型。",
    project: "作品 09｜客戶流失預測與模型說明卡",
  },
  {
    id: 12,
    phase: 5,
    week: "第 17–18 週",
    topic: "深度學習",
    title: "PyTorch for Deep Learning & Machine Learning — Full Course",
    channel: "freeCodeCamp.org",
    videoId: "V_xro1bcAuA",
    duration: "25 小時",
    level: "中階",
    views: "300 萬+",
    signal: "25 小時旗艦課・高討論",
    skills: ["PyTorch", "CNN", "Training Loop"],
    reason:
      "不是速覽，而是從 tensor、訓練迴圈、GPU、分類、CNN 到自訂資料集的 25 小時旗艦課，能補足深度學習『會用但不懂訓練流程』的落差。",
    outcome: "能自行撰寫、訓練、診斷與保存神經網路。",
    project: "作品 10｜自訂影像分類器與實驗報告",
  },
  {
    id: 13,
    phase: 5,
    week: "第 18 週",
    topic: "電腦視覺",
    title: "OpenCV Course — Full Tutorial with Python",
    channel: "freeCodeCamp.org",
    videoId: "oXlwWbU8l2o",
    duration: "3 小時 42 分",
    level: "中階",
    views: "470 萬+",
    signal: "高觀看・課評 4.4/5",
    skills: ["OpenCV", "影像處理", "Face Detection"],
    reason:
      "從像素處理、色彩空間、輪廓與邊緣一路到人臉辨識，兼具傳統視覺與深度視覺入口；實作密度高，且有完整程式碼。",
    outcome: "能建立可解釋的影像前處理與偵測流程。",
  },
  {
    id: 14,
    phase: 5,
    week: "第 19 週",
    topic: "自然語言處理",
    title: "Natural Language Processing with spaCy & Python",
    channel: "freeCodeCamp.org",
    videoId: "dIUTsFT2MeQ",
    duration: "3 小時 20 分",
    level: "中階",
    views: "100 萬+",
    signal: "工業級 NLP 熱門入門",
    skills: ["spaCy", "NER", "文字分類"],
    reason:
      "spaCy 是偏生產環境的 NLP 工具。這支課將 tokenization、詞性、實體辨識與文字分類連到真實問題，比只做文字雲更貼近職場。",
    outcome: "能把非結構化文字轉成可分析特徵與標籤。",
    project: "作品 11｜新聞輿情與命名實體分析系統",
  },
  {
    id: 15,
    phase: 5,
    week: "第 20 週",
    topic: "LLM 全貌",
    title: "Deep Dive into LLMs like ChatGPT",
    channel: "Andrej Karpathy",
    videoId: "7xTGNNLPyMI",
    duration: "3 小時 31 分",
    level: "中階",
    views: "728 萬+",
    signal: "HN 582 分・高密度討論",
    skills: ["LLM", "SFT", "RLHF"],
    reason:
      "由 OpenAI 創始成員從資料、tokenization、預訓練、SFT、RLHF 到幻覺與工具使用完整拆解；2025 年後理解現代 AI 系統最重要的長課之一。",
    outcome: "能用正確心智模型評估 LLM 的能力、限制與風險。",
  },
  {
    id: 16,
    phase: 5,
    week: "第 20 週",
    topic: "Transformer 實作",
    title: "Let's build GPT: from scratch, in code, spelled out.",
    channel: "Andrej Karpathy",
    videoId: "kCc8FmEb1nY",
    duration: "1 小時 56 分",
    level: "進階",
    views: "735 萬+",
    signal: "HN 1,110 分・104 則深度討論",
    skills: ["Transformer", "Attention", "PyTorch"],
    reason:
      "這不是套 API，而是從 Bigram、self-attention 到 Transformer block 寫出小型 GPT。高觀看與技術社群討論度同時成立，是理解生成模型內部機制的首選。",
    outcome: "能逐層解釋 decoder-only Transformer 如何產生下一個 token。",
  },
  {
    id: 17,
    phase: 6,
    week: "第 21 週",
    topic: "資料產品",
    title: "Build 12 Data Science Apps with Python and Streamlit",
    channel: "freeCodeCamp.org",
    videoId: "JwSS70SZdyM",
    duration: "3 小時 12 分",
    level: "中階",
    views: "200 萬+",
    signal: "12 個作品・課評 5/5",
    skills: ["Streamlit", "資料產品", "部署"],
    reason:
      "一次做出 12 個分析與 ML 應用，能快速練習將 Notebook 轉成可操作產品；這正是作品集從『有模型』到『有人能用』的關鍵。",
    outcome: "能把分析、圖表與模型包成可分享的互動應用。",
  },
  {
    id: 18,
    phase: 6,
    week: "第 22 週",
    topic: "模型 API",
    title: "FastAPI Course for Beginners",
    channel: "freeCodeCamp.org",
    videoId: "7t2alSnE2-I",
    duration: "2 小時 40 分",
    level: "中階",
    views: "400 萬+",
    signal: "Python API 長青熱門",
    skills: ["FastAPI", "REST API", "Pydantic"],
    reason:
      "模型要被其他系統使用，就需要穩定 API。課程完整涵蓋路由、驗證、資料庫與認證，讓資料科學家能與後端、前端真正接軌。",
    outcome: "能將模型封裝成有輸入驗證與文件的 REST API。",
  },
  {
    id: 19,
    phase: 6,
    week: "第 23 週",
    topic: "容器化",
    title: "Docker Tutorial for Beginners",
    channel: "TechWorld with Nana",
    videoId: "3c-iBn73dDE",
    duration: "2 小時 56 分",
    level: "中階",
    views: "1,000 萬+",
    signal: "DevOps 經典高觀看",
    skills: ["Docker", "Container", "Compose"],
    reason:
      "以圖解建立 image、container、registry 與 compose 的完整心智模型，兼具高觀看與開發社群口碑；可解決『我的電腦明明能跑』的部署落差。",
    outcome: "能把資料應用封裝成一致、可攜的執行環境。",
  },
  {
    id: 20,
    phase: 6,
    week: "第 24 週",
    topic: "MLOps",
    title: "How to Build a Machine Learning Pipeline with MLOps",
    channel: "freeCodeCamp.org",
    videoId: "o6vbe5G7xNo",
    duration: "4 小時 30 分",
    level: "進階",
    views: "26 萬+",
    signal: "新課高互動・端到端實作",
    skills: ["MLflow", "ZenML", "監控"],
    reason:
      "觀看數不是唯一標準：這支較新的課以可測試程式碼、實驗追蹤、部署與監控完整收尾，內容時效性與端到端深度優於大量只談名詞的舊片。",
    outcome: "能追蹤實驗、版本化模型並設計最小可行監控。",
    project: "作品 12｜可部署、可追蹤的端到端 AI 產品",
  },
];

const lessonDetails: Record<number, LessonDetail> = {
  1: {
    zhVideoId: "FKXRiAiQFiY",
    zhTitle: "Git 和 GitHub 零基礎快速上手",
    zhChannel: "PAPAYA 電腦教室",
    zhDuration: "15 分 51 秒",
    zhViews: "27 萬+",
    zhReason:
      "繁體中文、視覺解說清楚，能在短時間分辨 Git 與 GitHub，並走過版本控制的核心操作；在同主題中文影片中兼具高觀看與高完成率。",
    objectives: [
      "理解版本控制如何保護實驗、程式與資料處理流程。",
      "能以 branch 與 pull request 完成最小協作流程。",
    ],
    theory: [
      "快照與提交：commit 是可追溯的專案狀態，不是單純備份。",
      "分支與合併：用獨立開發線隔離風險，再透過 merge 整合。",
      "遠端協作：clone、push、pull 與 pull request 構成團隊交付循環。",
    ],
    exercises: [
      "建立一個含 README、notebook 與 .gitignore 的資料專案。",
      "建立 feature/eda 分支，完成一次提交後合併回 main。",
      "替專案寫一則模擬 pull request，說明變更、驗證與風險。",
    ],
  },
  2: {
    zhVideoId: "zdMUJJKFdsU",
    zhTitle: "4 小時初學者 Python 教學",
    zhChannel: "GrandmaCan 我阿嬤都會",
    zhDuration: "4 小時",
    zhViews: "200 萬+",
    zhReason:
      "華語 Python 長課中的高人氣選擇，以大量動畫與實作降低語法門檻，涵蓋流程控制、函式、資料結構與物件概念。",
    objectives: [
      "能使用變數、條件、迴圈、函式與常用資料結構解題。",
      "養成拆解問題、命名與例外處理的基本程式習慣。",
    ],
    theory: [
      "資料型別決定可執行的操作；可變與不可變物件會影響副作用。",
      "控制流程描述決策與重複，函式則封裝可重用行為。",
      "模組化與單一職責讓資料流程更容易測試與維護。",
    ],
    exercises: [
      "寫一個函式清理姓名、電話與 Email，並處理缺值。",
      "用 list 與 dictionary 完成桌遊預約的新增、查詢、取消。",
      "為三個核心函式各設計正常、邊界與錯誤輸入測試。",
    ],
  },
  3: {
    zhVideoId: "3okbnliWIlU",
    zhTitle: "統計學（一）：基礎統計 Ch1 簡介",
    zhChannel: "NYCU OCW",
    zhDuration: "2 小時 09 分",
    zhViews: "28 萬+",
    zhReason:
      "陽明交通大學開放課程的正式大學講授，觀看數在中文統計長課中突出，能建立母體、樣本、變數與推論的正確語言。",
    objectives: [
      "區分描述統計、推論統計、母體參數與樣本統計量。",
      "能用抽樣與不確定性觀念解讀資料結論。",
    ],
    theory: [
      "集中趨勢與離散程度共同描述分布，平均數不能單獨代表資料。",
      "抽樣分布連接樣本與母體，是信賴區間與假設檢定的核心。",
      "p 值不是效果大小；統計顯著也不必然等於實務重要。",
    ],
    exercises: [
      "比較同一資料的平均數、中位數、標準差與 IQR。",
      "用重抽樣模擬 1,000 次樣本平均，觀察抽樣分布。",
      "為一個 A/B Test 寫出虛無假設、對立假設與決策準則。",
    ],
  },
  4: {
    zhVideoId: "gvRXjsrpCHw",
    zhTitle: "SQL 3 小時初學者教學",
    zhChannel: "GrandmaCan 我阿嬤都會",
    zhDuration: "2 小時 46 分",
    zhViews: "127 萬+",
    zhReason:
      "中文 SQL 長課中的百萬觀看代表作，從資料庫觀念、建表到 JOIN 與彙總完整走過，適合搭配英文主課反覆實作。",
    objectives: [
      "能設計具主鍵、外鍵與合理欄位型別的關聯式資料表。",
      "能以 SELECT、JOIN、GROUP BY 與子查詢回答商業問題。",
    ],
    theory: [
      "正規化降低重複與更新異常；主鍵與外鍵維持實體關係。",
      "JOIN 的本質是依條件組合關係，需注意粒度與重複列。",
      "聚合前先定義分析單位，避免 GROUP BY 產生錯誤解讀。",
    ],
    exercises: [
      "畫出顧客、訂單、商品三張表的 ER Diagram。",
      "寫查詢找出近 90 天營收最高的前 10 名商品。",
      "刻意製造一個重複 JOIN，說明數字膨脹原因並修正。",
    ],
  },
  5: {
    zhVideoId: "4xm8dyYIBSk",
    zhTitle: "Python NumPy 多維陣列 ndarray 基礎",
    zhChannel: "彭彭的課程",
    zhDuration: "29 分 56 秒",
    zhViews: "4.8 萬+",
    zhReason:
      "繁體中文 NumPy 教材中觀看與口碑兼具，集中解說 shape、dtype、索引與多維運算，適合快速補足英文主課的關鍵詞。",
    objectives: [
      "理解 ndarray 的 shape、axis、dtype 與 broadcasting。",
      "能用向量化運算取代逐筆 Python 迴圈。",
    ],
    theory: [
      "連續記憶體與固定型別使陣列運算比一般 list 更有效率。",
      "axis 指定沿哪個維度聚合；shape 決定資料的幾何結構。",
      "broadcasting 依相容維度擴展運算，但也可能悄悄產生錯誤。",
    ],
    exercises: [
      "建立 100×5 陣列並完成欄標準化。",
      "不用 for 迴圈計算每列與指定向量的歐氏距離。",
      "設計一個 broadcasting 錯誤案例，印出 shape 並修正。",
    ],
  },
  6: {
    zhVideoId: "w76oa7YzvkY",
    zhTitle: "3 小時 Pandas 入門教程",
    zhChannel: "kfsoft（粵語）",
    zhDuration: "3 小時 06 分",
    zhViews: "1 萬+",
    zhReason:
      "中文 Pandas 單支長課稀少，這門粵語課完整涵蓋 Series、DataFrame、清理、合併與分析；以完整度勝過大量片段式短片。",
    objectives: [
      "能讀取、檢查、清理、重塑與合併表格資料。",
      "能提出問題並以 EDA 找到分布、關係與異常。",
    ],
    theory: [
      "資料清理先處理型別、缺值、重複與粒度，再談圖表與模型。",
      "groupby 是 split–apply–combine；merge 則依鍵值組合資料。",
      "EDA 是形成與反駁假設的循環，不是無目的地畫圖。",
    ],
    exercises: [
      "對一份髒資料建立 data quality report。",
      "用 groupby 比較三個客群的平均客單與回購率。",
      "把清理步驟封裝成可重跑函式並輸出處理紀錄。",
    ],
  },
  7: {
    zhVideoId: "1PHp1prsxIM",
    zhTitle: "Python 爬蟲 2 小時初學者課程",
    zhChannel: "CodeShiba 程式柴",
    zhDuration: "1 小時 37 分",
    zhViews: "25 萬+",
    zhReason:
      "以 PTT、Hahow、Yahoo 電影三種頁面示範 requests、BeautifulSoup、AJAX 與 cookie，兼顧高觀看與多情境實作。",
    objectives: [
      "能判斷靜態 HTML、XHR/API 與動態頁面的資料來源。",
      "能建立遵守規範、具限速與錯誤處理的擷取流程。",
    ],
    theory: [
      "HTTP request/response、狀態碼與 headers 是爬蟲的溝通基礎。",
      "DOM 選擇器擷取結構；若資料來自 API，優先直接呼叫合法端點。",
      "robots.txt、服務條款、個資與請求頻率共同界定可做範圍。",
    ],
    exercises: [
      "擷取一個公開網站的 30 筆資料並輸出 CSV。",
      "加入 timeout、重試、User-Agent 與每次請求間隔。",
      "寫一頁資料來源卡，記錄授權、欄位、更新頻率與風險。",
    ],
  },
  8: {
    zhVideoId: "9RcQUhlIb_Y",
    zhTitle: "15 分鐘上手 Power BI",
    zhChannel: "PAPAYA 電腦教室",
    zhDuration: "14 分 51 秒",
    zhViews: "150 萬+",
    zhReason:
      "繁體中文 Power BI 入門影片的高觀看代表，以極短時間走過載入、關聯與視覺化，適合作為八小時英文主課前的全貌導覽。",
    objectives: [
      "能把商業問題轉成指標、維度與互動儀表板。",
      "理解 Power Query、資料模型與 DAX 各自負責的層次。",
    ],
    theory: [
      "星型模型以事實表儲存事件、維度表描述分析角度。",
      "DAX measure 依 filter context 動態計算，不等同試算表儲存格。",
      "好圖表先服務決策，再考慮裝飾；顏色與排序都應傳遞含義。",
    ],
    exercises: [
      "為電商資料建立日期、顧客、商品維度表。",
      "建立營收、客單價、回購率三個 DAX measures。",
      "用一頁儀表板回答『哪個客群值得增加預算？』。",
    ],
  },
  9: {
    zhVideoId: "1rr9NfPBHeE",
    zhTitle: "ETL 大解析：Data Pipeline 與資料工程師",
    zhChannel: "歐立威科技",
    zhDuration: "18 分 31 秒",
    zhViews: "5,500+",
    zhReason:
      "中文資料工程完整長課仍少，這支臺灣實務研討會精華清楚說明角色、ETL 與團隊分工；搭配英文主課可兼顧在地語境與實作深度。",
    objectives: [
      "能描述批次資料管線從來源到分析層的完整生命週期。",
      "理解排程、可重跑、資料品質與血緣為何重要。",
    ],
    theory: [
      "ETL 與 ELT 的差異在轉換發生位置與運算責任。",
      "冪等性讓同一批次重跑不重複污染資料。",
      "編排器管理相依、排程與重試；資料測試守住 schema 與商業規則。",
    ],
    exercises: [
      "畫出 API → raw → staging → mart 的資料流。",
      "寫一個可重跑且不重複寫入的每日匯入程式。",
      "為資料管線新增三項品質檢查與失敗通知規則。",
    ],
  },
  10: {
    zhVideoId: "wm9yR1VspPs",
    zhTitle: "機器學習 3 小時初學者教學",
    zhChannel: "GrandmaCan 我阿嬤都會",
    zhDuration: "2 小時 57 分",
    zhViews: "161 萬+",
    zhReason:
      "華語機器學習長課中的百萬觀看代表，以動畫與 Python 串起回歸、分類與深度學習，特別適合第一次建立整體地圖。",
    objectives: [
      "區分監督式、非監督式學習與分類、回歸任務。",
      "能建立 baseline，避免資料洩漏並選擇合理評估指標。",
    ],
    theory: [
      "模型從特徵學習輸入到目標的映射，泛化能力比訓練分數重要。",
      "訓練、驗證、測試需隔離；任何由全資料學得的處理都可能洩漏。",
      "偏差與變異描述欠擬合、過擬合之間的取捨。",
    ],
    exercises: [
      "為房價、流失、客群三題判斷任務類型與目標變數。",
      "建立 dummy baseline 並與第一個模型比較。",
      "列出五種可能的資料洩漏並逐一提出防法。",
    ],
  },
  11: {
    zhVideoId: "3m8Bb01uNNE",
    zhTitle: "Scikit-learn 入門",
    zhChannel: "kfsoft（粵語）",
    zhDuration: "1 小時 01 分",
    zhViews: "1.7 萬+",
    zhReason:
      "中文單支 scikit-learn 長課不多，這支從前處理到模型 API 都有跟做；內容完整度與單支觀看表現優於零散系列。",
    objectives: [
      "能用一致 API 建立 preprocessing、model 與 evaluation pipeline。",
      "能以交叉驗證、搜尋與合適指標比較候選模型。",
    ],
    theory: [
      "fit 學習參數，transform 改變資料，predict 產生輸出。",
      "Pipeline 將前處理與模型綁定，避免驗證時的資料洩漏。",
      "交叉驗證估計模型對未見資料的穩定度，調參需留出最終測試集。",
    ],
    exercises: [
      "用 ColumnTransformer 同時處理數值與類別欄位。",
      "比較 Logistic Regression、Random Forest 與 dummy baseline。",
      "用 confusion matrix 說明不同錯誤成本下的 threshold 選擇。",
    ],
  },
  12: {
    zhVideoId: "ejYbJ7YR_Gk",
    zhTitle: "2 小時從零實作 PyTorch 手寫數字分類",
    zhChannel: "Shady 的混亂空間",
    zhDuration: "2 小時 04 分",
    zhViews: "3 萬+",
    zhReason:
      "華語 PyTorch 單支實作課中觀看較高，從張量、資料載入到訓練手寫數字分類完整走過，可快速接上 25 小時英文旗艦課。",
    objectives: [
      "理解 tensor、autograd、loss、optimizer 與 training loop。",
      "能辨識欠擬合、過擬合並保存可重現模型。",
    ],
    theory: [
      "前向傳播產生預測與損失，反向傳播計算梯度，optimizer 更新參數。",
      "batch 將資料分段估計梯度，epoch 表示完整看過一次訓練集。",
      "train/eval 模式影響 dropout 與 batch normalization 行為。",
    ],
    exercises: [
      "手寫一個不封裝的 train loop 與 validation loop。",
      "比較兩個 learning rate 的 loss curve。",
      "保存模型、重新載入，並對五張自製圖片推論。",
    ],
  },
  13: {
    zhVideoId: "xjrykYpaBBM",
    zhTitle: "OpenCV 2 小時初學者教學",
    zhChannel: "GrandmaCan 我阿嬤都會",
    zhDuration: "2 小時 14 分",
    zhViews: "69 萬+",
    zhReason:
      "繁體華語 OpenCV 長課的高觀看首選，涵蓋讀圖、轉換、輪廓、臉部與物件辨識，動畫解說與程式實作兼具。",
    objectives: [
      "能以 OpenCV 完成影像讀取、轉換、特徵與偵測流程。",
      "理解傳統影像處理如何支援深度學習前後處理。",
    ],
    theory: [
      "影像是具有高度、寬度與通道的數值陣列。",
      "濾波、閾值、形態學與邊緣偵測將像素轉成可利用結構。",
      "座標系、色彩空間與縮放插值若處理錯誤會改變模型輸入分布。",
    ],
    exercises: [
      "建立灰階、模糊、Canny、輪廓四階段處理圖。",
      "在不同光線下測試固定閾值與自適應閾值。",
      "為一批圖片建立一致 resize、normalize 與品質檢查。",
    ],
  },
  14: {
    zhVideoId: "5J0X2SdvW3k",
    zhTitle: "AI 如何懂人話：NLP 自然語言處理",
    zhChannel: "PanSci 泛科學",
    zhDuration: "1 小時 41 分",
    zhViews: "3.5 萬+",
    zhReason:
      "由中央大學 NLP 教授完整對談，兼具華語脈絡、方法演進與產業應用；比單一工具教學更能補足理論與中文語言特性。",
    objectives: [
      "理解 tokenization、向量表示、序列建模與實體辨識。",
      "能評估中文斷詞、標註資料與模型偏誤問題。",
    ],
    theory: [
      "文字須先轉成 token 與數值表示，模型才能比較語意。",
      "傳統特徵、word embeddings 到 Transformer 的差異在上下文表示能力。",
      "precision、recall、F1 需依任務錯誤成本選擇，不能只看 accuracy。",
    ],
    exercises: [
      "比較兩種中文斷詞工具在專有名詞上的結果。",
      "標註 100 句新聞的組織、人物與地點實體。",
      "建立錯誤分析表，將模型錯誤分成斷詞、語境與標註問題。",
    ],
  },
  15: {
    zhVideoId: "yiY4nPOzJEg",
    zhTitle: "ChatGPT 原理剖析：常見誤解",
    zhChannel: "李宏毅 Hung-yi Lee",
    zhDuration: "19 分 59 秒",
    zhViews: "21 萬+",
    zhReason:
      "李宏毅教授以繁體中文拆解語言模型的能力邊界與常見誤解，觀看與討論度高，適合作為 Karpathy 深課前的概念校準。",
    objectives: [
      "能描述預訓練、指令微調、偏好對齊與推論的分工。",
      "理解 hallucination、context window、工具使用與知識截止。",
    ],
    theory: [
      "LLM 以 next-token prediction 學得壓縮的語言與世界規律。",
      "SFT 教模型遵循示例，偏好對齊再調整回答風格與安全行為。",
      "RAG 與工具把外部資料帶入上下文，但不自動保證真實性。",
    ],
    exercises: [
      "畫出一個 LLM 從預訓練到回答使用者的流程圖。",
      "設計五題測試知識、推理、工具與幻覺邊界。",
      "為一個 RAG 應用列出資料權限、引用與人工覆核點。",
    ],
  },
  16: {
    zhVideoId: "n9TlOhRjYoc",
    zhTitle: "機器學習 2021：Transformer（上）",
    zhChannel: "李宏毅 Hung-yi Lee",
    zhDuration: "32 分 48 秒",
    zhViews: "30 萬+",
    zhReason:
      "華語 Transformer 教學的代表作，以清楚圖解承接 self-attention、位置資訊與 encoder/decoder，技術社群長年引用。",
    objectives: [
      "能逐步說明 token embedding、attention、block 與輸出機率。",
      "能用小型資料實作 decoder-only Transformer 的最小版本。",
    ],
    theory: [
      "self-attention 以 query、key、value 計算序列內的資訊加權。",
      "位置編碼補回 attention 本身缺少的順序資訊。",
      "causal mask 阻止模型偷看未來 token，殘差與正規化穩定深層訓練。",
    ],
    exercises: [
      "用三個 token 手算一次 scaled dot-product attention。",
      "標註 GPT block 中 attention、MLP、residual、LayerNorm 的資料流。",
      "改變 context length 與 temperature，記錄生成品質差異。",
    ],
  },
  17: {
    zhVideoId: "W4vRsg0Ptw0",
    zhTitle: "用 Streamlit 製作並部署資料視覺化工具",
    zhChannel: "工程師 Yuanlin",
    zhDuration: "8 分 04 秒",
    zhViews: "1 萬+",
    zhReason:
      "中文 Streamlit 影片中觀看較高且內容新，直接示範資料視覺化與雲端分享；用短片掌握產品流程，再由英文主課補齊 12 個應用。",
    objectives: [
      "能把分析函式包成具輸入、狀態、圖表與快取的 Web App。",
      "理解資料產品的使用者流程、回饋與部署限制。",
    ],
    theory: [
      "Streamlit 以 script rerun 模型更新 UI，state 用來保存互動狀態。",
      "cache 降低重複載入與計算，但需管理輸入與失效條件。",
      "資料產品要同時處理錯誤輸入、等待狀態與結果解釋。",
    ],
    exercises: [
      "把一份 EDA notebook 改成三個互動區塊。",
      "加入檔案格式、缺欄與空資料的錯誤提示。",
      "找兩位使用者測試，記錄三個卡點並改版。",
    ],
  },
  18: {
    zhVideoId: "5bIJ1SwF2bk",
    zhTitle: "從 Flask 邁向 FastAPI：房屋估價模型服務",
    zhChannel: "PyCon Taiwan",
    zhDuration: "46 分 21 秒",
    zhViews: "5,000+",
    zhReason:
      "雖非最高觀看的 FastAPI 短介，但它是臺灣社群少數以真實 ML 模型服務完整比較 Flask 與 FastAPI 的長講，內容貼合本課目標。",
    objectives: [
      "能以 typed schema 建立模型預測 API 與自動文件。",
      "理解 HTTP、同步/非同步、驗證與錯誤回應。",
    ],
    theory: [
      "REST 以資源、方法與狀態碼定義清楚契約。",
      "Pydantic schema 在邊界驗證資料，避免錯誤進入模型。",
      "async 適合 I/O 等待，不會自動加速 CPU 密集模型推論。",
    ],
    exercises: [
      "建立 POST /predict，驗證欄位型別與合理範圍。",
      "為成功、缺欄、非法值與模型失敗各寫一個 API 測試。",
      "在 OpenAPI 文件補上 request/response 範例與模型版本。",
    ],
  },
  19: {
    zhVideoId: "Ozb9mZg7MVM",
    zhTitle: "30 分鐘 Docker 入門教程",
    zhChannel: "GeekHour",
    zhDuration: "26 分 01 秒",
    zhViews: "44 萬+",
    zhReason:
      "中文 Docker 入門中的高觀看影片，以動畫清楚區分 image、container、volume 與 network，能快速建立部署心智模型。",
    objectives: [
      "能撰寫 Dockerfile 並以 container 執行資料應用。",
      "理解 image layer、volume、network 與 Compose。",
    ],
    theory: [
      "image 是唯讀模板，container 是具可寫層的執行實例。",
      "layer cache 讓建置加速，Dockerfile 順序會影響快取命中。",
      "volume 保存資料，network 讓多個服務以名稱互通。",
    ],
    exercises: [
      "為 FastAPI 模型服務撰寫非 root、固定版本的 Dockerfile。",
      "用 Compose 串起 API 與資料庫並加 healthcheck。",
      "比較兩次 build 的 layer cache，將 image 體積縮小 20%。",
    ],
  },
  20: {
    zhVideoId: "z1hQaqesPos",
    zhTitle: "6 分鐘學會什麼是 MLOps",
    zhChannel: "Google Cloud APAC",
    zhDuration: "6 分 08 秒",
    zhViews: "4,000+",
    zhReason:
      "中文 MLOps 教材供給有限，這支由 Google Cloud APAC 以官方華語快速建立生命週期全貌，再由英文主課完成 MLflow、ZenML 與部署實作。",
    objectives: [
      "能設計資料、程式、實驗、模型與服務的版本鏈。",
      "理解 CI/CD/CT、監控、漂移與回滾策略。",
    ],
    theory: [
      "可重現需要同時鎖定程式、資料、環境、參數與隨機性。",
      "CI 驗證程式，CD 交付服務，CT 在條件成立時觸發再訓練。",
      "資料漂移不等於效能下降；監控需連結輸入、預測與真實結果。",
    ],
    exercises: [
      "用 MLflow 記錄三組參數、指標、artifact 與模型版本。",
      "設計資料漂移、延遲、錯誤率與商業 KPI 的監控表。",
      "寫一份模型發布 checklist，包含核准、canary、回滾與事故紀錄。",
    ],
  },
};

const originalSkills = [
  "程式語言",
  "資料庫",
  "網路爬蟲",
  "資料探勘",
  "資料視覺化",
  "機器學習",
  "影像辨識",
  "深度學習",
  "自然語言處理",
];

const addedSkills = [
  "Git 協作",
  "機率統計",
  "資料工程",
  "模型評估",
  "PyTorch",
  "生成式 AI",
  "API 服務",
  "Docker",
  "MLOps",
  "AI 倫理與治理",
];

function GiscusDiscussion() {
  const container = useRef<HTMLDivElement>(null);
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;
  const enabled = Boolean(repo && repoId && category && categoryId);

  useEffect(() => {
    if (!enabled || !container.current) return;
    container.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo!);
    script.setAttribute("data-repo-id", repoId!);
    script.setAttribute("data-category", category!);
    script.setAttribute("data-category-id", categoryId!);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "zh-TW");
    script.setAttribute("data-loading", "lazy");
    container.current.appendChild(script);
  }, [category, categoryId, enabled, repo, repoId]);

  if (!enabled) {
    return (
      <div className="giscus-setup">
        <div className="giscus-mark">g</div>
        <div>
          <strong>討論區元件已就緒</strong>
          <p>
            部署前在 <code>.env.local</code> 填入 4 個 giscus 參數，即會在此載入
            GitHub Discussions。設定範本已附在專案中。
          </p>
        </div>
        <a href="https://giscus.app/zh-TW" target="_blank" rel="noreferrer">
          取得設定 ↗
        </a>
      </div>
    );
  }

  return <div ref={container} className="giscus-frame" />;
}

export default function CourseApp() {
  const [selectedId, setSelectedId] = useState(1);
  const [phaseFilter, setPhaseFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState<number[]>([]);
  const [practiceDone, setPracticeDone] = useState<string[]>([]);
  const [videoLanguage, setVideoLanguage] = useState<"zh" | "en">("zh");
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-ds-course-progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const timer = window.setTimeout(() => setCompleted(parsed), 0);
        return () => window.clearTimeout(timer);
      } catch {
        window.localStorage.removeItem("ai-ds-course-progress");
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "ai-ds-course-progress",
      JSON.stringify(completed),
    );
  }, [completed]);

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-ds-practice-progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const timer = window.setTimeout(() => setPracticeDone(parsed), 0);
        return () => window.clearTimeout(timer);
      } catch {
        window.localStorage.removeItem("ai-ds-practice-progress");
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "ai-ds-practice-progress",
      JSON.stringify(practiceDone),
    );
  }, [practiceDone]);

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-ds-font-size");
    if (saved === "normal" || saved === "large") {
      const timer = window.setTimeout(() => setFontSize(saved), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ai-ds-font-size", fontSize);
  }, [fontSize]);

  const filteredLessons = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      const phaseMatches = phaseFilter === 0 || lesson.phase === phaseFilter;
      const detail = lessonDetails[lesson.id];
      const text = [
        lesson.topic,
        lesson.title,
        lesson.channel,
        detail.zhTitle,
        detail.zhChannel,
        ...lesson.skills,
      ]
        .join(" ")
        .toLowerCase();
      return phaseMatches && (!keyword || text.includes(keyword));
    });
  }, [phaseFilter, query]);

  const selected =
    lessons.find((lesson) => lesson.id === selectedId) ?? lessons[0];
  const detail = lessonDetails[selected.id];
  const activeVideo =
    videoLanguage === "zh"
      ? {
          id: detail.zhVideoId,
          title: detail.zhTitle,
          channel: detail.zhChannel,
          duration: detail.zhDuration,
          label: "中文教材",
        }
      : {
          id: selected.videoId,
          title: selected.title,
          channel: selected.channel,
          duration: selected.duration,
          label: "英文教材",
        };
  const progress = Math.round((completed.length / lessons.length) * 100);

  const chooseLesson = (id: number) => {
    setSelectedId(id);
    setVideoLanguage("zh");
    setNavOpen(false);
    window.setTimeout(() => {
      document
        .getElementById("lesson-player")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  };

  const toggleComplete = (id: number) => {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const togglePractice = (lessonId: number, exerciseIndex: number) => {
    const key = `${lessonId}-${exerciseIndex}`;
    setPracticeDone((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  return (
    <main className={fontSize === "large" ? "font-large" : ""}>
      <div className="progress-line" style={{ width: `${progress}%` }} />
      <header className="topbar">
        <a href="#top" className="brand" aria-label="資料科學家學習地圖首頁">
          <span className="brand-mark">DS</span>
          <span>
            <b>AI DATA PATH</b>
            <small>完整學習地圖</small>
          </span>
        </a>
        <nav aria-label="主選單">
          <a href="#curriculum">課程地圖</a>
          <a href="#upgrade">完整度比較</a>
          <a href="#discussion">共學討論</a>
        </nav>
        <div className="header-tools">
          <div className="font-size-control" role="group" aria-label="調整網站字體大小">
            <span>字體</span>
            <button
              className={fontSize === "normal" ? "active" : ""}
              onClick={() => setFontSize("normal")}
              aria-pressed={fontSize === "normal"}
            >
              一般
            </button>
            <button
              className={fontSize === "large" ? "active" : ""}
              onClick={() => setFontSize("large")}
              aria-pressed={fontSize === "large"}
            >
              大字
            </button>
          </div>
          <div className="header-progress">
            <span>{completed.length}/20 已完成</span>
            <div>
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
          <a className="course-overview-link" href="/courses.html" aria-label="回到課程總覽頁面">← 課程總覽</a>
        </div>
        <button
          className="mobile-menu"
          aria-label="開啟課程導覽"
          onClick={() => setNavOpen(!navOpen)}
        >
          {navOpen ? "×" : "☰"}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" />
        <div className="hero-copy">
          <div className="eyebrow">
            <span>2026 CURRICULUM</span>
            依 TibaMe 路線擴充設計
          </div>
          <h1>
            從資料到 AI 產品，
            <br />
            <em>不只學會模型。</em>
          </h1>
          <p>
            一條為零基礎轉職者設計的 24
            週完整路線。以原課綱九大能力為骨架，補上統計、資料工程、生成式
            AI、部署與 MLOps。每個單元都有中英雙語教材、理論導讀與課後練習，
            讓每一次觀看都通往一件能放進作品集的成果。
          </p>
          <div className="hero-actions">
            <button onClick={() => chooseLesson(1)}>開始第一堂課 <span>→</span></button>
            <a href="#curriculum">展開 24 週地圖</a>
          </div>
          <div className="hero-stats">
            <div><strong>24</strong><span>週系統訓練</span></div>
            <div><strong>40</strong><span>支雙語教材</span></div>
            <div><strong>95<sup>+</sup></strong><span>小時影音</span></div>
            <div><strong>12</strong><span>件作品集</span></div>
          </div>
        </div>
        <div className="hero-map" aria-label="六階段學習路線">
          <span className="map-label">YOUR ROUTE</span>
          {phases.map((phase, index) => (
            <button
              key={phase.id}
              className={`map-step step-${index + 1}`}
              onClick={() => {
                setPhaseFilter(phase.id);
                document
                  .getElementById("curriculum")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <i style={{ background: phase.accent }}>{String(phase.id).padStart(2, "0")}</i>
              <span>
                <small>{phase.weeks}</small>
                <b>{phase.label}</b>
              </span>
            </button>
          ))}
          <div className="route-line" />
          <div className="map-orb orb-a" />
          <div className="map-orb orb-b" />
        </div>
      </section>

      <section className="trust-strip">
        <span>選片標準</span>
        <p><b>01</b> 同主題中觀看數較高</p>
        <p><b>02</b> 按讚與留言互動</p>
        <p><b>03</b> 長期社群口碑</p>
        <p><b>04</b> 內容完整且可跟著實作</p>
        <small>觀看數與互動表現為 2026/07 查核時的近似值，會隨 YouTube 即時變動。</small>
      </section>

      <section className="course-shell" id="curriculum">
        <aside className={`course-nav ${navOpen ? "open" : ""}`}>
          <div className="nav-heading">
            <span>CURRICULUM</span>
            <strong>24 週課程</strong>
          </div>
          <label className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜尋技能或課程"
              aria-label="搜尋課程"
            />
          </label>
          <div className="phase-pills">
            <button
              className={phaseFilter === 0 ? "active" : ""}
              onClick={() => setPhaseFilter(0)}
            >
              全部
            </button>
            {phases.map((phase) => (
              <button
                key={phase.id}
                className={phaseFilter === phase.id ? "active" : ""}
                onClick={() => setPhaseFilter(phase.id)}
              >
                {phase.id}
              </button>
            ))}
          </div>
          <div className="lesson-list">
            {filteredLessons.length === 0 && (
              <p className="no-results">沒有符合的課程，換個關鍵字試試。</p>
            )}
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                className={`lesson-link ${selectedId === lesson.id ? "active" : ""}`}
                onClick={() => chooseLesson(lesson.id)}
              >
                <i className={completed.includes(lesson.id) ? "done" : ""}>
                  {completed.includes(lesson.id) ? "✓" : lesson.id}
                </i>
                <span>
                  <small>{lesson.week} · {lesson.topic}</small>
                  <b>{lesson.title}</b>
                </span>
                <em>›</em>
              </button>
            ))}
          </div>
        </aside>

        <div className="lesson-workspace" id="lesson-player">
          <div className="lesson-breadcrumb">
            <span>PHASE {selected.phase}</span>
            <i>/</i>
            <span>{selected.week}</span>
            <i>/</i>
            <b>{selected.topic}</b>
          </div>

          <div className="video-toolbar">
            <div>
              <span>雙語教材</span>
              <small>先用中文建立概念，再以英文完整實作</small>
            </div>
            <div className="language-tabs" role="tablist" aria-label="切換教材語言">
              <button
                className={videoLanguage === "zh" ? "active" : ""}
                onClick={() => setVideoLanguage("zh")}
                role="tab"
                aria-selected={videoLanguage === "zh"}
              >
                中文 <small>{detail.zhDuration}</small>
              </button>
              <button
                className={videoLanguage === "en" ? "active" : ""}
                onClick={() => setVideoLanguage("en")}
                role="tab"
                aria-selected={videoLanguage === "en"}
              >
                English <small>{selected.duration}</small>
              </button>
            </div>
          </div>

          <div className="video-frame">
            <iframe
              key={`${activeVideo.id}-${videoLanguage}`}
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?rel=0&modestbranding=1`}
              title={activeVideo.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className="lesson-title-row">
            <div>
              <span className="lesson-kicker">{selected.topic} · {activeVideo.label}</span>
              <h2>{activeVideo.title}</h2>
              <p>{activeVideo.channel} · {activeVideo.duration}</p>
            </div>
            <button
              className={`complete-button ${completed.includes(selected.id) ? "done" : ""}`}
              onClick={() => toggleComplete(selected.id)}
            >
              {completed.includes(selected.id) ? "✓ 已完成" : "標記完成"}
            </button>
          </div>

          <div className="lesson-columns">
            <article className="lesson-main">
              <div className="content-card goal-card">
                <span className="card-label">UNIT GOALS</span>
                <h3>這個單元要完成什麼？</h3>
                <ul className="learning-list">
                  {detail.objectives.map((objective, index) => (
                    <li key={objective}>
                      <i>{index + 1}</i>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="content-card reason-card">
                <span className="card-label">WHY THIS ONE</span>
                <h3>為什麼收錄這兩支影片？</h3>
                <div className="material-reason">
                  <div className="material-heading">
                    <b>中文</b>
                    <span>{detail.zhTitle}</span>
                  </div>
                  <p>{detail.zhReason}</p>
                  <div className="heat-row">
                    <span>▶ {detail.zhViews} 觀看</span>
                    <span>◎ {detail.zhChannel}</span>
                    <a
                      href={`https://www.youtube.com/watch?v=${detail.zhVideoId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      YouTube 原頁 ↗
                    </a>
                  </div>
                </div>
                <div className="material-reason">
                  <div className="material-heading">
                    <b>EN</b>
                    <span>{selected.title}</span>
                  </div>
                  <p>{selected.reason}</p>
                  <div className="heat-row">
                    <span>▶ {selected.views} 觀看</span>
                    <span>◉ {selected.signal}</span>
                    <a
                      href={`https://www.youtube.com/watch?v=${selected.videoId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      YouTube 原頁 ↗
                    </a>
                  </div>
                </div>
              </div>

              <div className="content-card theory-card">
                <span className="card-label">METHODS & THEORY</span>
                <h3>主要方法與理論</h3>
                <div className="theory-grid">
                  {detail.theory.map((item, index) => (
                    <div key={item}>
                      <i>{String(index + 1).padStart(2, "0")}</i>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-card outcome-card">
                <span className="card-label">LEARNING OUTCOME</span>
                <h3>這一堂要帶走什麼？</h3>
                <p>{selected.outcome}</p>
                {selected.project && (
                  <div className="project-chip">
                    <span>PROJECT</span>
                    {selected.project}
                  </div>
                )}
              </div>

              <div className="content-card practice-card">
                <div className="practice-heading">
                  <div>
                    <span className="card-label">AFTER CLASS</span>
                    <h3>課後練習</h3>
                  </div>
                  <span>
                    {
                      detail.exercises.filter((_, index) =>
                        practiceDone.includes(`${selected.id}-${index}`),
                      ).length
                    }
                    /{detail.exercises.length} 完成
                  </span>
                </div>
                <div className="practice-list">
                  {detail.exercises.map((exercise, index) => {
                    const exerciseKey = `${selected.id}-${index}`;
                    const checked = practiceDone.includes(exerciseKey);
                    return (
                      <label className={checked ? "checked" : ""} key={exercise}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePractice(selected.id, index)}
                        />
                        <i>{checked ? "✓" : index + 1}</i>
                        <span>{exercise}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="practice-note">練習進度會保存在此瀏覽器中，不需登入。</p>
              </div>
            </article>

            <aside className="lesson-meta">
              <div className="meta-card">
                <span className="card-label">LESSON INFO</span>
                <dl>
                  <div><dt>難度</dt><dd>{selected.level}</dd></div>
                  <div><dt>建議節奏</dt><dd>每段約 25 分鐘</dd></div>
                  <div><dt>實作比例</dt><dd>70%</dd></div>
                  <div><dt>教材語言</dt><dd>中文 + English</dd></div>
                </dl>
              </div>
              <div className="meta-card">
                <span className="card-label">SKILLS</span>
                <div className="skill-tags">
                  {selected.skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </div>
              <div className="next-card">
                <small>NEXT UP</small>
                {selected.id < lessons.length ? (
                  <button onClick={() => chooseLesson(selected.id + 1)}>
                    <span>{lessons[selected.id].topic}</span>
                    <b>{lessons[selected.id].title}</b>
                    <i>→</i>
                  </button>
                ) : (
                  <p>恭喜！下一步是整理作品集與回顧學習紀錄。</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="roadmap-section">
        <div className="section-heading">
          <span>THE FULL ROADMAP</span>
          <h2>六個階段，從「看懂」走到「上線」</h2>
          <p>每一階段都以可驗收成果收尾，不把觀看時數誤認為學習成效。</p>
        </div>
        <div className="roadmap-grid">
          {phases.map((phase) => {
            const phaseLessons = lessons.filter((lesson) => lesson.phase === phase.id);
            return (
              <article key={phase.id} style={{ "--phase": phase.accent } as React.CSSProperties}>
                <div className="phase-number">0{phase.id}</div>
                <small>{phase.weeks}</small>
                <h3>{phase.label}</h3>
                <ul>
                  {phaseLessons.map((lesson) => (
                    <li key={lesson.id}>
                      <button onClick={() => chooseLesson(lesson.id)}>
                        {lesson.topic}<span>↗</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="phase-total">{phaseLessons.length} 門主課</div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="upgrade-section" id="upgrade">
        <div className="upgrade-copy">
          <span className="section-label">WHY MORE COMPLETE</span>
          <h2>保留原課綱的好骨架，<br />補上真正進入職場的最後一哩。</h2>
          <p>
            TibaMe 原課綱以 9 大職能建立清楚路線，本課程沿用相同漸進邏輯；
            但把現代資料團隊不可少的工程協作、統計判斷、資料管線、LLM
            與模型生命週期納入主線。
          </p>
          <a
            href="https://www.tibame.com/program/ai_datascientist"
            target="_blank"
            rel="noreferrer"
          >
            查看參考的原始課綱 ↗
          </a>
        </div>
        <div className="skill-compare">
          <div>
            <span>原課綱核心</span>
            <strong>9 項</strong>
            <ul>{originalSkills.map((skill) => <li key={skill}>✓ {skill}</li>)}</ul>
          </div>
          <div className="plus-column">
            <span>本課程新增</span>
            <strong>+10 項</strong>
            <ul>{addedSkills.map((skill) => <li key={skill}>+ {skill}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="method-section">
        <div className="section-heading">
          <span>CURATION NOTES</span>
          <h2>不是把熱門影片堆在一起</h2>
        </div>
        <div className="method-grid">
          <article>
            <b>01</b>
            <h3>先看主題內熱度</h3>
            <p>以觀看數、按讚與留言互動作第一輪篩選，再排除片段化、過時或無法跟做的內容。</p>
          </article>
          <article>
            <b>02</b>
            <h3>再看學習連續性</h3>
            <p>高觀看不必然適合這條路；每支片必須接得上前置能力，也要為下一個作品提供足夠技能。</p>
          </article>
          <article>
            <b>03</b>
            <h3>最後看職場可轉移性</h3>
            <p>優先選擇包含完整工作流程、公開程式碼與真實資料的長課，避免只會複製單一範例。</p>
          </article>
          <article>
            <b>04</b>
            <h3>加上風險註記</h3>
            <p>觀看、讚與留言會變動；工具版本也會更新。網站標示的是查核時近似人氣，而非永久排名。</p>
          </article>
        </div>
      </section>

      <section className="discussion-section" id="discussion">
        <div className="discussion-heading">
          <div>
            <span>LEARN IN PUBLIC</span>
            <h2>卡住時，別一個人硬撐。</h2>
          </div>
          <p>分享筆記、貼上可重現的錯誤、交換作品回饋。登入 GitHub 即可加入討論。</p>
        </div>
        <GiscusDiscussion />
      </section>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">DS</span>
          <div><b>AI DATA PATH</b><small>完整學習地圖</small></div>
        </div>
        <p>
          本站為公開學習資源策展，不隸屬 TibaMe、YouTube 或影片創作者。
          影片著作權歸原作者或權利人所有；觀看數以 YouTube 查核時顯示為準。
        </p>
        <div>
          <a href="#top">回到頂端 ↑</a>
        </div>
      </footer>
    </main>
  );
}
