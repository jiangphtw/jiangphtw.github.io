# AI 資料科學家・完整學習地圖

以 TibaMe「AI 資料科學家全方位課程」的九大能力為骨架，擴充成 24 週、20 個單元、40 支中英 YouTube 教材與 12 個作品的單頁線上學習網站。每個單元均含學習目標、方法與理論、雙語選片理由，以及可保存進度的課後練習。

## 本機啟動

需要 Node.js 22.13 以上。

```bash
npm install
npm run dev
```

瀏覽器開啟 `http://localhost:3000`。

## 啟用 giscus

1. 在準備部署的 GitHub repository 開啟 Discussions。
2. 安裝 [giscus GitHub App](https://github.com/apps/giscus)。
3. 到 [giscus 設定頁](https://giscus.app/zh-TW) 取得 repository 與 category 參數。
4. 複製 `.env.example` 為 `.env.local`，填入四個 `NEXT_PUBLIC_GISCUS_*` 值。
5. 重新啟動網站。

## 建置與部署

```bash
npm run build
```

此專案使用 Next.js 靜態輸出，產物位於 `out/`。主站的 GitHub Actions 會把它發布到 `/course/data-science/`。

> 若 Windows 工具在含中文字的資料夾執行異常，可從指向本專案的純英文路徑 junction 執行，不需移動原始碼。
