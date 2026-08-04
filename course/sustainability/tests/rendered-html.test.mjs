import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const exportRoot = new URL("../out/", import.meta.url);

test("exports the complete sustainability course as static HTML", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");
  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /永續力/);
  assert.match(html, /不只關心世界/);
  assert.match(html, /八週，把抽象名詞變成行動/);
  assert.match(html, /youtube-nocookie\.com/);
  assert.match(html, /回到課程總覽頁面/);
  assert.match(html, /討論區準備中/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("uses the GitHub Pages base path and Next.js assets", async () => {
  const html = await readFile(new URL("index.html", exportRoot), "utf8");
  assert.match(html, /\/course\/sustainability\/_next\//);
  assert.match(html, /\/course\/sustainability\/og\.svg/);
  assert.match(html, /\/course\/sustainability\/favicon\.svg/);
  assert.doesNotMatch(html, /(?:src|href)="\.\/(?:app|course-data|styles)\.(?:js|css)"/);
  await access(new URL("_next/", exportRoot));
  await access(new URL("og.svg", exportRoot));
  await access(new URL("favicon.svg", exportRoot));
});

test("ships twelve complete units with unique bilingual media", async () => {
  const source = await readFile(new URL("../app/course-data.ts", import.meta.url), "utf8");
  const unitSource = source.slice(source.indexOf("  units: ["), source.indexOf("\n  cases: ["));
  const ids = [...unitSource.matchAll(/videoId:\s*"([A-Za-z0-9_-]{11})"/g)].map((match) => match[1]);
  assert.equal((unitSource.match(/\n    \{\n      id: \d+,/g) ?? []).length, 12);
  assert.equal(ids.length, 24);
  assert.equal(new Set(ids).size, 24);
  assert.equal((unitSource.match(/\n      objectives:/g) ?? []).length, 12);
  assert.equal((unitSource.match(/\n      theory:/g) ?? []).length, 12);
  assert.equal((unitSource.match(/\n      exercises:/g) ?? []).length, 12);
});
