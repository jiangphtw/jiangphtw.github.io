---
layout: post
title: 資料應如何儲存？從 CSV、SQL 到 SQLite、PostgreSQL、zvec 的選型整理
subtitle: 先區分檔案格式、關聯式資料庫與向量資料庫，再選擇合適工具
author: Paul Jiang
categories: Development
tags: Data-Storage CSV JSON Parquet SQL SQLite PostgreSQL Zvec Vector-Database
sidebar: []
excerpt_image: /assets/images/260315/sqlite-postgresql-zvec-comparison.svg
---

許多人剛接觸資料儲存時，容易將不同層次的概念混在一起。

有人會問：「應該使用 `CSV` 還是 `SQL`？」
也有人會問：「小型專案是否先使用 `SQLite` 即可？什麼時候需要改用 `PostgreSQL`？」
進行 AI 或 RAG 開發時，還會遇到另一個問題：「向量是否需要另外存入向量資料庫？`zvec` 適合哪些情境？」

問題在於，這幾個名詞其實不在同一層：

- `CSV` 是檔案格式
- `SQL` 是查詢語言
- `SQLite`、`PostgreSQL` 是關聯式資料庫
- `zvec` 則是面向向量搜尋的資料庫

如果一開始沒有區分這些層次，後續很容易只依熟悉程度選擇工具，結果可能過於複雜或不夠可靠。
本文將常見資料儲存方式整理在同一套架構中，最後歸納成幾項實務選型建議。

> 本文對 `SQLite`、`PostgreSQL`、`zvec` 的描述，以我在 **2026 年 3 月 15 日** 查到的官方資料為準：
> [SQLite Features](https://www.sqlite.org/features.html)、
> [SQLite: Situations Where Another RDBMS May Work Better](https://www.sqlite.org/whentouse.html)、
> [PostgreSQL About](https://www.postgresql.org/about/)、
> [alibaba/zvec](https://github.com/alibaba/zvec)。

---

# 1. 先區分正在選擇檔案格式還是資料庫

最常見的誤解，是將所有工具都視為同一類資料儲存方法。
實際上，至少應先分成三類：

1. `檔案格式`
2. `關聯式資料庫`
3. `專門型資料庫`

![資料儲存方式的基本分類](/assets/images/260315/data-storage-landscape.svg)

_圖：先區分檔案格式、關聯式資料庫與專門型資料庫，才能避免混淆選型層次。_

這三種類型的用途與責任有很大差異。

## 1.1 檔案格式

`CSV`、`JSON` 與 `Parquet` 等格式，重點在於資料如何寫入檔案。
它們很適合交換、備份與批次處理資料，但不一定適合作為多人共用且需要一致性控制的主要資料來源。

## 1.2 關聯式資料庫

像 `SQLite`、`PostgreSQL` 這類，重點是：

- 資料表與欄位結構
- 查詢能力
- 一致性
- 權限
- 交易
- 多人存取

它們不只負責儲存資料，還提供一套可維護的資料管理方式。

## 1.3 專門型資料庫

向量資料庫的重點不在傳統表格查詢，而在於：

- `embedding` 儲存
- 相似度搜尋
- 混合檢索
- metadata filter

當核心需求是 Semantic Search（語義搜尋）、RAG、推薦或相似內容查詢時，才需要考慮這類資料庫。

---

# 2. `CSV`、`JSON`、`Parquet` 適合哪些用途

如果只是需要儲存資料，最先接觸的通常是檔案格式。
但這三種格式適合的使用情境截然不同。

![常見資料檔案格式的定位](/assets/images/260315/file-formats-csv-json-parquet.svg)

_圖：`CSV`、`JSON`、`Parquet` 都能存資料，但它們適合的工作完全不同。_

## 2.1 `CSV`

`CSV` 最大的優點是簡單。

幾乎所有常用工具都能開啟：

- `Excel`
- `Google Sheets`
- `pandas`
- `R`
- `SQLite`
- `PostgreSQL`

它很適合：

- 小型資料交換
- 匯出報表
- 一次性分析
- 給人手動檢查

但它的限制也很明顯：

- 沒有欄位型別
- 沒有 schema 約束
- 沒有索引
- 沒有 transaction
- 一大檔時效能有限
- 對巢狀資料不友善

因此，`CSV` 比較接近可攜帶、可交換的格式，而不是長期穩定的主要儲存方案。

## 2.2 `JSON`

`JSON` 的優勢是彈性。
它很適合：

- API 回傳資料
- 設定檔
- 巢狀結構資料
- 事件 payload

如果資料本身具有層級結構，例如：

- 一張訂單底下有多個商品
- 一次 API 回應包含多層欄位
- 使用者 profile 有可選欄位

`JSON` 通常會比 `CSV` 更加合適。

缺點則是：

- 不如 `CSV` 直觀
- 對大型分析不一定高效
- 欄位定義容易漂移
- 後續查詢前通常還要先展開或正規化

## 2.3 `Parquet`

如果進行的是分析型工作，而不是單純匯出一張資料表，`Parquet` 往往更為合適。

它的優勢在於：

- 欄位式儲存
- 壓縮率高
- 讀取部分欄位很有效率
- 適合大量分析資料

因此，在 Data Lake、批次分析與特徵資料集等情境中，`Parquet` 通常比 `CSV` 更有效率。

但它也有自己的限制：

- 不像 `CSV` 那麼容易直接打開看
- 對人工檢查不友善
- 它是分析檔案格式，不是交易型資料庫

---

# 3. `SQL` 不是檔案格式，而是操作資料的語言

這項差異值得單獨說明。

許多人會說「我想將資料存成 SQL」，但嚴格來說，這句話並不準確。
`SQL` 本身不是儲存格式，而是用來操作關聯式資料庫的語言。

真正需要選擇的是：

- 用不用關聯式資料庫
- 要用 `SQLite` 還是 `PostgreSQL`
- 如何設計 schema
- 哪些表要拆開
- 哪些欄位要索引

換句話說，`SQL` 解決的是：

- 如何查詢
- 如何進行 join
- 如何聚合
- 如何更新
- 如何定義約束

它並不決定資料本身使用何種副檔名。

---

# 4. `SQLite`：適合許多專案的輕量 SQL 資料庫

根據 SQLite 官方文件，它的定位很明確：

- `self-contained`
- `serverless`
- `zero-configuration`
- `transactional`
- 資料庫通常就是一個檔案

因此，它很適合本機工具、小型網站、桌面應用程式與測試環境。

## 4.1 `SQLite` 的優點

- 幾乎零安裝成本
- 不需要另外啟動資料庫服務
- 資料就是單一檔案，方便搬移與備份
- 支援標準 SQL 大部分常用功能
- 有 ACID transaction
- 非常適合單機應用與小型部署

## 4.2 `SQLite` 適合什麼場景

- 本機分析工具
- CLI / 小型內部工具
- 單人使用的 side project
- 小型網站 prototype
- 行動裝置 App
- 測試環境

## 4.3 `SQLite` 的限制

官方也明確指出，在某些情境中，其他 RDBMS 會更加合適。
常見情境包括：

- 高度多使用者並發寫入
- 大型 client/server 架構
- 需要複雜權限與管理功能
- 要做跨機器擴充

因此，`SQLite` 並非不能用於正式環境，而是更適合單機、內嵌與輕量情境。

---

# 5. `PostgreSQL`：成熟的通用型開源關聯式資料庫

當專案進入多人協作、正式產品、後端服務或報表系統階段時，`PostgreSQL` 往往比 `SQLite` 更合適。

根據 PostgreSQL 官方介紹，它的核心特性是：

- 強大的可靠性
- 穩定的 SQL 支援
- extensibility
- 複雜資料類型
- 多使用者與高並發能力

它不是以單一檔案攜帶的資料庫，而是完整的資料庫服務。

## 5.1 `PostgreSQL` 的優點

- 適合多人同時使用
- schema、constraint、index 功能成熟
- `join`、聚合、transaction 能力完整
- 權限管理與角色管理清楚
- 生態成熟，工具很多
- 可擴充性高，支援大量 extension

## 5.2 `PostgreSQL` 適合什麼場景

- Web / SaaS 正式產品
- 團隊共用後端資料庫
- 需要交易一致性的業務系統
- 有報表、分析與 API 共用同一份資料的系統
- 需要穩定備份、權限、監控與維運的環境

## 5.3 `PostgreSQL` 的代價

- 比 `SQLite` 重
- 要安裝與維運服務
- 要處理帳號、權限、連線池、備份
- 對本機小型工具而言，維運負擔可能過高

因此，如果需求只是單機記帳或小型資料管理，`PostgreSQL` 不一定是首選。
但對正式的多人產品而言，它通常比 `CSV` 或 `SQLite` 更穩健。

---

# 6. `zvec`：不是用來取代 PostgreSQL，而是處理向量搜尋

前文提到的 [`alibaba/zvec`](https://github.com/alibaba/zvec) 並非傳統的通用交易型資料庫。根據 README，其定位包括：

- 開源
- `in-process`
- 面向向量搜尋
- 支援 structured filtering
- 支援 full-text search
- 支援 sparse search

換句話說，它解決的是另一類問題：

- 我有一批文字或圖片 embedding
- 我想找最相似的內容
- 我需要 semantic search
- 我在做 RAG / 檢索增強
- 我需要向量 + metadata 一起查

![`SQLite`、`PostgreSQL`、`zvec` 的定位比較](/assets/images/260315/sqlite-postgresql-zvec-comparison.svg)

_圖：`SQLite`、`PostgreSQL` 與 `zvec` 都能儲存資料，但各自解決的問題不同。_

## 6.1 `zvec` 的優點

- 專門面向向量搜尋
- `in-process`，部署形態比大型分散式系統更輕
- 開源、可自管
- 結合向量查詢與條件過濾，比單純將 Embedding 存入 `CSV` 或 `JSON` 更實用

## 6.2 `zvec` 適合什麼場景

- 本機 semantic search
- 文件檢索
- RAG 原型
- 向量相似內容查詢
- 需要 embedding + metadata filter 的應用

## 6.3 `zvec` 不適合直接處理哪些工作

- 一般交易系統主庫
- 使用者／訂單／付款主資料管理
- 傳統多表關聯式業務流程

換句話說，`zvec` 與 `PostgreSQL` 並非完全替代關係。
在許多情況下，`zvec` 更適合作為既有系統旁的補充層：

- 結構化主資料放 `PostgreSQL`
- 向量搜尋放 `zvec`

---

# 7. 如何比較這些工具

下表可用於快速判斷：

| 類型 | 代表 | 最適合 | 主要優點 | 主要限制 |
| --- | --- | --- | --- | --- |
| 純檔案格式 | `CSV` | 匯出、交換、小型分析 | 簡單、可攜、多數工具皆可開啟 | 沒有型別、索引、Transaction |
| 彈性檔案格式 | `JSON` | API、巢狀資料、設定檔 | 結構彈性高 | 不利大規模分析、schema 容易漂移 |
| 分析檔案格式 | `Parquet` | 批次分析、Data Lake | 壓縮佳、讀取欄位效率高 | 不適合直接進行人工作業或交易系統 |
| 內嵌式 RDBMS | `SQLite` | 本機工具、小型應用 | 輕量、零設定、單一檔案容易搬移 | 不適合高並發 Server 情境 |
| 通用型 RDBMS | `PostgreSQL` | 正式產品、多人系統 | 穩定、強大、可擴充 | 需要維運成本 |
| 向量資料庫 | `zvec` | embedding 搜尋、RAG | 適合 similarity search | 不是通用交易資料庫 |

---

# 8. 常見情境下應如何選擇

針對以下常見情境，可以採用不同選擇。

![不同場景下的資料儲存選型](/assets/images/260315/storage-choice-scenarios.svg)

_圖：選型重點通常不是找出最強的工具，而是判斷哪項工具最符合目前情境。_

## 8.1 我只是要把分析結果存下來

先用：

- `CSV`：適合需要由人直接開啟查看的情境。
- `Parquet`：適合日後需要重複分析，且資料量較大的情境。

## 8.2 開發本機工具或 Side Project

優先考慮：

- `SQLite`

它通常比 `CSV` 更穩健，同時不需要承擔 `PostgreSQL` 的維運成本。

## 8.3 我在做正式網站或 SaaS

優先考慮：

- `PostgreSQL`

因為這類專案很快就會面臨：

- 多人同時使用
- 權限
- transaction
- 備份
- 監控

這些都不是 `CSV` 或 `SQLite` 最擅長的場景。

## 8.4 我在做 RAG、知識庫搜尋、相似度查詢

優先考慮：

- `zvec` 這類向量資料庫

但向量資料庫通常作為既有主要資料庫的補充，而不是直接將所有業務資料遷移過去。

---

# 9. 結語：不要先問哪個最好，而要釐清需要解決的問題

資料儲存沒有永遠正確的單一答案。
真正有助於選型的問題包括：

- 目前需要交換資料，還是穩定查詢？
- 使用情境是單機操作，還是多人協作？
- 需求重點是表格關聯，還是向量搜尋？
- 日後是否需要索引、權限與 Transaction？
- 目前進行的是分析工作，還是正式產品開發？

如果只需要分享分析結果，`CSV` 可能已經足夠。
如果需要開發本機工具，`SQLite` 相當實用。
如果正在建立正式後端，`PostgreSQL` 通常是穩健的起點。
如果需求是 Embedding 搜尋、RAG 或語義檢索，才需要考慮 `zvec` 等向量資料庫。

**不要將所有資料放入同一種儲存系統。更合適的做法，是讓每項工具只負責最適合的工作。**
