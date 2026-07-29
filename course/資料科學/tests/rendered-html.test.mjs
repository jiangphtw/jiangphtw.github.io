import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const exportRoot = new URL("../out/", import.meta.url);

test("exports the complete course as static HTML", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");

  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /AI 資料科學家/);
  assert.match(html, /完整學習地圖/);
  assert.match(html, /展開 24 週地圖/);
  assert.match(html, /課後練習/);
  assert.match(html, /youtube-nocookie\.com/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("uses the GitHub Pages base path for exported assets", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");

  assert.match(html, /\/course\/data-science\/_next\//);
  assert.match(html, /\/course\/data-science\/favicon\.svg/);
  assert.match(html, /\/course\/data-science\/og-light\.png/);
  await access(new URL("_next/", exportRoot));
  await access(new URL("favicon.svg", exportRoot));
  await access(new URL("og-light.png", exportRoot));
});
