---
layout: post
title: Python Data Science 入門：從 Anaconda、NumPy、Pandas 到股票分析實戰
subtitle: 用一條完整路線，把資料處理、視覺化、機器學習基礎和實戰案例串起來
author: Paul Jiang
categories: Data-Science
tags: Python Data-Science Anaconda Jupyter NumPy Pandas Matplotlib Seaborn SciPy Scikit-Learn
sidebar: []
excerpt_image: /assets/images/260315/python-data-science-roadmap.svg?v=2
---

> 本文提到的安裝方式與官方文件連結，以 **2026 年 3 月 15 日** 我查閱時的內容為準。之後如果套件安裝流程、介面或相依條件有變，請以官方文件為主。

很多人第一次接觸 `Python Data Science`，常常會被一串名詞直接淹沒：`Anaconda`、`Jupyter`、`NumPy`、`Pandas`、`Matplotlib`、`Seaborn`、`Scikit-learn`。看起來每個都要學，但又不知道先後順序，也不知道它們彼此之間到底怎麼接起來。

如果你是從課程大綱切進來，通常會看到像這樣的內容：安裝環境、學 `numpy`、學 `pandas`、做資料視覺化，最後再做一個資料分析專題。這種安排其實是合理的，因為資料科學的入門，不是從模型開始，而是先把資料讀進來、整理乾淨、看懂趨勢，最後才有資格談建模。

這篇文章就把這條線完整整理一次。你可以把它當成一篇 `Python Data Science` 入門地圖，先建立整體感，再決定下一步要練哪一塊。

---

# 1. Python Data Science 的入門順序，應該怎麼看

如果把整條學習路線壓縮成一句話，我會這樣講：

**先把環境和資料處理能力打穩，再學視覺化，最後才進到建模。**

很多新手一開始最容易犯的錯，是還不會處理 `CSV`、還不熟 `DataFrame`、也還不會看基本圖表，就急著碰分類模型或深度學習。結果不是模型本身有多難，而是前面的資料清理和解讀能力還沒長出來。

![Python Data Science 入門路線圖](/assets/images/260315/python-data-science-roadmap.svg?v=2)

_圖：入門比較穩的順序，是先處理環境、資料、視覺化，再往模型與更進階主題延伸。_

換個角度看，資料科學更像一個堆疊。越下面的能力越常用，也越決定你後面做的東西有沒有品質。

![Python Data Science 學習堆疊](/assets/images/260315/python-data-science-learning-stack.svg?v=2)

_圖：資料科學不是一開始就做模型，底層的工具、資料結構和視覺化能力才是最常用的地基。_

---

# 2. 先把環境裝好：Anaconda 與 Jupyter

入門課最常先教 `Anaconda` 和 `Jupyter`，這很合理。因為如果你連環境都還沒穩定建立，每次安裝套件都卡住，那後面學 `NumPy` 或 `Pandas` 的節奏會一直被中斷。

`Anaconda` 的角色，比較像是把 `Python`、常見資料科學套件與環境管理工具整理好；`Jupyter` 則是讓你能一格一格執行程式、同時保留說明文字與結果輸出，特別適合教學、實驗與資料分析。

如果你要一個很務實的開始方式，可以先建立一個新的環境，再把常用套件一次裝齊：

```bash
conda create -n ds101 python
conda activate ds101
conda install numpy pandas matplotlib seaborn scipy scikit-learn jupyterlab
jupyter lab
```

這裡最重要的不是指令本身，而是你要先建立一個觀念：

- 不要把所有專案都塞在同一個 `Python` 環境裡。
- 先學會用環境把套件隔開，之後你做不同專題才不容易互相衝突。
- `JupyterLab` 適合探索式分析；真正進入專案整理時，再慢慢把程式碼搬回 `.py` 檔也不遲。

---

# 3. 資料科學最常用的 Python 套件，到底各自做什麼

很多課程會列出「資料科學最常用的 5 個 Python 套件」，這種整理有價值，但只背名字沒有用，真正重要的是你要知道每個套件負責哪一層工作。

![資料科學最常用的 Python 套件](/assets/images/260315/python-data-science-libraries.svg?v=2)

_圖：`NumPy`、`SciPy`、`Pandas`、`Matplotlib`、`Scikit-learn` 各自處理不同層的工作，`Seaborn` 則補上更偏分析場景的視覺化效率。_

## 3.1 NumPy：數值計算的地基

`NumPy` 的核心價值，是提供高效的陣列與矩陣運算。很多資料科學套件底層都跟它有關，所以即使你最後主要寫的是 `Pandas`，還是很容易碰到 `NumPy`。

例如你想算一串股價的平均值與每日報酬率：

```python
import numpy as np

prices = np.array([612, 618, 615, 627, 635], dtype=float)
returns = (prices[1:] - prices[:-1]) / prices[:-1]

print(prices.mean())
print(returns)
```

這段程式的重點不在金融，而在你會開始習慣「整段資料一起算」，而不是一筆一筆慢慢處理。

## 3.2 SciPy：科學計算的工具箱

`SciPy` 通常不是新手最早大量使用的套件，但它在很多科學計算場景裡很重要，例如線性代數、最佳化、訊號處理、統計函式等。如果你之後往更偏工程、數學或研究的方向走，它會越來越常出現。

可以把它理解成：

- `NumPy` 打底數值陣列能力
- `SciPy` 補上更完整的科學計算工具

## 3.3 Pandas：表格資料分析的主力

`Pandas` 幾乎是資料分析入門最常用的套件。因為現實世界裡很多資料就是表格型資料：訂單、流量、會員、股票、時間序列、報表匯出檔。這類資料最常見的需求不是高深模型，而是先能讀、能篩、能整理、能聚合。

例如你想把兩檔股票的價格與成交量做基本彙總：

```python
import pandas as pd

df = pd.DataFrame({
    "stock": ["AAPL", "AAPL", "TSLA", "TSLA"],
    "price": [215.0, 218.0, 171.0, 175.0],
    "volume": [1200, 1500, 980, 1100]
})

summary = df.groupby("stock").agg({
    "price": ["mean", "max"],
    "volume": "sum"
})

print(summary)
```

這種能力之所以重要，是因為它直接對應到日常分析工作：

- 讀 `CSV`、`Excel`、資料庫查詢結果
- 清理欄位格式
- 篩選條件
- 彙總統計
- 按時間排序
- 建立新欄位

## 3.4 Matplotlib：底層繪圖能力

`Matplotlib` 是 Python 視覺化最基礎、也最普遍的套件之一。它的強項是彈性高、控制細，輸出格式也完整。你如果想真正理解圖表的結構，`Matplotlib` 幾乎是繞不過去的。

## 3.5 Scikit-learn：機器學習入門主力

當你已經能穩定整理資料、理解欄位、切分訓練與測試資料後，`Scikit-learn` 才開始真正上場。它最適合拿來入門常見的機器學習方法，例如：

- 回歸
- 分類
- 分群
- 前處理
- 模型評估

它的價值在於 API 設計相對一致，新手比較容易建立完整的建模流程觀念。

## 3.6 Seaborn：讓分析型圖表更快畫出來

嚴格來說，很多「5 大套件」清單不一定把 `Seaborn` 放進去，但如果你真的在做資料分析，它幾乎值得一起學。因為它建立在 `Matplotlib` 之上，卻能讓你用更少程式碼做出更適合分析的圖。

---

# 4. 用 Pandas 做資料分析時，你真正會做哪些事

很多人說自己在學資料科學，實際上每天最常做的事情，往往不是訓練模型，而是把資料整理成「終於可以分析」的狀態。

以股票資料為例，一份原始 `CSV` 常見的處理流程大概會長這樣：

```python
import pandas as pd

df = pd.read_csv("2330.csv")
df["Date"] = pd.to_datetime(df["Date"])
df = df.sort_values("Date")

df["MA5"] = df["Close"].rolling(5).mean()
df["MA20"] = df["Close"].rolling(20).mean()
df["DailyReturn"] = df["Close"].pct_change()

print(df.head())
```

這裡實際上做了幾件很典型的事：

- 把日期欄位轉成真正的時間格式
- 依照時間排序
- 用 rolling window 建立移動平均
- 用百分比變化建立每日報酬率

如果你能穩定做完這些，很多資料分析專題其實就已經跨過最難的那一道門檻了。因為你開始有能力把原始資料，整理成能回答問題的資料。

---

# 5. Matplotlib 和 Seaborn，應該怎麼分工

這兩個套件很常被放在一起教，但最好不要把它理解成「選一個就好」。更好的理解方式是：

- `Matplotlib` 讓你知道圖表底層是怎麼組起來的
- `Seaborn` 讓你在資料分析情境下畫得更快、更好看

![Matplotlib 與 Seaborn 的分工](/assets/images/260315/matplotlib-vs-seaborn.svg?v=4)

_圖：`Matplotlib` 適合打底與細節控制，`Seaborn` 適合快速產出分析型圖表，兩者通常一起用。_

如果你要畫股價與均線趨勢圖，`Matplotlib` 會很直接：

```python
import matplotlib.pyplot as plt

plt.figure(figsize=(10, 5))
plt.plot(df["Date"], df["Close"], label="Close")
plt.plot(df["Date"], df["MA20"], label="MA20")
plt.title("2330 Close Price")
plt.xlabel("Date")
plt.ylabel("Price")
plt.legend()
plt.tight_layout()
plt.show()
```

但如果你想快速看報酬率分佈，`Seaborn` 通常會更順手：

```python
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="whitegrid")
sns.histplot(df["DailyReturn"].dropna(), bins=40, kde=True)
plt.title("Daily Return Distribution")
plt.show()
```

`Seaborn` 之所以常被說比較適合資料分析，不只是因為圖比較漂亮，而是因為它對 `DataFrame`、分類欄位、統計型圖表的預設設計更貼近分析場景。

---

# 6. 把前面的工具串起來：股票市場數據分析實戰

課程大綱裡如果有一個「股票市場數據分析」專題，我會覺得這是很好的入門案例。原因很簡單：股票資料本身就是很典型的時間序列資料，幾乎把資料科學入門最常見的動作都涵蓋了。

![股票市場資料分析流程](/assets/images/260315/stock-analysis-project.svg?v=2)

_圖：股票資料很適合拿來練習資料取得、清理、指標建立、視覺化，以及跨標的比較。_

一個很務實的實作流程，通常會長這樣：

## 6.1 先把原始資料整理好

```python
import pandas as pd

df = pd.read_csv("AAPL.csv")
df["Date"] = pd.to_datetime(df["Date"])
df = df.sort_values("Date").dropna()
```

## 6.2 建立分析欄位

```python
df["MA5"] = df["Close"].rolling(5).mean()
df["MA20"] = df["Close"].rolling(20).mean()
df["DailyReturn"] = df["Close"].pct_change()
df["Volatility20"] = df["DailyReturn"].rolling(20).std()
```

這幾個欄位已經能支撐很多很基本但實用的問題：

- 最近價格是在上升還是下降
- 短期均線和中期均線的關係如何
- 報酬率分佈是否穩定
- 波動是否變大

## 6.3 先看單一股票趨勢

```python
import matplotlib.pyplot as plt

plt.figure(figsize=(12, 5))
plt.plot(df["Date"], df["Close"], label="Close")
plt.plot(df["Date"], df["MA5"], label="MA5")
plt.plot(df["Date"], df["MA20"], label="MA20")
plt.legend()
plt.title("Price Trend with Moving Averages")
plt.show()
```

## 6.4 再做多股票比較

如果你手上有多檔股票資料，比起直接比絕對價格，通常更適合先把價格標準化，再放到同一張圖上看：

```python
prices = pd.DataFrame({
    "AAPL": aapl["Close"],
    "MSFT": msft["Close"],
    "NVDA": nvda["Close"],
})

normalized = prices / prices.iloc[0]
normalized.plot(figsize=(12, 5), title="Normalized Price Comparison")
plt.show()
```

這一步的價值在於，你能把「不同價位」轉成「相對走勢」，讓比較回到真正有意義的尺度。

---

# 7. 這條路再走下去，會怎麼連到文字探勘、機器學習與深度學習

很多課程介紹會說，學完這些之後，可以進一步延伸到 `Text Mining`、`Machine Learning`、`Deep Learning`。這句話本身沒有錯，但比較值得補充的是：

**你不是學完套件名稱之後就自然會做模型，而是前面的資料處理能力，會直接決定你之後模型能不能做得穩。**

這條路大概可以這樣接：

- 往 `Text Mining` 走：先學文字前處理、向量化、基本分類
- 往 `Machine Learning` 走：用 `Scikit-learn` 練資料切分、特徵工程與評估
- 往 `Deep Learning` 走：再接 `PyTorch` 或 `TensorFlow`

但不管你最後走哪一條路，`Pandas`、視覺化與資料清理都不會消失。它們不是新手階段的過渡工具，而是之後一直都會用到的核心能力。

---

# 8. 結語

如果你今天是第一次接觸 `Python Data Science`，最重要的不是一次把所有東西都學完，而是先搞懂這些工具的分工。

可以把整篇收斂成一個簡單順序：

1. 先把 `Anaconda`、`Jupyter` 這種環境與工具準備好。
2. 用 `NumPy` 與 `Pandas` 建立資料處理能力。
3. 用 `Matplotlib` 與 `Seaborn` 學會看資料。
4. 最後再用 `Scikit-learn` 開始做建模。

這樣的順序有一個好處：你不會只是背套件名字，而是真的知道每一步在解什麼問題。

---

# 參考資料

- [Anaconda Getting Started](https://www.anaconda.com/docs/getting-started)
- [Jupyter Notebook 安裝文件](https://docs.jupyter.org/en/latest/install/notebook-classic.html)
- [NumPy Installation](https://numpy.org/install/)
- [pandas Getting Started](https://pandas.pydata.org/docs/dev/getting_started/index.html)
- [Matplotlib Installation](https://matplotlib.org/stable/install/index.html)
- [Seaborn Installing and Getting Started](https://seaborn.pydata.org/installing)
- [SciPy User Guide](https://docs.scipy.org/doc/scipy/tutorial/)
- [scikit-learn Installation](https://scikit-learn.org/stable/install.html)
