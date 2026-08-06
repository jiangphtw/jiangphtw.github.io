# AI 投資研究工程

以來源可追溯、回測可反證、自動化可停機為核心的 8 單元線上課程。結業作品是一個不自動下單、保留來源與人工責任的 AI 投資研究助理。

## 本機開發

```powershell
npm install
npm run dev
```

## 驗證

```powershell
npm run lint
npm test
```

`next build` 會輸出靜態網站至 `out/`，由倉庫的 GitHub Pages 工作流程組裝到 `/course/ai-investment-research/`。

若要啟用 giscus，將 `.env.example` 複製為 `.env.local` 並填入四個公開設定值。未設定時會顯示完整的準備中狀態。
