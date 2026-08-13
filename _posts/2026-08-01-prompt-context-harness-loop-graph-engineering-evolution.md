---
layout: post
title: 從 Prompt 到 Graph Engineering：LLM 工程如何從下指令走向可控系統
subtitle: 完整梳理 Prompt、Context、Harness、Loop 與 Graph Engineering 的演進、瓶頸、控制單位與實務取捨
author: Paul Jiang
categories: AI
tags: LLM Prompt-Engineering Context-Engineering Harness-Engineering Loop-Engineering Graph-Engineering AI-Agent LangGraph GraphRAG
sidebar: []
excerpt_image: /assets/images/260813/prompt-to-graph-engineering-hero.png
---

> 本文整理至 **2026 年 8 月 13 日**。先說結論：`Prompt Engineering → Context Engineering → Harness Engineering → Loop Engineering → Graph Engineering` 並不是五個互相淘汰的世代，而是控制範圍逐層向外擴張的工程堆疊。
>
> 其中，**Graph Engineering 是 2026 年才快速流行的新標籤，底下的狀態機、工作流、DAG、多 Agent 編排與知識圖譜技術則早已存在**。因此，本文把它視為一個正在形成的實務語彙，而不是已由學界統一定義的正式學科。

大型語言模型剛進入大眾視野時，與模型互動最重要的問題是：「這句話究竟要怎麼寫，模型才會照做？」

幾年後，工程師面對的問題已完全不同：

- 該把哪些資料放進模型有限的注意力範圍？
- 模型如何安全地使用工具、檔案、終端與外部 API？
- Agent 如何持續執行、驗證結果、從錯誤復原並在適當時機停止？
- 多個 Agent、確定性程式、審核者與資料系統如何分工、平行與匯合？

這段歷史的本質，不是提示詞失去價值，而是**工程師控制 AI 系統的單位，從一句文字逐步擴大為完整的執行拓撲**。

![從單一 Prompt、Context、工具與 Loop 演進為可治理的工作圖](/assets/images/260813/prompt-to-graph-engineering-hero.png)

_圖：AI 生成的概念主視覺。單一輸入逐步加入 Context、工具與資料來源，經過回饋迴圈後，展開成具有平行路徑、驗證閘門與人工核准的工作圖。_

---

# 1. 先釐清：這不是四次革命，而是五層控制範圍

把演進史畫成直線很方便，卻也容易產生誤解。

今天建置 Graph workflow 時，節點內仍然需要好的 Prompt；每一次模型呼叫仍然要管理 Context；每個 Agent 仍然需要 Harness；許多節點內部仍會執行 Loop。新的工程層次只是把舊層次包進更大的系統，而不是將其刪除。

![Prompt Engineering 到 Graph Engineering 的五層堆疊](/assets/images/260813/prompt-engineering-evolution-stack.svg)

_圖：五個層次的控制單位依序從單次模型呼叫、Token 組合、執行環境、任務週期，擴張到整個多節點系統。_

可以先用一張表掌握全貌：

| 工程層次 | 大致成為焦點的時期 | 主要控制單位 | 工程師的核心問題 | 代表方法 |
| --- | --- | --- | --- | --- |
| Prompt Engineering | 2020–2022 | 單次模型輸入與輸出 | 如何用文字讓模型理解任務？ | Instruction、Role、Few-shot、CoT、結構化輸出 |
| Context Engineering | 2023–2025 | 一次推論可見的 Token | 此刻應讓模型看到哪些資訊？ | RAG、記憶裁剪、檢索、Compaction、Just-in-time Context |
| Harness Engineering | 2024–2026 | 模型周圍的執行環境 | 模型如何可靠地讀寫世界？ | Tools、Sandbox、Filesystem、Permissions、Tracing、Persistence |
| Loop Engineering | 2025–2026 | 單一任務的反覆執行週期 | 如何讓 Agent 做到完成，而不是只回答一次？ | Investigate → Implement → Verify → Repeat、停止條件、獨立驗證 |
| Graph Engineering | 2026 起，名詞仍在形成 | 多節點與多 Agent 的拓撲 | 如何讓複雜 AI 系統可預測、可治理、可平行與可復原？ | State graph、Conditional edge、Fan-out/Fan-in、Subgraph、Checkpoint、HITL |

表中的年份表示「討論焦點明顯升高」，不是發明年份。ReAct 在 2022 年已提出推理與行動交錯的 Agent 方法，LangGraph 也早在「Graph Engineering」一詞流行前就提供狀態圖與持久化能力。**技術通常先出現，後來才被新的名稱重新整理。**

---

# 2. 第一階段：Prompt Engineering——控制「模型這一次怎麼回答」

## 2.1 為什麼 Prompt 最先成為工程問題

2020 年的 GPT-3 論文展示：不更新模型權重，只在文字輸入中放入指令或少量範例，模型就能進行 zero-shot、one-shot 與 few-shot 任務。這使自然語言第一次成為廣泛可用的模型控制介面。

當時工程師能直接控制的東西不多，最有槓桿的位置就是輸入文字本身：

- 指定模型扮演的角色
- 描述任務與限制
- 提供少量輸入／輸出示例
- 規定回覆格式
- 把複雜問題拆成步驟

2022 年的 Chain-of-Thought（CoT）研究進一步顯示，提供中間推理示例能明顯改善大型模型在算術、常識與符號推理上的表現。Prompt 因而不只是「問得有禮貌」，而是成為一種啟發模型能力的介面設計。

## 2.2 這一階段的瓶頸

Prompt Engineering 很快遇到三個無法只靠措辭解決的限制：

1. **模型不知道訓練後才發生的事。** 再精美的 Prompt 也不會自動取得公司今天的庫存或剛更新的法規。
2. **模型看不到企業私有資料。** 知識若不在 Context 裡，模型就無從使用。
3. **一次回覆不是一項完整工作。** 寫程式、研究與訂票都需要工具、狀態與多步驟互動。

因此，工程焦點從「一句話怎麼寫」移向更大的問題：**模型在產生這次答案以前，究竟看到了什麼？**

---

# 3. 第二階段：Context Engineering——控制「模型此刻看見什麼」

## 3.1 Context 不只等於 Prompt

Prompt 通常指人類撰寫的指令；Context 則是模型在一次推論中收到的全部 Token，可能包含：

- System instructions
- 使用者訊息與歷史對話
- Few-shot 範例
- RAG 檢索到的文件
- 工具說明與工具回傳結果
- Agent 的計畫、工作筆記與記憶
- 其他 Agent 交付的中間產物

因此，Context Engineering 的核心不是把 Prompt 寫得更長，而是**從所有可能資訊中，挑出當下最有用、最可信、最節省注意力的組合**。

## 3.2 為什麼 Context Window 變長仍不夠

長 Context 一度讓人以為：「只要把全部資料塞進去，問題就解決了。」但 2023 年的 `Lost in the Middle` 研究指出，即使模型支援長輸入，當關鍵資訊位於長 Context 中間時，效能仍可能顯著下降。

問題也不只在準確度：

- 無關 Token 會分散注意力
- 工具輸出可能非常冗長
- 歷史對話會持續累積舊決策與錯誤資訊
- 長輸入增加延遲與成本
- 資料來源若沒有時間、權限與可信度資訊，檢索再多也不代表答案可靠

因此，RAG、Contextual Retrieval、工具結果清理、訊息裁剪、摘要壓縮（compaction）與按需讀取資料逐漸成為系統核心。Anthropic 在 2025 年將 Context Engineering 概括為：在有限 Context Window 中，持續策展最適合產生目標行為的 Token。

## 3.3 關鍵轉折

Prompt Engineering 問的是：

> 「我要怎麼說？」

Context Engineering 問的是：

> 「模型在這一刻，最少需要知道什麼？」

但即使模型看到了正確資料，它仍然只是在產生 Token。若要修改檔案、查詢資料庫、執行程式、等待核准並保存進度，系統還需要一個能讓模型行動的外部環境。

---

# 4. 第三階段：Harness Engineering——控制「模型如何接觸真實世界」

## 4.1 Harness 是什麼

Harness 可以翻成「外部框架」或「執行鷹架」。它不是模型本身，也不只是一個 Prompt，而是包住模型、讓模型可以安全工作的整套環境：

- 工具與 Function Calling
- 檔案系統、Shell 與程式執行環境
- Sandbox 與權限邊界
- 短期／長期記憶
- Context 壓縮與跨階段筆記
- 錯誤處理、重試與續跑
- Tracing、Logging、Evals 與成本追蹤
- Human-in-the-loop 核准機制

同一個模型放進不同 Harness，實際能完成的工作可能差異極大。模型決定「下一步想做什麼」，Harness 則決定「它能做什麼、看得到什麼、做錯時會發生什麼」。

## 4.2 為什麼這一層出現

單次 API 呼叫適合摘要、分類與生成文字，卻不適合長時間任務。現實工作通常需要：

1. 讀取現況
2. 擬定計畫
3. 呼叫工具或修改環境
4. 檢查執行結果
5. 根據錯誤調整
6. 保存進度後繼續

Anthropic 在 2024 年的 `Building Effective Agents` 將「預先定義路徑的 workflow」與「由模型動態決定工具及流程的 agent」加以區分；OpenAI 的 Agents SDK 則把 tools、handoffs、guardrails 與 tracing 做成 Agent 系統的一級元件。這些發展顯示，工程焦點已經從模型回答品質擴展到**整個執行環境的可靠性**。

## 4.3 Harness 與 Loop 的差別

兩者經常被合稱，但仍可清楚區分：

- **Harness 是空間性的**：Agent 周圍有哪些工具、資料、權限與安全設施？
- **Loop 是時間性的**：Agent 要按照什麼週期持續工作，何時重試，何時停止？

Harness 像一間設備與規則完整的實驗室；Loop 則像在實驗室內反覆執行的研究流程。

---

# 5. 第四階段：Loop Engineering——控制「Agent 如何做到完成」

## 5.1 從 ReAct 到可驗證的工作迴圈

2022 年的 ReAct 已經將 reasoning 與 acting 交錯，讓模型能根據環境觀察選擇下一個動作。後續的 Reflection、Self-correction 與 coding agents，則讓「執行後再讀結果」成為常見模式。

到 2026 年，`Loop Engineering` 成為開發者社群常用的說法。它關心的不只是讓 Agent 不斷重試，而是設計一個**有證據、有停止條件、有成本上限的反覆工作週期**：

```text
Investigate → Implement → Verify → Decide
      ↑                           │
      └──────── 未通過，修正 ─────┘
                                  │
                              通過或停止
```

真正重要的不是箭頭，而是 `Verify` 與 `Decide`：

- 驗證最好來自測試、規則、資料或獨立評估者，而不是讓模型自己宣稱完成
- 迴圈要有最大步數、時間與成本限制
- 相同失敗不應無限重試
- 高風險或不可逆操作必須交由人類核准
- 每輪應留下可追蹤的輸入、動作、結果與錯誤

## 5.2 為什麼 Loop 還不夠

單一 Loop 適合一個 Agent 逐步完成一項任務，但當系統開始包含研究、撰寫、查證、安全審查、部署與人工核准時，問題不再只是「下一輪做什麼」。

此時會出現新的瓶頸：

- 哪些工作可以平行？
- 不同 Agent 的輸出在哪裡匯合？
- 某一條路徑失敗時，只重跑該分支還是全部重來？
- 哪個節點有權讀取敏感資料或執行不可逆操作？
- 如何對特定節點做單元評測，並對全流程做端到端評測？

當一個 Loop 無法清楚表達多角色、多分支與多種失敗路徑時，工程師自然會把它提升為 Graph。

---

# 6. 第五階段：Graph Engineering——控制「整個系統如何流動」

## 6.1 一個務實的定義

截至 2026 年 8 月，Graph Engineering 還沒有唯一、正式的定義。本文採用最實用的版本：

> **Graph Engineering 是把 AI 應用表示為可執行的圖，明確設計節點、共享狀態、依賴關係、條件路由、平行／匯合、驗證閘門、復原路徑與人工權限邊界。**

一張圖通常包含：

- **Node**：一次 LLM 呼叫、完整 Agent、確定性函式、API、資料庫查詢、測試或人工決策
- **Edge**：允許的下一步與依賴關係
- **State**：節點之間傳遞的共享資料、進度、錯誤與核准紀錄
- **Router / Conditional Edge**：根據規則或模型判斷選擇路徑
- **Fan-out / Fan-in**：拆分平行任務，再匯合結果
- **Subgraph**：將專門流程封裝成可重用或可委派的子圖
- **Checkpoint**：保存狀態，以便中斷、續跑、回溯與除錯
- **Gate**：測試、政策、成本或人工審核閘門

![Graph Engineering 工作圖的節點、路由、平行分支、驗證與復原](/assets/images/260813/graph-engineering-anatomy.svg)

_圖：研究寫作工作圖的簡化例子。研究工作平行執行後匯合；未通過驗證時只沿失敗路徑診斷與讀取檢查點，高風險結果則進入人工審核。_

## 6.2 為什麼 2026 年特別需要這個關注點

### 原因一：完全自主的路徑難以治理

若把所有決策都交給一個 Agent，流程只存在於模型的隱含狀態與對話紀錄中。它可能重複呼叫工具、提早結束，或在成本很高的路徑上不斷探索。

Graph 的做法是收回部分控制權：讓 LLM 在 Node 內處理語意與不確定性，Node 之間的轉移則由明確規則、State 與 Gate 約束。

### 原因二：多 Agent 需要拓撲，而不只是更多 Agent

增加 Agent 數量不等於增加系統能力。若沒有清楚的任務分解、資料契約、合併方式與衝突處理，更多 Agent 只會產生更多訊息與成本。

Graph 迫使工程師回答：誰先做、誰可平行、誰負責彙整、誰驗證、誰有最終權限。

### 原因三：生產環境需要可追蹤與可復原

LangGraph 的 persistence 會在圖的步驟間保存 State snapshot，支援 human-in-the-loop、記憶、time travel、錯誤後續跑與狀態檢查。這些能力讓「流程圖」不只是一張簡報，而成為真正的執行與除錯單位。

### 原因四：評測粒度必須變細

只評分最終答案，無法知道問題發生在檢索、路由、工具、摘要還是驗證。Graph 可以針對單一 Node 建立測試，並追蹤每條 Edge 的選擇是否合理，再搭配端到端評測觀察整體結果。

---

# 7. 三種「Graph」不要混為一談

草稿中提到 Workflow Graph、Graph of Thoughts 與 GraphRAG。三者都使用圖結構，但解決的問題不同。

| 名稱 | 圖中的 Node／Edge 代表什麼 | 主要用途 | 與 Graph Engineering 的關係 |
| --- | --- | --- | --- |
| Workflow / Agent Graph | 任務、Agent、工具、狀態與執行依賴 | 控制整個 AI 系統如何運作 | 本文所稱 Graph Engineering 的核心 |
| Graph of Thoughts（GoT） | 中間想法與想法之間的依賴、合併或回饋 | 探索非線性的推理拓撲 | 可成為某個推理 Node 的內部方法 |
| GraphRAG / Knowledge Graph | 實體、事件、概念與其關係 | 讓檢索保留關聯、社群與全域結構 | 可作為 Graph 中的知識與檢索層 |

2023 年的 Graph of Thoughts 將 LLM 產生的中間資訊視為任意圖，允許分流、合併與回饋；Microsoft GraphRAG 則從文件擷取實體與關係、建立知識圖譜並進行社群摘要，以回答需要全域理解的問題。

它們都很重要，但不能因此推論：「使用 GraphRAG 就完成了 Graph Engineering。」一個系統可以使用 GraphRAG 檢索，執行流程卻仍只是單一 Agent Loop；也可以擁有精密的 Workflow Graph，卻完全不使用知識圖譜。

---

# 8. 什麼時候該用 Loop，什麼時候才需要 Graph

Graph 並不一定比較先進。它增加狀態設計、節點契約、觀測、部署與維護成本；路徑定義得太早，也可能限制模型原本有價值的彈性。

## 適合維持單一 Prompt 或 Workflow

- 一次摘要、分類、抽取或格式轉換
- 路徑固定、步驟少、風險低
- 結果可立即由人類檢查

## 適合使用單一 Agent Loop

- 任務需要探索，但由同一個 Agent 負責最自然
- 工具與權限範圍清楚
- 有可靠驗證器與硬性停止條件
- 不需要複雜平行與角色分工

## 適合升級為 Graph

- 存在三條以上需要明確管理的分支或依賴
- 多個角色具有不同 Context、工具或權限
- 工作可以平行，之後需要可靠匯合
- 局部失敗必須局部復原，不宜全部重跑
- 流程包含政策、測試、成本或人工審核閘門
- 團隊需要追蹤每一步的狀態、來源與責任

一個實用原則是：**先用最簡單的 Loop 完成任務；只有當責任、權限、平行性或失敗邊界真的分裂時，才把它拆成 Graph。**

---

# 9. 五個階段真正改變的是「工程槓桿」

回顧這段演進，每一層都在處理上一層暴露的新瓶頸：

1. **Prompt Engineering**：模型已有能力，但需要用文字觸發與約束。
2. **Context Engineering**：文字寫得再好，也彌補不了缺少、過期或被雜訊淹沒的資訊。
3. **Harness Engineering**：資訊正確仍不代表能完成工作，模型需要工具、環境、權限與持久化。
4. **Loop Engineering**：有工具仍不代表能做到完成，系統需要反覆執行、外部驗證與停止條件。
5. **Graph Engineering**：單一 Loop 能工作，卻難以管理多角色、平行任務、局部復原與企業治理。

最精簡的說法是：

> Prompt 控制文字，Context 控制注意力，Harness 控制能力邊界，Loop 控制工作週期，Graph 控制整體拓撲。

未來名稱仍可能改變，但方向相當一致：**把只存在於自然語言與模型內部的隱含行為，逐步轉成可觀察、可測試、可復原、可治理的軟體系統。**

---

# 參考資料

- [Brown et al. (2020), Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165)
- [Wei et al. (2022), Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Yao et al. (2022), ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Liu et al. (2023), Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
- [Besta et al. (2023), Graph of Thoughts: Solving Elaborate Problems with Large Language Models](https://arxiv.org/abs/2308.09687)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic: Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [OpenAI: New Tools for Building Agents](https://openai.com/index/new-tools-for-building-agents/)
- [LangGraph Documentation: Workflows and Agents](https://docs.langchain.com/oss/python/langgraph/workflows-agents)
- [LangGraph Documentation: Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [Microsoft Research: Project GraphRAG](https://www.microsoft.com/en-us/research/project/graphrag/)
- [Addy Osmani: Loop Engineering](https://addyosmani.com/blog/loop-engineering/)

