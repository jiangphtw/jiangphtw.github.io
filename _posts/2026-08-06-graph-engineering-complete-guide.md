---
layout: post
title: "Graph Engineering 完整指南：把 Agent、狀態、分支、並行與知識關係設計成可治理的圖"
subtitle: "從 Workflow Graph、Reasoning Topology、GraphRAG，到 State、Reducer、Checkpoint、HITL、版本遷移、Observability 與 Evals"
author: Paul Jiang
date: 2026-08-06 09:00:00 +0800
categories: AI
tags: LLM Graph-Engineering AI-Agent LangGraph LlamaIndex Microsoft-Agent-Framework GraphRAG Workflow State-Machine Checkpoint Human-in-the-loop Observability Evals
sidebar: []
excerpt_image: /assets/images/260813/graph-engineering-complete-guide-hero.png
---

> **想先用生活故事理解？** 請看入門圖像版：[看漫畫學 AI 工程：Prompt、Context、Harness、Loop、Graph 一次看懂](/ai/2026/08/07/ai-engineering-beginner-comic-guide.html)。
>
> 本文更新於 **2026 年 8 月 13 日**，是 LLM 工程演進系列的第六篇。建議依序閱讀：[完整演進地圖](/ai/2026/08/01/prompt-context-harness-loop-graph-engineering-evolution.html)、[Prompt Engineering](/ai/2026/08/02/prompt-engineering-complete-guide.html)、[Context Engineering](/ai/2026/08/03/context-engineering-complete-guide.html)、[Harness Engineering](/ai/2026/08/04/harness-engineering-complete-guide.html) 與 [Loop Engineering](/ai/2026/08/05/loop-engineering-complete-guide.html)。
>
> 用一句話先下定義：**Graph Engineering 是把一個複雜 AI 系統拆成有契約的節點、可解釋的邊、可持久化的狀態與有界的循環，再工程化它的路由、並行、合流、復原、權限、觀測與評估。**

一個 Agent 能呼叫工具，不代表它已經是一套可靠系統。當任務開始出現多階段處理、條件分支、平行 Worker、Reviewer、人工核准、長時間等待、失敗復原，或需要把知識關係納入檢索時，單一 Prompt 或一個 `while` 迴圈就很難回答以下問題：

- 現在跑到哪一個節點？為什麼走這條邊？
- 三個平行結果要等全部、任一個，還是達到 quorum 才能合流？
- 兩個節點同時更新 State 時，誰覆蓋誰？
- 程式中斷後，從哪裡恢復？上一個外部操作到底成功了沒有？
- 哪些節點能用高權限工具？哪一條路徑必須讓人核准？
- 上線新版本時，舊的 in-flight run 與 State schema 怎麼辦？
- 錯誤來自 Node、Edge、Reducer、知識圖，還是整體拓撲？

這些才是 Graph Engineering 真正處理的問題。

![Graph Engineering 將執行控制、推理搜尋與知識關係組成可治理的 AI 系統](/assets/images/260813/graph-engineering-complete-guide-hero.png)

_AI 生成首圖：三個視覺區域分別暗示執行控制圖、分支合併的推理搜尋，以及實體關係知識圖；底部則是 State、Checkpoint 與通過驗證的產物。_

---

# 1. Graph Engineering 到底是什麼？

## 1.1 它是工程範疇，不是一個單一標準

截至 2026 年，「Graph Engineering」更適合被理解為一個逐漸成形的工程總稱，而不是由某一個組織定義、所有框架都遵守的正式標準。不同團隊談 Graph，可能是在談：

1. **Workflow／Control Graph**：如何執行 Agent、工具、驗證器與人工節點。
2. **Reasoning／Search Graph**：如何產生、評分、剪枝、合併多個候選路徑。
3. **Knowledge／Context Graph**：如何用實體、關係、事件與來源組織 Context。

三者都可以用 Node 與 Edge 表示，卻有不同的資料模型、Runtime、成本與 Evals。真正成熟的 Graph Engineering，第一步不是選框架，而是先說清楚你正在工程化哪一種 Graph。

## 1.2 一個最小形式化模型

可以把工作圖寫成：

```text
G = (V, E)

V：Node 集合；模型、工具、規則、人工、子圖都可以是 Node
E：Edge 集合；固定、條件式、事件驅動或動態產生的轉移
S：共享或分區的 State
T(v, S, input) -> (state_delta, events, route, artifacts)
```

但 Production graph 還需要補上：

```text
Graph System
= Topology
+ State schema / reducers
+ Node contracts
+ Routing and join semantics
+ Runtime / scheduler
+ Persistence / checkpoint
+ Side-effect policy
+ Identity / permissions / approvals
+ Budgets / stop rules
+ Trace / evals
+ Versioning / migration
```

只有 Node 與 Edge 的方塊圖，是 Architecture sketch；把上面這些語意補齊，才是 Engineering。

---

# 2. 三種最常被混在一起的 Graph

![Graph Engineering 中的執行控制圖、推理搜尋圖與知識脈絡圖比較](/assets/images/260813/graph-engineering-three-graphs.svg)

_同樣使用 Node 與 Edge，不代表可以共用同一套抽象。執行圖關心 Runtime；推理圖關心搜尋品質與成本；知識圖關心語意、來源與更新。_

## 2.1 Execution／Control Graph：系統要怎麼跑

這一類圖描述實際控制流程：

```text
Input
  -> Classifier / Router
  -> [Research A, Research B, Research C]  # fan-out
  -> Reducer / Synthesizer                # fan-in
  -> Verifier
     -> pass: Publish
     -> revise: Repair loop
     -> risky: Human approval
```

Node 可以是 deterministic function、LLM call、Agent loop、Tool、外部服務、Human task 或一個 Subgraph。Edge 則決定控制權和資料往哪裡移動。

[LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) 將自己定位為長時間、具狀態 Agent 的低階 orchestration runtime，強調 durable execution、streaming、human-in-the-loop 與 persistence；[Microsoft Agent Framework Workflows](https://learn.microsoft.com/en-us/agent-framework/workflows/) 則用 executors、edges、events 建構圖形工作流，並支援條件路徑、並行、checkpoint 與人工介入。這些都是 Execution Graph 的典型範圍。

## 2.2 Reasoning／Search Graph：候選路徑要怎麼探索

Chain-of-Thought 是單一路徑；[Tree of Thoughts](https://arxiv.org/abs/2305.10601) 讓系統探索多個候選並做 lookahead／backtracking；[Graph of Thoughts](https://arxiv.org/abs/2308.09687) 進一步允許不同 thought units 之間任意依賴、合併與轉換。

```text
Chain：A -> B -> C

Tree： A -> B1 -> C1
          \ B2 -> C2

Graph：A -> B1 --\
        \-> B2 ---> Merge -> D
             \----> B3 --/
```

工程上要設計的不是「叫模型多想幾步」，而是：

- Candidate 如何表示？是否能被機器驗證？
- Branching factor 與 depth 上限是多少？
- 用規則、外部 verifier 還是 evaluator model 評分？
- 何時剪枝、回溯或合併？
- 多樣性如何維持，避免三個分支其實是同一答案的改寫？
- 額外 Token、延遲與品質增益是否值得？

不是所有問題都適合 Tree 或 Graph search。可直接計算、工具結果唯一、低延遲的任務，多分支只會放大成本。它比較適合組合搜尋、規劃、開放式設計，或能用可靠 verifier 比較候選的問題。

> 對外的系統 Trace 應記錄候選、證據、分數、工具結果與路由理由，不需要要求或保存模型的私有隱藏推理。可觀測性應建立在可檢查的中間產物，而不是原始 chain-of-thought。

## 2.3 Knowledge／Context Graph：模型要看見什麼關係

Knowledge Graph 的 Node 可能是人物、組織、產品、地點、主張與事件；Edge 可能是任職、供應、持有、引用、發生於或因果關係。這時 Graph 的作用不是排程，而是組織 Context 與支援查詢。

Microsoft 的 [GraphRAG](https://github.com/microsoft/graphrag) 會從文本抽取 entities、relationships 與 claims，再建立 communities、community reports 與 embeddings。其官方查詢文件區分 [Local、Global、DRIFT 與 Basic Search](https://github.com/microsoft/graphrag/blob/main/docs/query/overview.md)：

- **Local Search**：從特定實體及其鄰域回答局部問題。
- **Global Search**：利用社群報告，透過 map-reduce 回答整個資料集的總體問題。
- **DRIFT Search**：結合社群資訊與局部展開，逐步探索。
- **Basic Search**：較接近一般向量 RAG 的基準路徑。

GraphRAG 不是 Workflow Graph。前者回答「哪些知識彼此相關」；後者回答「哪個工作接著執行」。兩者可以組合，例如 `retrieve_subgraph` 是執行圖中的一個 Node，但不可因此把兩個系統的更新、權限與 Evals 混在一起。

---

# 3. Loop Engineering 與 Graph Engineering 的差別

Loop 與 Graph 不是前後互斥的技術；它們控制不同維度。

| 維度 | Loop Engineering | Graph Engineering |
|---|---|---|
| 核心問題 | 同一 Agent 如何反覆行動、取得回饋並停止 | 多個 Node／Loop 如何分支、並行、合流與協調 |
| 基本單位 | Turn、Action、Observation、State delta | Node、Edge、Event、State、Subgraph |
| 主要風險 | 無限循環、沒有進展、成本放大 | 錯誤路由、State race、deadlock、錯誤合流、版本不相容 |
| 結束語意 | Success、budget、no-progress、human | Terminal node、join completion、cancel、interrupt、graph-wide budget |
| 常見測試 | Stop、retry、oscillation、trajectory | Node、route、reducer、subgraph、topology、recovery |

一個很實用的分層方式是：

```text
Graph：控制全局拓撲
  Node A：deterministic transform
  Node B：有界的 research loop
  Node C：parallel worker subgraph
  Node D：human approval
  Node E：publish side effect
```

Graph 本身也可以有 cycle，但每個 cycle 都必須有 entry、state transition、progress measure、budget、exit 與 escalation。DAG 很容易推理，卻無法自然表達 retry、repair、conversation 與 HITL；有 cycle 的 graph 更有能力，也更需要 Loop Engineering。

---

# 4. Execution Graph 的七個核心元件

## 4.1 State：不要把聊天紀錄當成全部狀態

State 是工作圖的共同語言。它至少要區分：

```json
{
  "run_id": "run_0182",
  "graph_version": "2026-08-13.3",
  "goal": {"type": "research_report", "topic": "Graph Engineering"},
  "route": "parallel_research",
  "facts": [],
  "claims": [],
  "artifacts": [],
  "errors": [],
  "approvals": [],
  "budgets": {"cost_left": 4.2, "seconds_left": 540},
  "node_attempts": {},
  "terminal": null
}
```

設計 State 時要回答：

- 哪些欄位是 durable，哪些只是 cache？
- 誰能讀、誰能寫？是 replace、append、set union 還是 custom reducer？
- 是否保存 provenance、timestamp、confidence 與 schema version？
- PII、secret、原始 tool output 是否真的應進入 checkpoint？
- 大型 Artifact 要放 object store，還是直接塞進 State？

Production 中通常只在 State 保存 URI、hash、metadata 與必要摘要，而不是把整個檔案、網站或 log 一路複製。

## 4.2 Node Contract：每個節點都應可單獨理解

一個 Node 不是只有函式名稱。它的 contract 應包含：

```text
Node Contract
= Typed input
+ Preconditions
+ Allowed state reads / writes
+ Model / prompt / tool / policy version
+ Permission and side-effect class
+ Timeout / retry / budget
+ Structured output or events
+ Postconditions
+ Error taxonomy
+ Idempotency behavior
+ Trace fields
```

能用 deterministic code 完成的 parsing、schema validation、ACL、數值計算與 route guard，不應交給 LLM。LLM 適合處理語意分類、開放式生成、模糊比對與規劃，但輸出仍應通過 schema 與 policy gate。

## 4.3 Edge 與 Router：路由是業務邏輯，不只是箭頭

Edge 可以是：

- 固定順序：A 完成後一定到 B。
- 條件式：依 State 或 verifier 結果選擇路徑。
- 事件驅動：特定 Event type 觸發 consumer。
- 動態 fan-out：依輸入產生 N 個工作項目。
- Interrupt／resume：等待外部事件後再繼續。

Router 最好回傳穩定的 route enum 與 evidence，而不是任意節點名稱：

```json
{
  "route": "NEEDS_HUMAN",
  "reason_code": "HIGH_RISK_PUBLISH",
  "evidence": ["policy://publish/public-site"],
  "confidence": 1.0
}
```

高風險路由應由規則或 policy engine 決定；LLM 可以提供建議，但不應靠一句自然語言自己授權自己。

## 4.4 Fan-out／Fan-in：並行容易，正確合流很難

Fan-out 必須定義：

- 最大 worker 數量與 child budget。
- 工作是否彼此獨立，還是共享可變狀態？
- Parent cancel／deadline 如何傳遞？
- 個別 worker 失敗時，是 fail-fast、降級還是繼續？

Fan-in 則要明確寫出 Join Contract：

| Join | 適用情境 | 主要風險 |
|---|---|---|
| ALL | 所有輸入都必要 | 慢節點拖住整體、deadlock |
| ANY | 第一個合格答案即可 | 慢結果仍在產生 side effect |
| QUORUM | 多數決或至少 N 個 | 分支不獨立造成假共識 |
| TIMEBOX | 時限內收集 best effort | 缺失資料必須被標記 |
| SCORE | 收到通過門檻的候選就結束 | evaluator 偏誤與校準 |

Reducer 要具備清楚的合併規則。若平行分支都對 `draft` 做 last-write-wins，結果只取決於誰最後完成，這不是推理，是 race condition。

## 4.5 Cycle：任何回邊都要有界

常見 Cycle 包括 retry、repair、replan、review-revise、clarification 與 HITL。每個 cycle 至少需要：

- 最大次數、時間、Token、成本與 side-effect 數。
- Error class 與 backoff／jitter。
- Progress measure 與 repeated-state detection。
- Best-so-far artifact。
- Escalation／partial-result／failed 路徑。

不要假設「Verifier 最後會通過」。Verifier 可能不穩定、標準互相矛盾，或任務根本不可完成。

## 4.6 Gate 與 Human-in-the-loop

Human node 不該只是 `input()`。它是一個可持久化狀態：

```text
PENDING -> CLAIMED -> APPROVED / REJECTED / EXPIRED / CANCELLED
```

要保存 approver identity、request version、展示給人的 Artifact hash、決定、理由與時間。若等待期間草稿被修改，舊核准不可自動套到新版本。

[LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) 會保存 State 並等待 resume；其文件也特別提醒，恢復後節點會從頭重新執行。因此 interrupt 前的 side effect 必須 idempotent，或被放到不會重跑的節點／安全邊界。

## 4.7 Subgraph：用邊界控制複雜度

Subgraph 應有明確 input／output schema、State ownership、budget、permission 與 version。常見劃分方式：

- 依能力：research、coding、review、publish。
- 依信任區：public-data、internal-data、privileged-action。
- 依生命週期：短任務、長時間等待、人工工作。
- 依團隊 ownership：每個子圖獨立發布與測試。

[LangGraph 的 Subgraph 文件](https://docs.langchain.com/oss/python/langgraph/use-subgraphs) 區分 per-invocation、per-thread 與 stateless persistence。這不是實作細節：它會決定多輪記憶是否隔離，以及同一 Subgraph 能否安全並行呼叫。

---

# 5. 一張 Production Graph 的解剖

![Graph Engineering 工作圖包含 Router、平行研究、Reducer、Verifier、人工審核、重試、Checkpoint 與發布](/assets/images/260813/graph-engineering-anatomy.svg)

_Node 只處理局部工作；State、Edge、Gate 與 Runtime 才負責全局一致性。圖中的 Retry 不是無限回頭，而是讀取 Checkpoint、帶著錯誤分類與剩餘 Budget 重新進入。_

以研究文章工作流為例，可以拆成：

1. `intake`：正規化題目、受眾、時間點與成功條件。
2. `plan`：列出需要證實的 claims 與 source policy。
3. `route`：依 claims 類型分派官方文件、論文、程式碼或新聞研究。
4. `research[*]`：平行蒐集證據，每個 worker 回傳結構化 claim／source／date。
5. `reduce_evidence`：去重、衝突偵測、保留 provenance。
6. `draft`：只使用合格證據生成草稿。
7. `verify`：檢查引用覆蓋率、時間一致性、連結、術語與格式。
8. `repair`：只修正失敗項，不重跑整張圖。
9. `human_review`：高風險結論或正式發布前核准。
10. `publish`：使用 idempotency key 產生唯一外部 side effect。

這個設計比「Research Agent、Writer Agent、Reviewer Agent」三個角色名稱更具體。角色是人類容易理解的包裝；Node contract、State、join 與 failure policy 才決定系統能不能運作。

---

# 6. Runtime：Graph 真正執行時發生什麼

![Graph Runtime 透過 State、Superstep、Reducer、Verifier 與 Checkpoint 支援並行和恢復](/assets/images/260813/graph-runtime-checkpoint-lifecycle.svg)

_可視化 Graph 不等於定義 Runtime 語意。必須知道平行節點何時可見彼此的 State、Reducer 如何合併、Checkpoint 在哪裡 commit，以及 resume 會重跑多少工作。_

## 6.1 Scheduler 與 Superstep

不同框架採不同模型。Microsoft Agent Framework 的 Graph workflow 文件說明其執行器採修改過的 Pregel／Bulk Synchronous Parallel 方式：每個 superstep 收集訊息、決定可執行節點、並行執行，再於 barrier 後移到下一步。這代表同一 superstep 的節點不應假設能立即讀到彼此尚未 commit 的寫入。

若使用事件驅動 Runtime，則要理解 event delivery 是 at-most-once、at-least-once，還是只有 process-local 保證。看到兩條 Edge，不等於知道訊息重送、順序與去重規則。

## 6.2 Checkpoint 與 Thread

[LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence) 會在 graph steps 建立 checkpoints，並依 thread 組織，支援 human-in-the-loop、memory、time travel 與 fault tolerance。設計時仍要自行定義：

- Checkpoint 邊界在 Node 前、Node 後或一個 superstep 後？
- Pending writes 是否保存？成功分支在另一分支失敗時會不會重跑？
- State snapshot 是否包含 prompt、model、tool 與 policy version？
- Retention、加密、刪除與租戶隔離怎麼處理？

## 6.3 不要假設 Exactly-once

外部 Email、Payment、Deploy、Publish、Delete 等 side effect，最危險的是「請求送出後 Runtime crash，沒有拿到回應」。重跑可能重複操作；不重跑又可能漏掉操作。

安全做法通常是：

1. 產生穩定 `operation_id`／idempotency key。
2. 在外部系統查詢 operation status。
3. 對未知結果先 reconcile，再決定是否重試。
4. 將不可逆操作隔離在小型、可稽核 Node。
5. Checkpoint 記錄 intent、request hash、external ID 與結果。

Checkpoint 解決「從哪裡繼續」，不會自動解決「外部世界是否已被改變」。

## 6.4 Graph version 與 State migration

上線新 Graph 時，正在等待核准或排隊的舊 run 仍可能在數天後恢復。至少要選擇一種策略：

- **Pin**：run 一生固定使用舊 graph／node／prompt／tool versions。
- **Migrate**：用可測試的 migration 將 State 轉到新 schema。
- **Restart**：取消舊 run，以新版本從安全起點重跑。
- **Drain**：停止建立舊 run，等既有工作完成後再移除。

不要在沒有 migration contract 的情況下，讓舊 checkpoint 直接進入新 Node。欄位同名也不代表語意相同。

---

# 7. 一個框架中立的 Graph 範例

下面的 Python 故意不綁定特定 LLM SDK。重點是 route、State delta、Reducer、Verifier 與 bounded cycle 都是顯式 contract。

```python
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Callable


class Route(str, Enum):
    RESEARCH = "research"
    DRAFT = "draft"
    REPAIR = "repair"
    HUMAN = "human"
    DONE = "done"
    FAILED = "failed"


@dataclass
class Evidence:
    claim: str
    source: str
    score: float


@dataclass
class GraphState:
    run_id: str
    topic: str
    evidence: list[Evidence] = field(default_factory=list)
    draft: str | None = None
    errors: list[str] = field(default_factory=list)
    revision: int = 0
    max_revisions: int = 2
    approved: bool = False
    terminal: str | None = None


Researcher = Callable[[str], list[Evidence]]
Writer = Callable[[str, list[Evidence]], str]


def reduce_evidence(branches: list[list[Evidence]]) -> list[Evidence]:
    """Deterministic fan-in: keep the best item for each claim/source pair."""
    best: dict[tuple[str, str], Evidence] = {}
    for branch in branches:
        for item in branch:
            key = (item.claim, item.source)
            if key not in best or item.score > best[key].score:
                best[key] = item
    return sorted(best.values(), key=lambda item: item.score, reverse=True)


def verify(state: GraphState) -> Route:
    state.errors.clear()
    if len(state.evidence) < 2:
        state.errors.append("insufficient_evidence")
    if not state.draft:
        state.errors.append("missing_draft")
    if any(item.score < 0.7 for item in state.evidence[:2]):
        state.errors.append("low_confidence_evidence")

    if not state.errors:
        return Route.HUMAN
    if state.revision < state.max_revisions:
        return Route.REPAIR
    state.terminal = "revision_budget_exhausted"
    return Route.FAILED


def run_graph(
    state: GraphState,
    researchers: list[Researcher],
    writer: Writer,
) -> GraphState:
    # Fan-out. A real runtime would execute these concurrently with child budgets.
    branch_results = [researcher(state.topic) for researcher in researchers]
    state.evidence = reduce_evidence(branch_results)
    state.draft = writer(state.topic, state.evidence)

    while True:  # Bounded by max_revisions through verify().
        route = verify(state)
        if route is Route.REPAIR:
            state.revision += 1
            state.draft = writer(state.topic, state.evidence)
            continue
        if route is Route.HUMAN:
            # Production code would persist an interrupt and resume later.
            state.terminal = "awaiting_human"
            return state
        return state
```

真正接上框架時，要把 research fan-out 換成受控並行，把 State 寫入 checkpoint store，把 human route 換成 interrupt，並為 side effect、取消、timeout、trace 與 migration 補上 Runtime contract。

---

# 8. 常見框架怎麼選？

這不是熱門度排名，而是抽象與使用情境比較。框架變化很快，正式採用前應再以官方文件和小型 failure test 驗證。

| 選項 | 核心抽象 | 適合 | 要特別確認 |
|---|---|---|---|
| [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) | State、Node、Edge、Checkpoint、Thread、Interrupt、Subgraph | 長時間、具狀態、需要顯式控制與恢復的 Agent graph | Reducer、Subgraph persistence、interrupt 重跑與 side-effect 邊界 |
| [LlamaIndex Workflows](https://developers.llamaindex.ai/python/llamaagents/workflows/) | Event-driven steps；event types 描述連接，Python 表達 branch／loop | RAG、Agent、事件驅動流程；希望 typed events 與 async-first | Dynamic event 的 bookkeeping、durability、deployment 與既有 LlamaIndex 整合 |
| [Microsoft Agent Framework Workflows](https://learn.microsoft.com/en-us/agent-framework/workflows/) | Executors、typed edges／events、WorkflowBuilder；Graph 與 Functional API | .NET／Python、企業整合、明確工作圖、checkpoint 與 HITL | 預覽／版本狀態、BSP 語意、部署環境與 connector maturity |
| Custom state machine／workflow engine | 自訂 Node／State／queue，或建立在既有 durable workflow 系統 | 範圍窄、規則固定、已有成熟平台與特殊合規需求 | 不要低估 visualizer、replay、checkpoint、migration、debugger 與 eval tooling 成本 |

LlamaIndex 官方把 Workflows 定義為 event-driven、step-based 的執行控制方式；Step 接收 Event、工作後回傳另一個 Event，並以 type annotation 連接 consumer。它刻意不把所有邏輯硬編碼成 DAG Edge，而是讓 branch、loop 與 concurrency 使用 Event 與一般 Python 表達。這說明「Graph Engineering」不要求所有實作都長得像顯式方塊圖；重要的是控制流與 State contract 能被驗證和觀測。

## 8.1 選型前的最小 Spike

不要只實作 happy path。用同一個小工作流測：

1. 三個分支中一個 timeout，另外兩個已成功。
2. Reducer 前 process crash，再 resume。
3. Interrupt 前已執行一次外部 API。
4. 同一 thread 同時收到兩個 resume。
5. Graph v2 讀取 Graph v1 checkpoint。
6. Parent cancel 時 child workers 是否停止。
7. Trace 能否回答「為什麼走到這個 Node」。

跑過這七種情境，比比較首頁功能清單更能看出框架是否適合你的系統。

---

# 9. GraphRAG 的工程重點

GraphRAG 最容易在 Demo 很漂亮、Production 很痛苦，因為抽取出來的圖不是天然真相。

## 9.1 建圖 Pipeline

一個典型 Knowledge Graph pipeline 是：

```text
Documents
-> chunk / parse
-> entity + relationship + claim extraction
-> entity resolution / canonicalization
-> provenance attachment
-> community detection
-> community summaries
-> embeddings / indexes
-> local / global / DRIFT query
```

每一步都可能產生誤差：同名異人、別名未合併、關係方向錯誤、時間過期、來源衝突、摘要遺漏。至少要保留 `source_id`、span／chunk、extraction version、timestamp 與 confidence，讓答案能回溯。

## 9.2 何時值得使用 GraphRAG

較適合：

- 問題跨越多份文件與多跳關係。
- 要回答整體主題、社群或演變，而非只找相似段落。
- 關係本身就是產品價值，例如供應鏈、組織、風險或研究脈絡。
- 有能力持續更新、評估 entity resolution 與 provenance。

不一定適合：

- 文件少、問題局部、普通 vector RAG 已能穩定回答。
- 來源變動很快，卻沒有增量更新與失效策略。
- 沒有 ground truth 評估抽取品質。
- 只是因為「Graph」聽起來比向量搜尋進階。

Microsoft GraphRAG 官方專案也直接提醒 indexing 可能昂貴，建議先從小資料集開始；它被定位為展示與研究方法，而不是承諾適用所有 Production 場景的託管產品。選用時應比較答案品質提升、index 成本、query latency、更新成本與可追溯性，而不是只看知識圖視覺化。

---

# 10. Observability：從「一次回答」改成「一條執行路徑」

## 10.1 最小 Trace Schema

```json
{
  "run_id": "run_0182",
  "graph_version": "2026-08-13.3",
  "node_id": "verify_claims",
  "node_attempt": 2,
  "parent_node_id": "draft",
  "route_in": "needs_verification",
  "route_out": "repair",
  "state_before_hash": "a83f...",
  "state_after_hash": "b207...",
  "writes": ["errors", "scores"],
  "model_version": "model-alias@2026-08-01",
  "tool_calls": 1,
  "cost_usd": 0.07,
  "elapsed_ms": 4218,
  "checkpoint_id": "cp_0042",
  "error_class": null
}
```

另外要能查詢：

- Run 經過哪些 Node／Edge？關鍵路徑耗時在哪裡？
- 哪個 Router 最常誤判？哪些路徑從未被走到？
- Fan-out 後的 straggler、cancel 與 orphan worker 有多少？
- 每個 Reducer 丟掉、合併、衝突的項目數量？
- Cycle 的重入次數、no-progress 比例與 stop reason？
- Resume 後重跑多少工作？發生多少 duplicate side effect？
- 每個 Graph version 的成功率、成本、人工介入與風險事件？

## 10.2 Critical path 與 Graph amplification

Graph 的成本不是 Node 成本相加這麼簡單。並行降低 wall-clock time，卻可能增加總 Token、Tool call 與失敗面積。

```text
Graph amplification
= model calls + tool calls + child runs + retries + evaluator calls

Critical-path latency
= 最慢且必須完成的依賴鏈
```

因此 Dashboard 要同時看 end-to-end latency 與 total work，否則可能誤以為 fan-out 讓系統更有效率，實際只是花三倍成本換較短等待。

---

# 11. Evals：從 Node 單元測試一路測到 Failure Injection

## 11.1 分層測試

| 層級 | 要測什麼 |
|---|---|
| Node | schema、pre／postcondition、tool mock、model output 邊界、timeout |
| Edge／Router | route confusion matrix、threshold、unreachable path、policy precedence |
| Reducer | 順序無關性、重複輸入、衝突、缺失、late result |
| Cycle | stop、budget、no-progress、oscillation、best-so-far |
| Subgraph | input／output contract、State isolation、cancel propagation |
| End-to-end | 成功率、品質、成本、延遲、人工介入、side effect |
| Recovery | crash、resume、duplicate delivery、partial write、version migration |
| Knowledge graph | entity／relation precision-recall、provenance、temporal freshness、answer faithfulness |

## 11.2 Route Eval 不該只看最終答案

最終答案正確，不代表路徑健康。系統可能碰巧成功，卻：

- 走了高成本分支。
- 未經人工核准就執行高風險操作。
- 重試五次才成功。
- 使用過期來源。
- 把三個相同候選當成多數共識。

因此 Eval record 要保存 expected routes／forbidden routes／required gates／budget，以及可接受的 terminal states。

## 11.3 Failure Injection

至少注入：

- Model timeout、malformed structured output、拒答。
- Tool 429／500／長時間無回應／回應後斷線。
- Worker 永不完成、重複 Event、Event 亂序。
- Reducer 收到空集合、衝突結果、惡意 payload。
- Checkpoint store 短暫不可用或寫入成功但 ACK 遺失。
- Human approval 過期、重複核准、核准舊 Artifact。
- Prompt injection 企圖改寫 route、permission 或 State。
- Graph／prompt／model／tool version 中途改變。

Graph 的可靠性不是「正常時能走完」，而是某個 Node 失敗時，整體仍會進入可理解、可恢復、可稽核的狀態。

---

# 12. Security 與治理

## 12.1 權限要跟著 Node 與 Edge 縮小

不要讓整張圖共用一把萬能 credential。可依 Node 設定：

- 可用工具與參數 scope。
- Read／write 資料域與 tenant。
- Network egress allowlist。
- Sandbox／filesystem 邊界。
- Side-effect 等級與 approval requirement。
- Model provider、data retention 與 region policy。

高權限 Node 應短小、deterministic、輸入 schema 嚴格，且只接受已通過 Gate 的 Artifact reference。

## 12.2 Edge 也是安全邊界

攻擊者不只會污染 Prompt，也可能企圖改變控制流：

- Tool output 誘導 Router 走到 privileged Node。
- Knowledge graph 中的惡意 relation 影響檢索。
- Worker 在 State 寫入偽造 `approved=true`。
- Resume payload 指向別的 tenant／thread。

因此敏感欄位要有 ownership；例如只有 approval service 能寫 `approvals`，只有 policy node 能產生 privileged route。LLM 產生的 State delta 不能直接成為授權事實。

---

# 13. 十個常見反模式

## 13.1 Spaghetti Graph

所有 Node 互相連接、到處回邊，沒人能說清楚進入與退出條件。用 Subgraph、穩定 Event type 與少數公共 Gate 收斂拓撲。

## 13.2 LLM Routes Everything

連權限、金額、資料分類都交給 LLM。高風險 routing 應由 deterministic policy guard 最後裁決。

## 13.3 Giant Shared State

每個 Node 都讀寫同一個巨大 dict。改用 typed schema、欄位 ownership、append-only evidence 與 reducer。

## 13.4 Last-write-wins Fan-in

平行結果彼此覆蓋。Reducer 必須顯式處理順序、衝突、缺失與 provenance。

## 13.5 Join 沒有完成條件

Worker 遺失後永遠等待。Join 需要 timeout、partial policy、cancel 與 terminal route。

## 13.6 Cycle 沒有 Progress 與 Budget

把 retry edge 畫回去，卻沒定義何時停。每個 cycle 都要做 bounded loop。

## 13.7 Checkpoint = Exactly-once 的錯覺

恢復 State 不代表外部 side effect 沒有重複。使用 idempotency、operation status 與 reconciliation。

## 13.8 Graph Version 沒有 Pin／Migration

新程式直接讀舊 State。所有 run、State、Node、prompt、tool 與 policy 都要有版本策略。

## 13.9 Multi-agent 組織圖劇場

把角色命名為 CEO、Manager、Researcher，不等於有好架構。先定義資料依賴、權限、交付物與 join contract，再決定是否需要多 Agent。

## 13.10 把 Workflow Graph、Thought Graph、Knowledge Graph 當同一件事

這會讓 State、指標與錯誤歸因失焦。可以在架構層整合，但要在實作、資料儲存與 Eval 上分離。

---

# 14. 從單一 Agent 演進到 Graph 的六個階段

## Phase 1：畫出現有隱性流程

先從 Trace 找出實際的 model call、tool call、retry、human wait 與 side effect，不要從理想架構開始。

## Phase 2：抽出 State 與 Terminal States

把 conversation、workflow state、artifact、evidence、approval 分開；定義 `DONE`、`PARTIAL`、`FAILED`、`CANCELLED`、`WAITING_HUMAN`。

## Phase 3：建立 Node Contract 與 Deterministic Gate

先拆出高價值邊界：intake、router、tool execution、verifier、publish。將 schema、ACL 與 postcondition 程式化。

## Phase 4：只在真正獨立處 Fan-out

為每個 child 設定 budget、cancel、timeout 與 output schema，再設計 Reducer 和 Join Contract。

## Phase 5：加入 Durability 與 Side-effect Safety

用 crash／resume 測試確認 checkpoint 邊界；為外部操作加入 idempotency、reconciliation 與 audit。

## Phase 6：版本化、Eval 與逐步放量

保存 graph／node／prompt／model／tool／policy version；shadow run、canary、對照舊版本，並觀察 route、cost、critical path、human rate 與 failure recovery。

---

# 15. Production Checklist

## Topology 與契約

- [ ] 每個 Node 有 typed input／output、pre／postcondition 與 owner。
- [ ] 每條條件 Edge 有穩定 route enum、reason code 與 fallback。
- [ ] 每個 fan-out 有 child budget、cancel 與 concurrency limit。
- [ ] 每個 fan-in 有 ALL／ANY／QUORUM／TIMEBOX／SCORE 的明確 Join Contract。
- [ ] 每個 cycle 有 progress、hard bound、best-so-far 與 escalation。
- [ ] Subgraph 有清楚 State、permission 與 version 邊界。

## State 與 Runtime

- [ ] State schema、Reducer 與欄位 ownership 已版本化。
- [ ] 知道 Runtime 的 event delivery、ordering、barrier 與 retry 語意。
- [ ] Checkpoint boundary、pending writes、retention 與 tenant isolation 已驗證。
- [ ] Interrupt／resume 重跑行為已測試。
- [ ] Graph upgrade 有 Pin、Migrate、Restart 或 Drain 策略。

## Side effect 與 Security

- [ ] 外部寫入使用 idempotency key／operation ID。
- [ ] Unknown outcome 會先 reconcile，不會盲目重試。
- [ ] Credential、tool 與 data scope 依 Node 最小化。
- [ ] 高風險路由有 deterministic policy 與 Human gate。
- [ ] LLM／Tool output 無法直接寫入 approval、identity 等授權欄位。

## Observability 與 Evals

- [ ] Trace 能重建 Node、Edge、State delta、version 與 checkpoint。
- [ ] 能量測 critical path、total work、route confusion 與 reducer 衝突。
- [ ] Node、Edge、Reducer、Cycle、Subgraph、E2E 都有測試。
- [ ] 已注入 timeout、duplicate、out-of-order、partial write、crash、resume 與 migration failure。
- [ ] Knowledge Graph 有 entity／relation、provenance、freshness 與 answer faithfulness 評估。

---

# 結語：Graph 的價值不是複雜，而是把複雜性變得可管理

Graph Engineering 不是把所有工作都改造成多 Agent，也不是畫出越多節點越先進。它的價值在於，當系統本來就存在分支、並行、等待、回復、知識關係與風險邊界時，讓這些隱性複雜性變成明確 contract：

- Node 有局部責任與最小權限。
- Edge 有可解釋的轉移條件。
- State 有 schema、ownership 與 provenance。
- Fan-in 有 deterministic reducer 與完成條件。
- Cycle 有 progress、budget 與 exit。
- Checkpoint 有 replay 邊界，side effect 有 reconciliation。
- Graph 與 State 都能版本化、觀測、測試與遷移。

> **好的 Graph 不是看起來像一張漂亮流程圖；而是任一節點失敗、任一路徑被重跑、任一版本被替換時，系統仍能回答：現在在哪裡、為什麼到這裡、改變了什麼、下一步誰負責，以及如何安全結束。**

---

# 參考資料

- [LangGraph Overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [LangGraph Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangGraph Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)
- [LangGraph Subgraphs](https://docs.langchain.com/oss/python/langgraph/use-subgraphs)
- [LlamaIndex Workflows Introduction](https://developers.llamaindex.ai/python/llamaagents/workflows/)
- [Microsoft Agent Framework: Workflows](https://learn.microsoft.com/en-us/agent-framework/workflows/)
- [Microsoft Agent Framework: Workflow Concepts and Execution](https://learn.microsoft.com/en-us/agent-framework/workflows/workflows)
- [Yao et al. (2023), Tree of Thoughts](https://arxiv.org/abs/2305.10601)
- [Besta et al. (2024), Graph of Thoughts](https://arxiv.org/abs/2308.09687)
- [Microsoft GraphRAG Repository](https://github.com/microsoft/graphrag)
- [GraphRAG Overview](https://github.com/microsoft/graphrag/blob/main/docs/index/overview.md)
- [GraphRAG Query Methods](https://github.com/microsoft/graphrag/blob/main/docs/query/overview.md)
- [GraphRAG Global Search](https://github.com/microsoft/graphrag/blob/main/docs/query/global_search.md)
- [Edge et al. (2024), From Local to Global: A Graph RAG Approach](https://arxiv.org/abs/2404.16130)
