# Gemini Notebook 學術研究實戰

以 Next.js 靜態匯出製作的免費公開課程，部署路徑為 `/course/notebooklm-academic/`。

## 本機開發

```bash
npm ci
npm run dev
```

## 驗證

```bash
npm run lint
npm test
```

`npm test` 會先建立靜態輸出，再檢查課程結構、GitHub Pages 子路徑與 28 支不重複的雙語影片。影音可用性最後查核日為 2026-08-04；觀看數為選片當下的約數，不作即時統計。

## 討論區

複製 `.env.example` 為 `.env.local` 並填入 giscus 參數。若未設定，頁面會顯示清楚的啟用說明，不會留下空白區塊。

課程內容為原創教學設計；YouTube 僅以隱私增強嵌入播放，權利仍屬原頻道。產品介面與功能可能更新，操作前請以 Google 官方說明為準。
