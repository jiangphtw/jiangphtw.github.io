---
layout: post
title: AI Coding 讓產生程式碼變得容易，但判讀能力更加珍貴
subtitle: 從 Can't Maintain 談起：為什麼「看起來能執行」遠遠不夠
author: Paul Jiang
categories: AI
tags: AI-Coding Code-Review Maintainability React API-Design
sidebar: []
excerpt_image: /assets/images/260312/cant-maintain-learn-overview.png
---

> 本文提到的 [Can't Maintain](https://cant-maintain.saschb2b.com/learn) 題目與畫面，以 **2026 年 3 月 12 日** 我看到的版本為準。之後分類、範例與說明可能會調整。

如果最近經常使用 AI 寫程式，應該很快就會發現：現在真正稀缺的，已經不是產生程式碼的能力，而是判斷程式碼品質的能力。

AI Coding 最明顯的改變，是大幅降低產生程式碼的成本。過去可能需要親手逐行寫出 100 或 200 行程式碼，現在只要輸入一段 prompt，很快就能得到看似完整的元件、Hook、API 封裝，甚至整套 CRUD 流程。

然而，問題也正是出在這裡。

許多 AI 產生的程式碼並非完全不能使用。相反地，它們往往**可以執行、通過型別檢查，甚至短期內看不出明顯問題**。真正棘手的是，這些程式碼可能在命名、抽象邊界、型別設計、可擴充性與可維護性等方面，悄悄累積日後才會浮現的技術債。

因此，我越來越認為，AI 時代真正重要的能力不只是撰寫 prompt，而是在 AI 提交答案後快速判斷：

- 這段程式碼只是看似可用，還是真的設計合理？
- 這個 API 只在目前可用，還是日後也容易修改？
- 這個命名只是勉強說得通，還是清楚到讓其他人一看就懂？

最近，我看到一個很適合用來練習這種能力的網站：[Can't Maintain](https://cant-maintain.saschb2b.com/learn)。

---

# 1. AI Coding 改變的不只是開發速度，也加快不良設計的複製

過去寫程式的 bottleneck（瓶頸），往往是產出程式碼本身。如今，AI 已大幅降低這項瓶頸。

這原本是好事，但也帶來一項副作用：**過去在長期手寫過程中才逐漸累積的設計問題，現在可能迅速擴散至整個專案。**

最常見的情況不是 AI 產生明顯錯誤、完全無法執行的程式碼，而是以下較隱晦的問題：

- 命名有些模糊，卻難以立即看出問題。
- Props 可以使用，但語意邊界並不清楚。
- Callback 名稱看似合理，實際上卻混淆責任歸屬。
- 雖然定義了型別，卻只是改變 `any` 或 `unknown` 出現的位置。
- 元件 API 目前可以應付需求，擴充後卻容易變得複雜混亂。

換句話說，AI 最容易大量產生的並非完全錯誤的程式碼，而是**品質約 60 至 80 分、足以進入程式碼庫的普通程式碼**。

這類程式碼特別危險，因為它不會立即報錯，卻會讓開發者在數週或數月後逐漸發現：

- 這個元件為何越來越難修改？
- 為什麼 Props 越來越多，命名也越來越不一致？
- 為什麼每次接手他人的元件，都必須重新猜測它的語意？

---

# 2. 讀得懂程式碼，不等於能判斷程式碼品質

我認為這是許多人使用 AI Coding 時最容易忽略的一點。

許多人其實已具備閱讀程式碼的能力。他們看得懂語法，知道一段 TypeScript 程式碼的作用，也知道 React 元件會渲染出什麼結果。

然而，這與判斷程式碼的設計品質是兩回事。

真正困難的通常不是判斷程式碼能否執行，而是回答以下問題：

- 這個 Prop 名稱是否清楚？
- 這個 Callback 是在描述事件，還是在間接暴露 Setter？
- 這個元件的 state ownership（狀態所有權）是否合理？
- 這個型別是在提供資訊，還是在掩蓋不確定性？
- 這個 API 是否符合既有生態系的慣例？

這類問題相當棘手，因為它們通常沒有單一標準答案，也不像語法錯誤會直接顯示訊息。開發者必須依靠經驗、對語意的敏感度，以及評估維護成本的能力來判斷。

這也是我認為在 AI 時代，**判讀能力比產生程式碼的能力更接近真正工程能力**的原因。

---

# 3. Can't Maintain：適合練習判讀能力的網站

[Can't Maintain](https://cant-maintain.saschb2b.com/learn) 的特別之處，在於它不考演算法，也不要求背誦 API。

網站的做法很單純：並排呈現兩種寫法，讓讀者判斷哪一種更容易維護。

我喜歡這個網站，是因為題目非常貼近日常開發。它討論的不是華而不實的框架技巧，而是許多開發者每天都會遇到的問題：

- Boolean Props 應如何命名？
- Callback 應如何命名？
- Controlled 與 Uncontrolled Component 的邊界應如何設計？
- 型別是否應使用 Generic？
- Accessibility（無障礙設計）是否應納入 API 本身？

由於多數題目採用 side-by-side（並排）比較，讀者很容易看出一項重要差異：

**許多設計問題並非程式碼無法執行，而是其中一種寫法明顯更不容易增加未來的維護負擔。**

![Can't Maintain 的 Learn 頁面總覽](/assets/images/260312/cant-maintain-learn-overview.png)

_圖：`Can't Maintain` 的 `Learn` 頁面將不同 API 設計題型分類，重點不在測驗語法，而是練習判斷哪種寫法更容易維護。_

---

# 4. 幾個具體例子

## 4.1 Boolean Props：`loading` 和 `isLoading` 差很多嗎？

表面上看，`loading` 與 `isLoading` 似乎都容易理解。

但放入真實專案後，`isLoading` 明顯更清楚，因為它直接表明這是一個 Boolean 狀態，用來回答是非問題。

`loading` 並非完全錯誤，但語意較為寬鬆，可能被理解為：

- Loading 狀態。
- Loading 流程。
- Loading 行為。
- 某種與 Loading 有關的設定。

相較之下，`isLoading` 留下的模糊空間較少。

這項差異在單一元件中看似很小，但當整個程式碼庫開始累積 `loading`、`disabled`、`error` 與 `active` 等寫法時，便會發現：每個人都勉強看得懂，閱讀時卻不夠直覺。

AI 很容易產生前者，因為名稱簡短、常見，看起來也沒有錯誤。但如果開發者沒有主動審查，這種尚可但不夠清楚的命名就會不斷被複製。

![Can't Maintain 的 Boolean Props 題目頁面](/assets/images/260312/cant-maintain-boolean-naming.png)

_圖：`Boolean Props` 頁面並排呈現 `loading` 與 `isLoading` 等命名，說明「能夠理解」與「足夠清楚」並不是同一件事。_

## 4.2 Callback Naming：`setValue` 不一定是好 API

另一個我很喜歡的例子是 Callback Naming。

`setValue` 這類命名乍看沒有問題，卻容易使元件 API 的語意變得奇怪。它暗示呼叫者傳入了一個 Setter，而不是元件對外發出事件。

相較之下，`onValueChange` 的語意清楚得多，代表：

- 元件內部發生了某項變化。
- 外部程式碼可以視需要接收並處理這個事件。

這項差異很重要，因為它關係到責任歸屬。

`setValue` 比較像將外部的狀態管理方式直接暴露於 API 中。
`onValueChange` 則著重描述互動事件本身。

這種命名差異平時很容易被忽略，但當元件被重複使用、重構，或連接至不同的狀態管理方式時，問題便會浮現。

![Can't Maintain 的 Callback Naming 題目頁面](/assets/images/260312/cant-maintain-callback-naming.png)

_圖：`Callback Naming` 的例子適合用來判斷 Callback 究竟是在描述事件，還是在間接暴露 Setter。_

## 4.3 Controlled / Uncontrolled：明確說明 state ownership

在 Controlled Component 的情境中，我很在意 API 能否讓人一眼看出「誰擁有 State」。

`toggled`/`setToggled` 這種組合雖然可以使用，卻沒有充分對應 React 生態系中已廣為人知的語意。

相較之下，`checked`/`onChange` 的搭配清楚得多，因為它直接沿用開發者對表單控制項的既有認知。

這樣做的價值不只在於命名較美觀，還包括：

- 使用者更容易預測元件的運作方式。
- API 更符合生態系慣例。
- 後續接手的開發者不必重新學習一套專案特有的語言。

AI 產生程式碼時，經常混淆「能表達這項意思」與「最適合長期維護的表達方式」。這正是 Human Review（人工審查）仍然重要的原因。

![Can't Maintain 的 Controlled and Uncontrolled 題目頁面](/assets/images/260312/cant-maintain-controlled-uncontrolled.png)

_圖：`Controlled & Uncontrolled` 題型的重點不只是更換名稱，也在於明確說明 state ownership 與元件契約。_

## 4.4 Generic Props：定義型別不代表設計完整

我經常看到 AI 產生以下型別：

- `items: unknown[]`
- `onSelect: (item: unknown) => void`

這種寫法在技術上沒有錯，卻未真正將型別資訊納入 API 設計，只是將不確定性轉移給呼叫者處理。

如果元件本來就應採用泛型，使用 `T[]` 與 `(item: T) => void` 會更接近真正可重用、可推導且可維護的 API。

這一點值得注意，因為 AI 很擅長產生不會引發編譯錯誤的型別，但這不代表型別確實傳達了設計意圖。

對我而言，良好的型別不只用來避免誤用，還應幫助他人理解元件需要什麼資料。

![Can't Maintain 的 Generic Props 題目頁面](/assets/images/260312/cant-maintain-generic-props.png)

_圖：`Generic Props` 適合比較「僅避免型別報錯」與「真正將型別資訊納入 API 設計」之間的差異。_

## 4.5 Accessibility Props：良好的 API 會要求必要資訊

這個網站的另一項優點，是不只討論命名，也關注 Accessibility（無障礙設計）。

以 Icon Button 元件為例，如果 API 只要求傳入 `icon`，卻未納入 `aria-label` 等必要資訊，就等於默許容易產生問題的使用方式。

這裡最值得記住的一句話是：

**Accessibility 不應是事後補上的附註，而應成為 API 設計的一部分。**

這種思維與 AI Coding 密切相關，因為 AI 容易將「畫面成功顯示」視為完成，但工程上真正重要的通常不只有視覺結果。

![Can't Maintain 的 Accessibility Props 題目頁面](/assets/images/260312/cant-maintain-accessibility-props.png)

_圖：`Accessibility Props` 的例子說明，良好的元件 API 會將必要的無障礙資訊直接納入介面，而不是留給使用者事後補充。_

---

# 5. 這些例子與 AI Coding 有什麼關係？

我認為關鍵在於：AI 很擅長產生局部看似合理的內容，卻不一定能維持整體設計品質。

AI 可以快速建立元件，也能迅速產生 Props、型別與事件名稱。但如果開發者缺乏足夠的判讀能力，就很容易接受以下危險結果：

- 每段程式碼個別看來都還可以。
- 但整個專案累積後，命名日益混亂、抽象越來越鬆散，邊界也越來越模糊。

這正是我目前最警惕的問題。

AI Coding 不只提升生產力，也會放大開發者原有審查能力所造成的影響。

如果開發者原本就能分辨：

- 哪種命名較清楚。
- 哪種 API 更符合語意。
- 哪種抽象只是過早泛化。
- 哪種型別只是表面工夫。

AI 便能有效加快開發速度。

但如果尚未建立這種判讀能力，AI 也會讓普通甚至不良的設計更快進入專案。

---

# 6. 我如何審查 AI 產生的程式碼

現在審查 AI 產生的程式碼時，我至少會問自己以下問題：

- 這個命名能不能直接看出型別與語意？
- 這個 Callback 是在描述事件，還是在間接暴露 Setter？
- 這個元件的 state ownership 是否清楚？
- 這個型別真的有傳遞資訊，還是只為了通過編譯？
- 這個 API 是否遵循 React 與 HTML 的既有慣例？
- 如果三個月後需要擴充，這項設計是否會變得複雜混亂？
- Accessibility 是否已納入 API，還是被留待日後處理？

我越來越不將 AI 視為直接完成所有工作的工具，而是用它來：

- 先產生草稿。
- 提出可能的方向。
- 加速重複性的例行工作。

但最終決定哪些程式碼可以保留在程式碼庫中，仍然必須由人負責。

---

# 7. 結語：AI 可以協助產生程式碼，卻無法代替人建立判斷力

我並不反對 AI Coding。相反地，我也經常使用，而且相信它已是未來工作流程的一部分。

但我現在比以往更確定一件事：

**AI 時代最值得投資的，不只是撰寫 prompt 的能力，更是 judgment（判斷力）。**

可以讓 AI 協助產生初稿，但開發者仍須判斷：

- 這段程式碼是否只是在模仿常見寫法？
- 這個 API 是否會增加未來維護者的負擔？
- 這項設計是否只是目前恰好可用？

如果想練習這種能力，我認為 [Can't Maintain](https://cant-maintain.saschb2b.com/learn) 這類網站很值得定期挑選幾道題目練習。它不會讓人瞬間成為更優秀的工程師，卻會促使讀者注意一項重要事實：

同樣能夠執行的程式碼，維護成本可能相差甚遠。

而這項差距，通常無法只依靠 AI 維持。
