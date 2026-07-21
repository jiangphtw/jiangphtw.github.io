---
layout: post
title: Embedding（嵌入向量）是什麼？從詞意、發展到實作應用
subtitle: 把離散世界壓進向量空間
author: Paul Jiang
categories: AI
tags: Embedding
sidebar: []
excerpt_image: /assets/images/260118/embedding-onehot-vs-dense.svg
---

在機器學習與自然語言處理（NLP）中，**Embedding（嵌入）** 指的是把「離散」的東西（例如：單字、句子、使用者 ID、商品 ID、圖片）轉換成一個固定維度的**實數向量**，讓模型能用「距離 / 角度」來衡量相似度，並在向量空間裡做運算與學習 [1, 2]。

這篇文章會用「詞意解釋 → 發展脈絡 → 技術核心 → 實作應用」的方式，整理 Embedding 為什麼重要，以及你可以怎麼把它用在搜尋、推薦或內容理解上。

---

# 1. 詞意解釋：Embedding 到底「嵌入」了什麼？

先從直覺來看：如果你用 One-hot 來表示單字，假設詞彙表有 50,000 個詞，那每個詞就是一個 50,000 維、幾乎全是 0 的稀疏向量。這種表示法有兩個缺點：

1. **太大、太稀疏**：計算與記憶體成本高。
2. **沒有語義距離**：在 One-hot 空間裡，「國王」和「蘋果」一樣都只差一個位置是 1；你無法用距離表達「誰比較像誰」。

![One-hot 與 Embedding 的差異示意圖](/assets/images/260118/embedding-onehot-vs-dense.svg)

_圖：One-hot 是高維稀疏；Embedding 是低維稠密（示意圖）。_

Embedding 的核心想法是：用一個較小的維度 `d`（例如 256、768）把每個離散項目映射成一個稠密向量：

- One-hot：`token -> R^{|V|}`（|V| 很大、很稀疏）
- Embedding：`token -> R^{d}`（d 較小、較稠密）

在深度學習裡，它通常長得像一張「查表矩陣」`E`：

```text
E: |V| x d
embedding(token_id) = E[token_id]   # 取出其中一列（或一行）
```

關鍵是：`E` 不是手工設計的，而是**在訓練目標的驅動下被學出來**的，所以向量空間會逐漸呈現出語義或偏好上的結構 [1]。

---

# 2. 發展脈絡：從 Word Embedding 到「萬物皆可嵌入」

Embedding 的概念並不只屬於 NLP，而是「表徵學習（Representation Learning）」的一部分：只要你能定義一個訓練目標，你就能學到有用的向量表徵 [4]。簡單整理幾個里程碑：

- **早期：分散式表徵的引入**  
  神經語言模型開始把單字表示成可學習的向量，取代純符號化的表示，並證明這能改善模型泛化能力 [4]。

- **2013：word2vec 帶動普及**  
  CBOW / Skip-gram 讓「用上下文學語義」變得簡單而有效，也帶來經典的向量類比示例：  
  `vec("King") - vec("Man") + vec("Woman") ≈ vec("Queen")` [2]

- **後續：Contextual Embedding 與大型模型**  
  近年的語言模型不再給每個詞一個固定向量，而是根據上下文動態產生表示：同一個詞在不同句子中的向量會不同。這讓語義表徵更精準，也更適合下游任務（分類、問答、檢索等）。

- **跨領域：推薦、影像、多模態**  
  推薦系統會把「使用者」與「商品」嵌入到同一個向量空間，以便用相似度做召回或排序；影像與文字也能被嵌入到同一空間，用於以文搜圖、以圖搜文等任務 [5]。

---

# 3. 技術核心：Embedding 為什麼能「捕捉語義」？

Embedding 之所以有用，不是因為它只是降維，而是因為它把**任務訊號**壓進向量裡。幾個常見的核心觀念如下。

## 3.1 分佈假說：你跟誰常一起出現，就像誰

在文字世界裡，很多 embedding 來自一個簡單直覺：**語義相近的詞，會出現在相似的上下文**。當訓練目標要求模型「用上下文預測詞」或「用詞預測上下文」時，相似用法的詞就會被迫學到相近的向量位置 [1, 2]。

## 3.2 相似度：用距離或角度來比較

向量空間裡最常見的相似度是：

![向量空間與類比關係示意圖](/assets/images/260118/embedding-vector-space-analogy.svg)

_圖：相似概念靠近；類比關係常呈現近似平行的向量方向（示意圖）。_

- **Cosine similarity（餘弦相似度）**：看方向像不像，常用於語義相似度與檢索。
- **Dot product（內積）**：常用於推薦系統打分（user 向量 ⋅ item 向量）。
- **Euclidean distance（歐氏距離）**：在某些設定也會用，但高維下需要小心尺度。

實務上，你會看到很多系統把向量做 L2 normalization（單位化），讓「內積」等價於「餘弦相似度」，方便用向量資料庫做高效檢索。

## 3.3 向量運算：類比關係為什麼會出現？

`King - Man + Woman ≈ Queen` 這類現象，反映的是向量空間裡可能存在某些近似線性的方向（例如「性別」方向）[2]。但也要注意：

- 不是所有模型、所有語料都會穩定出現漂亮的類比。
- 在 contextual embedding 裡，「一個詞」沒有唯一向量，類比方式也會更複雜。

把它當成「直覺示例」很有用，但別把它當成一定成立的定律。

## 3.4 維度與資訊量：d 越大越好嗎？

`d`（向量維度）是典型的取捨：

- `d` 太小：資訊裝不下，相似度不穩定。
- `d` 太大：成本高、容易學到雜訊，檢索與儲存也更貴。

實作上通常會從「你要解的任務」與「資料量」出發調整；也會搭配正則化、對比式學習目標、或更好的資料清理來提升表徵品質。

---

# 4. 實作應用：你可以怎麼用 Embedding？

下面用幾個常見場景，讓你把 Embedding 從概念落到工程做法。

## 4.1 語義搜尋（Semantic Search）/ RAG 的檢索階段

目標：使用者搜尋「意思接近」的內容，而不是只比對關鍵字。

典型流程：

1. **切分文件（chunking）**：把文章切成段落或固定長度片段。
2. **產生每段的 embedding**：段落 -> 向量。
3. **存入向量資料庫**：例如 FAISS / Milvus / pgvector。
4. **查詢時同樣做 embedding**：query -> 向量。
5. **近鄰檢索**：找最相近的前 K 段內容，再交給重排或 LLM 生成回答。

## 4.2 推薦系統（user/item embedding）

最簡化的形式就是：每個使用者一個向量、每個商品一個向量，分數用內積表示偏好強度：

```python
import torch.nn as nn

num_users, num_items, d = 100000, 50000, 64
user_emb = nn.Embedding(num_users, d)
item_emb = nn.Embedding(num_items, d)
```

接著把互動資料（點擊、購買、收藏）當作監督訊號，讓「喜歡的 user-item」內積變大，「不喜歡的」變小（常見做法包含負採樣 / pairwise ranking loss 等）。

## 4.3 分群、去重、相似內容推薦

只要你有一批文字（文章標題、摘要、留言）：

- 先把每筆資料轉成 embedding
- 再用 k-means、階層式分群或近鄰圖

就能做到「主題分群」、「相似貼文推薦」、「重複內容偵測」等功能。

## 4.4 多模態：以文搜圖、以圖搜文

像 CLIP 這類模型會把「文字」與「圖片」嵌入到同一空間：  
同一張圖與它的描述文字會靠近，不相關的會拉遠，讓跨模態檢索變得可行 [5]。

---

# 5. 快速動手：簡單 / 中等 / 進階三個案例

如果你的目標是「先把系統做出來」，用現成的 embedding 模型通常最快。下面用同一套工具示範三個層級（環境：`pip install openai numpy`，並設定 `OPENAI_API_KEY`）[3]。

## 共用工具：把文字變向量、用 cosine 比相似度

```python
import os
import numpy as np
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

def embed_texts(texts, model="text-embedding-3-small"):
    resp = client.embeddings.create(model=model, input=texts)
    data = sorted(resp.data, key=lambda x: x.index)
    return np.array([d.embedding for d in data], dtype=np.float32)

def l2_normalize(x):
    if x.ndim == 1:
        return x / max(np.linalg.norm(x), 1e-12)
    norms = np.linalg.norm(x, axis=1, keepdims=True)
    return x / np.maximum(norms, 1e-12)
```

## 5.1 簡單：三段文字相似度（最小示例）

```python
texts = ["國王", "皇后", "蘋果"]
vecs = embed_texts(texts)
vecs = l2_normalize(vecs)

def cosine(a, b):
    return float(l2_normalize(a) @ l2_normalize(b))

print("國王 vs 皇后:", cosine(vecs[0], vecs[1]))
print("國王 vs 蘋果:", cosine(vecs[0], vecs[2]))
```

你會看到「國王 vs 皇后」通常比「國王 vs 蘋果」更相近，這就是「語義距離」在工程上可被利用的方式。

## 5.2 中等：迷你語義搜尋（切段 → 建索引 → Top-K）

這個版本不需要向量資料庫，直接用 numpy 做 Top-K；資料量小時很好用（例如你的部落格文章、筆記、FAQ）。

![語義搜尋（Embedding 檢索）流程示意圖](/assets/images/260118/embedding-semantic-search-pipeline.svg)

_圖：文件在離線階段轉成向量索引；查詢在即時階段做近鄰檢索（示意圖）。_

```python
docs = {
    "doc-a": "Embedding 是把離散項目映射到向量空間。\n\n常用 cosine similarity 衡量語義接近程度。",
    "doc-b": "推薦系統會把 user / item 嵌入到同一個向量空間。\n\n內積常被用來當作偏好分數。",
}

chunks = []
for doc_id, text in docs.items():
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    for i, p in enumerate(paragraphs):
        chunks.append({"id": f"{doc_id}#{i}", "text": p})

chunk_mat = l2_normalize(embed_texts([c["text"] for c in chunks]))

def search(query, k=3):
    q = l2_normalize(embed_texts([query])[0])
    scores = chunk_mat @ q
    top_idx = scores.argsort()[::-1][:k]
    for idx in top_idx:
        print(f"{scores[idx]:.4f}", chunks[idx]["id"], chunks[idx]["text"])

search("如何用 embedding 做語義搜尋？", k=3)
```

把 `docs` 換成你自己的資料來源（例如：文章段落、商品描述、工單內容），就能做出一個可用的語義搜尋原型。

## 5.3 進階：MMR（避免重複）+ RAG（檢索後生成）

當你直接取 Top-K 時，常會拿到「很像的段落」一整排。**MMR（Maximal Marginal Relevance）** 會在「相關」與「多樣」之間做取捨，讓檢索結果更不重複（承接上面的 `chunks`、`chunk_mat`）。

![MMR：在相關性與多樣性間取捨](/assets/images/260118/embedding-mmr-diversity.svg)

_圖：Top-K 可能高度重複；MMR 會優先挑「相關且不重複」的片段（示意圖）。_

```python
def mmr(query_vec, doc_mat, k=5, lambda_=0.7, pool_size=30):
    q = l2_normalize(query_vec)
    doc = l2_normalize(doc_mat)

    sim_q = doc @ q
    pool = sim_q.argsort()[::-1][: min(pool_size, len(sim_q))].tolist()

    selected = []
    while pool and len(selected) < k:
        if not selected:
            best = max(pool, key=lambda i: sim_q[i])
        else:
            def score(i):
                redundancy = max(doc[i] @ doc[j] for j in selected)
                return lambda_ * sim_q[i] - (1 - lambda_) * redundancy
            best = max(pool, key=score)

        selected.append(best)
        pool.remove(best)

    return selected

query = "embedding 在推薦系統怎麼用？"
q = embed_texts([query])[0]
picked = mmr(q, chunk_mat, k=3, lambda_=0.7, pool_size=10)
context = "\n\n".join(f"[{chunks[i]['id']}] {chunks[i]['text']}" for i in picked)
print(context)

# （可選）把檢索結果丟給 LLM，做最小版 RAG
resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "你是助理，只能依據提供的內容回答。若內容不足，請說不知道。"},
        {"role": "user", "content": f"問題：{query}\n\n可用內容：\n{context}"},
    ],
)
print(resp.choices[0].message.content)
```

做到這一步後，下一個實務升級通常是：把 embedding 結果快取/落盤、用向量資料庫做近鄰檢索、加入 metadata filter（例如 tag/date）、再加一層 re-rank（交叉編碼器或 LLM）來提升精準度。

---

# 小結

Embedding 的價值在於：它把「離散世界」轉換成「可計算的幾何世界」，讓相似度、檢索、推薦、分類、分群都可以用同一套向量工具鏈處理。理解它的詞意、訓練目標與相似度計算方式後，你會更容易把 Embedding 用在自己的專案裡（搜尋、推薦、RAG、去重等）。


---

# 參考資料

1. Google Machine Learning Crash Course — Embeddings: https://developers.google.com/machine-learning/crash-course/embeddings/video-lecture
2. Mikolov et al., Distributed Representations of Words and Phrases and their Compositionality (2013): https://arxiv.org/abs/1310.4546
3. OpenAI API Documentation — Embeddings: https://platform.openai.com/docs/guides/embeddings
4. Bengio et al., A Neural Probabilistic Language Model (2003): https://www.jmlr.org/papers/v3/bengio03a.html
5. Radford et al., Learning Transferable Visual Models From Natural Language Supervision (CLIP, 2021): https://arxiv.org/abs/2103.00020
