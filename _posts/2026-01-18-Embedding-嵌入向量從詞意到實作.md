---
layout: post
title: Embedding（嵌入向量）是什麼？從語義、發展脈絡到實作應用
subtitle: 把離散世界壓進向量空間
author: Paul Jiang
categories: AI
tags: Embedding
sidebar: []
excerpt_image: /assets/images/260118/embedding-onehot-vs-dense.svg
---

在機器學習與自然語言處理（NLP）中，**Embedding（嵌入）** 指的是將離散項目（例如單字、句子、使用者 ID、商品 ID 或圖片）轉換成固定維度的**實數向量**，讓模型能透過距離或角度衡量相似度，並在向量空間中進行運算與學習 [1, 2]。

本文將依序說明 Embedding 的基本概念、發展脈絡、技術核心與實作應用，並介紹如何將它運用於搜尋、推薦與內容理解。

---

# 1. 概念說明：Embedding「嵌入」了什麼？

先從直覺來看：如果使用 One-hot 表示單字，假設詞彙表有 50,000 個詞，每個詞都會表示成一個 50,000 維、幾乎全是 0 的稀疏向量。這種表示法有兩個缺點：

1. **太大、太稀疏**：計算與記憶體成本高。
2. **沒有語義距離**：在 One-hot 空間中，不同詞的向量彼此正交，任意兩個不同詞之間的距離也相同，因此無法呈現「國王」比「蘋果」更接近「皇后」這類語義關係。

![One-hot 與 Embedding 的差異示意圖](/assets/images/260118/embedding-onehot-vs-dense.svg)

_圖：One-hot 是高維稀疏；Embedding 是低維稠密（示意圖）。_

Embedding 的核心想法是：以較低的維度 `d`（例如 256、768）將每個離散項目映射成一個稠密向量：

- One-hot：`token -> R^{|V|}`（|V| 很大、很稀疏）
- Embedding：`token -> R^{d}`（d 較小、較稠密）

在深度學習中，實作上通常會使用一個可查表的矩陣 `E`：

```text
E: |V| x d
embedding(token_id) = E[token_id]   # 取出對應的向量
```

關鍵是：`E` 不是手工設計的，而是**透過訓練目標學得**，所以向量空間會逐漸呈現語義或偏好上的結構 [1]。

---

# 2. 發展脈絡：從 Word Embedding 到「萬物皆可嵌入」

Embedding 不只應用於 NLP，也是「表徵學習（Representation Learning）」的一部分：只要能定義訓練目標，就能學到有用的向量表徵 [4]。以下整理幾個重要里程碑：

- **早期：分散式表徵的引入**
  神經語言模型開始把單字表示成可學習的向量，取代純符號化的表示，並證明這能改善模型泛化能力 [4]。

- **2013：word2vec 帶動普及**
  CBOW／Skip-gram 讓「從上下文學習語義」變得簡單而有效，也帶來經典的向量類比範例：
`vec("King") - vec("Man") + vec("Woman") ≈ vec("Queen")`[2]

- **後續：Contextual Embedding（上下文嵌入）與大型模型**
  近年的語言模型不再給每個詞一個固定向量，而是根據上下文動態產生表示：同一個詞在不同句子中的向量會不同。這讓語義表徵更精準，也更適合下游任務（分類、問答、檢索等）。

- **跨領域：推薦、影像、多模態**
  推薦系統會把「使用者」與「商品」嵌入到同一個向量空間，以便用相似度做召回或排序；影像與文字也能映射至同一個向量空間，用於以文搜圖、以圖搜文等任務 [5]。

---

# 3. 技術核心：Embedding 為何能「捕捉語義」？

Embedding 之所以有用，不只是因為它能降維，更因為它將**任務訊號**編碼至向量中。以下是幾個常見的核心觀念。

## 3.1 分佈假說：出現在相似脈絡中的詞，語義通常相近

在文字世界中，許多 Embedding 方法都源自一個簡單直覺：**語義相近的詞，會出現在相似的上下文**。當訓練目標要求模型「用上下文預測詞」或「用詞預測上下文」時，用法相近的詞便會逐漸形成相近的向量表示 [1, 2]。

## 3.2 相似度：用距離或角度來比較

向量空間裡最常見的相似度是：

![向量空間與類比關係示意圖](/assets/images/260118/embedding-vector-space-analogy.svg)

_圖：相似概念彼此靠近；類比關係常呈現近似平行的方向（示意圖）。_

- **Cosine similarity（餘弦相似度）**：衡量向量方向的相似程度，常用於語義相似度與檢索。
- **Dot product（內積）**：常用於推薦系統評分（使用者向量 ⋅ 商品向量）。
- **Euclidean distance（歐氏距離）**：某些情境也會使用，但在高維空間中須留意尺度影響。

實務上，許多系統會對向量執行 L2 normalization（L2 正規化），讓「內積」等價於「餘弦相似度」，以便使用向量資料庫進行高效檢索。

## 3.3 向量運算：類比關係為何會出現？

`King - Man + Woman ≈ Queen` 這類現象，反映的是向量空間裡可能存在某些近似線性的方向（例如「性別」方向）[2]。但也要注意：

- 不是所有模型、所有語料都會穩定出現漂亮的類比。
- 在 Contextual Embedding 中，「一個詞」沒有唯一向量，類比方式也會更複雜。

將其視為直觀範例很有用，但不應視為必然成立的定律。

## 3.4 維度與資訊量：d 越大越好嗎？

`d`（向量維度）是典型的取捨：

- `d` 太小：表示能力可能不足，相似度也較不穩定。
- `d` 太大：計算與儲存成本較高，也可能學到更多雜訊。

實作上通常會依據任務需求與資料量調整，也會搭配正則化、對比式學習目標或更完善的資料清理來提升表徵品質。

---

# 4. 實作應用：如何使用 Embedding？

下面透過幾個常見場景，將 Embedding 從概念轉化為實際工程流程。

## 4.1 語義搜尋（Semantic Search）／RAG 的檢索階段

目標：根據語義相似度找出相關內容，而不只比對完全相同的關鍵字。

典型流程：

1. **切分文件（chunking）**：把文章切成段落或固定長度片段。
2. **產生每段的 embedding**：段落 → 向量。
3. **存入向量資料庫**：例如 FAISS／Milvus／pgvector。
4. **查詢時同樣產生 embedding**：查詢 → 向量。
5. **近鄰檢索**：找出相似度最高的 K 個片段，再交給重排模型或 LLM 生成回答。

## 4.2 推薦系統（user/item embedding）

最簡單的形式是：每個使用者與商品各有一個向量，並以內積分數表示偏好強度：

```python
import torch.nn as nn

num_users, num_items, d = 100000, 50000, 64
user_emb = nn.Embedding(num_users, d)
item_emb = nn.Embedding(num_items, d)
```

接著將互動資料（點擊、購買、收藏）當作監督訊號，讓具有正向互動的使用者—商品配對得到較高分數，負向或抽樣配對得到較低分數（常見做法包含負採樣、pairwise ranking loss 等）。

## 4.3 分群、去重、相似內容推薦

只要你有一批文字（文章標題、摘要、留言）：

- 先把每筆資料轉成 Embedding。
- 再使用 k-means、階層式分群或近鄰圖。

就能做到「主題分群」、「相似貼文推薦」、「重複內容偵測」等功能。

## 4.4 多模態：以文搜圖、以圖搜文

像 CLIP 這類模型會把「文字」與「圖片」嵌入到同一空間，使圖片與其描述文字彼此靠近、不相關的內容彼此遠離，讓跨模態檢索成為可能 [5]。

---

# 5. 快速動手：由淺入深的三個案例

如果你的目標是先建立系統，使用現成的 Embedding 模型通常最快。下面以同一套工具示範三個層級；請先執行 `pip install openai numpy`，並設定 `OPENAI_API_KEY`[3]。

## 共用工具：將文字轉成向量，使用餘弦相似度進行比較

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

執行結果通常會顯示「國王 vs 皇后」比「國王 vs 蘋果」更相近，表示語義距離能實際運用於工程系統。

## 5.2 中等：迷你語義搜尋（切段 → 建索引 → Top-K）

這個版本不需要向量資料庫，直接使用 NumPy 執行 Top-K；很適合資料量較小的情境，例如部落格文章、筆記或 FAQ。

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

將 `docs` 換成自己的資料來源（例如文章段落、商品描述或工單內容），即可建立一個基本的語義搜尋原型。

## 5.3 進階：MMR（避免重複）+ RAG（檢索後生成）

直接取 Top-K 時，常會得到多個內容高度相似的片段。**MMR（Maximal Marginal Relevance）** 會在「相關性」與「多樣性」之間做取捨，降低檢索結果之間的重複程度（承接上面的 `chunks`、`chunk_mat`）。

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

query = "如何在推薦系統中使用 embedding？"
q = embed_texts([query])[0]
picked = mmr(q, chunk_mat, k=3, lambda_=0.7, pool_size=10)
context = "\n\n".join(f"[{chunks[i]['id']}] {chunks[i]['text']}" for i in picked)
print(context)

# （可選）將檢索結果傳給 LLM，建立最小版 RAG
resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "你是助理，只能依據提供的內容回答。若內容不足，請說不知道。"},
        {"role": "user", "content": f"問題：{query}\n\n可用內容：\n{context}"},
    ],
)
print(resp.choices[0].message.content)
```

完成這一步後，可以進一步將 Embedding 結果快取或寫入儲存空間，並使用向量資料庫執行近鄰檢索。接著可加入 metadata filter（中繼資料篩選，例如標籤或日期）及 re-ranking（重新排序，例如使用交叉編碼器或 LLM），進一步提升檢索精準度。

---

# 小結

Embedding 的價值，在於將「離散世界」轉換成「可計算的幾何世界」，讓相似度比較、檢索、推薦、分類與分群都能使用同一套向量工具鏈。理解它的基本概念、訓練目標與相似度計算方式後，便能更容易將 Embedding 運用於搜尋、推薦、RAG 與內容去重等專案。


---

# 參考資料

1. Google Machine Learning Crash Course — Embeddings: https://developers.google.com/machine-learning/crash-course/embeddings/video-lecture
2. Mikolov et al., Distributed Representations of Words and Phrases and their Compositionality (2013): https://arxiv.org/abs/1310.4546
3. OpenAI API Documentation — Embeddings: https://platform.openai.com/docs/guides/embeddings
4. Bengio et al., A Neural Probabilistic Language Model (2003): https://www.jmlr.org/papers/v3/bengio03a.html
5. Radford et al., Learning Transferable Visual Models From Natural Language Supervision (CLIP, 2021): https://arxiv.org/abs/2103.00020
