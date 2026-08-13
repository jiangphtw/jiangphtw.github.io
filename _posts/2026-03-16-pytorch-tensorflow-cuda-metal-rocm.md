---
layout: post
title: 深度學習入門最容易混淆的兩層：PyTorch / TensorFlow 與 CUDA / Metal / ROCm
subtitle: 先區分框架層與加速平台層，再討論差異、相容性與選擇方式
author: Paul Jiang
categories: AI
tags: PyTorch TensorFlow Keras CUDA Metal ROCm Deep-Learning GPU
sidebar: []
excerpt_image: /assets/images/260316/framework-vs-accelerator-stack.svg
---

> 本文對 `PyTorch`、`TensorFlow / Keras`、`CUDA`、`Metal`、`ROCm` 的描述，以 **2026 年 3 月 16 日** 我查閱官方資料時的內容為準。之後版本、安裝方式與支援矩陣可能調整。本文主要參考：
> [PyTorch](https://pytorch.org/)、[TensorFlow](https://www.tensorflow.org/overview)、[Keras](https://keras.io/keras_3/)、[CUDA](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)、[Apple Metal / PyTorch MPS](https://developer.apple.com/metal/pytorch/)、[tensorflow-metal](https://developer.apple.com/metal/tensorflow-plugin/)、[ROCm](https://rocm.docs.amd.com/en/latest/what-is-rocm.html)、[HIP](https://rocm.docs.amd.com/projects/HIP/en/latest/index.html)。

閱讀深度學習入門討論時，我最常看到的問題不是比較框架強弱，而是將不同層次的名詞混在一起討論。
許多初學者會同時接觸 `PyTorch`、`TensorFlow`、`CUDA`、`Metal` 與 `ROCm`，進而自然地將它們放入同一組問題中：

- 應該學習 `PyTorch` 還是 `TensorFlow`？
- 使用 `Mac` 是否就無法接觸深度學習？
- `CUDA`、`Metal` 與 `ROCm` 是否屬於同一類技術？
- 這些平台是否能彼此相容？

問題不只在於名詞眾多，更在於這些名詞根本不屬於同一層次。

可以先將它們分為兩類：

- `PyTorch`、`TensorFlow / Keras` 是用來定義與訓練模型的 `框架層`。
- `CUDA`、`Metal`、`ROCm` 是讓模型實際利用 GPU 算力的 `加速平台層`。

如果一開始沒有區分這兩層，後續很容易產生誤解：
使用者以為自己正在選擇框架，實際上卻受到硬體環境限制；或以為正在討論 GPU 平台，其實談的是高階框架的使用體驗。

因此，本文會先說明這兩個層次，再依序討論：

1. `PyTorch` 與 `TensorFlow / Keras` 的差異。
2. `CUDA`、`Metal` 與 `ROCm` 在整個技術堆疊中扮演的角色。
3. 所謂的相容性發生在哪個層次。
4. 初學者應如何做出合理選擇。

---

# 1. 為什麼這些名詞很容易被混在一起

這種混淆其實可以理解。

接觸深度學習時，通常不會只遇到其中一個名詞，更常看到以下組合：

- `PyTorch with CUDA`
- `TensorFlow on GPU`
- `PyTorch MPS on Mac`
- `ROCm build`

因此，初學者很容易將它們理解為同一組可相互替代的選項。

但真正的情況是：

- 有些名詞回答模型如何撰寫。
- 有些名詞回答模型如何加速執行。
- 有些名詞回答框架能否使用特定硬體平台。

本文最重要的一句話是：

**你不是在同一層比較 `PyTorch` 和 `CUDA`。**

前者是框架，後者是加速平台。
面對這類問題時，第一步應先區分層次；一旦釐清分層，後續許多選型問題就會簡單許多。

# 2. 先分層：框架層與加速平台層

如果以最簡化的方式呈現，可以使用以下架構：

![先分清楚框架層和加速平台層](/assets/images/260316/framework-vs-accelerator-stack.svg)

_圖：`PyTorch`、`TensorFlow / Keras` 屬於框架層；`CUDA`、`Metal`、`ROCm` 則是讓框架利用硬體算力的加速平台層。_

這張圖不打算一次涵蓋所有細節，而是先建立最重要的分層觀念。

## 2.1 框架層

框架層負責以下工作：

- 定義模型。
- 組合 Layer。
- 計算 Loss。
- 執行自動微分。
- 執行訓練流程。
- 呼叫 Optimizer 更新參數。

換句話說，這一層在回答的是：
**應如何建立並訓練深度學習模型？**

## 2.2 加速平台層

加速平台層負責以下工作：

- 將 Tensor 運算交由 GPU 或其他加速硬體處理。
- 提供底層 Kernel 與 Runtime。
- 處理與硬體相關的執行能力。

也就是說，這一層在回答的是：
**模型底層如何利用硬體算力？**

## 2.3 為什麼這樣分很重要

之所以強調這項分層，是因為它會直接改變理解問題的方式。

例如你用的是：

- `NVIDIA` 顯卡
- `MacBook` 上的 `Apple silicon`
- `AMD`GPU

最後使用的加速平台可能完全不同。
但上層用來定義模型的框架，仍然可以是 `PyTorch` 或 `TensorFlow / Keras`。

如果進一步濃縮成一句話：

**框架層決定如何建立模型，加速平台層決定模型如何透過硬體加速。**

---

# 3. PyTorch 與 TensorFlow 本質上都在做什麼

討論差異之前，應先說明共同點。
否則很容易將 `PyTorch` 與 `TensorFlow` 想像成兩個完全不同的世界。

實際上，兩者都能協助完成相同的深度學習工作流程：

1. 準備 Tensor。
2. 定義模型。
3. 執行前向傳播。
4. 計算 Loss。
5. 執行反向傳播。
6. 更新參數。
7. 重複訓練直到收斂。

從這個角度來看，`PyTorch` 與 `TensorFlow` 並非處理兩種不同工作，而是以不同方式封裝相同類型的流程。

因此，這裡需要先調整幾項常見預期：

- 不是 `PyTorch` 才能做 CNN
- 不是 `TensorFlow` 才能做 Transformer
- 不是某一個框架才有 GPU

大多數常見模型都能使用這兩個框架建立。
真正值得討論的是：

- 哪個框架較適合目前的學習目標？
- 哪種工作方式較符合個人習慣？
- 哪個框架在現有硬體環境中運作得更順暢？

# 4. PyTorch 的工作方式是什麼

`PyTorch` 官方將其定位為支援 GPU 的 Tensor Library 與深度學習框架。
以較容易理解的方式來說，它的使用方式比較接近：

**直接撰寫 Python 程式碼來控制模型訓練流程。**

其特點可以整理為：

- 訓練 Loop 通常清楚可見。
- Model、Loss、Backward 與 Optimizer 之間的關係較直接。
- 除錯時較容易定位發生問題的步驟。
- 使用者可以直接控制訓練過程，而不只呼叫高階封裝。

因此，對許多深度學習初學者而言，`PyTorch` 較適合用來建立直覺。

這並不代表 `PyTorch` 一定更好，而是它通常提供較高的 `可見度`。如果目前最想建立的是：

- tensor shape 的感覺
- 損失值如何反向傳播
- 最佳化器實際更新哪些內容
- 一個訓練步驟中實際發生哪些運算

通常可以優先從 `PyTorch` 開始。

# 5. TensorFlow / Keras 的工作方式是什麼

`TensorFlow` 官方將其描述為 End-to-end Machine Learning Platform。
對多數初學者而言，接觸 `TensorFlow` 時通常也會同時接觸 `Keras`。

這裡先補充一項容易混淆、但很重要的觀念：

- `TensorFlow` 官網仍將 `Keras` 作為 High-level API 介紹。
- `Keras 3` 已成為多後端 API，可在 `TensorFlow`、`JAX` 與 `PyTorch` 上執行。

但從初學者角度來看，最常見的使用情境仍是：
**使用 `TensorFlow + Keras` 快速建立標準模型流程。**

其使用體驗可以整理為：

- 高階 API 較完整。
- 許多常見流程可以快速建立。
- 訓練、驗證、儲存與部署較容易放在同一個脈絡中理解。

換句話說，`PyTorch` 比較像由使用者展開並查看完整訓練迴圈。

`TensorFlow / Keras` 則讓使用者先在較高的抽象層建立標準工作流程。

![PyTorch 與 TensorFlow / Keras 的工作方式比較](/assets/images/260316/pytorch-vs-tensorflow-comparison.svg)

_圖：兩者都能訓練深度學習模型，但 `PyTorch` 通常直接呈現訓練流程，`TensorFlow / Keras` 則更強調高階 API 與整體工作流程。_

因此，本節重點不是比較勝負，而是理解：

- 若想先理解模型如何學習，`PyTorch` 通常較為直觀。
- 若想快速建立標準流程，`TensorFlow / Keras` 通常更加順手。

---

# 6. CUDA、Metal、ROCm 解決什麼問題

如果前文討論的是如何建立模型，本節討論的就是：
**如何在底層加速已建立的模型。**

`CUDA`、`Metal` 與 `ROCm` 都屬於這一層，但必須注意，它們分別對應不同的硬體生態系。

## 6.1 CUDA

`CUDA` 是 `NVIDIA` 的 Parallel Computing Platform and Programming Model（平行運算平台與程式設計模型）。

深度學習使用者不一定每天都直接撰寫 `CUDA Kernel`，但若使用 `NVIDIA`GPU，許多框架的 GPU 加速功能都建立在這條路徑上。

因此，在配備 NVIDIA GPU 的 PC 上進行深度學習時，常見組合包括：

- `PyTorch + CUDA`
- `TensorFlow + CUDA`

## 6.2 Metal

對 Apple 平台而言，不建議將 `Metal` 粗略理解成 Apple 版 `CUDA`。

較準確的說法是：

- `Metal` 是 Apple 的 Graphics and Compute API。
- 在機器學習中，使用者通常不會直接操作 `Metal`API。
- 更常接觸的是以 `Metal` 為基礎的 Backend 或 Plugin。

例如：

- Apple 官方有 `PyTorch MPS`backend 說明
- `TensorFlow` 在 `Mac` 上則可透過 `tensorflow-metal`plugin 使用 GPU 加速

因此，在 Apple 平台上，真正需要思考的不是選擇 `Metal` 或 `CUDA`，而是使用的框架透過哪條路徑利用 Apple GPU 算力。

## 6.3 ROCm

`ROCm` 是 AMD 的開放 GPU 軟體堆疊。

以簡單方式來說，可以將它理解為：
**讓深度學習框架能在 AMD GPU 環境中執行的一套基礎設施。**

它常和 `HIP` 一起出現，因為 `HIP` 是 AMD 在可移植 GPU 程式開發上很重要的一層。

對深度學習使用者而言，不必背誦 `ROCm` 的所有底層細節，但應先知道：

- 如果你用 `AMD`GPU
- 又想讓 `PyTorch` 或其他框架使用 GPU

通常需要採用 `ROCm` 這條技術路徑。

![CUDA、Metal、ROCm 的角色定位](/assets/images/260316/cuda-metal-rocm-positioning.svg)

_圖：三者都在加速平台層，但對應的硬體生態與常見使用方式不同。_

如果本節只保留一句話，可以記住：

**`CUDA`、`Metal` 與 `ROCm` 不是用來定義模型，而是處理模型底層的硬體加速。**

---

# 7. CUDA、Metal、ROCm 能否彼此相容

這一節的概念最容易被說明得過度簡化。

直接宣稱三者彼此相容並不精確。
但若宣稱它們完全不相容，又會忽略實際存在的部分可移植性。

較準確的說法是：

**它們並非直接互通的同一套平台，但在某些層次上，確實存在抽象、移植或語意對應。**

關鍵在於先釐清正在討論哪個層次的相容性。

![相容性具有不同層次：框架抽象、原始碼移植與 Runtime 互通必須分開理解](/assets/images/260316/compatibility-vs-portability.svg)

_圖：人們所說的相容性，可能指涉不同層次的問題。_

## 7.1 框架層抽象

這是最容易造成誤解的地方。

以 `PyTorch` 為例，官方的 ROCm/HIP 說明裡明確提到：
ROCm 版本會重用很多 `torch.cuda` 介面。

這代表在 `PyTorch` 框架層，許多程式碼看起來相似，甚至不需要大幅修改。

但這不代表：

- `CUDA` 和 `ROCm` 底層完全一樣
- `NVIDIA` 的 binary 可以直接在 `ROCm` 上跑

因此，更合適的理解是：
**框架將部分底層差異抽象化。**

## 7.2 原始碼可移植

`HIP` 是原始碼可移植性的典型例子。

AMD 官方寫得很清楚，`HIP` 的目標之一，是幫助把部分 `CUDA` 程式移植到 AMD GPU，也提供 `hipify` 這類工具輔助轉換。

因此，在這個層次可以說：

- `CUDA` 和 `ROCm/HIP` 有部分可移植性

但請注意，這裡指的是：

- 原始碼層的移植

不是：

- runtime 完全互通
- 一份 Binary 可以直接在所有平台執行

## 7.3 runtime / binary 互通

到了這個層次，就不應過度樂觀。

`CUDA`、`Metal` 與 `ROCm` 各自具有不同的 Runtime、Driver、生態系與硬體相依性。

較直接的說法是：

- 不是三者可以直接互換執行
- 更不是同一個編譯結果到處跑

尤其 `Metal` 比較不像 `HIP` 這種「幫你做 CUDA 程式移植」的角色。
`Metal` 更接近 Apple 生態系特有的加速路徑，通常由 `PyTorch MPS` 或 `tensorflow-metal` 等框架端整合功能連接。

本節可以總結為一句話：

**`CUDA`、`Metal`、`ROCm` 不是直接互通，但在框架抽象層與部分可移植工具層，確實存在一定程度的銜接。**

# 8. 這兩個層次如何連接

綜合前文，可以用下表理解：

| 你的硬體環境 | 你常用的框架層 | 常見加速路徑 | 實際理解方式 |
| --- | --- | --- | --- |
| `NVIDIA`GPU PC / 工作站 | `PyTorch`/`TensorFlow` | `CUDA` | 最常見的桌面 GPU 深度學習路徑 |
| 配備 Apple Silicon 的 `Mac` | `PyTorch` | `MPS / Metal` | 透過 Apple 提供的 Backend 使用 GPU |
| 配備 Apple Silicon 的 `Mac` | `TensorFlow` | `tensorflow-metal` | 透過 Plugin 連接 Apple GPU 加速 |
| `AMD`GPU 環境 | `PyTorch`/ 其他支援框架 | `ROCm` | 走 AMD 自己的加速堆疊 |

這張表要強調的是前文反覆說明的觀念：

**大多數初學者不是先選擇 `CUDA / Metal / ROCm`，而是先受到現有硬體環境影響。**

所以如果你今天拿的是：

- 一台 `NVIDIA`GPU PC
- 一台 `MacBook`
- 一張 `AMD` 顯卡的工作站

後續接觸的加速平台層便會有很大差異。

# 9. 初學者應該如何選擇

本節將內容歸納成一組判斷規則。

## 9.1 先確認學習目標是深度學習還是硬體堆疊

如果你現在主要目標是：

- 理解 tensor
- 理解 forward / backward
- 理解訓練 loop
- 理解模型如何收斂

建議先將重心放在 `框架層`，不要一開始就將所有精力投入 Driver 與 Backend。

## 9.2 如果你重點是建立直覺

可以優先從 `PyTorch` 開始。

因為它通常能較直接地呈現：

- model 在做什麼
- loss 在做什麼
- optimizer 在做什麼
- 一次訓練步驟中實際發生哪些運算

## 9.3 如果你想快速走標準高階流程

可以從 `TensorFlow / Keras` 開始。

尤其如果你想先快速做出一條：

- 定義模型
- fit
- evaluate
- save / deploy

對這類較完整的標準工作流程而言，`TensorFlow / Keras` 通常更加自然。

## 9.4 如何理解硬體平台

- 使用 `NVIDIA`GPU：幾乎一定會接觸 `CUDA`。
- 主要使用 `Mac`：需要理解 `Metal` 在整個技術堆疊中的位置。
- 使用 `AMD`GPU：需要釐清 `ROCm` 這條技術路徑。

## 9.5 一個很實際的建議

在入門階段使用小型模型與教學範例時，未必需要一開始就完成整套 GPU Stack 設定。

許多人真正遇到的問題不是：

- `CUDA` 裝不裝得好

而是以下基礎概念：

- tensor shape 看不懂
- loss function 不知道在優化什麼
- 不知道如何解讀過度擬合
- train / validation / test 分不清楚

因此，初學者可以依照以下順序學習：

1. 先理解深度學習工作流程。
2. 再熟悉一個框架。
3. 最後補足加速平台層的知識。

# 10. 結論

如果將本文濃縮成一句話，可以這樣總結：

**`PyTorch / TensorFlow` 屬於框架層，`CUDA / Metal / ROCm` 屬於加速平台層。**

前者在回答：
模型如何被定義、訓練與更新。

後者在回答：
模型底層如何利用 GPU 算力。

而所謂的相容性，也不能只用「可以」或「不可以」概括。
至少需要先區分：

- 框架 API 的抽象。
- 原始碼的可移植性。
- Runtime / Binary 的直接互通。

清楚區分這兩層後，許多看似混亂的問題就會變得簡單：

- 為什麼 `PyTorch` 與 `CUDA` 不屬於同一層？
- 為什麼在 `Mac` 上討論的是 `Metal` 路徑？
- 為什麼 `ROCm/HIP` 經常與 `CUDA` 比較？
- 為什麼某些程式碼在不同平台幾乎不必修改，底層卻不是同一套技術？

換句話說，真正應先學會的不是選邊站，而是 `分層理解`。
