---
layout: post
title: Python Data Science 入門：從 Anaconda、NumPy、Pandas 到股票分析實戰
subtitle: 以完整學習路線串連資料處理、視覺化、機器學習基礎與實戰案例
author: Paul Jiang
categories: Data-Science
tags: Python Data-Science Anaconda Jupyter NumPy Pandas Matplotlib Seaborn SciPy Scikit-Learn
sidebar: []
excerpt_image: /assets/images/260315/python-data-science-roadmap.svg?v=2
---

> 本文提到的安裝方式與官方文件連結，以 **2026 年 3 月 15 日** 我查閱時的內容為準。之後如果套件安裝流程、介面或相依條件有變，請以官方文件為主。

許多人第一次接觸 `Python Data Science` 時，經常面對一連串陌生名詞：`Anaconda`、`Jupyter`、`NumPy`、`Pandas`、`Matplotlib`、`Seaborn` 與 `Scikit-learn`。這些工具似乎都需要學習，卻很難判斷先後順序，也不清楚彼此如何串連。

從課程大綱開始學習時，通常會看到以下安排：安裝環境、學習 `NumPy` 與 `Pandas`、進行資料視覺化，最後完成資料分析專題。這項安排相當合理，因為資料科學入門不是從模型開始，而是先讀取資料、完成清理並理解趨勢，之後才進入建模階段。

本文將完整整理這條學習路線。讀者可以將它視為 `Python Data Science` 入門地圖，先建立整體概念，再決定下一步需要加強的部分。

---

# 1. 如何理解 Python Data Science 的入門順序

如果將整條學習路線濃縮成一句話，我會這樣說：

**先穩固環境設定與資料處理能力，再學習視覺化，最後進入建模。**

許多初學者最容易犯的錯誤，是在尚未學會處理 `CSV`、不熟悉 `DataFrame`，也無法解讀基本圖表時，就急著接觸分類模型或深度學習。此時真正的困難通常不在模型本身，而是資料清理與解讀能力尚未建立。

![Python Data Science 入門路線圖](/assets/images/260315/python-data-science-roadmap.svg?v=2)

_圖：較穩健的入門順序，是先學習環境設定、資料處理與視覺化，再延伸至模型及其他進階主題。_

換個角度來看，資料科學更像一個能力堆疊。越接近底層的能力越常使用，也越能影響後續成果的品質。

![Python Data Science 學習堆疊](/assets/images/260315/python-data-science-learning-stack.svg?v=2)

_圖：資料科學不是一開始就建立模型，底層工具、資料結構與視覺化能力才是最常使用的基礎。_

---

# 2. 先完成環境設定：Anaconda 與 Jupyter

入門課程通常先介紹 `Anaconda` 與 `Jupyter`，這樣的安排相當合理。如果開發環境尚未穩定建立，每次安裝套件都遇到問題，後續學習 `NumPy` 或 `Pandas` 的節奏便會不斷中斷。

`Anaconda` 將 `Python`、常用資料科學套件與環境管理工具整合在一起；`Jupyter` 則讓使用者能逐一執行程式碼儲存格，同時保留說明文字與輸出結果，特別適合教學、實驗及資料分析。

如果需要一個務實的起點，可以先建立新環境，再一次安裝常用套件：

```bash
conda create -n ds101 python
conda activate ds101
conda install numpy pandas matplotlib seaborn scipy scikit-learn jupyterlab
jupyter lab
```

此處最重要的不是指令本身，而是先建立以下觀念：

- 不要將所有專案都放在同一個 `Python` 環境中。
- 先學會利用環境隔離套件，日後進行不同專題時才不容易發生相依衝突。
- `JupyterLab` 適合探索式分析；正式整理專案時，再逐步將程式碼移至 `.py` 檔案。

---

# 3. 常用 Python 資料科學套件各自負責什麼

許多課程會列出「資料科學最常用的五個 Python 套件」。這種整理有其價值，但只記住名稱並不足夠，真正重要的是理解各套件負責的工作層次。

![資料科學最常用的 Python 套件](/assets/images/260315/python-data-science-libraries.svg?v=2)

_圖：`NumPy`、`SciPy`、`Pandas`、`Matplotlib` 與 `Scikit-learn` 分別處理不同層次的工作，`Seaborn` 則提升分析情境中的視覺化效率。_

## 3.1 NumPy：數值計算的基礎

`NumPy` 的核心價值，是提供高效的陣列與矩陣運算。許多資料科學套件都以它作為底層基礎，因此即使主要使用 `Pandas`，仍然經常會接觸 `NumPy`。

例如，計算一組股價的平均值與每日報酬率：

```python
import numpy as np

prices = np.array([612, 618, 615, 627, 635], dtype=float)
returns = (prices[1:] - prices[:-1]) / prices[:-1]

print(prices.mean())
print(returns)
```

這段程式碼的重點不在金融知識，而在於學習一次處理整組資料，而不是逐筆計算。

## 3.2 SciPy：科學計算的工具箱

`SciPy` 通常不是初學者最早大量使用的套件，但在線性代數、最佳化、訊號處理與統計函式等科學計算情境中十分重要。如果日後朝工程、數學或研究方向發展，使用它的機會將逐漸增加。

可以將兩者的分工理解為：

- `NumPy` 奠定數值陣列處理能力。
- `SciPy` 補充更完整的科學計算工具。

## 3.3 Pandas：表格資料分析的主力

`Pandas` 是資料分析入門最常用的套件之一。現實世界中的許多資料都以表格呈現，例如訂單、流量、會員、股票、時間序列與報表匯出檔。處理這類資料時，最常見的需求不是複雜模型，而是讀取、篩選、整理與彙總。

例如，對兩檔股票的價格與成交量進行基本彙總：

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

這些能力相當重要，因為它們直接對應日常分析工作：

- 讀取 `CSV`、`Excel` 與資料庫查詢結果。
- 清理欄位格式。
- 根據條件篩選資料。
- 進行彙總統計。
- 依照時間排序。
- 建立新欄位。

## 3.4 Matplotlib：底層繪圖能力

`Matplotlib` 是 Python 最基礎、也最普遍的視覺化套件之一。它的優勢是彈性高、控制細緻，輸出格式也相當完整。如果想深入理解圖表結構，`Matplotlib` 是不可或缺的工具。

## 3.5 Scikit-learn：機器學習入門主力

在能夠穩定整理資料、理解欄位，並切分訓練與測試資料後，便可以開始使用 `Scikit-learn`。它很適合用來學習常見的機器學習方法，例如：

- 回歸。
- 分類。
- 分群。
- 前處理。
- 模型評估。

其價值在於 API 設計相對一致，初學者較容易建立完整的建模流程概念。

## 3.6 Seaborn：更快建立分析型圖表

嚴格來說，許多「五大套件」清單不一定包含 `Seaborn`，但實際進行資料分析時，它很值得一併學習。`Seaborn` 建立在 `Matplotlib` 之上，能以較少程式碼建立更適合分析的圖表。

---

# 4. 使用 Pandas 分析資料時，實際會進行哪些工作

許多人學習資料科學時，日常最常進行的工作往往不是訓練模型，而是將資料整理成可以分析的狀態。

以股票資料為例，一份原始 `CSV` 的常見處理流程如下：

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

這段程式碼執行了幾項典型工作：

- 將日期欄位轉換為正式的日期時間格式。
- 依照時間排序。
- 使用 Rolling Window（滾動視窗）建立移動平均。
- 使用百分比變化計算每日報酬率。

如果能穩定完成這些工作，許多資料分析專題便已跨越最困難的門檻，因為這代表已具備將原始資料整理成可回答問題之資料的能力。

---

# 5. Matplotlib 與 Seaborn 應如何分工

這兩個套件經常一起教授，但不應將它們理解為只能擇一使用。較合適的分工方式是：

- `Matplotlib` 幫助使用者理解圖表的底層結構。
- `Seaborn` 讓使用者在資料分析情境中更快建立美觀圖表。

![Matplotlib 與 Seaborn 的分工](/assets/images/260315/matplotlib-vs-seaborn.svg?v=4)

_圖：`Matplotlib` 適合建立基礎能力與控制細節，`Seaborn` 適合快速產出分析型圖表，兩者通常搭配使用。_

如果要繪製股價與均線趨勢圖，使用 `Matplotlib` 相當直接：

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

但如果想快速查看報酬率分布，`Seaborn` 通常更加方便：

```python
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="whitegrid")
sns.histplot(df["DailyReturn"].dropna(), bins=40, kde=True)
plt.title("Daily Return Distribution")
plt.show()
```

`Seaborn` 經常被認為更適合資料分析，不只因為圖表較美觀，也因為它針對 `DataFrame`、分類欄位與統計圖表提供了更貼近分析情境的預設設計。

---

# 6. 串連前述工具：股票市場資料分析實戰

如果課程大綱包含「股票市場資料分析」專題，我認為這是很好的入門案例。股票資料是典型的時間序列，幾乎涵蓋資料科學入門最常見的操作。

![股票市場資料分析流程](/assets/images/260315/stock-analysis-project.svg?v=2)

_圖：股票資料很適合用來練習資料取得、清理、指標建立、視覺化與跨標的比較。_

一套務實的實作流程通常如下：

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

這些欄位已能支援許多基礎但實用的問題：

- 近期價格正在上升還是下降？
- 短期均線與中期均線的關係如何？
- 報酬率分布是否穩定？
- 波動是否擴大？

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

如果擁有多檔股票資料，比起直接比較絕對價格，通常更適合先將價格標準化，再放入同一張圖表比較：

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

這一步的價值，在於將不同價位轉換成相對走勢，使比較回到真正有意義的尺度。

---

# 7. 如何延伸至文字探勘、機器學習與深度學習

許多課程介紹指出，完成這些內容後，可以進一步延伸至 `Text Mining`、`Machine Learning` 與 `Deep Learning`。這項說法並沒有錯，但還需要補充一點：

**記住套件名稱不代表自然具備建模能力；前面的資料處理基礎，會直接決定後續模型是否可靠。**

學習路線可以依照以下方式延伸：

- 延伸至 `Text Mining`：先學習文字前處理、向量化與基本分類。
- 延伸至 `Machine Learning`：使用 `Scikit-learn` 練習資料切分、特徵工程與評估。
- 延伸至 `Deep Learning`：再接續學習 `PyTorch` 或 `TensorFlow`。

無論最後選擇哪一條路線，`Pandas`、視覺化與資料清理都不會消失。它們不是初學階段的過渡工具，而是日後持續使用的核心能力。

---

# 8. 結語

如果是第一次接觸 `Python Data Science`，最重要的不是一次學完所有內容，而是先理解各項工具的分工。

本文可以歸納為以下學習順序：

1. 先把 `Anaconda`、`Jupyter` 這種環境與工具準備好。
2. 用 `NumPy` 與 `Pandas` 建立資料處理能力。
3. 使用 `Matplotlib` 與 `Seaborn` 學習解讀資料。
4. 最後使用 `Scikit-learn` 開始建模。

這項順序的優點，是讀者不會只記住套件名稱，而能真正理解每個步驟所解決的問題。

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
