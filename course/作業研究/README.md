# 作業研究｜把限制條件變成更好的決策

以陽明交大王晉元老師 97 學年度「作業研究（一）」為課綱主軸，重新設計成 15 週、15 單元的自學課程。內容從線性規劃建模與單體法，進到對偶、敏感度、運輸、指派、網路最佳化、PERT/CPM 與賽局，最後交付可重現的最佳化決策專題。

## 課程特色

- 5 個階段、15 個完整單元
- 每課包含中英文影音、可觀察目標、三個理論重點與三階練習
- 中文主教材取自 NYCU OCW 王晉元老師原課程；英文主教材以 NPTEL/IIT Madras 系列為主
- 單元與練習進度、字級模式儲存在瀏覽器 `localStorage`
- 使用 `youtube-nocookie.com` 嵌入影片
- giscus 未設定時顯示明確的準備狀態
- 支援鍵盤操作、手機版課綱與大字模式

## 開發

```bash
npm ci
npm run dev
```

開啟 <http://localhost:3000/course/operations-research/>。

## 驗證與靜態輸出

```bash
npm run lint
npm test
```

`next build` 會把 GitHub Pages 可用的靜態內容輸出到 `out/`，正式路徑為 `/course/operations-research/`。

## 討論區

複製 `.env.example` 為 `.env.local`，填入公開的 giscus repository 與 category 識別值。這些值會出現在客戶端，不得放入機密資訊。

## 來源與權利

課程架構參考 [NYCU OCW 作業研究（一）](https://ocw.nycu.edu.tw/?course_page=all-course%2Fcollege-of-management%2F%E4%BD%9C%E6%A5%AD%E7%A0%94%E7%A9%B6%E4%B8%80-operations-research-i-97%E5%AD%B8%E5%B9%B4%E5%BA%A6-%E9%81%8B%E8%BC%B8%E8%88%87%E7%89%A9%E6%B5%81%E7%AE%A1%E7%90%86%E5%AD%B8%E7%B3%BB-%E7%8E%8B)。本站的教學說明與練習為重新撰寫；影音著作權歸各原創作者與頻道所有，本站僅策展與嵌入，不表示合作或背書。
