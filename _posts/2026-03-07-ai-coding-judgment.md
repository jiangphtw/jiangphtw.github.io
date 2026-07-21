---
layout: post
title: AI coding 讓產碼變便宜，但判讀能力更值錢
subtitle: 從 Can't Maintain 這個網站談起，為什麼「看起來能跑」遠遠不夠
author: Paul Jiang
categories: AI
tags: AI-Coding Code-Review Maintainability React API-Design
sidebar: []
excerpt_image: /assets/images/260312/cant-maintain-learn-overview.png
---

> 本文提到的 [Can't Maintain](https://cant-maintain.saschb2b.com/learn) 題目與畫面，以 **2026 年 3 月 12 日** 我看到的版本為準。之後分類、範例與說明可能會調整。

如果你最近常用 AI 寫程式，應該會很快發現一件事：現在真正稀缺的，已經不是「把 code 生出來」的能力，而是「看出這段 code 寫得好不好」的能力。

AI coding 最明顯的改變，是讓產碼這件事突然變得很便宜。以前你可能要自己慢慢敲 100 行、200 行，現在你只要下一段 prompt，很快就能得到一個看起來像樣的元件、hook、API wrapper，甚至是一整段 CRUD 流程。

但問題也剛好出在這裡。

很多 AI 產生的程式碼不是完全不能用。相反地，它常常是那種 **可以跑、可以過型別、甚至短期內看不出太大問題** 的程式碼。真正麻煩的是：它很可能在命名、抽象邊界、型別設計、可擴充性、可維護性這些地方，默默埋進一堆之後才會爆的債。

所以我現在越來越覺得，AI 時代真正重要的能力，不只是會不會下 prompt，而是你能不能在 AI 交出一份答案之後，快速判斷：

- 這段 code 只是「像能用」，還是真的設計合理？
- 這個 API 只是現在能 work，還是之後也改得動？
- 這個命名只是勉強說得通，還是足夠清楚到別人一看就懂？

最近我看到一個很適合拿來練這種能力的網站：[Can't Maintain](https://cant-maintain.saschb2b.com/learn)。

---

# 1. AI coding 改變的不是只有速度，還有壞設計的複製速度

過去寫程式的 bottleneck，常常是「把東西寫出來」本身。現在這個 bottleneck 已經被 AI 大幅壓低了。

這本來是好事，但副作用是：**以前你得慢慢手寫才會累積的設計問題，現在可以被很快複製到整個專案裡。**

最常見的情況不是 AI 給你一段明顯錯誤、完全不能執行的 code。比較常見的是：

- 命名有點模糊，但一時看不出哪裡怪
- props 能用，但語意邊界不清楚
- callback 名稱看起來合理，實際上混淆了責任歸屬
- 型別有寫，但只是把 `any` 或 `unknown` 換個位置擺
- 元件 API 現在能撐住，之後一擴充就開始變醜

也就是說，AI 最容易大量產生的，其實不是「完全錯的 code」，而是 **60 到 80 分、足以混進 codebase 的普通程式碼**。

這種 code 最危險，因為它不會立刻報錯。它只會讓你在幾週、幾個月後開始覺得：

- 這個元件怎麼越改越難改
- 為什麼 props 越來越多，而且命名越來越不一致
- 為什麼每次接手別人的 component 都要重新猜一次它的語意

---

# 2. 看得懂程式碼，不等於看得出程式碼寫得好不好

這是我覺得很多人在 AI coding 時最容易忽略的一點。

很多人其實已經具備「讀 code」的能力了。他看得懂語法、知道這段 TypeScript 在做什麼、知道 React component 會 render 出什麼。

但這跟「判斷這段 code 設計得好不好」是兩回事。

真正難的常常不是：

- 這段 code 能不能執行

真正難的是：

- 這個 prop 名稱到底清不清楚
- 這個 callback 是在描述事件，還是在偷偷暴露 setter
- 這個元件的 state ownership 到底合不合理
- 這個型別是在提供資訊，還是在掩蓋不確定性
- 這個 API 是否跟既有生態系慣例一致

而且這類問題很麻煩，因為它們通常沒有單一標準答案，也不像語法錯誤那樣會直接噴錯。你得靠經驗、語意敏感度、以及對維護成本的想像力去判斷。

這也是為什麼我覺得：在 AI 時代，**判讀能力其實比產碼能力更接近真正的工程能力。**

---

# 3. Can't Maintain：一個很適合練判讀力的網站

[Can't Maintain](https://cant-maintain.saschb2b.com/learn) 這個網站之所以有意思，是因為它不是在考你演算法，也不是在考你背 API。

它做的事情很單純：把兩種寫法並排給你看，讓你判斷哪一種比較好維護。

我喜歡它的原因是，這些題目都非常貼近日常開發。它談的不是很炫的 framework trick，而是很多人每天都會碰到的問題：

- boolean props 怎麼命名
- callback 怎麼命名
- controlled / uncontrolled component 的邊界怎麼設計
- 型別到底要不要用 generic
- accessibility 應不應該被納入 API 本身

也因為它的題目大多是 side-by-side 對比，你很容易看出一件重要的事：

**很多設計問題，不是「不能跑」，而是「雖然能跑，但右邊明顯比較不容易把未來搞爛」。**

![Can't Maintain 的 Learn 頁面總覽](/assets/images/260312/cant-maintain-learn-overview.png)

_圖：`Can't Maintain` 的 `Learn` 頁面會把不同 API 設計題型分門別類，核心不是考語法，而是在練你判斷「哪種寫法比較能維護」。_

---

# 4. 幾個很有感的例子

## 4.1 Boolean Props：`loading` 和 `isLoading` 差很多嗎？

表面上看，`loading` 跟 `isLoading` 好像都能懂。

但如果你把它放進一個真實專案裡，`isLoading` 明顯更清楚，因為它直接告訴你：這是一個 boolean 狀態，而且它回答的是一個是非問題。

`loading` 的問題不是完全錯，而是語意比較鬆。它可能被理解成：

- loading 狀態
- loading 流程
- loading 行為
- 某種與 loading 有關的設定

`isLoading` 則比較不留模糊空間。

這種差異在單一元件裡看起來很小，但一旦整個 codebase 開始累積 `loading`、`disabled`、`error`、`active` 這類寫法，你很快就會發現：大家都看得懂，但沒有人真的看得很輕鬆。

AI 很容易產生前者，因為它短、常見、看起來也沒錯。但如果你沒有主動 review，這種 80 分命名就會一直被複製下去。

![Can't Maintain 的 Boolean Props 題目頁面](/assets/images/260312/cant-maintain-boolean-naming.png)

_圖：`Boolean Props` 頁面直接把 `loading` 和 `isLoading` 這類命名差異並排，讓你看到「能懂」和「夠清楚」其實不是同一件事。_

## 4.2 Callback Naming：`setValue` 不一定是好 API

另一個我很喜歡的例子，是 callback naming。

像 `setValue` 這種命名，乍看沒有問題。但它其實很容易讓元件 API 變得奇怪，因為它暗示的是「你把 setter 傳進來」，而不是「這個元件對外發出一個事件」。

相對地，像 `onValueChange` 這種命名，語意就清楚很多。它表示的是：

- 元件內部發生了某個變化
- 你如果有需要，可以在外部接住這個事件

這個差異很重要，因為它關係到責任歸屬。

`setValue` 比較像是把外部 state 管理方式直接暴露進 API 裡。  
`onValueChange` 則比較像是在描述互動事件本身。

這種命名差異，平常很容易被忽略，但一旦元件被重用、被重構、被接到不同狀態管理方式上，問題就會浮出來。

![Can't Maintain 的 Callback Naming 題目頁面](/assets/images/260312/cant-maintain-callback-naming.png)

_圖：`Callback Naming` 這組例子很適合拿來看 callback 究竟是在描述事件，還是在偷偷暴露 setter。_

## 4.3 Controlled / Uncontrolled：state ownership 要說清楚

在 controlled component 的情境裡，我很在意 API 是否能讓人一眼看出「誰擁有 state」。

像 `toggled` / `setToggled` 這種組合，雖然不是完全不能用，但它沒有很好地對齊 React 生態系裡大家已經很熟悉的語意。

相較之下，`checked` / `onChange` 這種搭配就清楚很多，因為它直接沿用大家對表單控制項的既有心理模型。

這件事的價值不只是「命名比較漂亮」，而是：

- 使用者比較容易預測這個 component 怎麼運作
- API 比較符合生態系慣例
- 之後接手的人不用重新學一套你的私有語言

AI 生成 code 時，常常會把「能表達這個意思」和「最適合長期維護的表達方式」混在一起。這就是為什麼 human review 還是很重要。

![Can't Maintain 的 Controlled and Uncontrolled 題目頁面](/assets/images/260312/cant-maintain-controlled-uncontrolled.png)

_圖：`Controlled & Uncontrolled` 題型的重點不是換名字而已，而是把 state ownership 與元件契約說清楚。_

## 4.4 Generic Props：型別不是有寫就算數

我自己很常看到 AI 產生這種型別：

- `items: unknown[]`
- `onSelect: (item: unknown) => void`

這種寫法 technically 沒有錯，但它其實沒有真的把型別資訊設計進 API 裡。它只是把不確定性往外推，讓呼叫者自己處理。

如果這個元件本來就應該是泛型的，那麼用 `T[]`、`(item: T) => void` 這種方式，會更接近真正可重用、可推導、可維護的 API。

我覺得這點很值得注意，因為 AI 很會產生「編譯器不會抱怨」的型別，但那不代表型別真的有幫你表達設計意圖。

對我來說，好的型別不只是防呆，它還應該幫助別人理解元件在期待什麼。

![Can't Maintain 的 Generic Props 題目頁面](/assets/images/260312/cant-maintain-generic-props.png)

_圖：`Generic Props` 很適合對照「只是讓型別不報錯」與「真的把型別資訊設計進 API」之間的差別。_

## 4.5 Accessibility Props：好 API 會把該要求的事要求進來

這個網站另一個很好的點，是它不只談命名，也談 accessibility。

例如 icon button 這種元件，如果 API 只要求你傳 `icon`，卻沒有把 `aria-label` 這類必要資訊納進來，那就代表它其實在鼓勵一種很容易出問題的使用方式。

這裡我覺得最值得記的一句話是：

**accessibility 不是事後補上的備註，而應該是 API 設計的一部分。**

這種思維跟 AI coding 很有關係，因為 AI 很容易把「畫面有出來」當成完成，但工程上真正重要的，通常不只畫面。

![Can't Maintain 的 Accessibility Props 題目頁面](/assets/images/260312/cant-maintain-accessibility-props.png)

_圖：`Accessibility Props` 這組例子提醒你：好的元件 API 會把該要求的可及性資訊直接設計進介面，而不是留給使用者事後補。_

---

# 5. 這些例子，和 AI coding 的關係是什麼？

我覺得關鍵在於：AI 很擅長產生「局部看起來合理」的東西，但不一定擅長替你守住整體設計品質。

它可以很快補出一個 component，也能很快湊出 props、型別、事件名稱。但如果你沒有足夠的判讀能力，你就很容易接受一種危險的結果：

- 每一段 code individually 看起來都還可以
- 但整個專案加總起來，命名越來越亂、抽象越來越鬆、邊界越來越模糊

這才是我現在最警惕的地方。

AI coding 不會只放大生產力，它也會放大你原本的審查能力上限。

如果你本來就有能力分辨：

- 哪種命名比較清楚
- 哪種 API 比較符合語意
- 哪種抽象只是提早泛化
- 哪種型別只是表面工夫

那 AI 會讓你變快。

但如果你還沒有建立這種判讀能力，AI 也會讓你更快地把普通甚至糟糕的設計帶進專案。

---

# 6. 我現在怎麼 review AI 產生的 code

現在我看 AI 產生的 code，最少會問自己下面幾個問題：

- 這個命名能不能直接看出型別與語意？
- 這個 callback 是在描述事件，還是在偷渡 setter？
- 這個元件的 state ownership 清不清楚？
- 這個型別真的有傳遞資訊，還是只是讓編譯器閉嘴？
- 這個 API 有沒有順著 React / HTML 的既有慣例？
- 這個設計如果三個月後要擴充，會不會開始變醜？
- accessibility 是被考慮進 API，還是被留到「之後再說」？

我現在越來越不把 AI 當成「幫我直接完成」的工具，而比較像是：

- 幫我先寫草稿
- 幫我提出一個可能的方向
- 幫我加速體力工作

但最後決定哪些 code 能留在 repo 裡，還是要靠人。

---

# 7. 結語：AI 可以幫你產碼，但不能替你形成 judgment

我不是在反對 AI coding。相反地，我自己也常用，而且我很確定這已經是未來工作流的一部分。

但我現在比以前更確定一件事：

**AI 時代最值得投資的能力，不只是 prompt，而是 judgment。**

你可以讓 AI 幫你寫第一版，但你還是要有能力看出：

- 這段 code 是不是只是在模仿常見寫法
- 這個 API 會不會讓未來的維護者痛苦
- 這個設計是不是只是「目前剛好能用」

如果你想練這種能力，我覺得 [Can't Maintain](https://cant-maintain.saschb2b.com/learn) 這種網站很值得偶爾去做幾題。它不會讓你瞬間變成更強的工程師，但它會逼你開始注意一件很重要的事：

同樣都能跑的 code，維護成本可能差非常多。

而這個差距，通常不是 AI 自己會替你守住的。
