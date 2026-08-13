---
layout: post
title: Harness Engineering 完整指南：讓 LLM 從會回答走向安全、可靠、可觀測的 Agent
subtitle: 深入工具契約、Sandbox、權限、狀態、恢復、Tracing、Evals，並比較 Hermes Agent、OpenClaw、Pi Agent 與 nanobot
author: Paul Jiang
date: 2026-08-04 09:00:00 +0800
categories: AI
tags: LLM Harness-Engineering AI-Agent Hermes-Agent OpenClaw Pi-Agent nanobot Tools Sandbox Guardrails Observability Evals MCP
sidebar: []
excerpt_image: /assets/images/260813/harness-engineering-complete-guide-hero.png
---

> 本文整理至 **2026 年 8 月 13 日**，是「LLM 工程演進」系列的第四篇。前面依序介紹了 [整體工程演進](/ai/2026/08/01/prompt-context-harness-loop-graph-engineering-evolution.html)、[Prompt Engineering](/ai/2026/08/02/prompt-engineering-complete-guide.html) 與 [Context Engineering](/ai/2026/08/03/context-engineering-complete-guide.html)，這一篇開始把模型接上工具、狀態與真實世界。
>
> 先用一句話定義：**Harness Engineering 是設計包圍模型的執行鷹架，讓模型能在明確能力、權限、資源與安全邊界內採取行動，並且讓整個過程可觀測、可測試、可中斷、可恢復。**

一個模型可以說「我會查詢訂單、修改檔案、執行測試」，但光靠輸出 Token，它並沒有真正做任何事。

若要讓 LLM 變成 Agent，系統必須補上：

- 可以呼叫哪些工具，以及參數和回傳契約
- 能存取哪些檔案、資料庫、網路與應用程式
- 哪些操作可以自動執行，哪些必須人工核准
- 每次呼叫的逾時、重試、冪等與成本上限
- 任務狀態要保存在哪裡，程序中斷後如何續跑
- 如何防止外部資料將惡意指令帶入高權限工具
- 如何記錄模型、工具、Context、延遲與失敗原因
- 如何證明 Agent 完成了真正工作，而不只是自稱完成

這些問題共同構成 Harness Engineering。

![語言模型核心被工具、Sandbox、權限、狀態、重試、觀測、測試與人工核准模組包圍](/assets/images/260813/harness-engineering-complete-guide-hero.png)

_圖：AI 生成的 Harness Engineering 概念圖。中央是模型，外圍鷹架決定它能使用的工具、行動範圍、恢復能力與驗證方式；底部四個模組呼應本文比較的四套框架。_

---

# 1. Harness Engineering 到底是什麼

## 1.1 Harness 是模型與世界之間的控制層

Harness 可翻成「外部框架」、「執行鷹架」或「控制裝具」。它不是 LLM 本身，也不只是 Prompt，而是模型與外部世界之間的軟體控制層。

```text
User／Trigger
      ↓
Application Policy
      ↓
Agent Harness
  ├─ Context Builder
  ├─ Model Adapter
  ├─ Tool Registry
  ├─ Permission Gate
  ├─ Sandbox／Runtime
  ├─ State／Checkpoint
  ├─ Retry／Recovery
  ├─ Observability
  └─ Validation／Evals
      ↓
Files · APIs · Database · Browser · Shell · People
```

模型負責依 Context 推測下一步；Harness 則把「下一步」轉成可控的系統行為。

## 1.2 同一個模型，換 Harness 就像換了一種能力

同一個 LLM 可以被包裝成完全不同的產品：

- 聊天機器人：只能輸出文字
- RAG 助理：能查文件，但不能改資料
- 客服 Agent：能查訂單、試算退款並要求核准
- Coding Agent：能讀寫 Repo、執行 Shell、測試與提交 Diff
- Research Agent：能搜尋、整理證據、保存筆記並產生報告

差異主要不是模型權重，而是 Harness 提供的工具、環境、政策、狀態與驗證器。

## 1.3 Harness Engineering 不等於挑一套 Framework

Framework 可以提供 Agent Loop、Tool abstraction、Checkpoint、Tracing 或 Human-in-the-loop 等積木，但它不知道你的：

- 商業授權規則
- 租戶與資料權限
- 風險分級
- 工具副作用
- 成本與服務等級目標
- 失敗恢復語意
- 正確答案與完成條件

所以：

> **Framework 是建造 Harness 的工具箱；Harness 是針對特定產品與風險設計的完整運行系統。**

---

# 2. Prompt、Context、Harness、Loop 與 Graph 的分工

| 工程層 | 控制對象 | 核心問題 | 典型產物 |
|---|---|---|---|
| Prompt Engineering | 模型指令與輸出 | 要模型做什麼？成功長什麼樣？ | Prompt、Examples、Schema |
| Context Engineering | 每次推論可見資訊 | 此刻模型應知道什麼？ | Retrieval、Memory、Compaction |
| Harness Engineering | 模型周圍的執行環境 | 模型可以怎麼安全接觸世界？ | Tools、Sandbox、Policy、Tracing |
| Loop Engineering | 一個任務的反覆週期 | 如何持續工作、驗證、修正直到停止？ | Agent Loop、Retry、Stop Condition |
| Graph Engineering | 多節點系統拓撲 | 如何管理分支、並行、審批與局部復原？ | State Graph、DAG、Subgraph、Handoff |

Harness 與 Loop 最容易混淆：

- **Harness 偏空間性**：Agent 周圍有哪些設備、界面與界線？
- **Loop 偏時間性**：Agent 如何在多次推論與行動間持續前進？

Harness 像設備、門禁和監控完整的實驗室；Loop 是在實驗室內重複進行的研究流程。許多 Agent Framework 同時實作兩者，但概念上仍值得分開，因為你可以換掉 Loop 而保留同一套工具與政策。

---

# 3. 一套 Production Harness 的十二個核心元件

![Production Agent Harness 的十二個核心元件](/assets/images/260813/harness-engineering-anatomy.svg)

_圖：模型只是核心之一；真正決定 Agent 是否能上線的，是外圍十二個可獨立測試與治理的元件。_

## 3.1 Model Adapter：隔離模型供應者差異

Model Adapter 負責統一：

- 訊息格式
- Tool calling／Structured output
- Streaming event
- Token usage
- Reasoning 設定
- Context Window 與輸出上限
- Rate limit 與錯誤類型

不要讓產品邏輯到處直接依賴某個供應者的原始回應格式。至少應將模型 ID、參數、SDK 版本與 Feature flag 記錄在每次 Trace 中。

## 3.2 Context Builder：把每一步需要的資訊送進模型

Context Builder 串接前一篇介紹的 Context Engineering：

- 組合指令、對話、檢索結果與工作狀態
- 依 Token Budget 去重與壓縮
- 區分可信指令和不可信資料
- 保留來源與版本

它通常會在每次模型呼叫前重新執行，而不是任務開始時只建一次 Context。

## 3.3 Tool Registry：能力目錄與工具契約

Tool Registry 不只是函式陣列。每項工具至少應描述：

```yaml
name: issue_refund
purpose: 對已核准退款建立退款交易
input_schema:
  order_id: string
  amount_twd: integer
side_effect: irreversible_external_write
required_scope: refund.write
approval: always
timeout_seconds: 20
retry_policy: never_after_unknown_result
idempotency_key: required
output_schema:
  transaction_id: string
  status: enum[pending, completed, rejected]
```

模型看到的是語意介面；Harness 還需要知道權限、副作用、逾時與恢復語意。

## 3.4 Policy Engine：授權不交給模型自行判斷

模型可以提出行動，但不能自己授權行動。Policy Engine 根據：

- 身分與角色
- 租戶、專案與資料 Scope
- 工具風險等級
- 金額或資源門檻
- 執行環境
- 使用者這次請求實際授權的範圍

做出 deterministic 的 Allow、Deny 或 Require Approval。

```text
Model proposes action
        ↓
Schema validation
        ↓
Authentication + Authorization
        ↓
Risk policy
   ├─ allow
   ├─ deny
   └─ pause for approval
```

## 3.5 Sandbox／Runtime：限制工具能碰到的世界

Coding、資料分析與 Computer-use Agent 常需要執行任意程度的程式或操作。Sandbox 應控制：

- 可讀寫目錄
- CPU、記憶體、磁碟與執行時間
- 網路 Egress
- 套件安裝
- Secret 注入
- Process 與 OS 權限
- Browser profile 或 Desktop session
- 執行完成後是否保留環境

Sandbox 不是絕對安全保證，而是一層 blast-radius reduction。高風險動作仍需要工具級權限和人工核准。

## 3.6 State Store：保存任務真相

State 應明確區分：

- Conversation history
- Workflow state
- Tool call／result
- Artifact reference
- Approval state
- Memory
- Trace／audit event

不要只靠一串自然語言聊天紀錄表示所有狀態。交易 ID、已完成步驟、核准人與版本等關鍵資料應使用結構化欄位。

## 3.7 Checkpoint 與 Resume：讓中斷不是重頭開始

長任務可能因：

- Process crash
- 使用者隔天才核准
- API rate limit
- 外部系統暫時不可用
- Deployment
- Context compaction

而暫停。Checkpoint 應保存足夠狀態，使系統能判斷哪些步驟已完成、哪些可以重跑、哪些必須先查證外部結果。

## 3.8 Retry、Timeout 與 Circuit Breaker

不是所有錯誤都適合重試：

| 錯誤類型 | 建議 |
|---|---|
| 429、暫時性 5xx | 指數退避並加入 jitter |
| Schema validation failed | 回到模型修正一次，限制次數 |
| 權限不足 | 不重試；回報或要求授權 |
| 付款請求逾時、結果未知 | 先以 idempotency key 查詢狀態，不能直接重送 |
| 不存在的資源 | 視業務語意追問或停止 |
| 連續供應者故障 | Circuit breaker，改走降級路徑 |

重試是業務語意，不是 `except: try_again()`。

## 3.9 Human-in-the-loop：將人放在正確的風險點

人工核准適合放在：

- 不可逆外部寫入
- 金錢、法律、醫療或高風險決策
- 權限擴張
- 影響多人或公開發布
- 模型信心不足且錯誤成本高

核准畫面要顯示具體 Diff 或行動摘要，而不是只問「允許 Agent 繼續嗎？」：

```text
將執行：退款 NT$1,680
訂單：ORDER-4821
付款方式：原信用卡
依據：退款政策 v2026-07-15 第 4.2 條
影響：送出後不可由 Agent 撤銷
```

## 3.10 Observability：看見 Agent 為何這樣做

每次 Run 應有 Trace，並將以下事件串起來：

```text
request
  → context build
  → model call
  → tool proposal
  → policy decision
  → approval
  → tool execution
  → validation
  → final output
```

推薦記錄：

- `run_id`、`trace_id`、`user／tenant scope`
- Prompt／Context／Tool schema 版本
- Model、參數與 Token
- Tool 名稱、參數雜湊、結果狀態與延遲
- Policy decision 與 Approval actor
- Retry、Exception、Checkpoint
- 成本、總延遲、最後完成狀態

敏感 Context 不應因為「方便除錯」就完整進 Log；應做遮蔽、取樣與保存期限管理。

## 3.11 Validators 與 Evals：驗證真實世界，而不是 Agent 的自我敘述

如果 Agent 說「測試通過」，Harness 應取得真正的測試 Exit Code；如果說「退款成功」，應查驗交易狀態；如果產生 JSON，應用 Schema Parser 驗證。

驗證器可分為：

- Schema validator
- Business-rule validator
- Artifact validator
- Security／Policy validator
- External-state verifier
- LLM／Human grader

## 3.12 Budget 與 Stop Controller：防止無限工作

需要限制：

- 最大模型呼叫數
- 最大工具呼叫數
- Token／金額預算
- Wall-clock deadline
- 連續無進展次數
- 重複相同行動次數
- 最大子 Agent 數

達到上限時要產生結構化的 `partial` 或 `blocked` 結果，保留已完成產物和續跑位置，而不是突然失去所有資訊。

---

# 4. 一次 Tool Call 應如何安全地完成

![安全 Tool Call 從模型提案到驗證、提交與記錄的生命週期](/assets/images/260813/harness-tool-call-lifecycle.svg)

_圖：模型只能提出 Tool Call；真正執行之前仍須經過 Schema、授權、風險與核准控制。_

## 4.1 模型只提出 Proposal

```json
{
  "tool": "send_email",
  "arguments": {
    "to": ["customer@example.com"],
    "subject": "退款進度",
    "body": "您的退款已送出。"
  }
}
```

這不是已授權命令，只是一個待審查提案。

## 4.2 Harness 進行 deterministic preflight

依序檢查：

1. Tool 是否存在且在本 Run 的 Allowlist？
2. 參數是否符合 Schema？
3. 收件人與資料是否在正確 Tenant？
4. 使用者是否授權寄信？
5. 是否包含敏感資料？
6. 是否需要人工核准？
7. 是否超過成本、頻率或數量門檻？

## 4.3 Side-effect Tool 使用 Idempotency Key

```text
idempotency_key = hash(
  tenant_id,
  run_id,
  tool_name,
  normalized_arguments,
  business_operation_id
)
```

即使網路斷線或 Process 重啟，也能先查詢先前是否已完成，避免重複寄信、退款或建立工單。

## 4.4 Postcondition Verification

工具回傳 `200 OK` 不等於業務成功。應檢查：

- 資源是否真的存在
- 狀態是否達到預期
- 寫入值是否正確
- 有無產生不可預期的額外影響
- 結果能否追溯到 Transaction ID

## 4.5 把結果以精簡結構回給模型

```json
{
  "status": "completed",
  "message_id": "msg_8f31",
  "recipient_count": 1,
  "sent_at": "2026-08-13T22:04:31+08:00"
}
```

避免把完整 HTTP Header、SDK Debug Log 和不必要的個資全塞回 Context。

---

# 5. Tool 設計：Agent 最終只能可靠到它的工具介面

## 5.1 工具要窄、清楚、可組合

不佳：

```text
manage_customer(action, payload)
```

較佳：

```text
get_customer_profile(customer_id)
list_customer_orders(customer_id, status, limit)
quote_refund(order_id, reason)
issue_refund(order_id, quote_id, idempotency_key)
```

窄工具較容易限制權限、驗證參數與追蹤副作用。

## 5.2 Read 與 Write 分離

將 `sql(query)` 同時拿來查詢和刪除資料，是危險的介面。Production Agent 應優先提供業務語意工具；需要 SQL 時，也應將 Read-only 與 Write 路徑、Credential 和 Approval 分開。

## 5.3 回傳錯誤要能驅動正確下一步

```json
{
  "status": "error",
  "code": "APPROVAL_REQUIRED",
  "retryable": false,
  "approval_request_id": "apr_2041",
  "next_action": "pause"
}
```

比自然語言 Stack Trace 更適合 Agent 判斷。

## 5.4 MCP 解決互通性，不自動解決信任

Model Context Protocol（MCP）可標準化工具與資料連接方式，讓不同 Agent Client 共用 Server。但安裝或連接 MCP Server 仍需評估：

- Server 的維護者與部署位置
- Authentication／Authorization
- Tool annotation 是否與實際副作用一致
- 傳出的資料與保存政策
- Network access
- Prompt Injection 與結果污染

協定讓連接更容易，也可能讓高權限能力更容易被錯誤暴露。

---

# 6. Sandbox、權限與 Secret 管理

## 6.1 最小權限應落在基礎設施，而非 Prompt

「請不要讀取其他資料夾」不是安全邊界。真正的邊界包括：

- Filesystem ACL／mount
- Container user
- Network policy
- Database role
- OAuth scope
- Cloud IAM
- Secret broker
- 獨立測試帳號與環境

## 6.2 Secret 不應直接進入模型 Context

較好的流程是：

```text
Model requests tool
→ Harness authorizes request
→ Tool runtime obtains short-lived credential
→ Tool calls external service
→ Model only receives sanitized result
```

模型通常不需要看到 API Key、Access Token 或完整連線字串。

## 6.3 Network Egress 採 Allowlist

能執行 Shell 又能自由連網的 Agent，外洩風險很高。可依任務只開放：

- 指定套件 Registry
- 指定企業 API
- 經 Proxy 審計的 Web access
- DNS 與目的地主機 Allowlist

## 6.4 不可信資料與高權限工具隔離

瀏覽器看到的網頁、Email、Issue 與文件都可能含間接 Prompt Injection。Harness 不應讓它們改寫工具政策。敏感工具可放在不同 Agent、不同程序，甚至不同網段中，只接受結構化、已驗證的輸入。

---

# 7. Persistence、恢復與冪等性

## 7.1 至少要有三種 ID

```text
trace_id       一次端到端請求的觀測鏈
run_id         一次 Agent 執行
operation_id   一次具業務意義的外部動作
```

此外還可能有 conversation、thread、checkpoint、approval 和 artifact ID。

## 7.2 Exactly-once 通常是假象

分散式系統很難保證絕對 exactly-once。較實際的方式是：

- At-least-once delivery
- Idempotent business operation
- Durable operation log
- 執行前後查詢外部狀態
- 對 unknown result 採 reconciliation

## 7.3 Checkpoint 邊界放在哪裡

適合保存 Checkpoint 的時機：

- 高成本步驟完成後
- 外部寫入提交後
- 等待人工輸入前
- 長時間工具呼叫前後
- Context compaction 後
- 進入新的工作階段時

Checkpoint 太少會重做昂貴工作，太多則增加儲存與序列化負擔。

## 7.4 Resume 必須處理版本漂移

隔天續跑時，Prompt、Tool schema、Framework 或政策可能已更新。Checkpoint 應記錄相依版本；若不相容，應執行 Migration 或安全終止，不能假設舊狀態一定能套到新程式。

---

# 8. Observability：如何除錯一個非決定性系統

## 8.1 Log、Metric、Trace、Artifact 各自用途

| 類型 | 回答的問題 |
|---|---|
| Log | 某個時間點發生了什麼事件？ |
| Metric | 整體成功率、延遲與成本趨勢如何？ |
| Trace | 這次 Run 經過哪些模型、工具與政策決策？ |
| Artifact | Agent 真正產生或修改了什麼？ |

## 8.2 最少要追的 Metrics

- Task success rate
- Tool selection／argument accuracy
- Approval rate／rejection rate
- Retry and recovery rate
- P50／P95／P99 latency
- Token and cost per successful task
- Runs hitting budget／iteration limit
- Duplicate side-effect incident
- Security policy denial
- Human correction rate

## 8.3 Trace 必須能重建原因，但不一定能完整 Replay

即使保存完全相同輸入，外部資料、模型版本和隨機性仍可能改變結果。應區分：

- **Inspect**：看懂當時發生什麼
- **Replay**：在相同或模擬環境重跑
- **Reproduce**：得到足以定位問題的相同行為

不要為了追求完全 Replay，把所有秘密與個資無限制保存。

---

# 9. Evals：Harness 的品質不只看答案

## 9.1 分層評測

```text
Tool unit tests
    ↓
Policy and permission tests
    ↓
Single-step model/tool tests
    ↓
Multi-step scenario tests
    ↓
Adversarial and failure-injection tests
    ↓
Production canary and monitoring
```

## 9.2 必測的 Harness 場景

- Tool 回傳 429、500、逾時與 malformed data
- 模型重複提出同一個外部寫入
- 使用者在核准前改變要求
- Process 在寫入成功但回應前 Crash
- Context 逼近上限並觸發 Compaction
- 不可信文件要求洩漏 Secret
- Agent 使用錯誤 Tenant 的 ID
- Checkpoint 由舊版本程式續跑
- 人工核准等待數小時或數天
- Validator 否定模型自稱的成功

## 9.3 驗證 Side Effect 的不變量

例如退款 Agent：

```text
refund_amount <= paid_amount
refund_count_per_operation_id <= 1
approval.actor has refund_approve scope
transaction.order_id belongs to authenticated tenant
every completed refund has audit event and policy version
```

這些不變量應由程式與資料庫約束保護，不是只寫在 Prompt 裡。

## 9.4 Framework 升級也要跑 Regression Evals

Agent Framework 更新可能改變：

- Tool schema 轉換
- Message history
- Default retry
- Streaming event
- Handoff／routing
- Checkpoint serialization
- Tracing 欄位

版本升級應像模型與 Prompt 升級一樣，先在代表性情境與故障注入下比較。

---

# 10. 2026 年常見的四個開源 Agent Harness

先回答最容易混淆的問題：**Hermes Agent、OpenClaw、Pi Agent 與 nanobot，確實是 2026 年開源個人／自主 Agent harness 圈常被討論與採用的一組。**不過「主流」不是全球排名；更精準的說法是，它們代表四種很有辨識度的 Harness 路線。

1. **Hermes Agent**：會累積記憶與技能、強調自我改進的長期個人 Agent。
2. **OpenClaw**：以 Gateway 串接通訊渠道、裝置與 Agent 的 always-on 個人助理。
3. **Pi Agent**：極簡、可自行擴充的 terminal coding harness。
4. **nanobot**：Python 寫成的小型、自架、功能完整個人 Agent runtime。

> OpenAI Agents SDK、LangGraph、CrewAI、Microsoft Agent Framework 偏向「讓開發者把 Agent 嵌入應用程式」的 SDK／orchestration framework；本節四個專案更接近「安裝後就能長期工作，並可繼續擴充」的完整 Agent harness。兩類產品不在完全相同的抽象層。

![Hermes Agent、OpenClaw、Pi Agent 與 nanobot 的 Harness 定位比較](/assets/images/260813/agent-framework-comparison.svg)

_圖：四個專案都能包住模型並讓它採取行動，但設計中心分別是學習、Gateway、極簡可塑性與輕量完整性。_

## 10.1 Hermes Agent：會累積能力的長期個人 Agent

[Hermes Agent](https://hermes-agent.nousresearch.com/docs/) 是 Nous Research 建立的開源自主 Agent。它不只保存對話，而是把 **Memory、Skills 與使用者模型**放進同一個學習迴圈：從工作經驗建立可重用技能、在使用過程改善技能，並跨 Session 回想過去資訊。

它可跑在本機、VPS、Container、SSH 或 Serverless 執行環境，並透過 CLI、Desktop 或 Messaging Gateway 接到 Telegram、Discord、Slack、WhatsApp 等平台。它更像持續存在的個人 Agent，而不是一次性的 Coding CLI。

核心 Harness 能力：

- 多 Provider／多模型，可使用不同 API、OpenAI-compatible endpoint 或自有模型
- Terminal、Files、Web、Browser、Cron 與委派工具
- Persistent memory、跨 Session recall 與 Skill learning
- Skills、Plugins、MCP 與工具篩選
- Messaging Gateway、排程與隔離 Subagents
- Command approval、授權設定與 Container isolation

快速安裝：

```bash
# Linux、macOS、WSL2
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes setup
hermes
```

```powershell
# Windows PowerShell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
hermes setup
hermes
```

**優點**是 Memory 與 Skill learning 屬於核心設計，同一個 Agent 可跨介面延續工作，也適合常駐伺服器與排程。**主要代價**是治理：Agent 自動建立或改善 Skill，等於會改變未來行為；Skill 必須有來源、版本、Review 與回滾。Persistent memory 也需要寫入政策、刪除方式、敏感資料過濾與保存期限。

最適合想讓 Agent 長期記住偏好、專案與工作方法，並願意治理 Memory 與自我改進風險的使用者。

## 10.2 OpenClaw：以 Gateway 為中心的個人 Agent 作業層

[OpenClaw](https://docs.openclaw.ai/) 是自架的個人 AI assistant 與 Agent Gateway。單一 Gateway 是 Session、Routing 與 Channel connection 的控制平面，再把 Agent 接到 Web Control UI、CLI／TUI、WhatsApp、Telegram、Slack、Discord、Signal、iMessage 與行動裝置 Nodes。

它的核心問題不是如何畫 Agent Graph，而是如何讓同一位操作者隨時從不同渠道安全地喚起同一套 Agent 能力。

核心 Harness 能力：

- Gateway 管理 Sessions、Tools、Events、Routing 與 Channels
- 多 Agent routing，可依 Agent、Workspace 或 Sender 隔離 Session
- Tools、Skills、Plugins、ClawHub、Cron 與 Webhooks
- Hosted／Local model providers
- Control UI、CLI、TUI、Companion Apps 與 Nodes
- Pairing、Allowlist、Mention gate、Tool policy、Exec approval 與 Sandbox

快速安裝：

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
openclaw gateway status
openclaw dashboard
```

**優點**是 Channel 與 Gateway 生態完整，適合真正 always-on 的個人 Agent；Session、身份、Workspace 與多 Agent routing 也有明確模型。**關鍵風險**是 Host 與網路邊界：官方明確提醒，Main session 的 Tools 預設可能直接在 Host 上執行，Sandbox 需主動設定。通訊訊息、Email、網頁與附件都可能帶入 Prompt injection，只限制 DM Sender 並不夠。

Gateway 暴露公網前，必須處理 Token、Pairing、TLS、Reverse proxy、來源政策與 Secret；互不信任的使用者應使用不同 Gateway 與 OS Account。

最適合想從手機和多種通訊平台呼叫同一位 Self-hosted 個人 Agent 的開發者與 Power user。

## 10.3 Pi Agent：極簡、自我可擴充的 Coding Harness

[Pi Agent Harness](https://github.com/earendil-works/pi) 的官方描述是「minimal terminal coding harness」。它刻意只給模型四個預設工具：`read`、`write`、`edit`、`bash`，其餘能力透過 TypeScript Extensions、Skills、Prompt Templates、Themes 與 Pi Packages 加入。

Pi 可用 Interactive、Print／JSON、RPC 與 SDK 四種模式執行，因此既是 Coding CLI，也能作為可嵌入的 Agent runtime。

> 舊資料常指向 `badlogic/pi-mono`；目前該網址會導向官方 `earendil-works/pi`，套件名稱也已更新為 `@earendil-works/*`。

核心 Harness 能力：

- `pi-ai`：統一多 Provider LLM API
- `pi-agent-core`：Tool calling 與 State management runtime
- `pi-coding-agent`：互動式 Coding Agent CLI
- Session tree、Fork、Branch、Compaction、Import／Export
- Context files、Skills、Prompt Templates、Themes 與 Pi Packages
- TypeScript Extensions 可替換 Tools、UI、Compaction 與 Provider
- RPC 與 SDK 方便嵌入其他程式

快速安裝：

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
pi
```

**優點**是核心小、抽象少、擴充點深，很適合打造自己的 Coding Agent。**安全上的最大差異**也必須直接說清楚：官方文件指出 Pi 沒有內建限制 Filesystem、Process、Network 或 Credential 的 Permission system，預設繼承啟動 User／Process 的權限。

Permission gate、Path protection、Subagents、Plan mode、MCP 或 Sandbox 可由 Extension 提供，但不是核心保證。Pi Packages 的 Extensions 可執行任意程式碼；第三方套件必須先 Review，正式使用應放在 Container、Micro-VM 或 Policy-controlled sandbox。

最適合重視可讀性、可 Hack 性與嵌入能力，並願意自行設計 Permissions、Sandbox、Telemetry 與 Production controls 的 TypeScript／Node 團隊。

## 10.4 nanobot：小核心但具備完整個人 Agent 能力

[nanobot](https://github.com/HKUDS/nanobot) 是 HKUDS 以 Python 寫成的 ultra-lightweight、自架個人 Agent framework。它把 WebUI、Terminal、Chat apps、Tools、Long-term memory、MCP、Model routing、Subagents、排程與 OpenAI-compatible API 放進相對小且可閱讀的 Core。

它介於 Pi 的最小 coding harness 與 OpenClaw 的大型 Gateway 生態之間：保留容易理解與改造的 Python 核心，同時提供可直接長駐使用的 WebUI、Gateway、Memory 與 Automation。

核心 Harness 能力：

- WebUI、Terminal、Chat apps 與長駐 Gateway
- File、Shell、Web、MCP、Cron、Image generation 等 Tools
- Session history 與 Dream long-term memory consolidation
- Long-horizon goals、Scheduled automation 與 Subagents
- 多 Provider、Fallback、Local LLM 與 OpenAI-compatible endpoint
- Python SDK、OpenAI-compatible API 與可見 Tool activity
- Pairing／Allowlist、Workspace restriction、Shell sandbox 與 Network checks

快速安裝：

```bash
# macOS／Linux
curl -fsSL https://raw.githubusercontent.com/HKUDS/nanobot/main/scripts/install.sh | sh
nanobot webui
```

```powershell
# Windows PowerShell
irm https://raw.githubusercontent.com/HKUDS/nanobot/main/scripts/install.ps1 | iex
nanobot webui
```

**優點**是 Python 核心較小，卻已有 WebUI、Memory、Gateway、Automation、SDK 與 API。**安全注意**是輕量不等於天然安全：若開啟 Shell、MCP、外部訊息與自我修改，攻擊面仍很大。應啟用 Workspace restriction 與 Channel access control；Linux 可使用 `bwrap`，macOS／Windows 則需 Container 或其他 OS Sandbox。

最適合 Python 團隊 Self-host 個人 Agent、教學研究與中小型 Automation，並願意在小核心之上補齊部署、觀測與安全政策。

## 10.5 四個 Harness 的選型比較

| 面向 | Hermes Agent | OpenClaw | Pi Agent | nanobot |
|---|---|---|---|---|
| 核心定位 | 會學習的長期個人 Agent | 多 Channel Agent Gateway | 極簡 Coding Harness | 輕量完整個人 Agent Runtime |
| 技術棧 | Python 為主 | Node.js／TypeScript | TypeScript | Python |
| 主要介面 | CLI、Desktop、Messaging Gateway | Control UI、CLI／TUI、Channels、Nodes | Terminal、Print／JSON、RPC、SDK | WebUI、Terminal、Chat apps、API、SDK |
| Memory | 跨 Session、Skill learning | Session、Workspace、Agent memory | Session tree、Context files、Compaction | Session、Dream long-term memory |
| Automation | Cron、Gateway、Subagents | Cron、Webhooks、Gateway、Routing | 核心不預設，靠 Extension／外部程式 | Cron、Long goals、Subagents、Gateway |
| 安全基線 | Approval、Authorization、隔離 Backend 可設定 | Pairing／Allowlist；Host tools 與 Sandbox 要審查 | 無內建 Permission system；應外部 Sandbox | Workspace policy、Pairing、Linux bwrap 可設定 |
| 最大特色 | 累積方法與個人化 | 跨平台 always-on 控制平面 | 最小、最可塑、容易嵌入 | 小核心與完整功能的折衷 |
| 最佳場景 | 長期個人化與技能累積 | 多通訊渠道個人助理 | 客製 Coding Agent | Python 自架 Agent／Automation |

選型可以先問四個問題：

- 想讓 Agent 越用越懂你、持續生成 Skills：先看 **Hermes Agent**。
- 想從手機與多個 Channel 隨時呼叫：先看 **OpenClaw**。
- 想自己打造最小 Coding Agent：先看 **Pi Agent**。
- 想要 Python、小而完整、可直接 Self-host：先看 **nanobot**。

不確定時，讓四者完成同一個 Thin Slice：在隔離專案內讀檔、查兩個官方來源、改一個檔案、跑測試、重啟後恢復，再從外部介面取回結果。比較實際權限邊界、Session／Memory、Tool trace、擴充信任、Provider 切換、版本固定與回滾成本，而不是只比 Feature list。

---

# 延伸：另一類常見的企業 Agent SDK

以下四套同樣重要，但屬於應用程式 SDK／workflow orchestration 的比較。它們可與上述完整 Harness 搭配，不應當成同一層的完全替代品。

## 四套 SDK 的代表性取向

這裡不是依 GitHub Star 排名，而是補充四個在 2026 年仍有明確官方路線、能代表不同應用開發取向的框架：

1. **OpenAI Agents SDK**：輕量、Code-first、OpenAI 原生 Agent runtime。
2. **LangGraph**：低階、狀態圖導向、強調 Durable execution。
3. **CrewAI**：以角色、Crew 與 Flow 快速建立多 Agent 協作。
4. **Microsoft Agent Framework**：Python／.NET、多 Provider、企業整合與 batteries-included Harness。

> 為何沒有 AutoGen 與 Semantic Kernel？截至本文日期，Microsoft 已將 AutoGen 轉入維護模式，並將 Microsoft Agent Framework 定位為 AutoGen 與 Semantic Kernel 的直接後繼。新專案應優先評估後者；既有系統則依遷移成本決定時程。

## OpenAI Agents SDK

### 定位

OpenAI Agents SDK 將 Agent、Runner、Tools、Handoffs、Guardrails、Sessions、Approval 與 Tracing 做成 Code-first 元件。官方的區分很清楚：若你要自己掌控每一步 Loop，可直接使用 Responses API；若希望 SDK 管理 Agent Loop、反覆 Tool call、Handoff 與暫停／續跑，使用 Agents SDK。

### 核心抽象

- `Agent`：指令、模型、工具、Guardrails 與 Handoffs
- `Runner`：執行 Agent Loop
- Function／Hosted／MCP Tools
- Agent-as-tool 與 Handoff
- Sessions／Run state
- Guardrails 與 resumable approvals
- Built-in tracing
- Sandbox agents

### 最小 Python 範例

```python
import asyncio
from agents import Agent, Runner, function_tool


@function_tool
def get_order_status(order_id: str) -> str:
    """取得訂單目前狀態；只讀工具。"""
    return f"{order_id}: delivered"


agent = Agent(
    name="Support agent",
    instructions="查詢訂單並說明結果；不得假裝已執行不存在的工具。",
    tools=[get_order_status],
)


async def main():
    result = await Runner.run(agent, "查詢 ORDER-4821")
    print(result.final_output)


asyncio.run(main())
```

安裝：

```bash
pip install openai-agents
```

### 優點

- API 小而直接，單 Agent 到 Handoff 容易漸進擴張
- 與 OpenAI 平台 Tools、Responses、Tracing 整合緊密
- Python 與 TypeScript
- Guardrails、Sessions、Approval 和 Trace 是一級元件
- 適合 OpenAI-first 的產品與交易型工作流

### 限制與注意事項

- 對其他模型供應者的抽象與整合深度需自行驗證
- 複雜顯式 DAG、精細節點重播與圖狀狀態控制，不如 LangGraph 直接
- SDK 提供 Guardrail 介面，不代表業務 ACL、Sandbox 與 Side-effect safety 已完成
- State storage、Tool implementation 與 Deployment 仍由應用負責

### 最適合

- OpenAI 為主要模型平台
- 希望以少量抽象快速取得 Tool loop、Handoff、Guardrail、Approval 與 Tracing
- 客服、助理、Voice Agent、交易協作與中等複雜 Agent

## LangGraph

### 定位

LangGraph 是建構長時間、Stateful Agent 的低階 orchestration framework/runtime。它以 State、Node、Edge 與 Checkpointer 表達執行，重點是 Durable execution、Persistence、Streaming、Human-in-the-loop、Time travel 與 Fault tolerance。

LangChain 的高階 Agent 也建立在 LangGraph 之上，但你可以直接使用 LangGraph，不必綁定 LangChain 的所有元件。

### 核心抽象

- State schema
- Nodes／Edges／Conditional edges
- Reducers
- Checkpointer／Threads
- Interrupt／Command resume
- Subgraphs
- Stream
- LangSmith observability／evaluation

### 最小 Python 範例

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver


class State(TypedDict):
    order_id: str
    status: str


def lookup_order(state: State):
    return {"status": "delivered"}


builder = StateGraph(State)
builder.add_node("lookup_order", lookup_order)
builder.add_edge(START, "lookup_order")
builder.add_edge("lookup_order", END)

graph = builder.compile(checkpointer=InMemorySaver())
result = graph.invoke(
    {"order_id": "ORDER-4821", "status": ""},
    {"configurable": {"thread_id": "customer-0182"}},
)
```

安裝：

```bash
pip install -U langgraph
```

### 優點

- 執行拓撲、狀態與恢復點高度顯式
- 強大的 Checkpoint、Interrupt、Resume 與 Time travel
- 適合混合 deterministic code 和 agentic decision
- 能局部重跑、檢查歷史 State、管理長時間任務
- Provider 相對中立，適合複雜客製流程

### 限制與注意事項

- 抽象較低，初期程式碼與狀態設計成本較高
- Graph 易被過度設計；簡單 Agent 不一定需要
- Production Checkpointer、部署、Tool ACL 與 Sandbox 仍需自行整合
- Node Side effect 必須遵守冪等性，特別是 Interrupt 後節點可能重新執行

### 最適合

- 需要長時間、可暫停、可恢復與可審查的 Agent
- 有明確分支、並行、子圖或多 Agent 拓撲
- 對狀態控制與故障恢復要求高
- 願意投入較多工程以取得更細控制

## CrewAI

### 定位

CrewAI 以 Agent、Task、Crew、Process 和 Flow 表達團隊協作。Crew 適合用角色與任務快速描述多 Agent；Flow 則使用 `@start`、`@listen`、`@router` 等 Python decorator 建立事件驅動流程，並提供 State、Persistence 與 Human feedback。

### 核心抽象

- Agent：Role、Goal、Backstory、Tools
- Task：Description、Expected output、Guardrails
- Crew：多 Agent 團隊
- Process：Sequential／Hierarchical 等協作方式
- Flow：Start、Listen、Router、AND／OR
- Memory／Knowledge
- Human feedback
- Observability integrations

### 最小 Python 範例

```python
from crewai import Agent, Crew, Process, Task


researcher = Agent(
    role="Policy Researcher",
    goal="找到目前有效的退款政策並保留來源",
    backstory="你只使用有版本與生效日的正式政策。",
)

task = Task(
    description="判斷延遲五日的訂單適用哪些條款。",
    expected_output="條款摘要、版本、生效日與來源。",
    agent=researcher,
)

crew = Crew(
    agents=[researcher],
    tasks=[task],
    process=Process.sequential,
)

result = crew.kickoff()
```

安裝：

```bash
uv tool install crewai
```

### 優點

- Role／Task／Crew 心智模型直覺，原型速度快
- 多 Agent 協作與任務委派表達簡潔
- Flow 補上 State、Routing、Persistence 與 Human feedback
- Memory、Knowledge、Guardrail、Callback 與 Observability 生態完整
- 適合研究、內容、營運與 Business automation

### 限制與注意事項

- 過度使用角色敘事可能增加 Prompt 與 Token 負擔
- Crew 的高階自動協作較難預測，重要流程宜用 Flow 收緊路徑
- 對極細的 Checkpoint／Replay／State transition 控制，需確認是否符合需求
- 商業邏輯、ACL、Side-effect idempotency 與 Sandbox 仍要自行實作

### 最適合

- 團隊已用「角色—任務—交付物」描述工作
- 需要快速建立 Research、Content、Operations 多 Agent 原型
- 希望 Agent autonomy 與顯式 Flow 混合
- Python-first 團隊

## Microsoft Agent Framework

### 定位

Microsoft Agent Framework 是 Microsoft 將 AutoGen 的 Agent／Multi-agent 經驗與 Semantic Kernel 的企業能力整合後推出的後繼框架，支援 Python、.NET，並開始提供 Go。它將能力分成 Agents、Harness 與 Workflows 三類。

特別值得注意的是，它直接提供名為 Agent Harness 的 batteries-included runtime，內含 Tool loop、每次 Service call 的 History persistence、Compaction、Todo、Plan／Execute mode、File memory、File access、Tool approval、OpenTelemetry，也可選擇加入 Skills、Background agents、Shell 與 Looping。

### 核心抽象

- Agent／Chat client
- AgentSession
- Context providers／Middleware
- Tools／MCP
- `create_harness_agent`
- Workflows／Executors／Edges
- Checkpoint／Human-in-the-loop
- OpenTelemetry
- A2A、AG-UI、OpenAI-compatible hosting、Durable Extension

### 最小 Harness 範例

```python
from agent_framework import create_harness_agent
from agent_framework.openai import OpenAIChatClient


agent = create_harness_agent(
    OpenAIChatClient(model="gpt-5.6"),
    max_context_window_tokens=1_000_000,
    max_output_tokens=32_000,
    disable_web_search=True,
)

session = agent.create_session()


async def run_task():
    result = await agent.run(
        "檢查專案、提出計畫、執行安全的本機修改並驗證。",
        session=session,
    )
    print(result)
```

安裝核心套件：

```bash
pip install agent-framework
```

實際 Provider 可能需要額外套件，應依官方版本指南固定依賴並測試。

### 優點

- 官方直接把 Harness 當成核心產品概念
- Python／.NET、多 Provider，適合 Microsoft 與企業應用堆疊
- Session、Middleware、Telemetry、Workflows 與 Hosting 路線完整
- Batteries-included Harness 適合研究、Coding 與長時間任務
- 是 AutoGen／Semantic Kernel 新專案的官方後繼方向

### 限制與注意事項

- 框架在快速演進，部分 Hosting／Provider／Go 功能成熟度不同
- Batteries-included 預設方便，但必須審查自動核准、Web、File 與 Shell 能力
- 多套件、多 Provider 與 Azure／Foundry 整合的版本矩陣較複雜
- 若團隊不使用 .NET、Azure 或 Microsoft 生態，導入價值需與較輕框架比較

### 最適合

- .NET／Python 企業團隊
- Azure、Microsoft Foundry 或多 Provider 部署
- 從 AutoGen／Semantic Kernel 規劃新架構或遷移
- 需要現成 Harness、Workflow、Telemetry 與 Hosting 能力

---

# 企業 Agent SDK 的選型比較

這四個框架也不是同一層級的完全替代品；它們各自在輕量 Runtime、Durable Graph、角色協作與企業 Harness 上有不同重心。

| 面向 | OpenAI Agents SDK | LangGraph | CrewAI | Microsoft Agent Framework |
|---|---|---|---|---|
| 主要心智模型 | Agent + Runner + Tool + Handoff | State + Node + Edge + Checkpoint | Agent + Task + Crew + Flow | Agent + Harness + Workflow |
| 主要語言 | Python、TypeScript | Python、TypeScript | Python | Python、.NET；Go 能力持續擴充 |
| Provider 取向 | OpenAI-first | 相對中立 | 多 Provider | 多 Provider、Azure／Foundry 深度高 |
| 上手速度 | 快 | 中至慢 | 快 | 中 |
| 顯式流程控制 | 中 | 很高 | Crew 中、Flow 高 | Workflow 高 |
| Durable／Checkpoint | 有 Run／Session 與續跑能力 | 核心強項 | Flow 支援 Persistence | Session、Workflow、Durable Extension |
| Human-in-the-loop | Guardrails／Approval | Interrupt／Resume | Human feedback／Triggers | Tool approval／Workflow HITL |
| Observability | Built-in tracing | LangSmith／OpenTelemetry 整合 | 多種 Observability integration | OpenTelemetry |
| Multi-agent | Handoff、Agent-as-tool | Subgraph／自訂拓撲 | 核心強項 | Handoff／Group／Workflow |
| Batteries-included Harness | 中 | 低階積木為主 | 中高 | 高 |
| 最佳場景 | OpenAI 原生產品 | 長任務、複雜狀態圖 | 角色型團隊自動化 | Microsoft／企業級多 Provider |

## SDK 情境一：快速做可靠的 Tool-calling Agent

OpenAI-first 選 OpenAI Agents SDK；多 Provider 或企業 Microsoft 堆疊可看 Microsoft Agent Framework。先從單 Agent 開始，不必為了展示架構就建立多 Agent。

## SDK 情境二：中斷數小時後精確恢復

優先評估 LangGraph 的 Checkpointer／Interrupt，或 Microsoft Agent Framework 的 Workflow／Durable Extension。用真實資料庫與 Crash injection 測試，不要只測 In-memory demo。

## SDK 情境三：業務天然是多角色協作

CrewAI 可快速把 Researcher、Analyst、Writer、Reviewer 與任務交付物具象化；但涉及付款、發布或正式資料寫入時，應使用 Flow、Guardrail 與外部 Policy 收緊路徑。

## SDK 情境四：正在使用 AutoGen 或 Semantic Kernel

不要因為舊系統仍可運行就立刻重寫，也不要為新專案忽略官方方向。盤點使用到的 Agent、Group chat、Plugin、Memory、Filter、Hosting 與 Telemetry，再依 Microsoft 遷移指南建立等價測試。

## SDK 不確定時，也做一個 Thin Slice

用四個框架各做同一段代表性流程：

```text
讀取一筆訂單
→ 查正式政策
→ 產生退款試算
→ 暫停等待核准
→ 模擬程序重啟
→ 續跑並只退款一次
→ 留下完整 Trace
```

比較：

- 程式與設定複雜度
- 狀態與 Tool schema 清晰度
- Crash／Resume 行為
- HITL 整合
- Trace 可讀性
- 測試容易度
- Provider lock-in
- 版本穩定性
- 團隊維護能力

這比比較 Marketing feature list 更接近真實選型。

---

# 12. Production Harness 參考架構

```text
                         ┌─────────────────────┐
User / Scheduler / Event│ API Gateway + Auth  │
────────────────────────▶ Rate Limit + Tenant │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │ Agent Run Service   │
                         │ Budget · Lifecycle  │
                         └──────────┬──────────┘
                                    │
     ┌──────────────┬───────────────┼───────────────┬──────────────┐
     │              │               │               │              │
┌────▼─────┐  ┌─────▼──────┐ ┌──────▼──────┐ ┌──────▼─────┐ ┌────▼─────┐
│ Context  │  │ Model      │ │ Tool        │ │ Policy /   │ │ State /  │
│ Service  │  │ Gateway    │ │ Gateway     │ │ Approval   │ │ Checkpt  │
└────┬─────┘  └────────────┘ └──────┬──────┘ └──────┬─────┘ └────┬─────┘
     │                              │               │            │
 Vector / DB             Sandbox / API / MCP       Human UI     Durable DB
                                    │
                         ┌──────────▼──────────┐
                         │ Validators         │
                         │ Postconditions     │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │ Trace + Metrics     │
                         │ Audit + Eval Store  │
                         └─────────────────────┘
```

關鍵設計是把 Model Gateway、Tool Gateway、Policy 與 State 分開。即使更換 Agent Framework，業務工具、授權政策、Audit 與 Evals 仍可保留。

---

# 13. 常見反模式與誤解

## 誤解一：選最強模型就不需要 Harness

模型越能自主行動，越需要清楚能力與核准邊界。智慧不能取代 IAM、Transaction 與 Audit。

## 誤解二：裝了 Agent Framework 就是 Production-ready

框架的 demo 能跑，只代表基本路徑成立。租戶隔離、Side-effect safety、Secret、SLO、部署、告警與事故處理仍是應用責任。

## 誤解三：把所有工具都給 Agent 比較靈活

工具越多，選擇錯誤、Prompt Injection 與權限暴露面越大。應依任務動態暴露最小工具集合。

## 誤解四：Human-in-the-loop 就是每一步都詢問

過度詢問會造成 Approval fatigue。安全讀取可自動進行，高風險、不可逆或範圍擴張動作才進入核准。

## 誤解五：Retry 能提高可靠性

沒有分類與冪等性的 Retry 會重複付款、寄信或修改。可靠性來自 Error taxonomy、Idempotency、Reconciliation 與上限。

## 誤解六：Tracing 就是把完整 Prompt 和回應全部記錄

完整記錄可能洩漏個資、Secret 與商業資料。Observability 要同時滿足可除錯與資料最小化。

## 誤解七：Agent 說完成就代表完成

只有外部 Postcondition、Artifact、測試或交易狀態能證明完成。

## 誤解八：多 Agent 天生比單 Agent 更好

多 Agent 增加 Context 交接、成本、延遲與失敗點。單 Agent 加少量工具可解決時，通常更容易測試與營運。

## 誤解九：AutoGen 仍熱門，所以新專案照舊採用

歷史使用量不等於目前官方路線。AutoGen 已進入維護模式；新專案應評估 Microsoft Agent Framework，舊專案則建立有測試的漸進遷移計畫。

---

# 14. Harness Engineering 實作清單

## 工具與能力

- [ ] 每個工具都有明確用途、Schema、回傳與錯誤碼
- [ ] Read／Write 與可逆／不可逆能力分離
- [ ] 工具標示副作用、權限、逾時、重試與冪等政策
- [ ] 每個 Run 只暴露最小必要工具
- [ ] Tool result 精簡、結構化且可追溯

## 安全與權限

- [ ] Authentication／Authorization 在模型外強制執行
- [ ] 不可信內容不能改寫工具政策
- [ ] Secret 使用短期 Credential，且不進模型 Context
- [ ] Sandbox 限制 Filesystem、Network、Process 與資源
- [ ] 高風險操作有資訊充分的 Human approval

## 狀態與恢復

- [ ] Conversation、Workflow、Approval、Artifact 與 Memory 分開
- [ ] 有 Durable checkpoint 與版本相容策略
- [ ] Side-effect operation 使用 Idempotency key
- [ ] Unknown result 會 Reconcile，不會盲目重送
- [ ] 達到預算或停止條件時保留 Partial result

## 觀測與評測

- [ ] 每次 Run 有 Trace ID 串起模型、工具、政策與核准
- [ ] 敏感資料遮蔽、取樣並設定保存期限
- [ ] 追蹤成功率、成本、延遲、重試與人工修正率
- [ ] 有 Tool unit、Scenario、Failure injection 與 Security Evals
- [ ] Framework、模型、Prompt 與 Tool 版本升級皆跑 Regression

## 營運

- [ ] 有 Rate limit、Budget、Circuit breaker 與 Kill switch
- [ ] 有 Staging／Canary／Rollback
- [ ] Alert 能指向失敗階段而非只報「Agent failed」
- [ ] Audit log 可回答誰授權、做了什麼、依據哪個版本
- [ ] 團隊有 Incident response 與人工接管方式

---

# 15. 什麼時候還不需要 Agent Framework

以下需求常用普通程式更好：

- 固定輸入輸出的分類或抽取
- 一次模型呼叫即可完成
- 流程完全 deterministic
- 每一步都能寫成簡單函式與條件
- 錯誤成本高，但沒有可靠驗證器
- 只是因為流行而想導入多 Agent

可以先使用：

```text
Application code
→ Responses／Chat API
→ Structured output
→ 一到兩個受控 function tools
→ 標準 Log／Metric
```

當你真正需要反覆 Tool calling、持久化 State、HITL、Handoff、Checkpoint 或 Graph，再導入相應 Framework。抽象越少，除錯面通常越小。

---

# 結語：可靠 Agent 的差距，往往不在模型，而在它周圍

Harness Engineering 的核心不是讓模型擁有最多工具，而是讓它在可證明安全的邊界內完成真正工作：

- 工具是有副作用與權限語意的契約
- 模型提出行動，Policy 才決定是否允許
- Sandbox 限制爆炸半徑，Secret 不暴露給模型
- State 與 Checkpoint 使工作可中斷、可恢復
- Idempotency 和 Reconciliation 防止重複外部動作
- Human-in-the-loop 放在真正高風險的決策點
- Trace 讓非決定性行為可以理解
- Validator 與 Evals 證明外部世界真的達成成功條件

四個開源 Harness 各有擅長之處：Hermes Agent 強在長期 Memory 與 Skill learning，OpenClaw 強在 Gateway 與多 Channel，Pi Agent 強在極簡與可塑性，nanobot 則在小型 Python Core 與完整個人 Agent 能力之間取得平衡。若要把 Agent 嵌進企業產品，仍可再評估 OpenAI Agents SDK、LangGraph、CrewAI 或 Microsoft Agent Framework，並讓兩層透過受控 API／MCP 協作。

但選框架不是終點。真正的工程問題始終是：

> **當模型做對、做錯、做到一半、重複做、超出權限或外部系統失敗時，整個系統分別會發生什麼？**

能用程式、政策、狀態、觀測與測試清楚回答這個問題，才是一套成熟的 Harness。

---

# 參考資料

- [Yao et al. (2022), ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Hermes Agent 官方文件](https://hermes-agent.nousresearch.com/docs/)
- [Hermes Agent：Security](https://hermes-agent.nousresearch.com/docs/user-guide/security/)
- [Hermes Agent GitHub Repository](https://github.com/NousResearch/hermes-agent)
- [OpenClaw 官方文件](https://docs.openclaw.ai/)
- [OpenClaw：Security](https://docs.openclaw.ai/gateway/security)
- [OpenClaw GitHub Repository](https://github.com/openclaw/openclaw)
- [Pi Agent Harness GitHub Repository](https://github.com/earendil-works/pi)
- [Pi Coding Agent 文件](https://github.com/earendil-works/pi/tree/main/packages/coding-agent)
- [nanobot GitHub Repository](https://github.com/HKUDS/nanobot)
- [nanobot：Architecture](https://github.com/HKUDS/nanobot/blob/main/docs/architecture.md)
- [nanobot：Quick Start](https://github.com/HKUDS/nanobot/blob/main/docs/quick-start.md)
- [OpenAI API: Agents SDK](https://developers.openai.com/api/docs/guides/agents)
- [OpenAI API: Agents SDK Quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart)
- [OpenAI API: Guardrails and Human Review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)
- [OpenAI API: Sandbox Agents](https://developers.openai.com/api/docs/guides/agents/sandboxes)
- [OpenAI API: Integrations and Observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability)
- [OpenAI API: Evaluate Agent Workflows](https://developers.openai.com/api/docs/guides/agent-evals)
- [LangGraph Documentation: Overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [LangGraph Documentation: Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangGraph Documentation: Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)
- [CrewAI Documentation](https://docs.crewai.com/)
- [CrewAI Documentation: Flows](https://docs.crewai.com/en/concepts/flows)
- [CrewAI Documentation: Memory](https://docs.crewai.com/en/concepts/memory)
- [Microsoft Agent Framework: Overview](https://learn.microsoft.com/en-us/agent-framework/overview/)
- [Microsoft Agent Framework: Agent Harnesses](https://learn.microsoft.com/en-us/agent-framework/agents/harness)
- [Microsoft Agent Framework: AutoGen Migration Guide](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/)
- [Microsoft AutoGen Repository: Maintenance Mode Notice](https://github.com/microsoft/autogen)
- [Model Context Protocol: Specification](https://modelcontextprotocol.io/specification/latest)
- [OWASP: LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [OpenTelemetry: Generative AI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
