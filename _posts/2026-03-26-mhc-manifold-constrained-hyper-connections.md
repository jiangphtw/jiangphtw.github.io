---
layout: post
title: mHC 是什麼？為什麼 DeepSeek 提出用 manifold constraint 改寫 Hyper-Connections
subtitle: 從 residual connection、identity mapping、Hyper-Connections 到 doubly stochastic manifold，一次看懂 mHC 真正想解決的訓練穩定性與可擴展性問題
author: Paul Jiang
categories: AI
tags: mHC Hyper-Connections Residual-Connection Identity-Mapping Transformer Model-Architecture DeepSeek
sidebar: []
excerpt_image: NO_EXCERPT_IMAGE
---

> 本文以 arXiv 論文 [mHC: Manifold-Constrained Hyper-Connections](https://arxiv.org/abs/2512.24880) 為主線，內容以 **2026 年 3 月 26 日** 查閱到的 arXiv `v2` 版本為準。  
> 如果先講一句話結論：**`mHC` 的核心價值，是在保留 `Hyper-Connections` 拓撲優勢的同時，把被破壞的 `identity mapping` 性質拉回來，換取更穩定、更可擴展的大模型訓練。**

這篇論文不是在改 attention、FFN、tokenizer，也不是在提出一個全新的 Transformer 替代品。它瞄準的是一個更基礎、但往往被視為理所當然的地方：**殘差連接（residual connection）這個宏觀架構骨架。**

很多模型論文喜歡談：

- attention 怎麼改
- MoE 怎麼擴
- KV cache 怎麼壓
- 訓練技巧怎麼調

但 `mHC` 在問的是另一個問題：

**如果我們連 residual connection 這個最基本的訊號傳遞機制都重新設計，會不會讓模型在大規模訓練時更強？**

這個方向其實不小。因為從 `ResNet` 到 `Transformer`，residual connection 一直都是深層網路能訓得穩、訓得深的重要原因之一。`mHC` 的出發點，就是建立在這個事實之上。

---

# 1. 為什麼殘差連接這麼重要：從 ResNet 到 Transformer 的共同骨架

## 1.1 它在解哪個問題

深層神經網路有一個老問題：層數越深，訊號越容易在 forward pass 中被放大或衰減，梯度在 backward pass 中也越容易爆炸或消失。這會讓訓練變得不穩，甚至根本訓不起來。

`Residual connection` 的出現，本質上就是在解這件事。

它最簡單的形式可以粗略理解成：

- 一部分訊號走 layer function
- 另一部分訊號直接繞過去
- 最後把兩者相加

這個「直接繞過去」的路徑，就是 residual learning 的核心。

## 1.2 它實際怎麼做

標準 residual connection 的最大優勢，不是形式簡單而已，而是它保留了一個很珍貴的性質：**identity mapping**。

白話地說，identity mapping 的意思是：

- 較淺層的訊號可以原樣流到較深層
- 不需要經過額外變形
- 不會每過一層就被重新洗牌一次

這讓模型在訓練時比較容易維持穩定的訊號與梯度流。

## 1.3 它跟標準 residual / HC / mHC 的關係

如果把三者放在同一條演化線上看：

- **標準 residual connection**：重點是穩定、乾淨、identity mapping 清楚
- **HC**：試圖增加連接拓撲與 residual stream 表達力
- **mHC**：保留 HC 的拓撲野心，但想把標準 residual 最珍貴的穩定性找回來

所以要看懂 `mHC`，第一步不是先看 manifold，而是先搞懂：**標準 residual 為什麼本來就這麼值錢。**

---

# 2. Hyper-Connections 想解什麼問題：為什麼有人想把 residual stream 變寬、變複雜

## 2.1 它在解哪個問題

如果標準 residual connection 這麼好，為什麼還要改？

原因很簡單：它穩定，但也相對保守。對越來越大的模型來說，研究者會開始問：

- residual stream 能不能更有容量？
- 跨層資訊交換能不能更豐富？
- 除了單一路徑相加，能不能讓連接拓撲更有表達力？

`Hyper-Connections (HC)` 就是在這個背景下出現的。

## 2.2 它實際怎麼做

從論文的描述來看，`HC` 的核心做法是：

- 把 residual stream 的寬度擴張
- 引入更複雜的 learnable mapping
- 讓訊號不再只是在單一 residual path 裡直通，而是在更寬、更複雜的多流結構中混合與交換

論文特別提到，這種設計在 FLOPs 上不一定明顯增加單個 block 的計算成本，但它確實讓 residual 拓撲複雜度提升很多。

換句話說，`HC` 不是在改 block 裡的 attention 或 FFN，而是在改「block 與 block 之間的資訊怎麼流動」。

## 2.3 它跟標準 residual / HC / mHC 的關係

三者在這裡的差異可以先抓成一句話：

- 標準 residual：資訊流最乾淨
- HC：資訊流更豐富、更複雜
- mHC：資訊流依然豐富，但不再放任它無約束地擴散

HC 的吸引力在於，它打開了一個新的 scaling 維度。過去談 scaling，多半在講：

- 模型參數量
- 訓練資料量
- 計算量

HC 則在說：**也許 residual stream 的拓撲與寬度，本身也是可擴展的設計維度。**

---

# 3. HC 的代價是什麼：identity mapping 被破壞後，為什麼訓練會不穩

## 3.1 它在解哪個問題

HC 的問題不是沒有效，而是它在換取拓撲彈性的同時，也把標準 residual connection 最重要的穩定來源動搖了。

論文的核心批評很直接：**HC 的 learnable mapping 是 unconstrained 的。**

這代表什麼？

代表當這些 mapping 在多層之間被不斷連乘、疊加時，它們不再保證像標準 residual 那樣保住 identity mapping。

## 3.2 它實際怎麼造成不穩

論文把這件事解釋成一種「守恆機制被破壞」。

在多個平行 residual stream 的設定裡，如果你有一個理想的 identity-like 傳遞機制，那麼較淺層的平均訊號強度應該在傳到較深層時大致保持穩定，不會莫名其妙越滾越大或越縮越小。

但 HC 的 unconstrained composite mapping 做不到這件事。於是會出現兩種風險：

- forward signal amplification / attenuation
- backward gradient explosion / vanishing

這正是大型訓練最怕的組合。

論文也不是只停在理論推測。它在 stability analysis 裡觀察到：

- HC 在大規模訓練時會出現明顯的 loss surge
- 這和 gradient norm 的異常高度相關
- 用來衡量 composite mapping 放大量的指標 `Amax Gain Magnitude`，在 HC 中峰值可接近 `3000`

這不是小抖動，而是相當劇烈的訊號失控。

## 3.3 它跟標準 residual / HC / mHC 的關係

如果用最直白的方式描述：

- 標準 residual：穩，但連接表達力較保守
- HC：表達力更強，但在 scale 上容易不穩
- mHC：承認 HC 的方向值得追，但不接受它用「破壞 identity mapping」作為代價

這就是 `mHC` 的問題意識。

---

# 4. mHC 在做什麼：把 residual connection space 投影到 manifold 上

## 4.1 它在解哪個問題

`mHC` 的核心問題很清楚：**能不能在保留 HC 連接彈性的同時，把 residual mapping 限制在一個更穩定的幾何空間裡？**

換句話說，它不是想取消 HC，而是想替 HC 加上一個結構性約束，讓它不要在多層組合之後變成訊號放大器。

## 4.2 它實際怎麼做

論文提出的做法是把 residual connection space 投影到一個特定 manifold 上。具體來說，它使用 `Sinkhorn-Knopp` 演算法，把相關矩陣投影到 `Birkhoff polytope`，也就是 **doubly stochastic matrices** 所構成的空間。

這一步的技術意義，可以先用直覺理解：

- 每一列加總為 1
- 每一欄加總為 1
- 所以整體 mapping 比較像是一種「加權平均」或「凸組合」

這很重要，因為當你的 mixing matrix 變成這種結構，訊號就比較不容易被無限制地放大或壓扁。

## 4.3 它跟標準 residual / HC / mHC 的關係

在這一層上，三者的差異可以理解為：

- 標準 residual：天然保留 identity path
- HC：讓 residual path 變成可學習的複雜混合，但沒有限制
- mHC：允許學習混合，但要求混合必須待在一個穩定的 manifold 上

所以 `mHC` 不是單純「加正則化」，而比較像是：

**把原本自由度過高的 residual mixing，壓回一個仍有表達力、但更不容易失控的幾何空間。**

---

# 5. doubly stochastic matrix、Birkhoff polytope、Sinkhorn-Knopp 到底在這裡扮演什麼角色

## 5.1 它在解哪個問題

如果只說「投影到 manifold」會太抽象。對多數讀者來說，真正要回答的是：

**為什麼這個 manifold 會讓訓練比較穩？**

論文的答案是：因為它選的不是任意 manifold，而是和訊號守恆、組合閉包、穩定傳播直接相關的那一類。

## 5.2 它實際怎麼做

### Doubly stochastic matrix

所謂 doubly stochastic matrix，可以先把它理解成：

- 每一列總和固定
- 每一欄總和固定
- 因此 mapping 具有某種守恆性

論文裡的關鍵敘述是，這種矩陣會讓 mapping 成為輸入特徵的 convex combination。這意味著：

- feature mean 更容易被保留
- signal norm 受到約束
- 不容易出現隨層數累積的爆炸或崩塌

### Birkhoff polytope

`Birkhoff polytope` 可以把它想成「所有 doubly stochastic matrices 的集合」。`mHC` 的策略，就是把原本自由度太高的 learnable mapping 投影到這個集合裡。

它的重點不在於名詞本身，而在於這個集合有一個對論文很重要的性質：

- 這個空間裡的矩陣做乘法組合後，仍然保留穩定的守恆特徵

論文把這一點視為 mHC 能恢復跨多層 identity-like 穩定性的關鍵。

### Sinkhorn-Knopp

`Sinkhorn-Knopp` 則是實務上把一般矩陣逼近到 doubly stochastic 形式的一個方法。

`mHC` 用它來做 projection，不是因為它名字高深，而是因為它讓這個 constraint 變成可計算、可落地、可放進訓練流程的東西。

## 5.3 它跟標準 residual / HC / mHC 的關係

如果你把這三個概念合起來看，mHC 的方法本質就是：

- `HC` 想把 residual mixing 變得更靈活
- 但自由度太高會毀掉 identity mapping
- 於是 `mHC` 用 `Sinkhorn-Knopp` 把 mapping 拉回 `Birkhoff polytope`
- 讓它變成近似的 doubly stochastic mixing

最終目的只有一個：**讓訊號在多層傳播時不至於失控。**

---

# 6. mHC 不只講理論：它還做了哪些 infrastructure optimization

## 6.1 它在解哪個問題

只要看到擴寬 residual stream、多加 projection、還要跑 `Sinkhorn-Knopp`，工程師第一個問題一定是：

「好，數學上也許有道理，但這東西會不會很慢、很吃記憶體、很難部署？」

論文其實很清楚知道這個疑慮，所以它不只提方法，也花了不少篇幅處理 infrastructure overhead。

## 6.2 它實際怎麼做

論文在 `Efficient Infrastructure Design` 裡主要提了三個方向：

### Kernel fusion

它把多個小而碎的操作融合成較少的 kernel，降低 launch overhead，並把部分 kernel 用 `TileLang` 與 mixed precision 方式實作。

這件事的核心不是炫 implementation，而是因為 mHC 引入的新步驟很多都不是重 FLOPs，而是容易碎成大量 memory-bound 操作。若不做 fusion，實際效率可能會很差。

### Recomputing

由於 multi-stream residual 在訓練中會帶來額外 activation memory，論文採用 selective recomputing：

- forward 後丟掉部分中間 activation
- backward 時再即時重算

這樣做的目標是壓低 peak memory footprint，而不是單純追求最快。

### Overlapping communication in DualPipe

論文的實驗是大規模 pretraining，因此 pipeline parallelism 與跨 stage communication 很重要。`mHC` 會在這裡引入更多延遲，所以作者進一步延伸 `DualPipe` schedule，讓 communication 與 computation 在 stage boundary 更好地重疊。

## 6.3 它跟標準 residual / HC / mHC 的關係

這一段很關鍵，因為它說明：

- 標準 residual 幾乎不用為這些額外機制付太多代價
- HC 帶來更寬 residual stream，也帶來 memory access cost
- mHC 不只是把 HC 約束化，還要補齊系統層面的效率缺口

所以 `mHC` 不是一個只停留在 paper math 的方法，它非常明顯在往「可訓練、可擴展、可落地」的方向設計。

---

# 7. 實驗結果代表什麼：穩定性、scaling、額外 overhead 怎麼解讀

## 7.1 它在解哪個問題

論文的核心主張有三個：

- `mHC` 比 `HC` 穩定
- `mHC` 比 baseline 與 HC 有更好的擴展性
- 這些收益不是靠巨大系統代價換來的

所以看實驗時，要抓住這三條線，而不是只看某個 benchmark 單點成績。

## 7.2 它實際怎麼做

論文使用的是受 `DeepSeek-V3` 啟發的 `MoE` 架構，包含：

- `3B`
- `9B`
- `27B`

三種主要規模，另有一個 `3B` 的 `1T tokens` 設定用來看 token scaling。對 `HC` 與 `mHC`，論文都固定使用：

- `expansion rate = 4`

這一點很重要，因為後面所有穩定性、scaling 與 overhead 討論，都建立在這個設定上。

在主結果上，論文顯示：

- `mHC` 在 `27B` 模型上比 baseline 整體更好
- 也在多數 benchmark 上超過 `HC`
- 在 BBH 與 DROP 這類任務上，相比 HC 仍有額外收益

更關鍵的是穩定性分析：

- `HC` 會出現明顯 loss surge
- `mHC` 的 gradient norm 行為更接近 baseline
- composite mapping 的最大 gain 在 `mHC` 中被壓到大約 `1.6` 的量級，而不是 HC 中接近 `3000` 的極端值

這是論文最有說服力的部分之一，因為它不只是說「結果變好」，而是直接對準不穩定機制本身做觀測。

最後是系統代價。論文在 introduction 中提到，在其 in-house large-scale training 設定下，`mHC` 在 `expansion rate = 4` 時只帶來約 **`6.7%` 額外時間 overhead**。

## 7.3 它跟標準 residual / HC / mHC 的關係

這些實驗結果如果濃縮成一句話，大概就是：

- 標準 residual：最穩，但連接表達力較保守
- HC：效果有潛力，但 scale 上容易不穩
- mHC：保住 HC 的好處，並把 instability 壓到可接受範圍

但要注意，這些結論都應該限定在論文設定內解讀。它不是在保證任何模型、任何訓練配方、任何硬體上都會得到同樣收益。

---

# 8. 我們該怎麼看這篇論文：它對未來模型架構設計有什麼意義

## 8.1 這篇論文真正的新意是什麼

我認為這篇論文真正的新意，不只是「HC 加了 constraint」這麼簡單，而是它把一個常被當作工程問題的東西，重新拉回架構設計核心：

- 殘差連接不是背景板，它本身就是關鍵設計自由度
- 如果 residual topology 更複雜，就必須重新思考 identity mapping 怎麼維持
- 幾何約束不只是數學裝飾，而可能是大規模訓練穩定性的必要條件

它某種程度上是在說：**模型架構的未來，不一定只靠更強的 block，也可能來自更好的跨層拓撲。**

## 8.2 它比較可能先影響哪一類模型訓練或架構研究

這篇論文比較可能先影響的，不是小模型 fine-tuning，而是：

- 大規模 pretraining 架構研究
- 對 macro-architecture 有興趣的基礎模型團隊
- 正在探索 residual stream 擴張、多流連接、跨層拓撲的研究工作
- 對訓練穩定性與系統效率同時敏感的 LLM infra 團隊

換句話說，它比較像是會先影響「下一代 backbone 怎麼設計」，而不是明天就讓所有應用端模型立刻換架構。

## 8.3 它離成為主流基礎架構設計，還差哪些驗證

還差不少。

至少還有幾件事需要後續驗證：

- 是否能在更多非 DeepSeek 風格模型上重現收益
- 是否能在更大規模、更長訓練、更不同硬體設定下穩定成立
- constraint 帶來的收益，是否足以抵消工程複雜度
- 社群是否能找到比 doubly stochastic manifold 更好的幾何限制

所以比較合理的結論不是「mHC 已經是新的標準架構」，而是：

**它把一個很值得追的方向講清楚了：如果要讓 residual topology 變得更有表達力，就不能再把穩定性視為之後再補的問題。**

---

# 設計比較表

| 設計 | 核心想法 | 優點 | 主要風險 / 代價 | 適用脈絡 |
| --- | --- | --- | --- | --- |
| `標準 Residual Connection` | 保留直接 identity path，layer output 與 input 相加 | 穩定、簡潔、易於深層訓練 | 連接拓撲較保守，跨層資訊交換形式有限 | 傳統 ResNet、Transformer、主流 backbone |
| `Hyper-Connections` | 擴張 residual stream width，讓多流訊號以 learnable mapping 混合 | 提升拓撲複雜度與表達潛力，不必明顯增加單元 FLOPs | unconstrained mapping 可能破壞 identity mapping，導致 instability 與 memory access overhead | 想探索更強 macro-architecture 的研究場景 |
| `mHC` | 把 HC 的 residual mixing 投影到 doubly stochastic manifold 上 | 在保留 HC 優勢下，改善穩定性、scaling 與系統可行性 | 需要額外 projection、kernel 優化與系統工程配合 | 大規模 pretraining、架構研究、對穩定性與效率都敏感的訓練環境 |

---

# 結語

`mHC` 這篇論文最有意思的地方，不是它提出一個聽起來複雜的新名詞，而是它把一個被很多人視為既有常識的元件重新打開來看：**residual connection 本身還有很多設計空間。**

它提醒我們一件事：

- 當你想讓跨層連接更複雜、更有彈性時
- 你同時也在動搖深層訓練最核心的穩定來源

所以真正好的架構設計，不是只追求表達力，而是要把表達力、穩定性與系統成本一起納入。

從這個角度看，`mHC` 不只是 `HC` 的修補版，而更像是一個訊號：**下一代基礎模型架構的競爭，可能不只在 block 裡，也在 block 之間。**

---

# 參考資料

- [arXiv: mHC: Manifold-Constrained Hyper-Connections](https://arxiv.org/abs/2512.24880)
- [arXiv HTML: mHC: Manifold-Constrained Hyper-Connections](https://arxiv.org/html/2512.24880)
- [arXiv PDF: mHC: Manifold-Constrained Hyper-Connections](https://arxiv.org/pdf/2512.24880)
