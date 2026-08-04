# Po-Hsien Jiang — Jekyll Personal Website

這是江柏賢的多頁式 Jekyll 個人網站。視覺樣式保留在 `assets/styles.css`，Jekyll 文章與索引頁補充樣式在 `assets/jekyll.css`。

## 本機預覽

第一次使用先安裝相依套件：

```bash
bundle install
```

啟動本機預覽：

```bash
bundle exec jekyll serve --livereload
```

開啟 `http://127.0.0.1:4000/`。修改頁面或文章後，瀏覽器會自動重新載入。

## 新增文章

1. 在 `_posts` 新增 `YYYY-MM-DD-英文網址名稱.md`。
2. 使用以下 front matter：

```yaml
---
title: 文章標題
subtitle: 可省略的副標題
author: Paul Jiang
categories: AI
tags: [LLM, Inference]
---
```

3. 在 front matter 下方用 Markdown 撰寫文章。
4. 圖片放在 `assets/images/`，文章中使用 `/assets/images/圖片檔名.png`。

文章會自動出現在：

- `notes.html`：所有文章
- `categories.html`：分類
- `tags.html`：標籤
- `archives.html`：年份封存
- `feed.xml`：RSS feed

文章網址沿用原站格式：`/分類/年/月/日/文章名稱.html`，因此既有文章連結不會因改版而改變。

## 主要結構

- `_layouts/`：共用頁面與文章版型
- `_includes/`：共用導覽列與頁尾
- `_posts/`：文章 Markdown
- `assets/images/`：文章圖片
- `_config.yml`：網站與網址設定
- `index.html`、`research.html`、`publications.html`、`courses.html`、`notes.html`、`about.html`：主要頁面
- `course/`：互動式線上課程的原始碼

## 新增 Node.js 課程

將新課程放在 `course/<課程目錄>/`，並使用專案指定的 npm 版本產生 lockfile：

```bash
cd course/<課程目錄>
npx npm@10.9.4 install
```

請一併提交 `package.json` 與 `package-lock.json`。GitHub Actions 會自動尋找所有 `course/*/package.json`，先以 npm 10.9.4 校正 lockfile，再執行 `npm ci`；若課程定義了 `lint` 或 `test` script，也會自動執行。因此新增 Node.js 課程時，不需要再複製安裝與測試步驟，也不會因本機與 CI 的 npm 版本不同而出現 lockfile 不同步錯誤。

課程的公開網址與 `out/` 複製位置仍須加入 `.github/workflows/pages.yml` 的組裝及驗證步驟。

## GitHub Pages

GitHub Pages 的發布來源設為 **GitHub Actions**。推送到 `main` 後，工作流程會：

1. 自動尋找、檢查並靜態建置所有 Node.js 線上課程。
2. 建置 Jekyll 主站。
3. 將課程的靜態輸出加入對應的 `/course/<公開路徑>/`。
4. 發布組合後的 GitHub Pages 網站。

