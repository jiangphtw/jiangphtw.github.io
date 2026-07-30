# 設計思考｜從洞察到可測試的解法

一門零基礎、6 週、12 單元的線上實作課。學習者會從真實情境出發，完成訪談、觀察、研究綜整、問題框定、發想、原型、使用者測試、服務藍圖與八頁設計提案。

## 課程結構

- 6 個階段、12 個單元
- 每單元 1 支中文與 1 支英文精選 YouTube 影音
- 每單元 2 個可觀察目標、3 個理論重點與 3 個漸進實作
- 進度、練習與字級偏好儲存在目前瀏覽器
- 結業作品：八頁設計提案、服務藍圖與原型 v2

影音候選於 2026-07-30 依主題契合、教學完整度、社群訊號、實作轉移性與內容穩定性比較。觀看數為查詢日約數，不代表絕對排名；本站只提供策展、原創導讀與隱私增強嵌入，權利仍屬原創作者與頻道。

## 本機開發

需要 Node.js 22.13 以上版本。

```bash
npm install
npm run dev
```

## 驗證與靜態輸出

```bash
npm run lint
npm test
```

`next build` 會把 GitHub Pages 可用的靜態內容輸出到 `out/`，正式路徑為 `/course/design-thinking/`。

## 啟用討論區

將 `.env.example` 複製為 `.env.local`，填入 giscus 的四個公開設定值：

```text
NEXT_PUBLIC_GISCUS_REPO
NEXT_PUBLIC_GISCUS_REPO_ID
NEXT_PUBLIC_GISCUS_CATEGORY
NEXT_PUBLIC_GISCUS_CATEGORY_ID
```

未設定時，網站會顯示完整的準備中說明，不影響其他課程功能。
