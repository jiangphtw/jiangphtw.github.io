# 留下人的聲音：AI 時代口述歷史方法與實作

8 單元、16 支中英雙語精選影音的互動課程。學習進度、練習與字級偏好保存在瀏覽器 `localStorage`，不需要帳號或後端。

## 開發

```bash
npm ci
npm run dev
```

## 驗證

```bash
npm run lint
npm test
```

靜態輸出在 `out/`，公開路徑為 `/course/oral-history-ai/`。

討論區為選配；複製 `.env.example` 並填入四個 giscus 公開值即可在建置時啟用。未設定時會顯示完整的準備中狀態。
