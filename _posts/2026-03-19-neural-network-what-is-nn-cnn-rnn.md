---
layout: post
title: 神經網路是什麼？從學習原理到 NN、CNN、RNN 的入門與實作
subtitle: 先以淺顯方式說明神經網路如何學習，再用 PyTorch 完成三個可執行的最小範例
author: Paul Jiang
categories: AI
tags: AI Neural-Network Deep-Learning PyTorch NN CNN RNN Backpropagation MNIST
sidebar: []
excerpt_image: /assets/images/260319/nn-cnn-rnn-comparison.svg
---

> 本文提到的 `PyTorch`（深度學習框架）範例與教材連結，以我在 **2026 年 3 月 20 日** 查閱 [Teaching-Resource](https://github.com/jiangphtw/Teaching-Resource) GitHub 儲存庫時的內容為準。日後檔案位置或套件版本可能有所調整。

許多人初次接觸神經網路時，通常會有兩項疑問。

- 神經網路究竟在學什麼？
- `NN`、`CNN` 與 `RNN` 有何差異？

如果一開始只列出大量公式，讀者通常更難掌握整體概念。因此，本文會先說明神經網路最經典的基本架構，再介紹 `NN`（本文以標準神經網路／`MLP` 為代表）、`CNN`（卷積神經網路）與 `RNN`（循環神經網路）的資料流。最後，我會使用 `PyTorch`（深度學習框架）及 [Teaching-Resource](https://github.com/jiangphtw/Teaching-Resource) 儲存庫中的三個最小範例，實際完成整套流程。

本文的核心概念可以濃縮成一句話：

**神經網路是一個反覆進行預測、衡量誤差及修正參數的函數。**

---

# 1. 神經網路為什麼是 AI 的核心技術

我不會將神經網路視為神祕的黑盒子，而會把它理解為一種通用的表示學習工具：它能自行從資料中學得有用的特徵表示，不必由人為逐一編寫所有規則。

這正是神經網路成為許多 `AI`（人工智慧）應用基礎的原因：

- 影像分類、物件偵測、影像分割
- 語音辨識、語音生成
- 文字分類、翻譯、問答、語言模型
- 時間序列預測、感測器資料分析

其中最重要的觀念是：

**神經網路的重要性不只在於能進行分類或預測，還在於它擅長從大量資料中自行學得可用的表示。**

![神經網路在 AI 裡的位置](/assets/images/260319/neural-network-importance.svg)

_圖：神經網路可視為多種 AI 任務共用的學習引擎。表層呈現的是任務差異，底層反覆運作的則是表示學習、參數更新與推論流程。_

---

# 2. 神經網路如何學習

若以最淺顯的方式說明，神經網路的學習流程如下：

1. 將輸入資料送入模型
2. 由模型產生一次預測
3. 比較預測結果與正確答案
4. 計算預測誤差
5. 根據誤差反向修正參數

換句話說，神經網路並非一開始就知道答案，而是透過大量、反覆的誤差修正逐步學習。

## 2.1 先看最經典的骨架：輸入層、隱藏層、輸出層

在說明訓練流程前，應先理解最經典的神經網路結構。初學者經常先接觸神經元、權重與損失函數等名詞，卻缺乏完整的網路架構圖，因此不易串連後續概念。

最基本的架構包含以下三層：

- `Input Layer`（輸入層）：接收原始資料
- `Hidden Layer`（隱藏層）：產生及轉換資料的中間表示
- `Output Layer`（輸出層）：輸出最終的分類結果、分數或預測值

![經典神經網路層結構](/assets/images/260319/neural-network-layers.svg)

_圖：神經網路可視為逐層傳遞訊號的模型。輸入層接收資料，隱藏層逐步轉換表示，輸出層則產生最終結果。_

可以從以下角度理解三者的功能：

- 輸入層不進行特徵轉換，只負責接收資料
- 隱藏層負責處理資料並學習特徵表示
- 輸出層將最後的內部表示轉換成所需答案

## 2.2 一個神經元在計算什麼

若將整個神經網路拆解成最小單位，可以先記住以下公式：

```text
y = activation(Wx + b)
```

各項符號的意義如下：

- `x` 是輸入
- `W` 是 `Weight`（權重）
- `b` 是 `Bias`（偏差）
- `activation(...)` 是 `Activation Function`（活化函數）
- `y` 是輸出

模型會先對輸入進行加權組合，再透過活化函數決定訊號應被放大、保留或抑制。

## 2.3 訓練流程如何運作

當大量神經元堆疊成網路後，訓練流程如下圖所示：

![神經網路的學習原理](/assets/images/260319/neural-network-learning-principle.svg)

_圖：神經網路訓練包含一套固定流程：輸入資料、產生預測、以損失函數衡量誤差、透過反向傳播回傳誤差，最後更新權重。_

初學者應先熟悉圖中的下列名詞：

- `Weight`（權重）：每條連線的重要程度
- `Bias`（偏差）：讓模型有額外平移能力的參數
- `Activation Function`（活化函數）：讓模型能表達非線性關係
- `Loss Function`（損失函數）：量化模型的預測誤差
- `Backpropagation`（反向傳播）：將誤差由後往前傳回各層
- `Optimizer`（最佳化器）：根據誤差更新權重的規則

整個學習原理可以再濃縮成一句話：

**神經網路學習的不是答案本身，而是「哪些參數組合能讓誤差持續降低」。**

## 2.4 什麼是 `Batch` 與 `Epoch`

執行後續範例時會反覆看到以下三個名詞，因此需要先加以說明。

- `Batch`（批次）：每次用多少筆資料更新參數
- `Epoch`（訓練輪數）：完整使用一次全部訓練資料
- `Learning Rate`（學習率）：每次更新參數的幅度

可以用以下方式記憶：

- `Batch` 決定每次處理多少資料
- `Epoch` 決定整份資料要重複處理幾輪
- `Learning Rate` 決定每次調整參數的幅度

因此，若後續看到程式輸出：

```text
Epoch 01 | train_loss=...
```

這表示模型已完整處理一輪資料，並回報目前在訓練集上的損失值。

---

# 3. 神經網路的三大經典類型：標準 NN、CNN、RNN

首先必須說明：**本文介紹的三大經典類型只構成入門版圖，並非現今所有模型架構的完整分類。**

之所以先介紹這三類模型，是因為它們分別對應三種典型的資料處理方式：

- 標準 `NN`：把輸入看成固定長度特徵向量
- `CNN`（卷積神經網路）：把輸入看成有空間結構的資料
- `RNN`（循環神經網路）：把輸入看成有順序的序列

![NN、CNN、RNN 的比較圖](/assets/images/260319/nn-cnn-rnn-comparison.svg)

_圖：這三類模型可依資料結構區分。模型並無高下之分，應根據資料的形式選擇較合適的架構。_

## 3.1 標準 `NN`：把資料先整理成特徵向量

本文所稱的標準 `NN`，主要以 `MLP`（多層感知器）為代表。

其典型用法是先將輸入整理成固定長度的特徵向量，再交由多個全連接層逐層轉換。

![標準 NN 的資料流](/assets/images/260319/nn-flowchart.svg)

_圖：標準 `NN` 會先將資料整理成一組特徵，再交由全連接層重新組合。_

這種模型很適合：

- 表格資料
- 已經整理好的數值特徵
- 入門理解神經網路訓練流程

但它也有明顯限制：如果資料本身具有空間或順序結構，純 `MLP` 不一定是最合適的起點。

## 3.2 `CNN`：先抓局部，再組成整體

`CNN` 最經典的應用場景是影像處理。它會先檢視局部區域，擷取邊緣、紋理與局部形狀，再逐步組合成整體表示。

![CNN 的資料流](/assets/images/260319/cnn-flowchart.svg)

_圖：`CNN` 可視為一套影像特徵擷取流程。影像不會一開始就被攤平，而會先經過卷積與池化，再交由分類器處理。_

因此，`CNN` 很適合影像任務：

- 它保留了空間結構
- 它會先擷取局部模式
- 它不會一開始就將整張影像視為一串彼此獨立的數字

## 3.3 `RNN`：逐步處理序列

`RNN` 的關鍵特性是保留前一步的狀態，並將其傳遞至下一步。

因此，當資料不是單張影像，而是文字、語音或時間序列等具有前後依賴關係的內容時，`RNN` 便是直觀的處理方式。

![RNN 的資料流](/assets/images/260319/rnn-flowchart.svg)

_圖：`RNN` 可視為沿時間軸向前處理資料的序列流程。每個步驟都會保留先前資訊，並用於預測下一步。_

這裡必須先釐清：**本文使用 `RNN` 是為了教學，並不表示現今大型語言模型仍以 `RNN` 為主流。**

大型文字理解與生成模型通常已採用 `Transformer`（轉換器架構）。不過，若要理解模型如何逐步處理序列，`RNN` 仍是很好的學習起點。

---

# 4. 使用 GitHub 教材建立 `PyTorch` 實作環境

接下來，我會透過三個最小範例實作前述概念，並使用另外整理的 GitHub 教材儲存庫：

- [Teaching-Resource 儲存庫](https://github.com/jiangphtw/Teaching-Resource)
- [ai/Neural-Network 教材目錄](https://github.com/jiangphtw/Teaching-Resource/tree/main/ai/Neural-Network)

本文採用一條固定的操作路徑：先複製儲存庫，再進入 `ai` 目錄啟用 `.venv`，最後切換至 `Neural-Network` 目錄並執行三個腳本。

![PyTorch 實作地圖](/assets/images/260319/pytorch-neural-network-course-map.svg)

_圖：本文的實作路徑是先複製 `Teaching-Resource`，再進入 `ai` 目錄啟用 `.venv`，最後切換至 `Neural-Network` 目錄執行三個範例。_

若要在 Windows PowerShell 中執行，可使用以下指令：

```powershell
git clone https://github.com/jiangphtw/Teaching-Resource.git
cd Teaching-Resource/ai
.\.venv\Scripts\Activate.ps1
cd .\Neural-Network
```

若尚未建立 `.venv`，才需要先執行以下指令：

```powershell
git clone https://github.com/jiangphtw/Teaching-Resource.git
cd Teaching-Resource/ai
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
cd .\Neural-Network
```

## 4.1 關鍵背景：什麼是 `MNIST`

在執行 `NN` 與 `CNN` 範例前，需要先認識 `MNIST`（手寫數字影像資料集）。

`MNIST` 是經典的入門資料集，具有以下特性：

- 0 到 9 的手寫數字
- 每張影像的尺寸為 `28 × 28`
- 灰階影像
- 任務通常是做 10 類分類

本文選用 `MNIST`，並非因為它最先進，而是因為它很適合比較不同模型的資料處理方式：

- 將影像攤平成 `784` 維向量後，可用於 `MLP`
- 保留影像結構時，則可用於 `CNN`

因此，它很適合幫助初學者理解：

**不同模型如何理解同一份資料。**

![MNIST 真實樣本圖](/assets/images/260319/mnist-sample-grid.png)

_圖：`MNIST`（手寫數字影像資料集）的實際樣本。每張影像都是 `28 × 28` 的灰階手寫數字，本文以此比較 `MLP` 與 `CNN`。圖片來源：MNIST 資料集。_

---

# 5. `NN` 實作：用 `MNIST` 做全連接分類

這個範例將說明四個重點：

- `MLP` 如何處理固定長度的向量
- 如何將影像攤平成向量
- `forward → loss → backward → update` 訓練流程如何運作
- 如何解讀 `train_loss`、`train_acc` 與 `test_acc`

執行方式：

```powershell
cd Teaching-Resource/ai
.\.venv\Scripts\Activate.ps1
cd .\Neural-Network
python nn_example.py --epochs 1
```

## 5.1 範例資料如何進入模型

這個範例會先讀取 `MNIST` 影像，再進行以下兩項操作：

- 使用 `torchvision`（PyTorch 視覺資料工具）下載並讀取資料
- 在模型內將每張 `28 × 28` 影像攤平成 `784` 維向量

核心程式碼如下：

```python
class MLP(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Linear(28 * 28, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 10),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)
```

這段程式碼可解讀為：

- `nn.Flatten()` 先將影像攤平
- 第一個 `Linear` 層把 784 維映射到 128 維
- 中間使用 `ReLU`（修正線性單元活化函數）
- 最後輸出 10 維，對應 0 到 9

## 5.2 比較基準版與增加訓練輪數後的結果

以下列出兩組實測結果。第一組是只執行 `1 epoch` 的 `baseline`（基準版）；第二組只將 `epochs` 增加至 `5`。

| 版本 | 執行命令 | 主要結果 |
| --- | --- | --- |
| baseline | `python nn_example.py --epochs 1` | `train_loss=1.5016 train_acc=0.6371 \| test_loss=0.7992 test_acc=0.7622` |
| 調整後 | `python nn_example.py --epochs 5` | `train_loss=0.2483 train_acc=0.9336 \| test_loss=0.3461 test_acc=0.8970` |

這兩組數據可解讀為：

- `train_loss` 從 `1.5016` 降至 `0.2483`，表示模型在訓練資料上的平均誤差明顯降低
- `test_acc` 從 `0.7622` 提升至 `0.8970`，表示模型分類未見數字的能力也明顯改善
- 僅將訓練輪數從 `1` 增加至 `5`，這個小型 `MLP` 就能更穩定地學習固定長度的特徵向量

若以一句話概括這項結果：

**這個 `NN` 範例顯示，同一個模型增加資料訓練輪數後，基本分類能力便能顯著改善。**

但要注意，這裡只調整了 `epochs`，而且使用的資料仍是小型 `subset`（子集合）。因此，這組比較旨在呈現增加訓練輪數後的改善，並非嚴格的模型效能評比。

---

# 6. `CNN` 實作：用 `MNIST` 做卷積分類

這個範例將說明四個重點：

- 為何 `CNN` 不會一開始就將整張影像攤平
- 卷積層如何先擷取局部模式
- 池化如何逐步縮小空間尺寸
- 如何解讀此處的 `train_acc` 與 `test_acc`

執行方式：

```powershell
cd Teaching-Resource/ai
.\.venv\Scripts\Activate.ps1
cd .\Neural-Network
python cnn_example.py --epochs 1
```

## 6.1 範例資料如何進入模型

這個範例使用同一份 `MNIST` 資料，但模型不會直接攤平影像，而是先經過卷積層。

核心程式碼如下：

```python
class SmallCNN(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(32 * 7 * 7, 64),
            nn.ReLU(),
            nn.Linear(64, 10),
        )
```

這段模型可分成兩部分理解：

- `features`：先進行卷積與池化，從影像中擷取局部特徵
- `classifier`：將擷取出的特徵交由分類器處理

這正是 `CNN` 與前述 `MLP` 最大的差異：
它不會將影像視為 784 個彼此無關的數字，而會先保留其空間結構。

## 6.2 比較基準版與調整後的結果

以下同樣列出兩組實測結果。第一組是只執行 `1 epoch` 的 `baseline`（基準版），第二組則將 `epochs` 增加至 `5`。

| 版本 | 執行命令 | 主要結果 |
| --- | --- | --- |
| baseline | `python cnn_example.py --epochs 1` | `train_loss=1.5915 train_acc=0.5420 \| test_loss=0.8104 test_acc=0.7477` |
| 調整後 | `python cnn_example.py --epochs 5` | `train_loss=0.2234 train_acc=0.9363 \| test_loss=0.2509 test_acc=0.9102` |

這些數據可解讀為：

- `train_loss` 從 `1.5915` 降至 `0.2234`
- `test_acc` 從 `0.7477` 提升至 `0.9102`
- 這表示小型 `CNN` 增加訓練輪數後，確實更能將影像中的局部模式轉化為有效的分類能力

這組結果也呈現 `CNN` 相較於 `MLP` 的優勢：它不會一開始就攤平影像，而是先保留空間位置，再進行卷積與池化。

不應只根據 `1 epoch` 的數據過早下結論，因為這仍是最小示範：

- 模型很小
- 資料只取子集合
- 訓練輪數很少

更重要的觀察是：**增加訓練輪數後，`CNN` 比 `MLP` 更明顯地發揮影像空間結構的優勢。**

---

# 7. `RNN` 實作：以小型文字 `corpus`（語料）進行下一字元預測

這個範例將說明四個重點：

- 序列資料如何逐步進入模型
- `RNN` 如何將先前資訊傳遞至後續步驟
- `train_loss` 為何會持續下降
- 生成文字不完全通順時，反映模型學到了哪些規律

執行方式：

```powershell
cd Teaching-Resource/ai
.\.venv\Scripts\Activate.ps1
cd .\Neural-Network
python rnn_example.py --epochs 5
```

## 7.1 範例資料如何進入模型

這個範例不另外下載大型資料集，而是直接在 `rnn_corpus.txt` 中放入一份小型文字 `corpus`（語料）。

模型會執行以下步驟：

- 先把字元轉成索引
- 將一小段字元序列切分為輸入與目標
- 讓模型根據先前字元預測下一個字元

核心程式碼如下：

```python
class CharRNN(nn.Module):
    def __init__(self, vocab_size: int) -> None:
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, 32)
        self.rnn = nn.RNN(32, 128, batch_first=True)
        self.output = nn.Linear(128, vocab_size)

    def forward(self, x, hidden=None):
        x = self.embedding(x)
        out, hidden = self.rnn(x, hidden)
        logits = self.output(out)
        return logits, hidden
```

這段模型可拆解為：

- `Embedding`（嵌入層）先把字元索引轉成向量
- `RNN` 核心層逐步處理序列
- `Linear` 層將每一步的 `hidden state`（隱藏狀態）轉換成下一個字元的分數

## 7.2 比較基準版與增加訓練輪數後的 `train_loss`

這個範例同樣列出兩組實測結果。比較重點不是 `accuracy`（準確率），而是 `train_loss`（訓練損失）與生成文字的品質。

| 版本 | 執行命令 | 主要結果 |
| --- | --- | --- |
| baseline | `python rnn_example.py --epochs 5` | `train_loss=2.0126`，生成文字大量重複，像 `the are the are ...` |
| 調整後 | `python rnn_example.py --epochs 20` | `train_loss=0.3826`，生成句子已更接近語料原本的節奏 |

`train_loss` 的意義可以用一句話說明：

`train_loss` 表示模型在訓練資料上預測下一個字元時的平均誤差。

因此，這兩組結果可解讀為：

- `2.0126` 表示模型只學到較粗略的局部規律，因此生成的句子會反覆停留在常見片段
- `0.3826` 表示模型對下一個字元的預測穩定許多，生成文字也開始接近原始語料的句型
- 這個範例顯示，序列模型並非一次處理完整句子，而是逐步累積上下文資訊

若以更淺顯的方式描述這個現象：

**當 `RNN` 的 `train_loss` 持續下降時，表示它不只是記住少數字元，而是逐漸掌握字元之間的順序規律。**

## 7.3 生成文字不通順代表什麼

執行完畢後，程式會輸出一段生成文字。本次實測結果如下：

```text
baseline（5 epochs）:
neural networks learn fron the are the are the are ...

調整後（20 epochs）:
neural networks learn fra ninger d ans fo be state of the art systems.
they are not meant to be state of the art systems.
```

第二段結果不能解讀為「模型已經理解語言」，但它確實比基準版更接近原始語料的節奏。這表示：

- 它學到更多常見單字片段
- 它開始保留較長的上下文
- 但它仍然沒有真正掌握穩定語意與長距離結構

因此，這個範例的重點不是產生流暢文字，而是說明：

**序列模型可以根據先前讀取的內容，逐步預測下一個字元。**

需要再次強調，本文使用 `RNN` 是為了教學，並不表示現今的大型語言模型仍依賴傳統 `RNN`。

---

# 8. 三個實作範例的重點

這三個範例可歸納為三項重點：

- `NN`／`MLP` 呈現最基本的神經網路訓練流程
- `CNN` 說明影像為何不應只被視為攤平向量
- `RNN` 說明序列模型如何逐步保留上下文

因此，這三個範例不是彼此取代的關係，而是三種入門視角：

- 若想先理解神經網路如何學習，可以從 `NN` 開始
- 若想理解如何擷取影像中的局部模式，可以從 `CNN` 開始
- 若想理解序列資料如何逐步進入模型，可以從 `RNN` 開始

學習神經網路時，與其先背誦大量新名詞，不如實際執行這三個經典流程。完成下列操作後：

1. 影像如何被攤平成向量
2. 影像如何經過卷積與池化
3. 序列如何逐步預測下一個字元

再進一步學習 `LSTM`、`Transformer` 或更現代的模型時，便能更容易串連相關概念。

---

# 9. 結語

全文可以總結為一句話：

**神經網路不是神祕的名詞，而是一套清楚的學習流程；`NN`、`CNN` 與 `RNN` 則是處理不同資料結構的三種經典架構。**

建議依照以下順序實際操作一次：

1. 先看輸入層、隱藏層、輸出層
2. 再了解訓練流程如何回傳誤差
3. 接著執行 `nn_example.py`
4. 再執行 `cnn_example.py`
5. 最後執行 `rnn_example.py`

如此一來，學到的就不只是三個模型名稱，而是一條從向量、影像到序列的完整入門路徑。
