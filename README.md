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
- `index.html`、`research.html`、`publications.html`、`notes.html`、`about.html`：主要頁面

## GitHub Pages

推送到 `jiangphtw.github.io` repository 的預設分支後，可由 GitHub Pages 直接執行 Jekyll 建置。`.nojekyll` 已移除，請勿再加回。

