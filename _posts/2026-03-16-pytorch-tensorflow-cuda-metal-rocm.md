---
layout: post
title: 深度學習入門最容易搞混的兩層：PyTorch / TensorFlow 與 CUDA / Metal / ROCm
subtitle: 先分清楚框架層和加速平台層，再來談差異、兼容與選法，才不會一開始就把整個技術堆疊混成一團
author: Paul Jiang
categories: AI
tags: PyTorch TensorFlow Keras CUDA Metal ROCm Deep-Learning GPU
sidebar: []
excerpt_image: /assets/images/260316/framework-vs-accelerator-stack.svg
---

> 本文對 `PyTorch`、`TensorFlow / Keras`、`CUDA`、`Metal`、`ROCm` 的描述，以 **2026 年 3 月 16 日** 我查閱官方資料時的內容為準。之後版本、安裝方式與支援矩陣可能調整。本文主要參考：
> [PyTorch](https://pytorch.org/)、[TensorFlow](https://www.tensorflow.org/overview)、[Keras](https://keras.io/keras_3/)、[CUDA](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)、[Apple Metal / PyTorch MPS](https://developer.apple.com/metal/pytorch/)、[tensorflow-metal](https://developer.apple.com/metal/tensorflow-plugin/)、[ROCm](https://rocm.docs.amd.com/en/latest/what-is-rocm.html)、[HIP](https://rocm.docs.amd.com/projects/HIP/en/latest/index.html)。

我自己在看深度學習入門討論時，最常看到的混亂不是哪個框架比較強，而是很多名詞一開始就被放在同一層講。  
很多人剛接觸這一塊時，會同時聽到：`PyTorch`、`TensorFlow`、`CUDA`、`Metal`、`ROCm`，然後很自然地把它們塞進同一個問題裡問：

- 我要學 `PyTorch` 還是 `TensorFlow`？
- 我是 `Mac`，是不是就不能碰深度學習？
- `CUDA`、`Metal`、`ROCm` 到底是不是同一種東西？
- 這些平台是不是其實可以互相兼容？

在我看來，問題不只是名詞多，而是這些名詞根本不在同一層。

我會把它們先拆成兩類：

- `PyTorch`、`TensorFlow / Keras` 是我拿來定義模型、訓練模型的 `框架層`
- `CUDA`、`Metal`、`ROCm` 是模型底下實際怎麼吃到 GPU 算力的 `加速平台層`

如果這兩層一開始沒有拆開，後面很容易變成：
你以為自己在選框架，其實是在被硬體環境限制；或者你以為自己在談 GPU 平台，結果其實是在談高階框架的使用感。

所以這篇我想做的事情很單純，就是先把這兩層拆清楚，再來講：

1. `PyTorch` 跟 `TensorFlow / Keras` 到底差在哪
2. `CUDA`、`Metal`、`ROCm` 各自在整個堆疊裡扮演什麼角色
3. 所謂的「兼容」到底是哪一層的兼容
4. 如果你是初學者，應該怎麼選比較合理

---

# 1. 為什麼這些名詞很容易被混在一起

我自己覺得，這個混淆其實非常合理。

因為你平常接觸深度學習，不太會只碰到其中一個詞。你常看到的反而是：

- `PyTorch with CUDA`
- `TensorFlow on GPU`
- `PyTorch MPS on Mac`
- `ROCm build`

於是很容易就把它們理解成同一組互相替代的選項。

但真正的情況是：

- 有些名詞在回答「模型怎麼寫」
- 有些名詞在回答「模型怎麼跑快」
- 有些名詞在回答「這個硬體平台能不能被框架吃到」

如果要先抓住這篇最重要的一句話，我會先講：

**你不是在同一層比較 `PyTorch` 和 `CUDA`。**

前者是框架，後者是加速平台。  
我自己每次遇到這類問題，第一步也都是先把層次拆開，因為這件事一旦分清楚，後面很多選型問題就會簡單很多。

# 2. 先分層：框架層 vs 加速平台層

如果要把這件事畫成最簡化的版本，我會用下面這種方式看：

![先分清楚框架層和加速平台層](/assets/images/260316/framework-vs-accelerator-stack.svg)

_圖：`PyTorch`、`TensorFlow / Keras` 是框架層；`CUDA`、`Metal`、`ROCm` 是讓框架吃到硬體算力的加速平台層。_

這張圖不是要把所有細節一次講完，而是先建立一個我覺得最重要的分層觀念：

## 2.1 框架層

我會把框架層理解成下面這些工作：

- 定義模型
- 組合 layer
- 算 loss
- 做自動微分
- 跑訓練流程
- 呼叫 optimizer 更新參數

換句話說，這一層在回答的是：
**我要怎麼把深度學習模型寫出來、訓練起來？**

## 2.2 加速平台層

我會把加速平台層理解成下面這些工作：

- 把 tensor 運算丟到 GPU 或其他加速硬體
- 提供底層 kernel 與 runtime
- 處理硬體相關的執行能力

也就是說，這一層在回答的是：
**模型底下到底怎麼吃到硬體算力？**

## 2.3 為什麼這樣分很重要

我之所以一直強調這個分層，是因為它會直接改變你對問題的理解方式。

例如你用的是：

- `NVIDIA` 顯卡
- `MacBook` 上的 `Apple silicon`
- `AMD` GPU

你最後碰到的加速平台可能就完全不同。  
但你上面用來定義模型的框架，還是可以是 `PyTorch` 或 `TensorFlow / Keras`。

如果再壓成一句話，我會這樣講：

**框架層是你怎麼工作，加速平台層是你的工作怎麼被硬體加速。**

---

# 3. PyTorch 跟 TensorFlow 本質上都在做什麼

在談差異之前，我會先講共同點。  
不然很容易一開始就把 `PyTorch` 和 `TensorFlow` 想成兩個完全不同世界。

但在我看來，它們其實都在幫你完成同一條深度學習工作流：

1. 準備 tensor
2. 定義模型
3. 前向傳播
4. 計算 loss
5. 反向傳播
6. 更新參數
7. 重複訓練直到收斂

如果從這個角度看，`PyTorch` 跟 `TensorFlow` 不是在做兩種不同事情，而是在用不同工作方式包裝同一類事情。

所以這裡我會先把期待校正一下：

- 不是 `PyTorch` 才能做 CNN
- 不是 `TensorFlow` 才能做 Transformer
- 不是某一個框架才有 GPU

大部分常見模型，這兩個框架都能做。  
我認為真正值得討論的，反而是：

- 哪個比較適合你現在的學習目標
- 哪個工作方式比較符合你的習慣
- 哪個在你的硬體環境上比較順

# 4. PyTorch 的工作方式是什麼

`PyTorch` 官方把自己定位成一個支援 GPU 的 tensor library 和深度學習框架。  
如果用我自己的白話來講，它給我的感覺比較像：

**比較接近「直接寫 Python 程式來控制模型訓練流程」。**

我會把它的特點整理成這幾件事：

- 訓練 loop 通常看得很清楚
- model、loss、backward、optimizer 的關係比較直接
- debug 時比較容易知道哪一步出了問題
- 你比較像是在親手控制訓練過程，而不是只呼叫一層很高的封裝

這也是為什麼我會覺得，很多人學深度學習時，`PyTorch` 比較適合用來建立直覺。

這裡我不是要說 `PyTorch` 一定比較好，而是它常給你比較強的 `可見度`。如果你現在最想建立的是：

- tensor shape 的感覺
- loss 怎麼往回傳
- optimizer 到底在更新什麼
- 一個訓練 step 到底發生了什麼

那我通常會比較傾向建議先從 `PyTorch` 開始。

# 5. TensorFlow / Keras 的工作方式是什麼

`TensorFlow` 官方把自己描述成一個 end-to-end machine learning platform。  
對多數初學者來說，實際接觸 `TensorFlow` 時，幾乎也會一起碰到 `Keras`。

這裡我想先補一個很容易搞混、但其實很重要的點：

- `TensorFlow` 官網仍把 `Keras` 當成 high-level API 來介紹
- `Keras 3` 本身又已經變成多後端 API，可跑在 `TensorFlow`、`JAX`、`PyTorch`

但如果站在入門者角度，我覺得最常見的使用情境還是：
**用 `TensorFlow + Keras` 這條線去快速搭標準模型流程。**

如果要描述它的使用感，我會這樣講：

- 高階 API 比較完整
- 很多常見流程可以比較快搭起來
- 訓練、驗證、儲存、部署這條線比較容易被放在同一個脈絡裡理解

也就是說，如果 `PyTorch` 比較像：
你自己把訓練迴圈展開來看。

那 `TensorFlow / Keras` 比較像：
你可以先站在比較高的抽象層，把標準工作流搭起來。

![PyTorch 與 TensorFlow / Keras 的工作方式比較](/assets/images/260316/pytorch-vs-tensorflow-comparison.svg)

_圖：兩者都能訓練深度學習模型，但 `PyTorch` 往往給你比較直接的訓練流程感，`TensorFlow / Keras` 則更強調高階 API 與整體工作流。_

所以這一節我想收的不是「誰贏」，而是：

- 想先理解模型怎麼學，`PyTorch` 常比較直覺
- 想先快速把標準流程跑起來，`TensorFlow / Keras` 常比較順

---

# 6. CUDA、Metal、ROCm 又是在解什麼問題

如果前面講的是「我怎麼寫模型」，那這一節講的就是：
**你寫好的模型，底下怎麼跑快。**

`CUDA`、`Metal`、`ROCm` 都屬於這一層，但我覺得它們最需要被看清楚的，是它們各自背後綁的是不同硬體生態。

## 6.1 CUDA

`CUDA` 是 `NVIDIA` 的 parallel computing platform and programming model。

對深度學習使用者來說，你不一定每天都直接寫 `CUDA kernel`，但如果你用的是 `NVIDIA` GPU，很多深度學習框架的 GPU 加速，其實就是建立在這條路徑上。

所以如果你是在 PC 上做深度學習，我會把常見情況直接理解成：

- `PyTorch + CUDA`
- `TensorFlow + CUDA`

## 6.2 Metal

Apple 這邊我反而最不建議用「Apple 版 CUDA」這種方式粗暴理解。

比較準的說法，我會寫成：

- `Metal` 是 Apple 的 graphics and compute API
- 在機器學習上，很多時候你不是直接碰 `Metal` API
- 你更常碰到的是基於 `Metal` 的 backend 或 plugin

例如：

- Apple 官方有 `PyTorch MPS` backend 說明
- `TensorFlow` 在 `Mac` 上則可透過 `tensorflow-metal` plugin 使用 GPU 加速

所以在 Apple 平台上，我覺得真正常見的使用感不是：
「我今天選 `Metal` 還是 `CUDA`」，
而是：
「我用的框架，在 Apple 平台上是透過哪條路徑吃到 GPU 算力」。

## 6.3 ROCm

`ROCm` 是 AMD 的開放 GPU 軟體堆疊。

如果用我自己的白話講，我會把它理解成：
**讓深度學習框架有機會在 AMD GPU 環境上跑起來的一整套基礎設施。**

它常和 `HIP` 一起出現，因為 `HIP` 是 AMD 在可移植 GPU 程式開發上很重要的一層。

對深度學習使用者來說，`ROCm` 的存在不是要你背所有底層細節，而是要先知道：

- 如果你用 `AMD` GPU
- 又想讓 `PyTorch` 或其他框架吃到 GPU

你常常就會走到 `ROCm` 這條線。

![CUDA、Metal、ROCm 的角色定位](/assets/images/260316/cuda-metal-rocm-positioning.svg)

_圖：三者都在加速平台層，但對應的硬體生態與常見使用方式不同。_

這一節如果只留一句話，我會留：

**`CUDA`、`Metal`、`ROCm` 不是拿來定義模型的，它們是在處理模型底下的硬體加速。**

---

# 7. CUDA、Metal、ROCm 能不能互相兼容

這一節我認為最容易被講壞。

如果直接寫「它們彼此兼容」，太粗。  
如果直接寫「它們完全不兼容」，又會錯過一些真實存在的可移植性。

所以我會更傾向用下面這句比較準的說法：

**它們不是直接互通的同一套平台，但在某些層次上，確實存在抽象、移植或語意對位。**

關鍵是，我們得先分清楚自己在講哪一層的兼容。

![兼容不是同一件事：框架抽象、原始碼移植、runtime 互通要分開看](/assets/images/260316/compatibility-vs-portability.svg)

_圖：很多人口中的「兼容」，其實是在講不同層次的事情。_

## 7.1 框架層抽象

這是我覺得最常讓人誤會的地方。

以 `PyTorch` 為例，官方的 ROCm/HIP 說明裡明確提到：
ROCm 版本會重用很多 `torch.cuda` 介面。

這代表什麼？  
代表你在 `PyTorch` 這一層，很多 code 看起來很像、甚至不用大改。

但這不代表：

- `CUDA` 和 `ROCm` 底層完全一樣
- `NVIDIA` 的 binary 可以直接在 `ROCm` 上跑

所以在我看來，它比較像是：
**框架幫你把底下差異抽象掉了一部分。**

## 7.2 原始碼可移植

這一層最典型的例子，我會拿 `HIP` 來講。

AMD 官方寫得很清楚，`HIP` 的目標之一，是幫助把部分 `CUDA` 程式移植到 AMD GPU，也提供 `hipify` 這類工具輔助轉換。

所以在這一層，我覺得可以這樣說：

- `CUDA` 和 `ROCm/HIP` 有部分可移植性

但請注意，這裡講的是：

- 原始碼層的移植

不是：

- runtime 完全互通
- 一份 binary 直接 everywhere

## 7.3 runtime / binary 互通

但到了這一層，我就不會講得太樂觀。

`CUDA`、`Metal`、`ROCm` 各自背後都有自己的 runtime、driver、生態與硬體依賴。

我會比較傾向直接寫成：

- 不是三者可以直接互換執行
- 更不是同一個編譯結果到處跑

尤其 `Metal` 比較不像 `HIP` 這種「幫你做 CUDA 程式移植」的角色。
它更像 Apple 生態裡自己的加速路徑，通常是由 `PyTorch MPS` 或 `tensorflow-metal` 這種框架側 integration 去接上。

如果我要用一句話總結這一節，我會寫成：

**`CUDA`、`Metal`、`ROCm` 不是直接互通，但在框架抽象層與部分可移植工具層，確實存在一定程度的銜接。**

# 8. 這兩層到底怎麼接在一起

如果把前面全部合起來，我自己會用下面這種方式理解：

| 你的硬體環境 | 你常用的框架層 | 常見加速路徑 | 實際理解方式 |
| --- | --- | --- | --- |
| `NVIDIA` GPU PC / 工作站 | `PyTorch` / `TensorFlow` | `CUDA` | 最常見的桌面 GPU 深度學習路徑 |
| `Mac` with Apple silicon | `PyTorch` | `MPS / Metal` | 透過 Apple 提供的 backend 吃到 GPU |
| `Mac` with Apple silicon | `TensorFlow` | `tensorflow-metal` | 用 plugin 接到 Apple GPU 加速 |
| `AMD` GPU 環境 | `PyTorch` / 其他支援框架 | `ROCm` | 走 AMD 自己的加速堆疊 |

這張表真正想提醒的，是我前面一直在講的那件事：

**大部分初學者不是先選 `CUDA / Metal / ROCm`，而是先被自己的硬體環境影響。**

所以如果你今天拿的是：

- 一台 `NVIDIA` GPU PC
- 一台 `MacBook`
- 一張 `AMD` 顯卡的工作站

你後面碰到的平台層其實已經差很多了。

# 9. 如果你是初學者，應該怎麼選

這一節我會直接收成一組判斷規則。

## 9.1 先問：你是在學深度學習，還是在學硬體堆疊

如果你現在主要目標是：

- 理解 tensor
- 理解 forward / backward
- 理解訓練 loop
- 理解模型怎麼收斂

那我會建議先把重心放在 `框架層`，不要一開始就把注意力全部耗在 driver 和 backend 上。

## 9.2 如果你重點是建立直覺

我會優先建議從 `PyTorch` 開始。

因為它通常比較容易讓你直接看到：

- model 在做什麼
- loss 在做什麼
- optimizer 在做什麼
- 一次訓練 step 到底發生了什麼

## 9.3 如果你想快速走標準高階流程

那我覺得可以從 `TensorFlow / Keras` 開始。

尤其如果你想先快速做出一條：

- 定義模型
- fit
- evaluate
- save / deploy

這種比較完整的標準工作流，`TensorFlow / Keras` 會比較自然。

## 9.4 硬體平台怎麼看

- 你用 `NVIDIA` GPU：幾乎一定會碰到 `CUDA`
- 你主要在 `Mac`：要理解 `Metal` 在整個 stack 裡的位置
- 你用 `AMD` GPU：才需要把 `ROCm` 這條線搞清楚

## 9.5 一個很實際的建議

如果你還在入門階段，小模型、教學例子、概念理解，其實未必需要一開始就把 GPU stack 全搞定。

很多人卡的不是：

- `CUDA` 裝不裝得好

而是：

- tensor shape 看不懂
- loss function 不知道在優化什麼
- overfitting 不知道怎麼解讀
- train / validation / test 分不清楚

所以如果是我自己給入門者排順序，我通常會排成：

1. 先理解深度學習工作流
2. 再熟一個框架
3. 最後才把加速平台層補齊

# 10. 結論

如果要把這篇壓成最短的一句話，我自己會這樣收：

**`PyTorch / TensorFlow` 是框架層，`CUDA / Metal / ROCm` 是算力層。**

前者在回答：
模型怎麼被定義、訓練、更新。

後者在回答：
模型底下怎麼吃到 GPU 算力。

而所謂的兼容，也不能只用一句「可以」或「不可以」帶過。
你至少要先分清楚：

- 是框架 API 的抽象
- 是原始碼的可移植
- 還是 runtime / binary 的直接互通

當這兩層真的分清楚之後，很多看起來很亂的問題就會突然變簡單：

- 為什麼 `PyTorch` 跟 `CUDA` 不是同一層
- 為什麼 `Mac` 上談的是 `Metal` 路徑
- 為什麼 `ROCm/HIP` 常被拿來和 `CUDA` 放在一起比較
- 為什麼你看到某些 code 在不同平台「幾乎不用改」，但底層其實不是同一套東西

換句話說，我認為真正該先學會的不是站隊，而是 `分層理解`。
