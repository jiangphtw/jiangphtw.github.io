---
layout: post
title: 神經網路是什麼？從學習原理到 NN、CNN、RNN 的入門與實作
subtitle: 我會先用白話把神經網路怎麼學講清楚，再用 PyTorch 做三個能跑的最小範例。
author: Paul Jiang
categories: AI
tags: AI Neural-Network Deep-Learning PyTorch NN CNN RNN Backpropagation MNIST
sidebar: []
excerpt_image: /assets/images/260319/nn-cnn-rnn-comparison.svg
---

> 本文提到的 `PyTorch`（深度學習框架）範例與教材連結，以我在 **2026 年 3 月 20 日** 查閱 [Teaching-Resource](https://github.com/jiangphtw/Teaching-Resource) 這個 GitHub repo 時的內容為準。之後檔案位置或套件版本可能調整。

很多人第一次碰到神經網路時，常常會有兩種混亂。

- 第一種混亂是：神經網路到底在學什麼？
- 第二種混亂是：`NN`、`CNN`、`RNN` 到底差在哪裡？

如果我只丟一堆公式，讀者通常只會更亂。所以這篇我想做的事情很單純：我先把神經網路最經典的骨架講清楚，再把 `NN`（這篇先用標準神經網路 / `MLP` 當代表）、`CNN`（卷積神經網路）、`RNN`（循環神經網路） 的資料流講清楚，最後用 `PyTorch`（深度學習框架）搭配 [Teaching-Resource](https://github.com/jiangphtw/Teaching-Resource) repo 裡的三個最小範例，把這條路線真的跑一遍。

我自己會把這篇的主線抓成一句話：

**神經網路其實就是一個不斷猜測、量誤差、回頭修正參數的函數。**

---

# 1. 神經網路為什麼是 AI 的核心技術

我自己不會把神經網路看成某一種很神祕的黑盒子。我比較習慣把它看成一種很通用的表示學習工具：它可以從資料裡自己學出有用的特徵表示，而不是所有規則都要人手刻。

這也是為什麼它會變成很多 `AI`（人工智慧）應用的基礎：

- 影像分類、物件偵測、影像分割
- 語音辨識、語音生成
- 文字分類、翻譯、問答、語言模型
- 時間序列預測、感測器資料分析

如果我要先講一句最重要的話，我會這樣說：

**神經網路的重要性，不只是它能做分類或預測，而是它很擅長從大量資料裡自己學出可用的表示。**

![神經網路在 AI 裡的位置](/assets/images/260319/neural-network-importance.svg)

_圖：我自己會把神經網路看成很多 AI 任務底下共同的學習引擎。上面看到的是任務差異，下面真正反覆出現的是表示學習、參數更新和推論流程。_

---

# 2. 神經網路怎麼學

如果先把一切縮到最白話，我會這樣理解神經網路：

1. 先把輸入丟進模型
2. 模型先做一次預測
3. 拿預測和正確答案比較
4. 算出自己錯多少
5. 再把這個錯誤回頭拿去修正參數

也就是說，神經網路不是一開始就知道答案，而是靠大量重複的錯誤修正慢慢學會。

## 2.1 先看最經典的骨架：輸入層、隱藏層、輸出層

在正式講訓練流程之前，我覺得先把最經典的神經網路結構看懂很重要。很多人一開始只聽到神經元、權重、損失函數，但腦中沒有一張「整個網路長什麼樣」的圖，後面就很容易散掉。

我自己最習慣的起點，就是這三層：

- `Input Layer`（輸入層）：接收原始資料
- `Hidden Layer`（隱藏層）：把資料做中間表示與轉換
- `Output Layer`（輸出層）：輸出最後的分類、分數或預測值

![經典神經網路層結構](/assets/images/260319/neural-network-layers.svg)

_圖：我自己會先把神經網路看成一層一層傳遞訊號的模型。輸入層先收資料，隱藏層逐步轉換表示，輸出層再給出最後結果。_

如果用最常見的角度理解：

- 輸入層不負責思考，它只是把資料送進去
- 隱藏層才是模型真正「消化資料」的地方
- 輸出層則把最後的內部表示翻成你要的答案

## 2.2 一個神經元到底在算什麼

如果把整個神經網路縮成一個最小單位，我自己會先記這個式子：

```text
y = activation(Wx + b)
```

這裡的意思其實沒有那麼玄：

- `x` 是輸入
- `W` 是 `Weight`（權重）
- `b` 是 `Bias`（偏差）
- `activation(...)` 是 `Activation Function`（激活函數）
- `y` 是輸出

我自己會把它理解成：模型先把輸入做加權組合，再決定這個訊號要不要被放大、保留或壓掉。

## 2.3 訓練流程怎麼跑

當很多神經元疊在一起之後，真正的訓練流程就會長得像下面這樣：

![神經網路的學習原理](/assets/images/260319/neural-network-learning-principle.svg)

_圖：我自己會把神經網路訓練理解成一條固定流程。資料進來、模型預測、損失衡量錯誤、反向傳播把誤差回傳，最後再更新權重。_

這張圖裡的幾個名詞，是我覺得入門一定要先有印象的：

- `Weight`（權重）：每條連線的重要程度
- `Bias`（偏差）：讓模型有額外平移能力的參數
- `Activation Function`（激活函數）：讓模型能表現非線性關係
- `Loss Function`（損失函數）：用來量化模型錯多少
- `Backpropagation`（反向傳播）：把誤差一路往前面各層回傳
- `Optimizer`（優化器）：根據誤差去更新權重的規則

如果我要把整個學習原理再壓成一句話，我會這樣講：

**神經網路學的不是答案本身，而是「哪些參數組合可以讓錯誤越來越小」。**

## 2.4 `Batch`、`Epoch` 到底是什麼

這一段我也想順手講清楚，因為後面跑範例時你一定會看到它們。

- `Batch`（批次）：一次拿多少筆資料來更新參數
- `Epoch`（訓練輪數）：整份訓練資料完整跑過一次
- `Learning Rate`（學習率）：每次更新參數時步伐多大

我自己會這樣記：

- `Batch` 決定一次看多少資料
- `Epoch` 決定整份資料重複看幾輪
- `Learning Rate` 決定每次改參數改多大

所以如果後面你看到程式印出：

```text
Epoch 01 | train_loss=...
```

它的意思就是：模型已經把這一輪資料完整看完一次，並回報目前在訓練集上的損失表現。

---

# 3. 神經網路的三大經典類型：標準 NN、CNN、RNN

這裡我先講一個前提：**我這裡說的三大經典類型，是入門版圖，不是今天所有模型架構的完整地圖。**

我自己之所以還是喜歡先從這三個講起，是因為它們剛好對應三種很典型的資料理解方式：

- 標準 `NN`：把輸入看成固定長度特徵向量
- `CNN`（卷積神經網路）：把輸入看成有空間結構的資料
- `RNN`（循環神經網路）：把輸入看成有順序的序列

![NN、CNN、RNN 的比較圖](/assets/images/260319/nn-cnn-rnn-comparison.svg)

_圖：我自己會先用資料結構去分這三類模型。不是誰比較高級，而是資料長什麼樣，決定哪種模型比較自然。_

## 3.1 標準 `NN`：把資料先整理成特徵向量

我這裡說的標準 `NN`，主要是拿 `MLP`（多層感知器）當代表。

它最自然的用法是：先把輸入整理成固定長度的特徵向量，然後交給全連接層一層一層做轉換。

![標準 NN 的資料流](/assets/images/260319/nn-flowchart.svg)

_圖：我自己會把標準 `NN` 理解成「先把資料整理成一串特徵，再交給全連接層重新組合」。_

這種模型很適合：

- 表格資料
- 已經整理好的數值特徵
- 入門理解神經網路訓練流程

但它的限制也很明顯：如果資料原本有空間結構或順序結構，純 `MLP` 不一定是最自然的起點。

## 3.2 `CNN`：先抓局部，再組成整體

`CNN` 最經典的場景就是影像。我自己會把它理解成：先看小區塊，先抓邊緣、紋理、局部形狀，再慢慢組成整體理解。

![CNN 的資料流](/assets/images/260319/cnn-flowchart.svg)

_圖：我自己會把 `CNN` 看成一條影像特徵萃取流程。影像不是一開始就攤平，而是先經過卷積和池化，再交給分類器。_

這也是為什麼 `CNN` 在影像任務裡很自然：

- 它保留了空間結構
- 它先抓局部模式
- 它不是一開始就把整張圖當成一串獨立數字

## 3.3 `RNN`：一步一步吃序列

`RNN` 的關鍵在於：它會保留前一步的狀態，然後帶到下一步。

所以如果今天資料不是一張圖，而是一串有前後依賴的內容，像文字、語音、時間序列，`RNN` 的思路就很自然。

![RNN 的資料流](/assets/images/260319/rnn-flowchart.svg)

_圖：我自己會把 `RNN` 理解成一條沿著時間往前走的序列流程。每一步都保留一點前面的資訊，再用它去預測下一步。_

我也想先講清楚一件事：**我這裡用 `RNN` 是為了教學，不是要說今天大型語言模型主流還是 `RNN`。**

如果今天是大型文字理解與生成，主線通常已經是 `Transformer`（轉換器架構）。但如果我要教一個人理解「模型怎麼一步一步處理序列」，`RNN` 仍然是很好的起點。

---

# 4. 用 GitHub 教材在 `PyTorch` 中建立實作環境

接下來我想把前面的概念落到三個最小範例上。這次我會直接用我另外整理的 GitHub 教材 repo：

- [Teaching-Resource repo](https://github.com/jiangphtw/Teaching-Resource)
- [ai/Neural-Network 教材目錄](https://github.com/jiangphtw/Teaching-Resource/tree/main/ai/Neural-Network)

我這篇文章只講一條正式操作路徑：先把 repo clone 下來，再進 `ai` 啟用 `.venv`，最後切到 `Neural-Network` 跑三個腳本。

![PyTorch 實作地圖](/assets/images/260319/pytorch-neural-network-course-map.svg)

_圖：我這篇文章的實作路徑是先 clone `Teaching-Resource`，再進 `ai` 啟用 `.venv`，最後切到 `Neural-Network` 執行三個範例。_

如果要在 Windows PowerShell 執行，我現在會這樣做：

```powershell
git clone https://github.com/jiangphtw/Teaching-Resource.git
cd Teaching-Resource/ai
.\.venv\Scripts\Activate.ps1
cd .\Neural-Network
```

如果你的 `.venv` 還沒建，才需要先做：

```powershell
git clone https://github.com/jiangphtw/Teaching-Resource.git
cd Teaching-Resource/ai
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
cd .\Neural-Network
```

## 4.1 先補一個關鍵背景：`MNIST` 是什麼

在正式跑 `NN` 和 `CNN` 範例之前，我覺得一定要先補 `MNIST`（手寫數字影像資料集）。

`MNIST` 是一個非常經典的入門資料集，內容是：

- 0 到 9 的手寫數字
- 每張圖大小是 `28 x 28`
- 灰階影像
- 任務通常是做 10 類分類

我自己這裡選 `MNIST` 的原因不是因為它最先進，而是因為它很適合做對照：

- 如果把圖攤平成 `784` 維向量，就可以拿來做 `MLP`
- 如果保留影像結構，就可以拿來做 `CNN`

所以它很適合幫初學者看懂：

**同一份資料，不同模型到底在怎麼理解它。**

![MNIST 真實樣本圖](/assets/images/260319/mnist-sample-grid.png)

_圖：這是 `MNIST`（手寫數字影像資料集）的真實樣本。每張圖都是 `28 x 28` 灰階手寫數字，這篇我會拿它來對照 `MLP` 和 `CNN`。圖片來源：MNIST dataset。_

---

# 5. `NN` 實作：用 `MNIST` 做全連接分類

這個例子我想讓讀者看懂四件事：

- `MLP` 怎麼吃固定長度向量
- 影像怎麼被攤平成向量
- 訓練流程 `forward -> loss -> backward -> update` 怎麼跑
- `train_loss`、`train_acc`、`test_acc` 應該怎麼看

執行方式：

```powershell
cd Teaching-Resource/ai
.\.venv\Scripts\Activate.ps1
cd .\Neural-Network
python nn_example.py --epochs 1
```

## 5.1 這個範例的資料怎麼進模型

這個範例會先把 `MNIST` 影像讀進來，然後做兩件事：

- 用 `torchvision`（PyTorch 視覺資料工具）下載並讀資料
- 把每張 `28 x 28` 的圖在模型內攤平成 `784` 維向量

核心片段長這樣：

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

我自己會這樣解讀：

- `nn.Flatten()` 先把圖攤平
- 第一個 `Linear` 層把 784 維映射到 128 維
- 中間穿插 `ReLU`（修正線性單元激活函數）
- 最後輸出 10 維，對應 0 到 9

## 5.2 先看 baseline，再看多跑幾輪之後的差異

我這裡直接放兩組我自己實測的結果。第一組是 `baseline`（基準版），也就是只跑 `1 epoch`；第二組是只改 `epochs`，把它拉到 `5`。

| 版本 | 執行命令 | 主要結果 |
| --- | --- | --- |
| baseline | `python nn_example.py --epochs 1` | `train_loss=1.5016 train_acc=0.6371 \| test_loss=0.7992 test_acc=0.7622` |
| 調整後 | `python nn_example.py --epochs 5` | `train_loss=0.2483 train_acc=0.9336 \| test_loss=0.3461 test_acc=0.8970` |

我自己會這樣看這兩組數字：

- `train_loss` 從 `1.5016` 掉到 `0.2483`，代表模型在訓練資料上平均錯得少很多
- `test_acc` 從 `0.7622` 拉到 `0.8970`，代表模型對沒看過的數字也明顯更會分
- 光是把訓練輪數從 `1` 拉到 `5`，這個小 `MLP` 就能更穩定地把固定長度特徵向量學起來

如果我要把這段翻成一句最白話的話，我會說：

**這個 `NN` 範例最先教會我的，不是神經網路很神，而是同一個模型只要多看幾輪資料，最基本的分類能力就會變得更完整。**

但我也會提醒自己：這裡只改了 `epochs`，而且資料仍然是小型 `subset`（子集合）。所以這組比較比較像是「看懂訓練會怎麼改善」，不是在做嚴格模型競賽。

---

# 6. `CNN` 實作：用 `MNIST` 做卷積分類

這個例子我想讓讀者看懂四件事：

- 為什麼 `CNN` 不會一開始就把整張圖攤平
- 卷積層怎麼先抓局部模式
- 池化怎麼逐步縮小空間尺寸
- `train_acc`、`test_acc` 在這裡應該怎麼解讀

執行方式：

```powershell
cd Teaching-Resource/ai
.\.venv\Scripts\Activate.ps1
cd .\Neural-Network
python cnn_example.py --epochs 1
```

## 6.1 這個範例的資料怎麼進模型

這個範例用的是同一份 `MNIST`，但模型不再直接攤平圖片，而是先走卷積層。

核心片段長這樣：

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

我自己會把這段拆成兩半看：

- `features`：先做卷積和池化，從影像裡抓局部特徵
- `classifier`：再把抽出的特徵交給分類器

這也是 `CNN` 和前面 `MLP` 最大的差別：  
它沒有假裝影像只是 784 個互不相關的數字，而是先保留了空間結構。

## 6.2 baseline 和調整後結果要怎麼比較

我這裡同樣放兩組我自己實測的結果。第一組是只跑 `1 epoch` 的 `baseline`（基準版），第二組則是把 `epochs` 拉到 `5`。

| 版本 | 執行命令 | 主要結果 |
| --- | --- | --- |
| baseline | `python cnn_example.py --epochs 1` | `train_loss=1.5915 train_acc=0.5420 \| test_loss=0.8104 test_acc=0.7477` |
| 調整後 | `python cnn_example.py --epochs 5` | `train_loss=0.2234 train_acc=0.9363 \| test_loss=0.2509 test_acc=0.9102` |

我自己會這樣解讀：

- `train_loss` 從 `1.5915` 掉到 `0.2234`
- `test_acc` 從 `0.7477` 拉到 `0.9102`
- 代表這個小型 `CNN` 在多看幾輪之後，確實更能把影像裡的局部模式轉成有效分類能力

我會特別注意一點：這組結果比 `MLP` 更能讓我看到 `CNN` 的優勢，因為它不是一開始就把圖攤平，而是先保留空間位置，再做卷積與池化。

如果我只看 `1 epoch` 的數字，我不會急著下結論。因為這仍然是最小示範：

- 模型很小
- 資料只取子集合
- `epoch` 很少

所以我自己更在意的是：**多跑幾輪之後，`CNN` 比 `MLP` 更明顯地把影像結構優勢發揮出來。**

---

# 7. `RNN` 實作：用小型文字 `corpus`（語料）做 next-character prediction

這個例子我想讓讀者看懂四件事：

- 序列資料怎麼一步一步進模型
- `RNN` 怎麼把前面看過的資訊帶到後面
- `train_loss` 為什麼會一路下降
- 生成文字看起來半通不通時，到底代表模型學到了什麼

執行方式：

```powershell
cd Teaching-Resource/ai
.\.venv\Scripts\Activate.ps1
cd .\Neural-Network
python rnn_example.py --epochs 5
```

## 7.1 這個範例的資料怎麼進模型

這次我沒有另外下載大型資料集，而是直接用 `rnn_corpus.txt` 放一份小型文字 `corpus`（語料）。

模型會做的事情是：

- 先把字元轉成索引
- 再把一小段字元序列切成輸入與目標
- 讓模型根據前面的字，去猜下一個字元

核心片段長這樣：

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

我自己會這樣拆：

- `Embedding`（嵌入層）先把字元索引轉成向量
- `RNN` 核心層逐步處理序列
- `Linear` 層把每一步的 hidden state 轉成下一字元的分數

## 7.2 baseline 和多跑幾輪之後，`train_loss` 有什麼差別

這個範例我也放兩組我自己實測的結果。這次的比較重點不是 accuracy，而是 `train_loss`（訓練損失）與生成文字品質。

| 版本 | 執行命令 | 主要結果 |
| --- | --- | --- |
| baseline | `python rnn_example.py --epochs 5` | `train_loss=2.0126`，生成文字大量重複，像 `the are the are ...` |
| 調整後 | `python rnn_example.py --epochs 20` | `train_loss=0.3826`，生成句子已更接近語料原本的節奏 |

如果我要用一句話講 `train_loss` 的意思，我會說：

`train_loss` 代表模型在訓練資料上，對「下一個字元應該是什麼」這件事，平均錯多少。

所以我會這樣看這兩組結果：

- `2.0126` 還代表模型只學到很粗的局部規律，所以生成句子會反覆卡在一些常見片段
- `0.3826` 表示它對下一字元的猜測穩定很多，生成文字也開始更像原始語料裡的句型
- 這個例子最適合拿來感受：序列模型不是一次把整句吃完，而是一步一步把上下文累積起來

如果我要把這個現象說得更白話，我會說：

**當 `RNN` 的 `train_loss` 繼續往下掉時，代表它不是只會背幾個字母，而是真的越來越會抓字元之間的順序規律。**

## 7.3 生成文字看起來怪怪的，代表什麼

跑完後你會看到一段生成文字。以我這次實測來看：

```text
baseline（5 epochs）:
neural networks learn fron the are the are the are ...

調整後（20 epochs）:
neural networks learn fra ninger d ans fo be state of the art systems.
they are not meant to be state of the art systems.
```

我不會把第二段結果解讀成「模型已經懂語言」，但我會承認它已經比 baseline 更接近語料本身的節奏。這代表：

- 它學到更多常見單字片段
- 它開始保留較長一點的上下文
- 但它仍然沒有真正掌握穩定語意與長距離結構

所以這個範例的重點不是產出漂亮文字，而是讓你看懂：

**序列模型可以從前面讀到的內容，逐步推測下一步。**

我也再強調一次，這裡我用 `RNN` 是為了教學，不是要說今天的大型語言模型還是靠傳統 `RNN`。

---

# 8. 我會怎麼總結這三個實作

如果我只留三句最值得帶走的話，我會留這三句：

- `NN` / `MLP` 教我看懂最基本的神經網路訓練流程
- `CNN` 教我看懂影像為什麼不能只當成攤平向量
- `RNN` 教我看懂序列模型怎麼一步一步保留上下文

所以這三個例子在我眼裡，不是誰取代誰，而是三種入門視角：

- 想先理解神經網路怎麼學，先看 `NN`
- 想理解影像中的局部模式怎麼被抓出來，先看 `CNN`
- 想理解序列資料怎麼逐步進模型，先看 `RNN`

我自己覺得，入門神經網路最好的方式，不是先背很多新名詞，而是先真的把這三個經典流程跑過一次。當你已經看過：

1. 影像怎麼被攤平成向量
2. 影像怎麼經過卷積與池化
3. 序列怎麼一步一步預測下一個字元

後面再去看 `LSTM`、`Transformer` 或更現代的模型，整條線才會接得起來。

---

# 9. 結語

如果這篇要我自己收成一句話，我會這樣寫：

**神經網路不是一個神祕名詞，而是一條很清楚的學習流程；`NN`、`CNN`、`RNN` 則是在不同資料結構下，最經典的三種理解方式。**

所以我會建議真的照這個順序做一次：

1. 先看輸入層、隱藏層、輸出層
2. 再看訓練流程怎麼回傳誤差
3. 然後跑 `nn_example.py`
4. 再跑 `cnn_example.py`
5. 最後跑 `rnn_example.py`

這樣你看到的就不只是三個模型名字，而是一條從向量、影像到序列的完整入門路線。
