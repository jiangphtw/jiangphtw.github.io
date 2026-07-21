---
layout: post
title: 資料要怎麼存？從 CSV、SQL 到 SQLite、PostgreSQL、zvec 的選型整理
subtitle: 把檔案格式、關聯式資料庫與向量資料庫拆開來看，才不會一開始就選錯
author: Paul Jiang
categories: Development
tags: Data-Storage CSV JSON Parquet SQL SQLite PostgreSQL Zvec Vector-Database
sidebar: []
excerpt_image: /assets/images/260315/sqlite-postgresql-zvec-comparison.svg
---

很多人一開始接觸資料儲存時，腦中其實把好幾件事混在一起了。

有人會問：「我要用 `CSV` 還是 `SQL`？」  
也有人會問：「小專案是不是先用 `SQLite` 就好？什麼時候才要上 `PostgreSQL`？」  
做 AI / RAG 的人又會碰到另一題：「向量要不要另外放進向量資料庫？像 `zvec` 這種東西適合什麼情境？」

問題在於，這幾個名詞其實不在同一層：

- `CSV` 是檔案格式
- `SQL` 是查詢語言
- `SQLite`、`PostgreSQL` 是關聯式資料庫
- `zvec` 則是面向向量搜尋的資料庫

如果一開始沒有把這些層次拆開，後面很容易變成「用熟的就先上」，結果不是太重，就是太脆弱。
這篇就把常見的資料儲存方式放在同一張地圖裡整理，最後再收斂成幾個實務上的選型建議。

> 本文對 `SQLite`、`PostgreSQL`、`zvec` 的描述，以我在 **2026 年 3 月 15 日** 查到的官方資料為準：
> [SQLite Features](https://www.sqlite.org/features.html)、
> [SQLite: Situations Where Another RDBMS May Work Better](https://www.sqlite.org/whentouse.html)、
> [PostgreSQL About](https://www.postgresql.org/about/)、
> [alibaba/zvec](https://github.com/alibaba/zvec)。

---

# 1. 先分清楚：你是在選檔案格式，還是在選資料庫

最常見的誤解就是把所有東西都當成「存資料的方法」。
但其實你至少要先分成三類：

1. `檔案格式`
2. `關聯式資料庫`
3. `專門型資料庫`

![資料儲存方式的基本分類](/assets/images/260315/data-storage-landscape.svg)

_圖：先分清楚檔案格式、關聯式資料庫、專門型資料庫，選型才不會混成一團。_

這三類差很多。

## 1.1 檔案格式

像 `CSV`、`JSON`、`Parquet` 這類，重點是「資料怎麼被寫進檔案」。
它們很適合交換資料、備份資料、批次處理資料，但不一定適合直接拿來當多人共用、需要一致性控制的主資料來源。

## 1.2 關聯式資料庫

像 `SQLite`、`PostgreSQL` 這類，重點是：

- 資料表與欄位結構
- 查詢能力
- 一致性
- 權限
- 交易
- 多人存取

它們不只是「把資料存下來」，而是提供一套可維護的資料管理方式。

## 1.3 專門型資料庫

像向量資料庫，重點不在傳統表格查詢，而在：

- `embedding` 儲存
- 相似度搜尋
- 混合檢索
- metadata filter

如果你的核心需求是 semantic search、RAG、推薦或相似內容查找，這類資料庫才會開始有必要。

---

# 2. `CSV`、`JSON`、`Parquet` 這些檔案格式，適合拿來做什麼

如果你只是要把資料存起來，最先碰到的通常還是檔案格式。
但這三種格式，適合的場景完全不同。

![常見資料檔案格式的定位](/assets/images/260315/file-formats-csv-json-parquet.svg)

_圖：`CSV`、`JSON`、`Parquet` 都能存資料，但它們適合的工作完全不同。_

## 2.1 `CSV`

`CSV` 最大的優點是簡單。

幾乎所有工具都打得開：

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

所以 `CSV` 比較像是「可攜帶、可交換」的格式，而不是長期穩定的主儲存方案。

## 2.2 `JSON`

`JSON` 的優勢是彈性。
它很適合：

- API 回傳資料
- 設定檔
- 巢狀結構資料
- 事件 payload

如果你的資料天然就有層級，例如：

- 一張訂單底下有多個商品
- 一次 API 回應包含多層欄位
- 使用者 profile 有可選欄位

那 `JSON` 會比 `CSV` 好用很多。

缺點則是：

- 不如 `CSV` 直觀
- 對大型分析不一定高效
- 欄位定義容易漂移
- 後續查詢前通常還要先展開或正規化

## 2.3 `Parquet`

如果你開始做的是分析型工作，而不是單純匯出一張表，那 `Parquet` 往往更適合。

它的優勢在於：

- 欄位式儲存
- 壓縮率高
- 讀取部分欄位很有效率
- 適合大量分析資料

所以在 data lake、批次分析、特徵資料集這種場景，`Parquet` 通常比 `CSV` 好得多。

但它也有自己的限制：

- 不像 `CSV` 那麼容易直接打開看
- 對人工檢查不友善
- 它是分析檔案格式，不是交易型資料庫

---

# 3. `SQL` 不是一種檔案，而是一種操作資料的方式

這點很值得單獨拉出來講。

很多人會說「我想把資料存成 SQL」，其實嚴格來講這句話不太準。
因為 `SQL` 本身不是儲存格式，而是用來操作關聯式資料庫的語言。

你真正會選的是：

- 用不用關聯式資料庫
- 要用 `SQLite` 還是 `PostgreSQL`
- schema 怎麼設計
- 哪些表要拆開
- 哪些欄位要索引

也就是說，`SQL` 解決的是：

- 怎麼查
- 怎麼 join
- 怎麼聚合
- 怎麼更新
- 怎麼定義約束

而不是「資料本身存成什麼副檔名」。

---

# 4. `SQLite`：最輕的 SQL 資料庫之一，很多專案其實夠用了

根據 SQLite 官方文件，它的定位很明確：

- `self-contained`
- `serverless`
- `zero-configuration`
- `transactional`
- 資料庫通常就是一個檔案

這也是為什麼它對很多本機工具、小型網站、桌面程式、測試環境都非常好用。

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

官方也明確提到，有些情境另一個 RDBMS 會更合適。
最常見的就是：

- 高度多使用者並發寫入
- 大型 client/server 架構
- 需要複雜權限與管理功能
- 要做跨機器擴充

所以 `SQLite` 不是不能上線，而是它更適合「單機、內嵌、輕量」場景。

---

# 5. `PostgreSQL`：最穩的通用型開源關聯式資料庫之一

如果你開始進入多人協作、正式產品、後端服務、報表系統，那 `PostgreSQL` 往往會比 `SQLite` 更適合。

根據 PostgreSQL 官方介紹，它的核心特性是：

- 強大的可靠性
- 穩定的 SQL 支援
- extensibility
- 複雜資料類型
- 多使用者與高並發能力

它不是一個「一個檔案帶著走」的資料庫，而是一個真正的資料庫服務。

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
- 本機小工具有時顯得太大材小用

所以如果你的需求只是單機記帳或小型資料管理，`PostgreSQL` 不一定是第一選擇。
但如果你做的是正式多人產品，它通常比 `CSV` 或 `SQLite` 穩很多。

---

# 6. `zvec`：不是拿來取代 PostgreSQL，而是處理向量搜尋

開頭提到的 [`alibaba/zvec`](https://github.com/alibaba/zvec)，它不是傳統意義上的通用交易型資料庫，而是根據 README 定位為：

- 開源
- `in-process`
- 面向向量搜尋
- 支援 structured filtering
- 支援 full-text search
- 支援 sparse search

也就是說，它在解決的是另一類問題：

- 我有一批文字或圖片 embedding
- 我想找最相似的內容
- 我需要 semantic search
- 我在做 RAG / 檢索增強
- 我需要向量 + metadata 一起查

![`SQLite`、`PostgreSQL`、`zvec` 的定位比較](/assets/images/260315/sqlite-postgresql-zvec-comparison.svg)

_圖：`SQLite`、`PostgreSQL`、`zvec` 都能存資料，但它們解的問題其實不同。_

## 6.1 `zvec` 的優點

- 專門面向向量搜尋
- `in-process`，部署形態比大型分散式系統更輕
- 開源、可自管
- 結合向量查詢與條件過濾，比單純把 embedding 塞進 `CSV` 或 JSON 有用得多

## 6.2 `zvec` 適合什麼場景

- 本機 semantic search
- 文件檢索
- RAG 原型
- 向量相似內容查詢
- 需要 embedding + metadata filter 的應用

## 6.3 `zvec` 不適合直接拿來做什麼

- 一般交易系統主庫
- 使用者／訂單／付款主資料管理
- 傳統多表關聯式業務流程

也就是說，`zvec` 和 `PostgreSQL` 不完全是替代關係。
很多情況下，它更像是補在既有系統旁邊的一層：

- 結構化主資料放 `PostgreSQL`
- 向量搜尋放 `zvec`

---

# 7. 這幾種東西，該怎麼比較

下面這張表可以當成快速判斷：

| 類型 | 代表 | 最適合 | 主要優點 | 主要限制 |
| --- | --- | --- | --- | --- |
| 純檔案格式 | `CSV` | 匯出、交換、小型分析 | 簡單、可攜、人人都會開 | 沒有型別、索引、transaction |
| 彈性檔案格式 | `JSON` | API、巢狀資料、設定檔 | 結構彈性高 | 不利大規模分析、schema 容易漂移 |
| 分析檔案格式 | `Parquet` | 批次分析、data lake | 壓縮佳、讀欄效率高 | 不適合直接做人工作業或交易系統 |
| 內嵌式 RDBMS | `SQLite` | 本機工具、小型應用 | 輕、零設定、單檔好搬移 | 不適合高並發 server 場景 |
| 通用型 RDBMS | `PostgreSQL` | 正式產品、多人系統 | 穩定、強大、可擴充 | 需要維運成本 |
| 向量資料庫 | `zvec` | embedding 搜尋、RAG | 適合 similarity search | 不是通用交易資料庫 |

---

# 8. 幾個常見情境，實際上該怎麼選

如果你現在是下面這些情境，我會這樣選。

![不同場景下的資料儲存選型](/assets/images/260315/storage-choice-scenarios.svg)

_圖：真正的選型通常不是「哪個最強」，而是「哪個對目前場景最合理」。_

## 8.1 我只是要把分析結果存下來

先用：

- `CSV`：如果你需要人可以直接打開看
- `Parquet`：如果你之後還會重複分析，資料量也不小

## 8.2 我在做本機工具或 side project

優先考慮：

- `SQLite`

因為它通常已經比 `CSV` 穩很多，但還不需要帶入 `PostgreSQL` 的維運成本。

## 8.3 我在做正式網站或 SaaS

優先考慮：

- `PostgreSQL`

因為你很快就會遇到：

- 多人同時使用
- 權限
- transaction
- 備份
- 監控

這些都不是 `CSV` 或 `SQLite` 最擅長的場景。

## 8.4 我在做 RAG、知識庫搜尋、相似度查詢

優先考慮：

- `zvec` 這類向量資料庫

但通常是補在既有主資料庫旁邊，而不是直接把所有業務資料都搬過去。

---

# 9. 寫在最後：不要問哪個最好，先問你到底在解什麼問題

資料儲存沒有一個永遠正確的答案。
真正有效的問題通常是：

- 我現在要的是交換資料，還是穩定查詢
- 我是單機使用，還是多人協作
- 我需要的是表格關聯，還是向量搜尋
- 我之後會不會需要索引、權限、transaction
- 我是在做分析，還是在做正式產品

如果你只是要分享分析結果，`CSV` 可能已經夠用。  
如果你要做本機工具，`SQLite` 會非常實用。  
如果你在做正式後端，`PostgreSQL` 幾乎是很穩的起點。  
如果你做的是 embedding 搜尋、RAG、語意檢索，那才輪到 `zvec` 這種向量資料庫出場。

**不要把所有資料都塞進同一種儲存方式。更好的做法通常是：讓每種工具只負責它最擅長的那段工作。**
