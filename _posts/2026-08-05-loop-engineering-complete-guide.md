---
layout: post
title: Loop Engineering 完整指南：把 Agent 的反覆嘗試設計成可停止、可驗證、可恢復的工作循環
subtitle: 深入 Agent Loop、ReAct、Plan-Execute-Replan、Evaluator-Optimizer、Test-Repair、停止條件、無進展偵測、Checkpoint、Tracing 與 Evals
author: Paul Jiang
date: 2026-08-05 09:00:00 +0800
categories: AI
tags: LLM Loop-Engineering AI-Agent Agent-Loop ReAct Reflection Self-Refine Tools Stop-Conditions Checkpoint Observability Evals
sidebar: []
excerpt_image: /assets/images/260813/loop-engineering-complete-guide-hero.png
---

> 本文整理至 **2026 年 8 月 13 日**，是「LLM 工程演進」系列的第五篇。前面依序介紹了 [整體工程演進](/ai/2026/08/01/prompt-context-harness-loop-graph-engineering-evolution.html)、[Prompt Engineering](/ai/2026/08/02/prompt-engineering-complete-guide.html)、[Context Engineering](/ai/2026/08/03/context-engineering-complete-guide.html) 與 [Harness Engineering](/ai/2026/08/04/harness-engineering-complete-guide.html)。這一篇聚焦 Harness 裡最關鍵的動態機制：**Agent 如何反覆行動、取得回饋、修正方向，並在正確時機停止。**
>
> 先用一句話定義：**Loop Engineering 是把 Agent 的多步驟執行設計成一個有目標、有狀態、有外部回饋、有驗證器、有資源上限、有停止出口的受控循環。**

「讓 Agent 繼續做，直到完成」看似是一句自然的指令，但在 Production 中，它隱藏了一整套工程問題：

- 什麼叫完成，誰負責證明？
- 每一圈允許採取哪些行動？
- 工具回傳錯誤時應重試、換方法、降級，還是停止？
- 如何判斷 Agent 正在進步，而不是用不同文字重複同一件事？
- Context 越來越長時，要保留什麼、壓縮什麼？
- 一個 Run 最多可以花多少 Turns、Tokens、時間與金額？
- Side effect 重試時，如何避免重複付款、寄信或發布？
- 程序重啟後，如何從安全的 Checkpoint 繼續？
- 何時必須請人核准、補資料或直接接管？
- 如果做不完，如何交付 Best-so-far，而不是只丟出 Timeout？

這些問題共同構成 Loop Engineering。

![一個具有規劃、行動、觀察、驗證、預算、人工核准與完成出口的受控 Agent Loop](/assets/images/260813/loop-engineering-complete-guide-hero.png)

_圖：AI 生成的 Loop Engineering 概念圖。中央模型沿受控軌道反覆工作；左側是時間、成本、狀態與記憶控制，右側有明確完成出口，底部則保留人工核准與緊急停止。_

---

# 1. Loop Engineering 到底是什麼

## 1.1 Loop 是 Agent 與 Chatbot 的分水嶺

Chatbot 通常接收輸入並產生一次回應；Agent 則會根據目前狀態選擇行動、呼叫工具、讀取結果，再決定下一步。Anthropic 將 Agent 描述為會自我導向地 **plan、act、observe、adjust、repeat**，直到任務完成或需要人類介入；OpenAI Agents SDK 的 Runner 也明確實作一個循環：模型若產生 Tool call 或 Handoff 就繼續，產生符合要求的 Final output 才結束。

最小 Tool-use loop 可以寫成：

```text
接收 Goal
→ 呼叫模型
→ 模型提出 Tool call
→ Harness 執行工具
→ Tool result 回到 Context
→ 再呼叫模型
→ 直到產生 Final output
```

這段邏輯很短，但「能跑」與「可靠」之間還差了一個 Stop controller、Verifier、State store、Error policy、Budget、Checkpoint 與 Trace。

## 1.2 Loop Engineering 是新名稱，不是全新的思想

截至 2026 年，「Loop Engineering」仍屬於快速形成中的實務術語，尚不是一套有唯一標準定義的正式學科。它的技術來源可以追溯到：

- [ReAct](https://react-lm.github.io/)：把 Reasoning 與 Action 交錯，讓外部 Observation 影響下一步。
- [Reflexion](https://arxiv.org/abs/2303.11366)：把失敗回饋轉成語言式 Reflection，寫入後續嘗試。
- [Self-Refine](https://selfrefine.info/)：以 Feedback → Refine 反覆改善初始輸出。
- 傳統軟體工程：Event loop、State machine、Retry、Circuit breaker、Transaction、Checkpoint、Control theory 與 Optimizer。

2026 年 7 月的預印本〈Stop Hand-Holding Your Coding Agent〉進一步用 **Loop specification** 描述 Trigger、Goal、Verification、Stopping rule 與 Memory 的組合。這個說法很貼近目前 Coding Agent 的工作方式，但它仍是近期預印本，應視為正在成形的工程語彙，而不是已完成共識的標準。

## 1.3 一份完整 Loop Specification

可以把 Loop 寫成下面這個契約：

```text
Loop = Trigger
     + Goal / Success Contract
     + State
     + Decision Policy
     + Allowed Actions
     + Observation Normalizer
     + Verifier
     + Progress Measure
     + Error / Recovery Policy
     + Stop Rules / Budgets
     + Checkpoint / Memory
     + Trace
```

少任何一項，系統仍可能工作；但缺少的部分往往會在長任務、錯誤、重啟、成本失控或安全事件中變成問題。

## 1.4 Harness 與 Loop 的關係

Harness 是靜態與執行層面的「外骨骼」；Loop 是 Harness 內部讓 Agent 隨時間前進的「控制律」。

| Harness Engineering | Loop Engineering |
|---|---|
| 定義工具、權限、Sandbox、State、Trace | 定義每圈如何選擇、執行、觀察、驗證與停止 |
| 回答「Agent 能做什麼」 | 回答「Agent 接下來做什麼，何時不再做」 |
| 提供執行環境與安全邊界 | 使用環境回饋調整後續行動 |
| 偏向能力與基礎設施 | 偏向生命週期與動態控制 |

實務上兩者不能完全分離：沒有 Harness，Loop 沒有安全工具可用；沒有 Loop，Harness 只是一堆尚未被編排的能力。

---

# 2. 為什麼單次 Prompt 不夠

## 2.1 真實任務需要環境回饋

寫程式、查資料、操作瀏覽器或處理交易，不可能只靠模型第一次猜對。模型必須看到：

- Compiler、Test、Linter 與 Type checker 的結果
- API status、Error code 與資料庫狀態
- 網頁是否載入、表單是否提交、畫面是否改變
- 搜尋是否找到足夠且相互支持的證據
- 檔案 Diff 是否符合需求
- Human reviewer 是否核准

Loop 的價值不在「多想幾次」，而在 **把新的外部證據帶回下一次決策**。

## 2.2 Reasoning Model 更強，反而更需要 Loop Contract

模型越能自主拆解與使用工具，單一 User request 就越可能展開成數十個模型與工具呼叫。能力提升會同時放大：

- 成功處理長任務的機會
- 不必要探索與成本
- Prompt injection 的傳播路徑
- 重複 Side effect 的風險
- Context 膨脹與目標漂移
- 巢狀 Subagent 的呼叫倍數

因此不能把「模型很聰明」當成停止條件。能力越強，越需要外部可執行的控制。

## 2.3 Loop 是從不確定性中取得局部確定性

模型決策是概率性的，但每一圈可以用確定性程式包住：

```text
LLM 提出下一步
→ Policy 檢查是否允許
→ Tool 在受控環境執行
→ Observation 被正規化
→ Verifier 檢查 State delta
→ Stop controller 決定下一個 Route
```

這使 Agent 不需要每次都完美；它只需要在每圈的限制內提出可檢查、可修復的進展。

---

# 3. Production Agent Loop 的十二個元件

![Agent Loop 從目標、規劃、行動、觀察、驗證到狀態更新，並具有完成、人工介入與停止出口](/assets/images/260813/loop-engineering-core-loop.svg)

_圖：每一圈都應產生可觀測的 State delta。成功、人工介入與安全停止都是一級出口，不是例外狀況。_

## 3.1 Trigger：為什麼現在要啟動

Trigger 可以是使用者請求、Cron、Webhook、Queue event、檔案變更或另一個 Agent 的委派。它至少要包含：

- `trigger_id` 與去重鍵
- Requester identity／Tenant
- Goal 與允許範圍
- 初始輸入與版本
- Deadline、Priority 與 Budget

若 Event delivery 是 at-least-once，Loop 啟動本身就必須 Idempotent。

## 3.2 Goal／Success Contract：完成的可執行定義

不好的 Goal：

```text
把這個專案改善到可以使用。
```

較好的 Success contract：

```text
- 指定的三個 API endpoint 通過 contract tests
- 現有測試不得退步
- 無新的 high-severity security finding
- 只可修改 src/ 與 tests/
- 產生 migration-note.md 與測試證據
```

Success contract 應由程式或外部 Reviewer 驗證，而不是要求模型回答「你完成了嗎？」。

## 3.3 Loop State：目前世界的最小真相

Loop state 不是完整聊天紀錄。它應是可序列化、可版本化的結構：

```json
{
  "run_id": "run_0182",
  "goal_version": "v3",
  "phase": "repair",
  "plan": ["inspect", "patch", "test"],
  "completed_steps": ["inspect"],
  "artifacts": ["report/test-41.json"],
  "last_observation": {"kind": "test_failure", "code": "E_SCHEMA"},
  "attempts_by_action": {"run_tests": 2},
  "budgets": {"turns_left": 5, "cost_left_usd": 1.40},
  "best_candidate": "artifact://patch-07",
  "stop_reason": null
}
```

## 3.4 Decision Policy：誰選下一步

Policy 可以是：

- 純 LLM：彈性高，但難預測。
- Deterministic code：穩定，但只適合已知流程。
- Hybrid：程式決定 Phase 與合法 Action，模型在局部空間內選擇。

Production 系統通常偏向 Hybrid：把創造性留在節點內，把權限、預算與生命週期留給程式。

## 3.5 Action：一次可審核的狀態轉移提案

一個 Action 不應只是自然語言，而應包含：

```json
{
  "action": "apply_patch",
  "arguments": {"file": "src/order.py", "patch_id": "patch-07"},
  "expected_effect": "schema validation passes",
  "risk": "reversible_write",
  "idempotency_key": "run_0182:patch-07",
  "evidence_required": ["git_diff", "test_result"]
}
```

## 3.6 Preflight：模型提出不等於可以執行

在 Tool execution 前，Harness 應檢查 Schema、ACL、Scope、Rate limit、Secret policy、Side-effect class、Approval 與 Idempotency。

這一步屬於 Loop 的 Transition guard：若不符合，不執行工具，而是回傳結構化 Constraint feedback 給 Replan。

## 3.7 Observation Normalizer：把世界回傳成可用訊號

Raw tool output 常太長、太吵或包含 Secret。Normalizer 應產生：

- `status`: success／retryable_error／permanent_error／unknown
- `state_delta`: 哪些外部狀態真的改變
- `evidence`: 可追溯 Artifact／Test／Response ID
- `diagnostic`: 下一步需要的最小錯誤資訊
- `redactions`: 哪些內容已遮蔽

不應把 20 MB Log 原封不動塞回 Context。

## 3.8 Verifier：成功由世界證明

Verifier 的可信優先順序通常是：

1. 外部狀態與 Deterministic check：Database、API、File hash、Test、Schema。
2. 獨立程式規則或 Formal validator。
3. Human review。
4. 具 Rubric 的獨立 Evaluator model。
5. 同一模型的 Self-reflection。

越往下，結果越具有概率性。Reflection 可以找方向，但不應取代可用的外部真相。

## 3.9 Progress Measure：這一圈是否真的向前

除了 Pass／Fail，還要衡量 State delta：

- 未通過測試數是否下降？
- 未解決子任務是否減少？
- 新增證據是否覆蓋尚未回答的 Claim？
- Candidate score 是否改善？
- 相同 Tool／Arguments／Result 是否重複？
- State hash 是否長期不變？

Progress measure 是 Early stop、Replan 與降級的基礎。

## 3.10 Stop Controller：Loop 的煞車與出口

Stop controller 每圈評估 Success、Safety、Human need、Progress 與 Budget，再產生：

- `DONE`：成功條件已由外部證據成立。
- `CONTINUE`：仍有預算且有合理進展。
- `REPLAN`：方法失敗，但仍有不同策略。
- `WAIT`：等待外部事件、Rate limit 或 Human approval。
- `PARTIAL`：未完成，但 Best-so-far 有價值。
- `FAILED`：不可恢復錯誤。
- `CANCELLED`：使用者、系統或 Kill switch 終止。

## 3.11 Checkpoint／Resume：中斷是正常狀態

每個安全邊界後保存：

- Loop state 與 Schema version
- Last committed action
- Tool result／Operation ID
- Approval status
- Budget counters
- Model、Prompt、Tool 與 Policy version
- Best-so-far artifact

Resume 時不能假設上次 Tool call 沒成功；先 Reconcile 外部世界，再決定是否重送。

## 3.12 Trace／Eval：保存因果鏈

Trace 至少串起：

```text
Trigger
→ Model decision
→ Policy decision
→ Tool execution
→ Observation
→ State delta
→ Verification
→ Stop decision
```

只記 Final answer，無法解釋 Loop 為何多跑十圈、在哪裡開始重複，以及哪個 Verifier 讓它誤判。

---

# 4. 一圈完整的生命週期

```text
1. 載入 Goal、Checkpoint、Budget 與 Policy
2. 建立本圈最小 Context
3. 模型提出 Next action 或 Final candidate
4. 驗證 Structured output
5. 執行 Preflight／Approval
6. 呼叫 Tool 或保存 Candidate
7. Normalizer 產生 Observation
8. Verifier 檢查外部 Postcondition
9. 計算 State delta 與 Progress
10. 更新 Plan、State、Memory candidate
11. Stop controller 決定 Route
12. 保存 Checkpoint 與 Trace
```

順序很重要。例如 Side effect 之後若先 Retry、後 Checkpoint，就可能在 Crash 後重複執行；若先把未驗證 Reflection 寫入長期 Memory，錯誤推論會污染未來 Run。

---

# 5. 五種常見 Loop Pattern

![Tool-use、Plan-Execute-Replan、Evaluator-Optimizer、Test-Repair 與巢狀 Supervisor Worker 五種 Loop Pattern](/assets/images/260813/loop-patterns-comparison.svg)

_圖：Pattern 應依可靠回饋的來源選擇；外部 Test 通常比純 Self-reflection 更適合作為停止依據。_

## 5.1 Tool-use／ReAct Loop

```text
Reason／Decide → Act → Observe → Reason／Decide → ...
```

ReAct 的關鍵不是公開長篇 Chain of Thought，而是讓推理與環境 Action 交錯。模型根據 Observation 更新計畫，適合搜尋、瀏覽器、資料查詢與通用助理。

優點：簡單、彈性高、工具可逐步加入。

風險：容易目標漂移、重複呼叫、被 Tool result 中的 Prompt injection 影響，也可能把 Tool availability 誤認為 Tool authorization。

## 5.2 Plan → Execute → Replan

先把 Goal 拆成可追蹤步驟，執行一或數步後，依 Observation 更新剩餘計畫。

```text
Plan v1
→ Execute step 1
→ Verify
→ Replan v2
→ Execute step 2
→ Verify
```

它比自由 ReAct 更適合長任務，因為能看見剩餘工作與依賴；但 Plan 不是承諾，外部世界改變後必須允許更新。

常見反模式是每圈重新生成整份計畫，造成 Token 浪費與計畫振盪。較好的方式是保存 Stable task ID，只修改受影響的節點。

## 5.3 Evaluator → Optimizer

Anthropic 的 Evaluator-optimizer pattern 讓一個模型產生 Candidate，另一個模型依明確 Rubric 評估並給回饋，反覆至 Pass 或達到上限。

適合：翻譯、文案、報告、設計方案等可由人清楚說明改進方向的工作。

必要條件：

- Rubric 能區分好壞。
- Evaluator 能提供具體、可執行且不互相矛盾的 Feedback。
- 每圈改善可以被測量。
- 保存 Best-so-far，避免最後一版反而退步。

若 Generator 與 Evaluator 使用相同 Context、相同盲點與相同 Prompt，兩者看似分工，實際上可能只是把同一錯誤說兩次。

## 5.4 Reflection／Self-Refine

```text
Generate → Self-feedback → Refine → Self-feedback → ...
```

Self-Refine 與 Reflexion 顯示語言式回饋能改善部分任務。Reflection 特別適合把失敗轉成下一次嘗試的局部策略，例如「API 回傳 429，下次應遵守 Retry-After」。

但 Reflection 不是免費真相：

- 沒有新 Evidence 時，模型可能把錯誤答案潤飾得更自信。
- Reflection 文字過長會污染 Context。
- 把一次失敗概括成永久規則可能造成錯誤 Memory。
- 自我評分可能受到 Position、Verbosity 與 Self-preference bias。

因此應把 Reflection 當成 **Replan input**，而不是 Final verifier。

## 5.5 Test → Repair Loop

Coding Agent 最典型的迴圈：

```text
Implement
→ Compile／Test／Lint／Security scan
→ Parse failures
→ Localize root cause
→ Repair
→ Re-run impacted checks
→ Full regression
```

這種 Pattern 強，因為回饋來自外部可執行檢查。仍需防止：

- 為通過測試而刪除或弱化測試。
- 只修表面症狀，造成其他 Regression。
- 同一 Fix 反覆套用。
- 測試本身 Flaky，導致錯誤修復方向。
- 全量測試每圈都跑，成本過高。

較好的設計是先跑 Targeted test，通過後再跑 Full suite；並將 Tests 與受保護規則放在 Agent 無法任意修改的範圍。

## 5.6 Nested Supervisor／Worker Loops

外圈 Supervisor 管理 Goal、分工、Budget 與整體驗證；每個 Worker 內部又有自己的 Tool loop。

```text
Supervisor turn
  ├─ Research worker loop
  ├─ Coding worker loop
  └─ Review worker loop
→ Aggregate
→ Global verify
```

巢狀 Loop 的成本是乘法，不是加法。若 Supervisor 10 圈、每圈啟動 5 個 Worker、每個 Worker 最多 8 圈，理論上可展開 400 個 Worker turns，還不含 Tool calls。

因此 Budget 必須可向下分配，Child 不能自行忽略 Parent deadline；Subagent 也必須回傳結構化 Result、Evidence、Spend 與 Stop reason。

---

# 6. Stop Engineering：如何讓 Loop 正確結束

![Loop Stop Controller 依序判斷成功、人工介入、進展與資源預算](/assets/images/260813/loop-stop-controller.svg)

_圖：`max_turns` 是保險絲，不是完整停止策略。Production Loop 應優先以外部成功條件結束，也要能安全交給人或回傳部分成果。_

## 6.1 Stop Rule 的優先順序

建議每圈依序判斷：

1. **Cancellation／Kill switch**：使用者取消、系統維護或安全事件。
2. **Safety／Policy violation**：越權、資料外洩、風險升高。
3. **External success**：Postcondition 已成立。
4. **Human required**：需要核准、澄清、Credential 或範圍擴張。
5. **Fatal／permanent error**：沒有合法恢復路徑。
6. **No progress／oscillation**：反覆但沒有 State delta。
7. **Budget exhausted**：Turns、Tokens、Cost、Time、Tool calls 或 Side effects 到頂。
8. **Continue／Replan**：仍有不同策略且預期效益大於成本。

這個順序避免「其實已成功卻又多跑一圈」，也避免在取消或安全事件後仍執行工具。

## 6.2 Hard Bounds：每個 Loop 都必須有

至少設定：

- `max_model_turns`
- `max_tool_calls`
- `max_wall_clock`
- `max_tokens_in／out`
- `max_cost`
- `max_side_effects`
- `max_subagents` 與 Child budget
- `max_context_size`

OpenAI Agents SDK 使用 `max_turns`，超過時可拋出 `MaxTurnsExceeded`；LangGraph 也以 recursion limit 阻止 Graph step 無限循環。把上限設為 `None` 或只把數字調大，會移除最後一道保險。

## 6.3 Semantic Success：不要只數圈數

固定迭代三次非常簡單，但 Easy task 會浪費，Hard task 可能被截斷。更好的停止方式是：

```text
hard cap
AND
(external success OR human handoff OR no-progress patience)
```

2026 年的 Semantic early-stopping 預印本研究以連續 Candidate 的語意變化與品質停滯作為停止訊號。這類方法值得探索，但 Embedding 不變只代表語意相近，不保證外部任務已完成；它應搭配 Hard cap 與真正的 Success verifier。

## 6.4 No-progress Detection

常見偵測器：

- 相同 `(tool, normalized_args)` 指紋重複。
- Tool result hash 長期相同。
- State hash 沒有改變。
- Error code 與 Root cause 重複。
- Plan 在 A → B → A → B 之間振盪。
- Evaluator score 在 Patience window 內沒有改善。
- 每圈只改寫敘述，Artifact diff 為空。

不能看到重複就一律停止：Pagination、Polling、分批處理可能合法重複同一工具。Fingerprint 必須包含 Cursor、Expected state delta 與 Tool 的 Repeat policy。

## 6.5 Best-so-far 與 Graceful Degradation

Loop 不一定只有成功／失敗。預算用完時，可以回傳：

- 目前最佳 Candidate
- 已完成與未完成項目
- 驗證通過與失敗的 Evidence
- 最後 Checkpoint
- 阻塞原因
- 建議的人類下一步
- 若續跑需要的額外 Budget

這比丟出 Timeout 或一句「無法完成」更有營運價值。

## 6.6 Infinite Agentic Loop 是跨層故障

2026 年預印本〈When Agents Do Not Stop〉將 Infinite Agentic Loops 描述為模型決策、Framework semantics、Runtime observation 與 termination mechanism 共同形成的回饋路徑。這點很重要：死循環不一定出現在明顯的 `while True`；Handoff、Retry middleware、Workflow edge、Subagent callback 也可能一起構成循環。

因此 Code review 與測試應畫出所有 Feedback edge，檢查每一條 Cycle 是否都有有效 Bound、Progress condition 與 Side-effect protection。

---

# 7. Error、Retry 與 Recovery

## 7.1 先分類，再決定是否重試

| Error class | 例子 | Loop 行為 |
|---|---|---|
| Transient | 429、短暫網路中斷 | Backoff + Jitter，消耗 Retry budget |
| Input repairable | Schema error、缺少必要參數 | 回傳最小診斷，讓模型修正 Action |
| Strategy failure | 搜尋路徑無結果 | Replan，換資料源或方法 |
| Permanent | 資源不存在、功能不支援 | 停止該分支，不盲目重試 |
| Permission | Scope／Credential 不足 | 請求核准或 Human handoff |
| Unknown outcome | Timeout 前可能已提交 | 先 Reconcile，禁止直接重送 |
| Safety／Policy | 越權、敏感資料風險 | 立即停止或隔離 |

## 7.2 Retry Budget 不等於 Loop Budget

同一 Tool 的 Retry、整體 Agent turn 與 Workflow resume 應分開計數。否則一個 429 可能吃掉全部 Agent turns，或每次 Replan 又重新取得完整 Tool retry 次數。

```text
Run budget
├─ Model turn budget
├─ Tool-call budget
│  └─ Per-tool retry budget
├─ Side-effect budget
└─ Subagent budget
```

## 7.3 Unknown Outcome 必須 Reconcile

付款 API Timeout 並不代表付款失敗。正確流程：

```text
POST payment with idempotency_key
→ Timeout
→ mark outcome=unknown
→ GET payment by operation_id
→ 已成功：更新 State，不重送
→ 未建立：在 Retry policy 內重送
→ 無法判斷：Human review
```

## 7.4 Recovery 要改變條件

有效 Recovery 至少改變一項：

- 修正 Arguments
- 更換 Tool／Provider
- 增加必要 Context
- 降低範圍
- 等待 Rate limit
- 回到上一個 Checkpoint
- 請人補資料或核准

如果 Input、State、Tool、Environment 與 Policy 都沒變，再跑一次通常只是賭隨機性。

---

# 8. Context 與 Memory 如何支援長 Loop

## 8.1 每圈 Context 不等於全部歷史

建議分層：

```text
Stable goal／policy
+ Current loop state
+ Active plan step
+ Recent relevant observations
+ Retrieved evidence
+ Failure memory
+ Tool schemas for this turn
```

完整 Raw trace 留在外部 Store，以 ID 取用，不要全部放進 Model window。

## 8.2 Observation 要壓縮，但不能抹掉證據

保留：

- Error type、位置、可重現步驟
- Artifact URI／hash
- External operation ID
- Test summary 與失敗案例
- 影響下一步的限制

移除：

- 重複 Stack trace
- 無關 stdout
- Secret／PII
- 已被後續 State 取代的中間文字

## 8.3 Failure Memory 只保存可泛化的教訓

一個安全的 Failure memory 應包含：

```json
{
  "condition": "provider returns HTTP 429 with Retry-After",
  "lesson": "honor Retry-After; do not immediately switch credentials",
  "evidence": "trace://run_0182/step_07",
  "scope": "provider_x.search",
  "confidence": 0.92,
  "expires_at": "2026-09-01"
}
```

不要把「某次方法失敗」直接變成「這個方法永遠無效」。Memory write 應在 Run 後由獨立規則或 Review 管理。

## 8.4 Compaction 也是 State transition

摘要會改變未來模型看到的世界，因此必須：

- 保存原始 Trace reference。
- 記錄 Compactor model／prompt version。
- 保留 Goal、Constraints、Open issues 與 Operation IDs。
- 做 Resume 與 Long-horizon regression test。
- 不讓摘要把未驗證假設寫成事實。

---

# 9. 一個 Provider-neutral 的 Python Loop

下面範例刻意不綁特定 SDK，展示控制層應放在哪裡。模型、工具與驗證器都是外部依賴；真正的 Stop decision 由程式掌控。

```python
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from hashlib import sha256
from time import monotonic
from typing import Any, Protocol


class Route(str, Enum):
    CONTINUE = "continue"
    DONE = "done"
    HUMAN = "human"
    PARTIAL = "partial"
    FAILED = "failed"


@dataclass
class Budget:
    max_turns: int = 12
    max_tool_calls: int = 20
    max_seconds: float = 300.0
    max_stagnant_turns: int = 2


@dataclass
class Action:
    tool: str
    args: dict[str, Any]
    expected_effect: str


@dataclass
class Observation:
    status: str
    summary: str
    evidence: list[str] = field(default_factory=list)
    state_delta: dict[str, Any] = field(default_factory=dict)


@dataclass
class LoopState:
    run_id: str
    goal: str
    turn: int = 0
    tool_calls: int = 0
    stagnant_turns: int = 0
    facts: dict[str, Any] = field(default_factory=dict)
    recent_fingerprints: list[str] = field(default_factory=list)
    evidence: list[str] = field(default_factory=list)
    best_candidate: Any | None = None
    stop_reason: str | None = None


class Model(Protocol):
    def next_action(self, state: LoopState) -> Action | None: ...


class Tools(Protocol):
    def preflight(self, action: Action, state: LoopState) -> None: ...
    def execute(
        self, action: Action, *, idempotency_key: str
    ) -> Observation: ...


class Verifier(Protocol):
    def verify(self, state: LoopState) -> tuple[bool, float, list[str]]: ...


def fingerprint(action: Action) -> str:
    payload = f"{action.tool}:{sorted(action.args.items())}"
    return sha256(payload.encode()).hexdigest()[:16]


def run_loop(
    model: Model,
    tools: Tools,
    verifier: Verifier,
    state: LoopState,
    budget: Budget,
) -> tuple[Route, LoopState]:
    started = monotonic()

    while True:
        # Hard bounds are checked by deterministic code.
        if state.turn >= budget.max_turns:
            state.stop_reason = "max_turns"
            return Route.PARTIAL, state
        if state.tool_calls >= budget.max_tool_calls:
            state.stop_reason = "max_tool_calls"
            return Route.PARTIAL, state
        if monotonic() - started >= budget.max_seconds:
            state.stop_reason = "deadline"
            return Route.PARTIAL, state

        # Check external success before asking the model to do more work.
        passed, score_before, evidence = verifier.verify(state)
        state.evidence.extend(evidence)
        if passed:
            state.stop_reason = "verified_success"
            return Route.DONE, state

        action = model.next_action(state)
        state.turn += 1

        if action is None:
            state.stop_reason = "model_has_no_legal_action"
            return Route.HUMAN, state

        tools.preflight(action, state)  # schema, ACL, scope, approval

        fp = fingerprint(action)
        repeated = fp in state.recent_fingerprints[-3:]
        state.recent_fingerprints.append(fp)

        observation = tools.execute(
            action,
            idempotency_key=f"{state.run_id}:{fp}",
        )
        state.tool_calls += 1
        state.facts.update(observation.state_delta)
        state.evidence.extend(observation.evidence)

        passed, score_after, evidence = verifier.verify(state)
        state.evidence.extend(evidence)
        if passed:
            state.stop_reason = "verified_success"
            return Route.DONE, state

        progressed = bool(observation.state_delta) or score_after > score_before
        if repeated and not progressed:
            state.stagnant_turns += 1
        elif progressed:
            state.stagnant_turns = 0

        if observation.status in {"permission", "needs_human"}:
            state.stop_reason = observation.status
            return Route.HUMAN, state

        if observation.status in {"permanent_error", "safety_block"}:
            state.stop_reason = observation.status
            return Route.FAILED, state

        if state.stagnant_turns >= budget.max_stagnant_turns:
            state.stop_reason = "no_progress"
            return Route.PARTIAL, state

        # Persist a checkpoint here before the next model turn.
```

正式版本還要補上 Async execution、Checkpoint store、Cancellation token、Backoff、Unknown-outcome reconciliation、Trace、Secret redaction 與 Best-so-far selection。但骨架重點已經清楚：

- 模型只提出 Action。
- Preflight 決定能否執行。
- Verifier 決定是否成功。
- Stop controller 決定是否繼續。
- State 與 Evidence 能在每圈後保存。

---

# 10. Observability：看懂 Agent 為何一直轉

## 10.1 每個 Step 的最低 Trace Schema

```json
{
  "run_id": "run_0182",
  "loop_id": "repair_loop",
  "turn": 7,
  "parent_loop_id": null,
  "goal_version": "v3",
  "state_before_hash": "a83f...",
  "decision": "run_tests",
  "policy_result": "allow",
  "tool_call_id": "call_91",
  "observation_status": "retryable_error",
  "state_after_hash": "b207...",
  "progress_score": 0.64,
  "cost_usd": 0.08,
  "elapsed_ms": 8412,
  "stop_decision": "continue"
}
```

## 10.2 Loop-specific Metrics

| Metric | 回答的問題 |
|---|---|
| Success within budget | 在限制內完成多少任務？ |
| Turns／cost to verified success | 成功要繞幾圈、花多少？ |
| Loop amplification factor | 一個 Trigger 展開多少模型、工具與 Handoff？ |
| Repeated-action ratio | 有多少 Action 沒帶來新進展？ |
| Stagnant-turn rate | 有多少圈 State 不變？ |
| Repair efficiency | 每次 Repair 消除多少 Failure？ |
| Recovery success rate | Crash／Timeout 後能否正確續跑？ |
| Human intervention rate | 哪些情況最常需要人？ |
| Stop reason distribution | Done、Partial、Budget、Policy 各占多少？ |
| Side effects per success | 完成一次任務對外部世界寫了幾次？ |

可定義：

```text
Loop amplification factor
= (model calls + tool calls + handoffs + child runs)
  / user triggers
```

平均成本可能正常，但 P95 amplification 爆高；因此分布比平均值更重要。

## 10.3 Trace 不等於全量洩密

模型輸入、Tool result 與 Memory 可能包含 PII、Credential 或商業資料。Observability 應採：

- Structured fields 優先。
- Secret 與 PII redaction。
- Raw payload 分權保存。
- Sampling 與 Retention。
- Artifact 使用 hash／URI。
- 能以 Run ID 做 Audit，但不是所有工程師都能看完整內容。

---

# 11. 如何評測一個 Loop

## 11.1 不只評 Final answer

Agent 可能偶然得到正確答案，卻走過危險路徑；也可能安全地停止並要求人類補資料，這不應被一律算成失敗。

評測分四層：

1. **Outcome**：Success contract 是否成立。
2. **Trajectory**：是否用了合法、合理且有效率的步驟。
3. **Safety**：是否越權、洩密、重複 Side effect。
4. **Recovery**：遇到故障是否能降級、Resume 或交給人。

## 11.2 必測場景

- Tool 回傳 malformed output。
- 429、Timeout 與網路抖動。
- Tool 回傳 Prompt injection。
- Side effect 成功但 Response 丟失。
- Verifier 誤判或 Flaky test。
- 相同 Error 連續出現。
- Plan A／B 振盪。
- Context 接近上限。
- 程序在 Tool 執行後、Checkpoint 前 Crash。
- Human approval 長時間未回覆。
- Parent cancel 時 Child loop 仍在執行。
- Budget 只剩一圈時的 Graceful stop。

## 11.3 Counterfactual Replay

保存 Trace 後，可以用相同 Observation replay 不同 Stop policy：

- 若 `max_turns` 從 12 改成 8，成功率與成本如何？
- 若兩圈無進展就 Replan，能否提早停止？
- 若 Verifier threshold 提高，False positive 是否下降？
- 若換模型，Action sequence 是否更短？

Replay 不等於重做 Side effect；應使用已保存 Observation 或 Sandbox fixture。

## 11.4 Judge 必須被評測

LLM-as-judge 也會漂移。至少檢查：

- 與 Human label 的 Agreement。
- 對長度、語氣與答案位置的 Bias。
- 同一 Candidate 重跑的一致性。
- 對 Prompt injection 的抵抗。
- 新模型版本的 Regression。

若 Judge cost 大於節省的迭代成本，Evaluator loop 可能在經濟上沒有價值。

---

# 12. 常見反模式

## 反模式一：在 Prompt 寫「請一直嘗試直到成功」

自然語言不是 Hard bound。Turns、Cost、Time 與 Side effects 必須由 Runtime 計數。

## 反模式二：由 Agent 自己宣告完成

模型可以提出 Final candidate，但完成必須由外部 Postcondition 證明。

## 反模式三：每個錯誤都 Retry

Permanent error、Permission、Safety block 與 Unknown outcome 需要不同 Route。

## 反模式四：每圈把完整歷史全部塞回去

Context 會膨脹、注意力分散，舊錯誤也會持續影響決策。應使用 Structured state 與選擇性 retrieval。

## 反模式五：Reflection 沒有新 Evidence

同一模型對同一資料反覆評論，可能只增加文字而不增加真相。

## 反模式六：Generator 與 Evaluator 共用相同盲點

應使用外部測試、不同 Rubric、不同 Context，必要時加入 Human calibration。

## 反模式七：Retry Side effect 沒有 Idempotency

任何 Email、Payment、Publish、Delete、Deploy 都需要 Operation ID、Reconciliation 與 Audit。

## 反模式八：只保留最後一版

迭代不保證單調改善。應保存 Best-so-far 與各版 Evidence。

## 反模式九：關閉 Max turns

無上限 Loop 會把一個 Request 放大為 Model denial of service、成本耗盡與 Context growth。

## 反模式十：忽略 Nested loop 的乘法成本

Parent、Worker、Evaluator 與 Retry middleware 都可能各有迴圈；Budget 應沿呼叫樹向下傳播。

---

# 13. 從單一 Loop 走向 Graph Engineering

單一 Loop 適合：

- 一個主 Goal。
- 少量 Action types。
- 回饋路徑相近。
- State 可以由一個 Runner 管理。
- 分支與平行工作有限。

當出現以下訊號，就應把隱含 Loop 提升為顯式 Graph：

- 多個 Phase 各有不同 State schema。
- 條件分支與 Human gate 越來越多。
- 需要平行 Worker 與 Join。
- 不同節點要使用不同 Model、Policy 或 Sandbox。
- 必須局部 Replay／Resume。
- 多個 Loop 互相嵌套，難以推導成本與停止條件。

```text
Loop Engineering
控制單一 Agent 在時間上的反覆行動

Graph Engineering
控制多個 Node／Loop 的拓撲、狀態與轉移
```

Graph 不是取代 Loop；Graph 的 Node 內部仍可能是一個受控 Loop。差別是 Cycle、Branch、Join 與 Checkpoint 被提升成顯式架構。

---

# 14. 導入 Loop Engineering 的實作路線

## Phase 1：把隱含 Loop 寫出來

- 畫出每個 Model call、Tool call、Retry 與 Handoff。
- 找出所有 Feedback edge。
- 定義每一條 Cycle 的 Entry 與 Exit。

## Phase 2：建立 Success 與 Stop Contract

- 把「完成」改成外部可檢查條件。
- 加入 Turns、Time、Cost 與 Side-effect 上限。
- 設計 Partial／Human／Cancelled 等出口。

## Phase 3：結構化 State 與 Observation

- Conversation 與 Workflow state 分離。
- Tool error 正規化。
- 保存 Artifact、Operation ID 與 State delta。

## Phase 4：加入 Progress 與 Loop detection

- Action fingerprint。
- State hash。
- No-progress patience。
- Oscillation 與 repeated error detection。

## Phase 5：Durability 與 Side-effect safety

- Checkpoint／Resume。
- Idempotency key。
- Unknown outcome reconciliation。
- Parent cancellation 傳遞到 Child。

## Phase 6：Trace 與 Failure injection Evals

- 量測 Amplification、Turns、Cost、Repeat 與 Stop reasons。
- 模擬 Timeout、Crash、Prompt injection、Flaky verifier。
- 每次模型、Prompt、Tool、Policy 或 Framework 升級跑 Regression。

---

# 15. Production Checklist

## Goal 與 State

- [ ] Success contract 可由外部程式驗證
- [ ] Goal、Scope、Policy 與版本可追溯
- [ ] Loop state 可序列化、版本化與 Resume
- [ ] Conversation history 不等同 Workflow state

## Action 與 Feedback

- [ ] 模型只提出 Action，Policy 決定能否執行
- [ ] Observation 有狀態、證據、錯誤類型與 State delta
- [ ] Raw Tool output 會壓縮與遮蔽 Secret
- [ ] Reflection 不會自動成為長期事實

## Stop 與 Budget

- [ ] 有 Turns、Tokens、Cost、Time、Tool 與 Side-effect 上限
- [ ] 成功由 Postcondition 驗證
- [ ] 有 No-progress、Repeat 與 Oscillation detection
- [ ] Budget 用完會回傳 Best-so-far
- [ ] Parent budget 與 Cancellation 會傳給 Child loops

## Recovery 與安全

- [ ] Retry 先分類並使用 Backoff／Jitter
- [ ] Side effect 使用 Idempotency key
- [ ] Unknown outcome 先 Reconcile
- [ ] Checkpoint 位於安全的 Commit boundary
- [ ] Human approval／handoff 能保存狀態並續跑

## Observability 與 Evals

- [ ] Trace 能串起 Decision、Policy、Tool、Observation、Verify、Stop
- [ ] 量測 Loop amplification 與 repeated-action ratio
- [ ] 有 Trajectory、Safety、Recovery 與 Failure injection Evals
- [ ] Evaluator／Judge 本身有 Calibration 與 Regression test

---

# 結語：真正成熟的 Agent，不是能一直做，而是知道如何向前與何時停止

Loop Engineering 的核心不是要求模型多思考幾次，而是建立一個可控制的 Feedback system：

- Goal 定義成功，不讓方向逐圈漂移。
- State 保存目前真相，不依賴完整聊天紀錄。
- Action 是受 Policy 約束的狀態轉移提案。
- Observation 把外部世界帶回下一圈。
- Verifier 以 Evidence 證明是否真的改善。
- Progress measure 分辨探索與原地打轉。
- Stop controller 管理完成、人工介入、部分成果與失敗。
- Checkpoint、Idempotency 與 Reconciliation 讓中斷與重試安全。
- Trace 與 Evals 讓非決定性的軌跡可被理解與回歸測試。

> **好的 Loop 不是轉得最久，而是用最少的安全迭代，取得足以證明任務完成的外部證據。**

當單一 Loop 的 Branch、Worker、Human gate 與 Nested cycle 越來越多，下一步就不再只是調整迭代，而是把這些路徑提升為顯式狀態圖——這也是 Graph Engineering 出現的原因。

---

# 參考資料

- [Yao et al. (2022), ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Shinn et al. (2023), Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- [Madaan et al. (2023), Self-Refine: Iterative Refinement with Self-Feedback](https://arxiv.org/abs/2303.17651)
- [Anthropic: Building Effective AI Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic: Trustworthy Agents in Practice](https://www.anthropic.com/research/trustworthy-agents)
- [Anthropic: Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [OpenAI Agents SDK: Running Agents](https://openai.github.io/openai-agents-python/running_agents/)
- [OpenAI Agents SDK: Agent Orchestration](https://openai.github.io/openai-agents-python/multi_agent/)
- [LangGraph: Graph API and Recursion Limit](https://docs.langchain.com/oss/python/langgraph/graph-api)
- [LangGraph: GRAPH_RECURSION_LIMIT](https://docs.langchain.com/oss/python/langgraph/errors/GRAPH_RECURSION_LIMIT)
- [Hou et al. (2026), When Agents Do Not Stop: Uncovering Infinite Agentic Loops in LLM Agents（預印本）](https://arxiv.org/abs/2607.01641)
- [Shrivastava (2026), Semantic Early-Stopping for Iterative LLM Agent Loops（預印本）](https://arxiv.org/abs/2606.27009)
- [Stop Hand-Holding Your Coding Agent: Engineering the Loops that Replace Step-by-Step Prompting（2026 預印本）](https://arxiv.org/abs/2607.00038)
